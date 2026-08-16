import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ComputerScene } from '~/components/ComputerScene'
import { PostList } from '~/components/PostList'
import { EmberPulse, SignalMark } from '~/components/home/SignalMark'
import { TypeLede } from '~/components/home/TypeLede'
import { fetchPosts } from '~/lib/queries'
import type { Post } from '~/lib/types'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/lab/homes')({
  loader: async ({ location }) => {
    const posts = await fetchPosts({ data: { tag: 'all', url: location.href } })
    return { posts }
  },
  head: () => ({
    meta: seo({
      title: 'Homepage ideas — Lab',
      description: 'A small array of homepage looks. Same writing list. Light 2D motion.',
      url: '/lab/homes',
    }),
  }),
  component: LabHomes,
})

const LEDE = 'Hard systems. Verified. Written down.'

type LookId = 'quiet' | 'desk' | 'type' | 'signal' | 'stagger'

const LOOKS: { id: LookId; label: string; why: string; live?: boolean }[] = [
  { id: 'quiet', label: 'Quiet', why: 'List first. One ember blink.', live: true },
  { id: 'desk', label: 'Desk', why: '2D laptop. Code ticks.' },
  { id: 'type', label: 'Type', why: 'Lede types itself, then stops.' },
  { id: 'signal', label: 'Signal', why: 'Radar ping from Goa.' },
  { id: 'stagger', label: 'Stagger', why: 'Rows rise in, one after another.' },
]

function QuietHero() {
  return (
    <>
      <p className="hero-kicker">
        Engineering lab · Goa
        <EmberPulse />
      </p>
      <p className="home-lede">{LEDE}</p>
    </>
  )
}

function DeskHero() {
  return (
    <div className="desk-grid">
      <div>
        <p className="hero-kicker">Engineering lab</p>
        <h2 className="article-title" style={{ fontSize: 'clamp(28px, 4vw, 44px)', marginTop: 8 }}>
          Om Naidu
        </h2>
        <p className="home-lede">{LEDE}</p>
      </div>
      <ComputerScene />
    </div>
  )
}

function TypeHero() {
  return (
    <>
      <p className="hero-kicker">Engineering lab · Goa</p>
      <TypeLede text={LEDE} className="home-lede" />
    </>
  )
}

function SignalHero() {
  return (
    <div className="signal-hero">
      <SignalMark />
      <div>
        <p className="hero-kicker">Engineering lab · Goa</p>
        <p className="home-lede">{LEDE}</p>
      </div>
    </div>
  )
}

function MiniStage({ id, posts }: { id: LookId; posts: Post[] }) {
  const peek = posts.slice(0, 2)

  return (
    <div className="home-array-stage">
      {id === 'quiet' ? <QuietHero /> : null}
      {id === 'desk' ? (
        <div className="home-array-desk">
          <ComputerScene />
        </div>
      ) : null}
      {id === 'type' ? <TypeHero /> : null}
      {id === 'signal' ? (
        <div className="signal-hero signal-hero-mini">
          <SignalMark compact />
          <p className="hero-kicker">Goa</p>
        </div>
      ) : null}
      {id === 'stagger' ? (
        <div className="home-stagger home-stagger-mini">
          <p className="hero-kicker">Writing</p>
          <PostList posts={peek} />
        </div>
      ) : null}
    </div>
  )
}

function FullLook({ id, posts }: { id: LookId; posts: Post[] }) {
  return (
    <div className="home-concept-frame">
      {id === 'quiet' ? <QuietHero /> : null}
      {id === 'desk' ? <DeskHero /> : null}
      {id === 'type' ? <TypeHero /> : null}
      {id === 'signal' ? <SignalHero /> : null}
      {id === 'stagger' ? (
        <p className="hero-kicker">
          Engineering lab · Goa
          <EmberPulse />
        </p>
      ) : null}
      <p className="section-label" style={{ marginTop: 28 }}>
        Writing
      </p>
      <div className={id === 'stagger' ? 'home-stagger' : undefined}>
        <PostList posts={posts} />
      </div>
    </div>
  )
}

function LabHomes() {
  const { posts } = Route.useLoaderData()
  const [look, setLook] = React.useState<LookId>('quiet')
  const active = LOOKS.find((item) => item.id === look) ?? LOOKS[0]

  return (
    <div className="lab-homes">
      <h1 className="lab-title">A small array of homes</h1>
      <p className="lab-lead">
        Same writing list in every look. Motion is CSS — a blink, a typewriter, a ping, a rise.
        Click a tile. Quiet is live on the real homepage.
      </p>

      <div className="home-array" role="list">
        {LOOKS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="home-array-card"
            data-active={look === item.id}
            onClick={() => setLook(item.id)}
          >
            <MiniStage id={item.id} posts={posts} />
            <span className="home-array-meta">
              <strong>
                {item.label}
                {item.live ? <span className="home-concept-badge">Live</span> : null}
              </strong>
              <span>{item.why}</span>
            </span>
          </button>
        ))}
      </div>

      <article className="home-concept" id={`look-${look}`}>
        <p className="home-concept-label">
          <strong>{active.label}</strong>
          {active.live ? <span className="home-concept-badge">Live · recommended</span> : null}
        </p>
        <p className="home-concept-why">{active.why} The list does not change.</p>
        <FullLook key={look} id={look} posts={posts} />
      </article>
    </div>
  )
}
