import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { DemoPlayer } from '~/components/DemoPlayer'
import { Proof } from '~/components/Proof'
import { fetchPost } from '~/lib/queries'
import { renderMarkdown } from '~/lib/markdown'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params, location }) => {
    const data = await fetchPost({ data: { slug: params.slug, url: location.href } })
    if (!data) throw notFound()
    return { ...data, html: renderMarkdown(data.post.body.replace(/^# .+\n+/, '')) }
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post
    return {
      meta: seo({
        title: post ? `${post.title} — Om Naidu` : 'Om Naidu',
        description: post?.abstract,
        image: `/og/${params.slug}`,
        url: `/blog/${params.slug}`,
      }),
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
  const { post, related, html } = Route.useLoaderData()

  return (
    <article className="article">
      <div className="narrow">
        <p className="post-meta">
          {formatDate(post.publishedAt)} · {post.tag} · {post.readingMinutes} min
        </p>
        <h1 className="article-title">{post.title}</h1>
        <p style={{ color: 'var(--muted)', fontSize: 18, marginBottom: 28 }}>{post.abstract}</p>
      </div>
      {post.demoUrl ? (
        <div className="narrow">
          <DemoPlayer
            src={post.demoUrl}
            poster={post.posterUrl}
            caption="Demo only. 30–90s of the thing running."
          />
        </div>
      ) : null}
      <div className="narrow">
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
        <Proof post={post} />
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
    </article>
  )
}
