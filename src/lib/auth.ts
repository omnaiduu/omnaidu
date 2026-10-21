export function presentedToken(request: Request): string | null {
  const header = request.headers.get('x-stats-token')?.trim()
  if (header) return header
  const auth = request.headers.get('authorization')
  if (!auth) return null
  const bearer = /^Bearer\s+(\S+)\s*$/i.exec(auth)
  if (bearer) return bearer[1] ?? null
  const basic = /^Basic\s+([A-Za-z0-9+/=]+)\s*$/i.exec(auth)
  if (!basic?.[1]) return null
  try {
    const decoded = atob(basic[1])
    const split = decoded.indexOf(':')
    if (split < 0) return null
    return decoded.slice(split + 1)
  } catch {
    return null
  }
}

export async function secretsMatch(provided: string | null | undefined, expected: string | undefined) {
  if (!provided || !expected) return false
  const enc = new TextEncoder()
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(provided)),
    crypto.subtle.digest('SHA-256', enc.encode(expected)),
  ])
  const left = new Uint8Array(a)
  const right = new Uint8Array(b)
  let diff = 0
  for (let i = 0; i < left.length; i += 1) diff |= left[i]! ^ right[i]!
  return diff === 0
}
