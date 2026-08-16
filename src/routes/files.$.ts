import { createFileRoute } from '@tanstack/react-router'
import { getMedia } from '~/lib/media'

export const Route = createFileRoute('/files/$')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const key = params._splat ?? ''
        if (!key) return new Response('Not found', { status: 404 })

        const cache = caches.default
        const ranged = Boolean(request.headers.get('range'))
        if (!ranged) {
          try {
            const hit = await cache.match(request)
            if (hit) return hit
          } catch {
            // Cache API may be unavailable in some previews.
          }
        }

        const object = await getMedia(key, request)
        if (!object || !('body' in object) || object.body === null) {
          return new Response('Not found', { status: 404 })
        }

        const headers = new Headers()
        object.writeHttpMetadata(headers)
        headers.set('etag', object.httpEtag)
        headers.set('cache-control', 'public, max-age=31536000, immutable')
        headers.set('accept-ranges', 'bytes')
        if (object.range) {
          headers.set(
            'content-range',
            `bytes ${object.range.offset}-${object.range.offset + object.range.length - 1}/${object.size}`,
          )
        }

        const status = object.range ? 206 : 200
        const response = new Response(object.body, { status, headers })
        if (!ranged && status === 200) {
          try {
            await cache.put(request, response.clone())
          } catch {
            // ignore
          }
        }
        return response
      },
    },
  },
})
