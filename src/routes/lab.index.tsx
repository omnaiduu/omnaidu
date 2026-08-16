import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/lab/')({
  component: LabOverview,
})

const CARDS = [
  {
    to: '/lab/homes' as const,
    title: 'Homes',
    copy: 'A small array of looks — quiet list, 2D desk, typewriter, radar, staggered rows.',
  },
  {
    to: '/lab/components' as const,
    title: 'Components',
    copy: 'Kitchen sink of every post block and directive an agent can write in markdown.',
  },
  {
    to: '/lab/og' as const,
    title: 'OG',
    copy: 'Open Graph card gallery — parchment, ink, and type styles at 1200×630.',
  },
  {
    to: '/lab/player' as const,
    title: 'Player',
    copy: 'DemoPlayer variants and the short-clip video contract for site and feeds.',
  },
]

function LabOverview() {
  return (
    <section className="lab-page">
      <h1 className="lab-title">Overview</h1>
      <p className="lab-lead">
        This is a picker — not public IA. The quiet writing list is live. Homes is a small
        array of looks with light 2D motion. Components, OG, and the player stay next door.
      </p>
      <div className="lab-card-grid">
        {CARDS.map((card) => (
          <Link key={card.to} to={card.to} className="lab-card">
            <h2>{card.title}</h2>
            <p>{card.copy}</p>
            <span className="lab-card-link">Open →</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
