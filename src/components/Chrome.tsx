import { Link } from '@tanstack/react-router'
import { ThemeToggle } from '~/components/ThemeToggle'
import type { ThemeId } from '~/lib/themes'

export function SiteHeader({ theme }: { theme: ThemeId }) {
  return (
    <header className="site-header">
      <div className="wrap site-header-inner">
        <Link to="/" className="wordmark">
          <span className="wordmark-text">omnaidu</span>
          <span className="wordmark-mark" aria-hidden />
        </Link>
        <nav className="nav-links" aria-label="Primary">
          <Link
            to="/blog"
            search={{ tag: 'all' }}
            activeOptions={{ exact: true, includeSearch: true }}
            activeProps={{ 'data-status': 'active' }}
          >
            Writing
          </Link>
          <Link
            to="/blog"
            search={{ tag: 'projects' }}
            activeOptions={{ exact: true, includeSearch: true }}
            activeProps={{ 'data-status': 'active' }}
          >
            Projects
          </Link>
          <Link to="/about" activeProps={{ 'data-status': 'active' }}>
            About
          </Link>
        </nav>
        <ThemeToggle active={theme} />
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="wrap footer">
      <span>Goa</span>
      <span>
        <a className="link-ember" href="/rss.xml">
          RSS
        </a>
        {' · '}
        <a className="link-ember" href="https://github.com/omnaiduu">
          GitHub
        </a>
      </span>
    </footer>
  )
}
