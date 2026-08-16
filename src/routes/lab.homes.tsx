import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { createFileRoute } from '@tanstack/react-router'
import { PostList } from '~/components/PostList'
import {
  CssCube,
  CurtainLine,
  GlyphField,
  MagneticHero,
  TagRail,
  TiltLaptop,
} from '~/components/home/MotionLooks'
import { EmberPulse } from '~/components/home/EmberPulse'
import { MotionPostList } from '~/components/home/MotionPostList'
import { SignalMark } from '~/components/home/SignalMark'
import { TypeLede } from '~/components/home/TypeLede'
import { fetchPosts } from '~/lib/queries'
import type { Post } from '~/lib/types'
import { seo } from '~/utils/seo'

const ThreeDesk = React.lazy(() => import('~/components/home/ThreeDesk'))

export const Route = createFileRoute('/lab/homes')({
  loader: async ({ location }) => {
    const posts = await fetchPosts({ data: { tag: 'all', url: location.href } })
    return { posts }
  },
  head: () => ({
    meta: seo({
      title: 'Homepage looks — Lab',
      description: 'Homepage array: Motion springs, Tailwind, and a lazy Three.js desk.',
      url: '/lab/homes',
    }),
  }),
  component: LabHomes,
})

const LEDE = 'Hard systems. Verified. Written down.'

type LookId =
  | 'quiet'
  | 'desk'
  | 'type'
  | 'signal'
  | 'spring'
  | 'magnetic'
  | 'glyphs'
  | 'rail'
  | 'curtain'
  | 'three'

const LOOKS: { id: LookId; label: string; why: string; stack: string; live?: boolean }[] = [
  { id: 'quiet', label: 'Quiet', why: 'List first. Ember spring.', stack: 'Motion', live: true },
  { id: 'desk', label: 'Desk', why: '2D laptop that tilts with the pointer.', stack: 'Motion' },
  { id: 'type', label: 'Type', why: 'Each letter springs in.', stack: 'Motion' },
  { id: 'signal', label: 'Signal', why: 'Radar rings, Motion scale.', stack: 'Motion' },
  { id: 'spring', label: 'Spring', why: 'Rows stagger in. Hover shifts 6px.', stack: 'Motion' },
  { id: 'magnetic', label: 'Magnetic', why: 'Ember follows the pointer.', stack: 'Motion spring' },
  { id: 'glyphs', label: 'Glyphs', why: 'Code dust floats behind the lede.', stack: 'Motion + Tailwind' },
  { id: 'rail', label: 'Rail', why: 'Tags marquee under the kicker.', stack: 'Motion' },
  { id: 'curtain', label: 'Curtain', why: 'Ember line draws, then the list.', stack: 'Motion' },
  { id: 'three', label: 'Three', why: 'WebGL laptop. Lazy chunk, not on `/`.', stack: 'Three.js + R3F' },
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
      <TiltLaptop />
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
          <TiltLaptop />
        </div>
      ) : null}
      {id === 'type' ? <TypeLede text={LEDE} className="home-lede" /> : null}
      {id === 'signal' ? (
        <div className="signal-hero signal-hero-mini">
          <SignalMark compact />
          <p className="hero-kicker">Goa</p>
        </div>
      ) : null}
      {id === 'spring' ? (
        <div>
          <p className="hero-kicker">Spring list</p>
          <MotionPostList posts={peek} hover={false} />
        </div>
      ) : null}
      {id === 'magnetic' ? (
        <MagneticHero>
          <p className="hero-kicker">Move here</p>
          <p className="home-lede">Ember tracks the pointer.</p>
        </MagneticHero>
      ) : null}
      {id === 'glyphs' ? (
        <GlyphField>
          <p className="hero-kicker">Glyphs</p>
        </GlyphField>
      ) : null}
      {id === 'rail' ? (
        <div>
          <p className="hero-kicker">Tags</p>
          <TagRail />
        </div>
      ) : null}
      {id === 'curtain' ? (
        <div>
          <p className="hero-kicker">Curtain</p>
          <CurtainLine />
        </div>
      ) : null}
      {id === 'three' ? <CssCube /> : null}
    </div>
  )
}

