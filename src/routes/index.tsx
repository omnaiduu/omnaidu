import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
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
  const rest = posts.slice(0, 4)

  return (
    <div>
      <section className="wrap hero">
        <motion.p
          className="hero-kicker"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Engineering lab
        </motion.p>
        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          Om Naidu
        </motion.h1>
        <motion.p
          className="hero-line"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
        >
          Hard systems. Verified. Written down. A quiet lab blog — not a creator channel.
        </motion.p>
        <motion.div
          className="hero-actions"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
        >
          <Link to="/blog/$slug" params={{ slug: latest?.slug ?? 'bankbot-turn-loop' }} className="btn btn-primary">
            Read latest →
          </Link>
          <Link to="/blog" search={{ tag: 'projects' }} className="btn btn-ghost">
            Projects
          </Link>
        </motion.div>
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
        >
          <DemoPlayer
            src="/media/demo.mp4"
            poster="/media/demo-poster.svg"
            caption="Short demo embed — 6s H.264, faststart, no HLS. Same asset for X/LinkedIn."
          />
        </motion.div>
      </section>
      <section className="wrap section">
        <p className="section-label">Latest</p>
        <PostList posts={rest} />
      </section>
    </div>
  )
}
