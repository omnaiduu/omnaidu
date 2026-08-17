import { Link } from '@tanstack/react-router'
import { Wordmark } from '~/components/Wordmark'
import { SiteEffects } from '~/components/SiteEffects'
import { GITHUB_URL, SITE_EMAIL_HREF } from '~/lib/site'

const navActive = {
  'data-status': 'active',
  'aria-current': 'page',
} as const

export function SiteHeader() {
  return (
    <header className="site-header">
      <SiteEffects />
      <div className="wrap site-header-inner">
        <Wordmark />
        <nav className="nav-links" aria-label="Primary">
          <Link
            to="/blog"
            activeOptions={{ exact: true, includeSearch: true }}
            activeProps={navActive}
          >
            Writing
          </Link>
          <Link
            to="/blog"
            search={{ tag: 'projects' }}
            activeOptions={{ exact: true, includeSearch: true }}
            activeProps={navActive}
          >
            Projects
          </Link>
          <Link to="/about" activeProps={navActive}>
            About
          </Link>
        </nav>
        <div className="header-end">
          <a className="link-plain" href={GITHUB_URL} rel="me">
            GitHub
          </a>
        </div>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="wrap footer">
      <span>Goa</span>
      <span>
        <a className="link-ember" href={GITHUB_URL} rel="me">
          GitHub
        </a>
        {' · '}
        <a className="link-ember" href={SITE_EMAIL_HREF}>
          Email
        </a>
      </span>
    </footer>
  )
}
