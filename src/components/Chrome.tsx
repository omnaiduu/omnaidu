import { Link } from '@tanstack/react-router'

export function SiteHeader() {
  return (
    <header className="wrap">
      <nav className="nav">
        <Link to="/" className="wordmark">
          Om Naidu
        </Link>
        <div className="nav-links">
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
          <Link to="/themes" activeProps={{ 'data-status': 'active' }}>
            Themes
          </Link>
        </div>
      </nav>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="wrap footer">
      <span>Engineering lab · Goa</span>
      <span>
        <a className="link-ember" href="/rss.xml">
          RSS
        </a>
        {' · '}
        <a className="link-ember" href="/mcp">
          MCP
        </a>
        {' · '}
        <a className="link-ember" href="https://github.com/omnaiduu">
          GitHub
        </a>
      </span>
    </footer>
  )
}
