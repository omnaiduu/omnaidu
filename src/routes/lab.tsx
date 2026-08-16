import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/lab')({
  component: LabLayout,
  head: () => ({
    meta: seo({
      title: 'Lab — Om Naidu',
      description: 'Homepage concepts, post components, OG previews — internal picker, not public IA.',
      url: '/lab',
    }),
  }),
})

const LINKS = [
  { to: '/lab' as const, label: 'Overview', exact: true },
  { to: '/lab/homes' as const, label: 'Homes' },
  { to: '/lab/components' as const, label: 'Components' },
  { to: '/lab/og' as const, label: 'OG' },
  { to: '/lab/player' as const, label: 'Player' },
]

function LabLayout() {
  return (
    <div className="lab-layout">
      <div className="wrap">
        <p className="hero-kicker">Lab / choose a look</p>
        <nav className="lab-subnav" aria-label="Lab sections">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={link.exact ? { exact: true } : undefined}
              activeProps={{ 'data-active': 'true' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Outlet />
      </div>
    </div>
  )
}
