/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import { SiteFooter, SiteHeader } from '~/components/Chrome'
import { ThemeDock } from '~/components/ThemeDock'
import { DEFAULT_THEME, THEME_COOKIE, isThemeId, type ThemeId } from '~/lib/themes'
import { seo } from '~/utils/seo'
import appCss from '~/styles/app.css?url'

function themeFromCookie(cookie: string | undefined) {
  const match = cookie?.match(new RegExp(`(?:^|;\\s*)${THEME_COOKIE}=([^;]+)`))
  const value = match?.[1]
  return isThemeId(value) ? value : DEFAULT_THEME
}

export const Route = createRootRoute({
  loader: ({ location }) => {
    const fromQuery = new URLSearchParams(location.searchStr ?? '').get('theme')
    if (isThemeId(fromQuery)) return { theme: fromQuery as ThemeId }
    if (typeof document !== 'undefined') {
      return { theme: themeFromCookie(document.cookie) }
    }
    return { theme: DEFAULT_THEME }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ...seo({
        title: 'Om Naidu — engineering lab',
        description: 'Hard systems. Verified. Written down. Short demos, not long YouTube.',
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'alternate', type: 'application/rss+xml', href: '/rss.xml' },
    ],
    scripts: [
      {
        children: `(() => { const m = document.cookie.match(/om-theme=([^;]+)/); const t = m && /^(parchment|ink|paper|terminal)$/.test(m[1]) ? m[1] : 'parchment'; document.documentElement.dataset.theme = t; })()`,
      },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
  component: RootComponent,
})

function RootComponent() {
  const initial = Route.useLoaderData()
  const [theme, setTheme] = React.useState<ThemeId>(initial.theme)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  React.useEffect(() => {
    const onTheme = (event: Event) => {
      const next = (event as CustomEvent<ThemeId>).detail
      if (isThemeId(next)) setTheme(next)
    }
    window.addEventListener('om-theme', onTheme)
    return () => window.removeEventListener('om-theme', onTheme)
  }, [])

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme, pathname])

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="site-main">
        <Outlet />
      </main>
      <SiteFooter />
      <ThemeDock active={theme} />
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="parchment">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
