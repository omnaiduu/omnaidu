import { Link } from '@tanstack/react-router'
import { Wordmark } from '~/components/Wordmark'
import { GITHUB_URL, SITE_EMAIL_HREF } from '~/lib/site'

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
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="wrap footer">
      <span>Goa</span>
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
