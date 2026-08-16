import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import type { Post } from '~/lib/types'

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function PostList({
  posts,
  empty = 'Nothing in this tag yet.',
  stagger = false,
}: {
  posts: Post[]
  empty?: ReactNode
  stagger?: boolean
}) {
  if (posts.length === 0) {
    return typeof empty === 'string' ? <p className="index-empty-plain">{empty}</p> : empty
  }

  return (
    <div className={stagger ? 'home-stagger' : undefined}>
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