function FullLook({
  id,
  posts,
  threeReady,
}: {
  id: LookId
  posts: Post[]
  threeReady: boolean
}) {
  const list =
    id === 'spring' || id === 'curtain' || id === 'magnetic' ? (
      <MotionPostList posts={posts} />
    ) : (
      <PostList posts={posts} />
    )

  return (
    <div className="home-concept-frame">
      {id === 'quiet' ? <QuietHero /> : null}
      {id === 'desk' ? <DeskHero /> : null}
      {id === 'type' ? (
        <>
          <p className="hero-kicker">Engineering lab · Goa</p>
          <TypeLede text={LEDE} className="home-lede" />
        </>
      ) : null}
      {id === 'signal' ? (
        <div className="signal-hero">
          <SignalMark />
          <div>
            <p className="hero-kicker">Engineering lab · Goa</p>
            <p className="home-lede">{LEDE}</p>
          </div>
        </div>
      ) : null}
      {id === 'spring' ? (
        <p className="hero-kicker">
          Engineering lab · Goa
          <EmberPulse />
        </p>
      ) : null}
      {id === 'magnetic' ? (
        <MagneticHero>
          <p className="hero-kicker">Engineering lab · Goa</p>
          <p className="home-lede">{LEDE}</p>
        </MagneticHero>
      ) : null}
      {id === 'glyphs' ? (
        <GlyphField>
          <p className="hero-kicker">Engineering lab · Goa</p>
          <p className="home-lede">{LEDE}</p>
        </GlyphField>
      ) : null}
      {id === 'rail' ? (
        <>
          <p className="hero-kicker">Engineering lab · Goa</p>
          <p className="home-lede">{LEDE}</p>
          <TagRail />
        </>
      ) : null}
      {id === 'curtain' ? (
        <>
          <p className="hero-kicker">Engineering lab · Goa</p>
          <p className="home-lede">{LEDE}</p>
          <CurtainLine />
        </>
      ) : null}
      {id === 'three' ? (
        <div className="desk-grid">
          <div>
            <p className="hero-kicker">WebGL · lazy chunk</p>
            <h2 className="article-title" style={{ fontSize: 'clamp(28px, 4vw, 44px)', marginTop: 8 }}>
              Om Naidu
            </h2>
            <p className="home-lede">{LEDE}</p>
          </div>
          {threeReady ? (
            <React.Suspense fallback={<div className="three-desk three-desk-wait" />}>
              <ThreeDesk />
            </React.Suspense>
          ) : (
            <div className="three-desk three-desk-wait" />
          )}
        </div>
      ) : null}
      <p className="section-label" style={{ marginTop: 28 }}>
        Writing
      </p>
      {list}
    </div>
  )
}

function LabHomes() {
  const { posts } = Route.useLoaderData()
  const [look, setLook] = React.useState<LookId>('quiet')
  const [mounted, setMounted] = React.useState(false)
  const active = LOOKS.find((item) => item.id === look) ?? LOOKS[0]

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="lab-homes">
      <h1 className="lab-title">More looks. Better motion.</h1>
      <p className="lab-lead">
        Motion for springs, stagger, and pointer. Tailwind for the layout. One Three.js laptop,
        loaded only when you pick it — it never sits on the live homepage.
      </p>

      <div className="home-array" role="list">
        {LOOKS.map((item) => (
          <motion.button
            key={item.id}
            type="button"
            className="home-array-card"
            data-active={look === item.id}
            onClick={() => setLook(item.id)}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          >
            <MiniStage id={item.id} posts={posts} />
            <span className="home-array-meta">
              <strong>
                {item.label}
                {item.live ? <span className="home-concept-badge">Live</span> : null}
              </strong>
              <span>{item.why}</span>
              <span className="home-array-stack">{item.stack}</span>
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.article
          key={look}
          className="home-concept"
          id={`look-${look}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="home-concept-label">
            <strong>{active.label}</strong>
            {active.live ? <span className="home-concept-badge">Live · recommended</span> : null}
          </p>
          <p className="home-concept-why">
            {active.why} {active.stack}.
          </p>
          <FullLook id={look} posts={posts} threeReady={mounted && look === 'three'} />
        </motion.article>
      </AnimatePresence>
    </div>
  )
}
