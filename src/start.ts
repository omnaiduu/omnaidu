import { createMiddleware, createStart } from '@tanstack/react-start'

function withCacheHeaders(pathname: string, response: Response) {
  if (response.headers.has('set-cookie')) return response
  const existing = response.headers.get('cache-control') ?? ''
  if (/private|no-store|no-cache/i.test(existing)) return response

  const headers = new Headers(response.headers)
  const type = headers.get('content-type') ?? ''

  if (pathname === '/mcp' || pathname.startsWith('/mcp')) {
    headers.set('cache-control', 'private, no-store')
    return new Response(response.body, { status: response.status, headers })
  }

  if (pathname.startsWith('/og/')) {
    headers.set('cache-control', 'public, max-age=300, s-maxage=86400')
    headers.set('cdn-cache-control', 'public, max-age=86400')
    headers.set('cache-tag', 'og')
    return new Response(response.body, { status: response.status, headers })
  }

  if (pathname.startsWith('/files/') || pathname.startsWith('/media/') || pathname.startsWith('/assets/')) {
    if (!existing) {
      headers.set('cache-control', 'public, max-age=31536000, immutable')
    }
    return new Response(response.body, { status: response.status, headers })
  }

  if (type.includes('text/html')) {
    headers.set('cache-control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=600')
    headers.set('cdn-cache-control', 'public, max-age=60')
    headers.set('cache-tag', 'html')
  }

  return new Response(response.body, { status: response.status, headers })
}

const edgeCache = createMiddleware({ type: 'request' }).server(async ({ next, request, pathname }) => {
  const result = await next()
  if (request.method !== 'GET' && request.method !== 'HEAD') return result
  if (result instanceof Response) return withCacheHeaders(pathname, result)
  return { ...result, response: withCacheHeaders(pathname, result.response) }
})

export const startInstance = createStart(() => ({
  requestMiddleware: [edgeCache],
}))
