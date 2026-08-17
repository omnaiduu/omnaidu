import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { CiteButton } from '~/components/CiteButton'
import { CopyLinkButton } from '~/components/CopyLinkButton'
import { PostHero } from '~/components/PostHero'
import { PostList } from '~/components/PostList'
import { PostToc } from '~/components/PostToc'
import { Proof } from '~/components/Proof'
import { fetchPostPage } from '~/lib/queries'
import { extractHeadings } from '~/lib/headings'
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
  const tocItems = extractHeadings(post.body)
  const hasToc = tocItems.length >= 3
  const showProof =
    !/:::proof/.test(post.body) &&
    Boolean(post.proofTests || post.proofBenches.length > 0 || post.repo)

  return (
    <article
      className={hasToc ? 'article article-with-toc' : 'article'}
      data-tag={post.tag}
    >
      <div className="wrap article-grid">
        <header className="article-head">
          <p className="post-crumb">
            <Link className="link-ember" to="/blog" activeOptions={{ exact: true, includeSearch: true }}>
              Writing
            </Link>
            <span className="post-crumb-sep" aria-hidden>
              /
            </span>
            <Link
              className="link-ember"
              to="/blog"
              search={{ tag: post.tag }}
              activeOptions={{ exact: true, includeSearch: true }}
            >
              {post.tag}
            </Link>
          </p>
          <p className="post-meta">
            {formatDate(post.publishedAt)} · {post.readingMinutes} min
          </p>
          <h1 className="article-title">{post.title}</h1>
          <p className="post-abstract-lead">{post.abstract}</p>
          <p className="post-byline">
            Om Naidu · Goa
            <span className="cite-group">
              <CopyLinkButton path={`/blog/${post.slug}`} />
              <CiteButton post={post} />
            </span>
          </p>
        </header>
        {hasToc ? <PostToc items={tocItems} /> : null}
        <div className="article-hero">
          <PostHero src={post.demoUrl} poster={post.posterUrl} alt={post.title} priority />
        </div>
        <div className="article-body">
          {Body}
          {showProof ? <Proof post={post} /> : null}
          {related.length > 0 ? (
            <div className="related">
              <p className="section-label">Related</p>
              <PostList posts={related} />
            </div>
          ) : null}
          <p className="article-back">
            <Link className="link-ember" to="/blog" activeOptions={{ exact: true, includeSearch: true }}>
              ← All writing
            </Link>
          </p>
        </div>
      </div>
    </article>
  )
}
