import { Link } from '@tanstack/react-router'
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
  showTag,
}: {
  posts: Post[]
  empty?: string
  /** Defaults to true only when the list holds more than one category. */
  showTag?: boolean
}) {
  const tagged = showTag ?? new Set(posts.map((post) => post.tag)).size > 1

  if (posts.length === 0) {
    return <p style={{ color: 'var(--muted)' }}>{empty}</p>
  }

  return (
    <div>
      {posts.map((post) => (
        <Link key={post.slug} to="/blog/$slug" params={{ slug: post.slug }} className="post-row">
          <span className="post-row-meta">
            <span className="post-meta">{formatDate(post.publishedAt)}</span>
            {tagged ? <span className="post-tag">{post.tag}</span> : null}
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
