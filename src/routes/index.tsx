import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { DemoPlayer } from '~/components/DemoPlayer'
import { PostList } from '~/components/PostList'
import { fetchPosts } from '~/lib/queries'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/')({
  loader: async ({ location }) => {
    const posts = await fetchPosts({ data: { tag: 'all', url: location.href } })
    return { posts }
  },
  component: Home,
  head: () => ({
    meta: seo({
      title: 'Om Naidu — engineering lab',
      description: 'Hard systems. Verified. Written down. A quiet lab blog — not a creator channel.',
      image: '/og/bankbot-turn-loop',
      url: '/',
    }),
  }),
})

function Home() {
  const { posts } = Route.useLoaderData()
  const latest = posts[0]
  const reduceMotion = useReducedMotion()

  const fade = reduceMotion
    ? { initial: false, animate: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
      }

  return (
    <div>
      <section className="wrap hero">
        <motion.p
          className="hero-kicker"
          {...fade}
          transition={{ duration: 0.4 }}
        >
          Engineering lab
        </motion.p>
        <motion.h1
          {...fade}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.05 }}
        >
          Om Naidu
        </motion.h1>
        <motion.p
          className="hero-line"
          {...fade}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.12 }}
        >
          Hard systems. Verified. Written down.
        </motion.p>
        <motion.div
          className="hero-actions"
          {...fade}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.18 }}
        >
          <Link
            to="/blog/$slug"
            params={{ slug: latest?.slug ?? 'bankbot-turn-loop' }}
            className="btn btn-primary"
          >
            Read latest →
          </Link>
          <Link to="/blog" search={{ tag: 'projects' }} className="btn btn-ghost">
            Projects
          </Link>
        </motion.div>
      </section>

      <section className="wrap section section-tight">
        <DemoPlayer
          src="/media/demo.mp4"
          poster="/media/demo-poster.svg"
          caption="Short demo embed — 6s H.264, faststart, no HLS. Same asset for X/LinkedIn."
        />
      </section>

      <section className="wrap section">
        <p className="section-label">Writing</p>
        <PostList posts={posts} />
      </section>
    </div>
  )
}
