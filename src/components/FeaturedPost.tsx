import { Link } from '@tanstack/react-router'
import { KeyResults } from '~/components/KeyResults'
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

export function FeaturedPost({ post, showTag = true }: { post: Post; showTag?: boolean }) {
  return (
    <article className="featured-post">
      <p className="featured-kicker">
        {showTag ? <span className="post-tag">{post.tag}</span> : null}
        <span className="post-meta">{formatDate(post.publishedAt)}</span>
      </p>
      <h2 className="featured-post-title">
        <Link className="link-plain" to="/blog/$slug" params={{ slug: post.slug }}>
          {post.title}
        </Link>
      </h2>
      <p className="featured-post-abstract">{post.abstract}</p>
      <KeyResults benches={post.proofBenches} className="key-results-featured" />
      <p className="featured-post-go">
        <Link className="link-ember" to="/blog/$slug" params={{ slug: post.slug }}>
          Read the post →
        </Link>
      </p>
      {post.posterUrl || post.demoUrl ? (
        <Link to="/blog/$slug" params={{ slug: post.slug }} className="featured-post-media">
          <PostHero src={null} poster={post.posterUrl} alt={post.title} priority />
        </Link>
      ) : null}
    </article>
  )
}
