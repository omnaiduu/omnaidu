import { Link } from '@tanstack/react-router'
import { Wordmark } from '~/components/Wordmark'
import { GITHUB_URL, SITE_EMAIL, SITE_EMAIL_HREF } from '~/lib/site'

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap site-header-inner">
        <Wordmark />
        <nav className="nav-links" aria-label="Primary">
          <Link to="/blog" activeProps={{ 'data-status': 'active' }}>
            Writing
          </Link>
          <Link
            to="/blog"
            search={{ tag: 'projects' }}
            activeProps={{ 'data-status': 'active' }}
          >
            Projects
          </Link>
          <Link to="/about" activeProps={{ 'data-status': 'active' }}>
            About
          </Link>
        </nav>
        <a className="site-header-mail" href={SITE_EMAIL_HREF}>
          {SITE_EMAIL}
        </a>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="wrap footer">
      <span>Goa · omnaidu.com</span>
      <span>
        <a className="link-ember" href={GITHUB_URL}>
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
