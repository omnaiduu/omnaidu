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
import { DEFAULT_THEME, THEME_COOKIE, normalizeThemeId, type ThemeId } from '~/lib/themes'
import { seo } from '~/utils/seo'
import appCss from '~/styles/app.css?url'

function themeFromCookie(cookie: string | undefined) {
  const match = cookie?.match(new RegExp(`(?:^|;\\s*)${THEME_COOKIE}=([^;]+)`))
  return normalizeThemeId(match?.[1])
}

export const Route = createRootRoute({
  loader: ({ location }) => {
    const fromQuery = new URLSearchParams(location.searchStr ?? '').get('theme')
    if (fromQuery) return { theme: normalizeThemeId(fromQuery) }
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
        children: `(() => { const m = document.cookie.match(/om-theme=([^;]+)/); const raw = m && m[1]; const t = raw === 'ink' ? 'ink' : raw === 'paper' ? 'parchment' : raw === 'terminal' ? 'ink' : 'parchment'; document.documentElement.dataset.theme = t; })()`,
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
      const next = normalizeThemeId((event as CustomEvent<string>).detail)
      setTheme(next)
    }
    window.addEventListener('om-theme', onTheme)
    return () => window.removeEventListener('om-theme', onTheme)
  }, [])

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme, pathname])

  return (
    <div className="site-shell">
      <SiteHeader theme={theme} />
      <main className="site-main">
        <Outlet />
      </main>
      <SiteFooter />
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
