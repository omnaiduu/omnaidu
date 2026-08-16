import { Link } from '@tanstack/react-router'
import { ThemeToggle } from '~/components/ThemeToggle'
import { Wordmark } from '~/components/Wordmark'
import type { ThemeId } from '~/lib/themes'

export function SiteHeader({ theme }: { theme: ThemeId }) {
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
          <Link to="/lab" activeProps={{ 'data-status': 'active' }}>
            Lab
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
