import { motion, useReducedMotion } from 'motion/react'
import { Link } from '@tanstack/react-router'
import type { Post } from '~/lib/types'

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const list = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
}

const row = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 420, damping: 32 },
  },
}

export function MotionPostList({
  posts,
  hover = true,
}: {
  posts: Post[]
  hover?: boolean
}) {
  const reduceMotion = useReducedMotion()

  if (posts.length === 0) {
    return <p style={{ color: 'var(--muted)' }}>Nothing in this tag yet.</p>
  }

  if (reduceMotion) {
    return (
      <div>
        {posts.map((post) => (
          <Link key={post.slug} to="/blog/$slug" params={{ slug: post.slug }} className="post-row">
            <span className="post-row-meta">
              <span className="post-meta">{formatDate(post.publishedAt)}</span>
              <span className="post-tag">{post.tag}</span>
            </span>
            <span>
              <span className="post-title">{post.title}</span>
              <p className="post-abstract">{post.abstract}</p>
            </span>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <motion.div variants={list} initial="hidden" animate="show">
      {posts.map((post) => (
        <motion.div
          key={post.slug}
          variants={row}
          whileHover={hover ? { x: 6 } : undefined}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        >
          <Link to="/blog/$slug" params={{ slug: post.slug }} className="post-row">
            <span className="post-row-meta">
              <span className="post-meta">{formatDate(post.publishedAt)}</span>
              <span className="post-tag">{post.tag}</span>
            </span>
            <span>
              <span className="post-title">{post.title}</span>
              <p className="post-abstract">{post.abstract}</p>
            </span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
