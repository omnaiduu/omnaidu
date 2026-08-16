import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { CiteButton } from '~/components/CiteButton'
import { PostBody } from '~/components/PostBody'
import { PostHero } from '~/components/PostHero'
import { PostToc } from '~/components/PostToc'
import { fetchPost } from '~/lib/queries'
import { seo } from '~/utils/seo'

const SITE = 'https://omnaidu.com'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params, location }) => {
    const data = await fetchPost({ data: { slug: params.slug, url: location.href } })
    if (!data) throw notFound()
    return data
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post
    const url = `${SITE}/blog/${params.slug}`
    return {
      meta: seo({
        title: post ? `${post.title} — Om Naidu` : 'Om Naidu',
        description: post?.abstract,
        image: `/og/${params.slug}`,
        url: `/blog/${params.slug}`,
      }),
      scripts: post
        ? [
            {
              type: 'application/ld+json',
              children: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': post.tag === 'research' ? 'ScholarlyArticle' : 'BlogPosting',
                headline: post.title,
                description: post.abstract,
                datePublished: post.publishedAt,
                image: `${SITE}/og/${params.slug}`,
                url,
                author: { '@type': 'Person', name: 'Om Naidu', url: SITE },
                publisher: { '@type': 'Person', name: 'Om Naidu', url: SITE },
              }),
            },
          ]
        : [],
    }
  },
  component: BlogPost,
})

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function BlogPost() {
  const { post, related } = Route.useLoaderData()

  return (
    <motion.article
      className="article"
      data-tag={post.tag}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="narrow">
        <p className="post-meta">
          {formatDate(post.publishedAt)} · {post.tag} · {post.readingMinutes} min
        </p>
        <h1 className="article-title">{post.title}</h1>
        <p className="post-abstract-lead">{post.abstract}</p>
        <p className="post-byline">
          Om Naidu · Goa
          <CiteButton post={post} />
        </p>
        <PostToc markdown={post.body} />
      </div>
      <div className="narrow">
        <PostHero src={post.demoUrl} poster={post.posterUrl} alt={post.title} priority />
      </div>
      <div className="narrow">
        <PostBody markdown={post.body} />
        {related.length > 0 ? (
          <div style={{ marginTop: 48 }}>
            <p className="section-label">Related</p>
            {related.map((item) => (
              <p key={item.slug} style={{ marginBottom: 10 }}>
                <Link className="link-ember" to="/blog/$slug" params={{ slug: item.slug }}>
                  {item.title} →
                </Link>
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </motion.article>
  )
}
