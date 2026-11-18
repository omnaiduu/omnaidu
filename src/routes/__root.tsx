/// <reference types="vite/client" />
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import { SiteFooter, SiteHeader } from '~/components/Chrome'
import { fetchPosts } from '~/lib/queries'
import { SITE_DESCRIPTION } from '~/lib/site'
import { seo } from '~/utils/seo'
import appCss from '~/styles/app.css?url'

export const Route = createRootRoute({
  // The nav only offers a Projects filter once posts span more than one category.
  loader: async ({ location }) => {
    try {
      const posts = await fetchPosts({ data: { tag: 'all', url: location.href } })
      return { mixedTags: new Set(posts.map((post) => post.tag)).size > 1 }
    } catch {
      return { mixedTags: false }
    }
  },
  staleTime: Infinity,
  shouldReload: false,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ...seo({
        title: 'Om Naidu',
        description: SITE_DESCRIPTION,
        url: '/',
        image: '/og/site.png',
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
  component: RootComponent,
})

function RootComponent() {
  const { mixedTags } = Route.useLoaderData()
  return (
    <div className="site-shell">
      <SiteHeader showProjects={mixedTags} />
      <main className="site-main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="ink">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
        <script src="/visit.js" defer />
      </body>
    </html>
  )
}
