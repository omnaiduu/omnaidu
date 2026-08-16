import { createFileRoute } from '@tanstack/react-router'
import { getPost } from '~/lib/db'
import { renderOgPng } from '~/lib/og'
import { SITE_DESCRIPTION } from '~/lib/site'

function pngHeaders() {
  return {
    'content-type': 'image/png',
    'content-disposition': 'inline; filename="og.png"',
    'cache-control': 'public, max-age=300',
    'cdn-cache-control': 'public, max-age=86400',
    'cache-tag': 'og',
  }
}

export const Route = createFileRoute('/og/$slug')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const slug = params.slug.replace(/\.png$/i, '')
        const post = slug === 'site' ? null : await getPost(slug)
        const png = await renderOgPng({
          title: post?.title ?? 'Om Naidu',
          tag: post?.tag ?? 'writing',
          abstract: post?.abstract ?? SITE_DESCRIPTION,
        })
        return new Response(png, { headers: pngHeaders() })
      },
    },
  },
})
