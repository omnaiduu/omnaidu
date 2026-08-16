import { createFileRoute } from '@tanstack/react-router'
import { getPost } from '~/lib/db'
import { renderOgPng } from '~/lib/og'
import { SITE_DESCRIPTION } from '~/lib/site'

export const Route = createFileRoute('/og/$slug')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const post = params.slug === 'site' ? null : await getPost(params.slug)
        const png = await renderOgPng({
          title: post?.title ?? 'Om Naidu',
          tag: post?.tag ?? 'writing',
          abstract: post?.abstract ?? SITE_DESCRIPTION,
        })
        return new Response(png, {
          headers: {
            'content-type': 'image/png',
            'cache-control': 'public, max-age=300, s-maxage=86400',
            'cdn-cache-control': 'public, max-age=86400',
            'cache-tag': 'og',
          },
        })
      },
    },
  },
})
