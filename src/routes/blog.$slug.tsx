import { createFileRoute, Link, notFound, redirect } from '@tanstack/react-router'
import { CiteButton } from '~/components/CiteButton'
import { KeyResults } from '~/components/KeyResults'
import { PostHero } from '~/components/PostHero'
import { PostToc, PostTocRail } from '~/components/PostToc'
import { fetchPostPage } from '~/lib/queries'
import { ogImagePath, SITE_URL } from '~/lib/site'
import { seo } from '~/utils/seo'

// Old posts that were merged into another post. The old link forwards to the new one.
const MOVED: Record<string, string> = {
  'a-remote-for-long-video': 'search-then-open-a-few-seconds',
}

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params, location }) => {
    const movedTo = MOVED[params.slug]
    if (movedTo) throw redirect({ to: '/blog/$slug', params: { slug: movedTo }, statusCode: 301 })
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
          {formatDate(post.publishedAt)} · {post.tag} · {post.readingMinutes} min
        </p>
        <h1 className="article-title">{post.title}</h1>
        <p className="post-abstract-lead">{post.abstract}</p>
        <KeyResults benches={post.proofBenches} className="key-results-post" />
        <p className="post-byline">
          Om Naidu · Goa
          {post.tag === 'research' ? <CiteButton post={post} /> : null}
        </p>
        <PostToc markdown={post.body} />
      </div>
      <div className="narrow">
        <PostHero src={post.demoUrl} poster={post.posterUrl} alt={post.title} priority />
      </div>
      <div className="post-layout">
        <PostTocRail markdown={post.body} />
        <div className="post-main">
          {Body}
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
      </div>
    </article>
  )
}
