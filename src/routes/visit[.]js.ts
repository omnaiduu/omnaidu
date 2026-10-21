import { createFileRoute } from '@tanstack/react-router'
import { VISIT_JS } from '~/lib/visit-js'

export const Route = createFileRoute('/visit.js')({
  server: {
    handlers: {
      GET: () =>
        new Response(VISIT_JS, {
          headers: {
            'content-type': 'application/javascript; charset=utf-8',
            'cache-control': 'public, max-age=300',
            'x-content-type-options': 'nosniff',
          },
        }),
    },
  },
})
