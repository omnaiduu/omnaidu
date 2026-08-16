import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { listPosts } from '~/lib/db'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const posts = await listPosts('all')
        const origin = env.SITE_URL || new URL(request.url).origin
        const urls = [
          '',
          '/blog',
          '/about',
          ...posts.map((post) => `/blog/${post.slug}`),
        ]
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `  <url><loc>${origin}${path}</loc></url>`,
  )
  .join('\n')}
</urlset>`
        return new Response(xml, {
          headers: {
            'content-type': 'application/xml; charset=utf-8',
            'cache-control': 'public, max-age=300',
          },
        })
      },
    },
  },
})
