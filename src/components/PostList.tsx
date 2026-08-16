import { Link } from '@tanstack/react-router'
import type { Post } from '~/lib/types'

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p style={{ color: 'var(--muted)' }}>Nothing in this tag yet.</p>
  }

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
