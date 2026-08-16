import { createFileRoute } from '@tanstack/react-router'
import { getPost } from '~/lib/db'

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export const Route = createFileRoute('/og/$slug')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const post = await getPost(params.slug)
        const title = post?.title ?? 'Om Naidu'
        const tag = post?.tag ?? 'lab'
        const abstract = post?.abstract ?? 'Engineering lab. Hard systems, verified, written down.'
        const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f7f7f4"/>
  <rect x="48" y="48" width="1104" height="534" fill="#ffffff" stroke="#e6e5e0"/>
  <text x="88" y="120" fill="#7a7974" font-family="ui-sans-serif, system-ui, sans-serif" font-size="22" letter-spacing="4">OMNAIDU.COM · ${escapeXml(tag.toUpperCase())}</text>
  <text x="88" y="280" fill="#26251e" font-family="ui-sans-serif, system-ui, sans-serif" font-size="56" font-weight="400">${escapeXml(title.slice(0, 70))}</text>
  <text x="88" y="380" fill="#7a7974" font-family="ui-sans-serif, system-ui, sans-serif" font-size="24">${escapeXml(abstract.slice(0, 110))}</text>
  <text x="88" y="520" fill="#f54e00" font-family="ui-sans-serif, system-ui, sans-serif" font-size="22">proof → demo → repo</text>
</svg>`
        return new Response(svg, {
          headers: {
            'content-type': 'image/svg+xml; charset=utf-8',
            'cache-control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})
