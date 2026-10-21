import { createFileRoute } from '@tanstack/react-router'
import { buildVisit, countryCode, isPrefetch, originsMatch } from '~/lib/visits'
import { insertVisit } from '~/lib/visits-db'

const headers = { 'cache-control': 'private, no-store' }

function empty(status = 204) {
  return new Response(null, { status, headers })
}

function countryFrom(request: Request) {
  const cf = (request as Request & { cf?: { country?: string } }).cf
  return countryCode(cf?.country)
}

export const Route = createFileRoute('/api/visit')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const pageHost = request.headers.get('host')
        if (!originsMatch(pageHost, request.headers.get('origin'), request.headers.get('referer'))) {
          return empty()
        }
        if (isPrefetch(request)) return empty()

        const declared = Number(request.headers.get('content-length') ?? 0)
        if (declared > 4096) return empty(400)
        const raw = await request.text()
        if (!raw || raw.length > 4096) return empty(400)

        let data: unknown
        try {
          data = JSON.parse(raw)
        } catch {
          return empty(400)
        }
        if (!data || typeof data !== 'object' || Array.isArray(data)) return empty(400)
        const body = data as Record<string, unknown>
        const visit = buildVisit({
          path: body.path,
          referrer: body.referrer,
          utmSource: body.utm_source,
          utmMedium: body.utm_medium,
          utmCampaign: body.utm_campaign,
          userAgent: request.headers.get('user-agent'),
          country: countryFrom(request),
          pageHost,
        })
        if (!visit) return empty()

        try {
          await insertVisit(visit)
        } catch (error) {
          console.error('visit insert failed', error)
          return empty(500)
        }
        return empty()
      },
    },
  },
})
