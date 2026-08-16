import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { listPosts } from '~/lib/db'

export const Route = createFileRoute('/rss.xml')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const posts = await listPosts('all')
        const origin = env.SITE_URL || new URL(request.url).origin
        const items = posts
          .map(
            (post) => `  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${origin}/blog/${post.slug}</link>
    <guid>${origin}/blog/${post.slug}</guid>
    <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    <description><![CDATA[${post.abstract}]]></description>
    <category>${post.tag}</category>
  </item>`,
          )
          .join('\n')

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Om Naidu</title>
  <link>${origin}</link>
  <description>Engineering lab. Hard systems, verified, written down.</description>
${items}
</channel>
</rss>`
        return new Response(xml, {
          headers: { 'content-type': 'application/rss+xml; charset=utf-8' },
        })
      },
    },
  },
})
