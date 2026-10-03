import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { CiteButton } from '~/components/CiteButton'
import { PostHero } from '~/components/PostHero'
import { PostList } from '~/components/PostList'
import { PostToc } from '~/components/PostToc'
import { fetchPostPage } from '~/lib/queries'
import { ogImagePath, SITE_URL } from '~/lib/site'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params, location }) => {
    const data = await fetchPostPage({ data: { slug: params.slug, url: location.href } })
    if (!data) throw notFound()
    return data
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post
    const url = `${SITE_URL}/blog/${params.slug}`
    return {
      meta: seo({
        title: post ? `${post.title} — Om Naidu` : 'Om Naidu',
        description: post?.abstract,
        image: ogImagePath(params.slug),
        url: `/blog/${params.slug}`,
        type: 'article',
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
                image: `${SITE_URL}${ogImagePath(params.slug)}`,
                url,
                author: { '@type': 'Person', name: 'Om Naidu', url: SITE_URL },
                publisher: { '@type': 'Person', name: 'Om Naidu', url: SITE_URL },
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
  const { post, related, Body } = Route.useLoaderData()

  return (
    <article className="article" data-tag={post.tag}>
      <div className="narrow">
        <p className="post-meta">
          <Link className="link-ember" to="/blog">
            Writing
          </Link>
          {' · '}
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
        {Body}
        {related.length > 0 ? (
          <div className="related-block">
            <p className="section-label">Related</p>
            <PostList posts={related} />
          </div>
        ) : null}
      </div>
    </article>
  )
}
