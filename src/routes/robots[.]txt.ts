import { createFileRoute } from '@tanstack/react-router'
import { SITE_URL } from '~/lib/site'

const BODY = `User-agent: *
Allow: /
Disallow: /mcp

User-agent: WhatsApp
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: facebookexternalhit
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(BODY, {
          headers: {
            'content-type': 'text/plain; charset=utf-8',
            'cache-control': 'public, max-age=86400',
            'cdn-cache-control': 'public, max-age=86400',
          },
        }),
    },
  },
})
