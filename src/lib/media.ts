import { env } from 'cloudflare:workers'

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
}

const MAX_BYTES: Record<string, number> = {
  'image/jpeg': 8 * 1024 * 1024,
  'image/png': 8 * 1024 * 1024,
  'image/webp': 8 * 1024 * 1024,
  'image/avif': 8 * 1024 * 1024,
  'image/gif': 4 * 1024 * 1024,
  'image/svg+xml': 512 * 1024,
  'video/mp4': 40 * 1024 * 1024,
  'video/webm': 40 * 1024 * 1024,
}

export function hasMedia() {
  try {
    return Boolean(env && 'MEDIA' in env && env.MEDIA)
  } catch {
    return false
  }
}

function extensionFor(contentType: string, filename: string) {
  const fromType = ALLOWED_TYPES[contentType]
  const fromName = filename.split('.').pop()?.toLowerCase()
  if (fromType) return fromType
  if (fromName && Object.values(ALLOWED_TYPES).includes(fromName)) return fromName
  throw new Error(`Unsupported type: ${contentType || filename}`)
}

function safeBase(filename: string) {
  const base = filename.split('/').pop() ?? 'file'
  return base.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase().slice(0, 80) || 'file'
}

export function publicMediaUrl(key: string) {
  return `/files/${key}`
}

export async function putMedia(input: {
  filename: string
  contentType: string
  bytes: ArrayBuffer
}) {
  if (!hasMedia()) {
    throw new Error('R2 MEDIA binding is not available')
  }
  const type = input.contentType.split(';')[0].trim().toLowerCase()
  if (!ALLOWED_TYPES[type]) {
    throw new Error(`Upload optimized assets only. Allowed: ${Object.keys(ALLOWED_TYPES).join(', ')}`)
  }
  const max = MAX_BYTES[type] ?? 8 * 1024 * 1024
  if (input.bytes.byteLength > max) {
    throw new Error(`File too large (${input.bytes.byteLength} bytes). Max for ${type} is ${max}. Optimize before upload.`)
  }
  const ext = extensionFor(type, input.filename)
  const id = crypto.randomUUID().slice(0, 8)
  const key = `uploads/${id}-${safeBase(input.filename).replace(/\.[^.]+$/, '')}.${ext}`
  await env.MEDIA.put(key, input.bytes, {
    httpMetadata: {
      contentType: type,
      cacheControl: 'public, max-age=31536000, immutable',
    },
    customMetadata: {
      original: safeBase(input.filename),
      uploadedAt: new Date().toISOString(),
    },
  })
  return {
    key,
    url: publicMediaUrl(key),
    contentType: type,
    bytes: input.bytes.byteLength,
  }
}

export async function getMedia(key: string, request: Request) {
  if (!hasMedia()) return null
  const normalized = key.replace(/^\/+/, '')
  if (normalized.includes('..')) return null
  return env.MEDIA.get(normalized, {
    range: request.headers,
    onlyIf: request.headers,
  })
}

export async function listMedia(limit = 40) {
  if (!hasMedia()) return []
  const listed = await env.MEDIA.list({ prefix: 'uploads/', limit })
  return listed.objects.map((object) => ({
    key: object.key,
    url: publicMediaUrl(object.key),
    size: object.size,
    uploaded: object.uploaded.toISOString(),
    contentType: object.httpMetadata?.contentType ?? null,
  }))
}
