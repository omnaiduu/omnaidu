import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { presentedToken, secretsMatch } from '~/lib/auth'
import { renderStats } from '~/lib/stats-html'
import { buildStats, parseRange, rangeStart } from '~/lib/visits'
import { recentVisits, visitsSince } from '~/lib/visits-db'

const headers = {
  'content-type': 'text/html; charset=utf-8',
  'cache-control': 'private, no-store',
  'x-robots-tag': 'noindex, nofollow',
  'referrer-policy': 'no-referrer',
  'x-content-type-options': 'nosniff',
  'content-security-policy':
    "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
}

export const Route = createFileRoute('/admin/stats')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secret = env.STATS_TOKEN
        if (!secret) {
          return new Response('Not found', {
            status: 404,
            headers: { 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex' },
          })
        }
        const allowed = await secretsMatch(presentedToken(request), secret)
        if (!allowed) {
          return new Response('Unauthorized', {
            status: 401,
            headers: { ...headers, 'www-authenticate': 'Basic realm="stats", charset="UTF-8"' },
          })
        }

        const range = parseRange(new URL(request.url).searchParams.get('range'))
        const now = new Date()
        try {
          const [rows, live] = await Promise.all([
            visitsSince(rangeStart(range, now).toISOString()),
            recentVisits(new Date(now.getTime() - 30 * 60 * 1000).toISOString()),
          ])
          return new Response(renderStats(buildStats(rows, range, now), live, range), { headers })
        } catch (error) {
          console.error('stats query failed', error)
          return new Response('Could not read visits.', {
            status: 500,
            headers: { 'cache-control': 'private, no-store' },
          })
        }
      },
    },
  },
})
