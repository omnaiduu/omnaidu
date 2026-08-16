import { Link } from '@tanstack/react-router'
import { PostHero } from '~/components/PostHero'
import type { Post } from '~/lib/types'

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function pickFeatured(posts: Post[]) {
  return posts.find((post) => post.tag === 'projects') ?? posts[0] ?? null
}

export function FeaturedPost({ post }: { post: Post }) {
  const still = post.posterUrl || post.demoUrl

  return (
    <article className={`featured-post${still ? ' featured-post-split' : ''}`}>
      <div className="featured-post-copy">
        <p className="featured-kicker">
          <span className="post-tag">{post.tag}</span>
          <span className="post-meta">{formatDate(post.publishedAt)}</span>
        </p>
        <h2 className="featured-post-title">
          <Link className="link-plain" to="/blog/$slug" params={{ slug: post.slug }}>
            {post.title}
          </Link>
        </h2>
        <p className="featured-post-abstract">{post.abstract}</p>
        <p className="featured-post-go">
          <Link className="link-ember" to="/blog/$slug" params={{ slug: post.slug }}>
            Read the post →
          </Link>
        </p>
      </div>
      {still ? (
        <Link to="/blog/$slug" params={{ slug: post.slug }} className="featured-post-media">
          <PostHero src={null} poster={post.posterUrl} alt={post.title} priority />
        </Link>
      ) : null}
    </article>
  )
}
