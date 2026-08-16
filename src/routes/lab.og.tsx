import { createFileRoute } from '@tanstack/react-router'
import { fetchPosts } from '~/lib/queries'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/lab/og')({
  loader: async ({ location }) => {
    const posts = await fetchPosts({ data: { tag: 'all', url: location.href } })
    return { posts }
  },
  component: LabOg,
  head: () => ({
    meta: seo({
      title: 'OG images — Lab',
      description: '1200×630 SVG share cards. Parchment, ink, and type.',
      url: '/lab/og',
    }),
  }),
})

const STYLES = [
  {
    id: 'parchment',
    label: 'Parchment',
    query: '',
    why: 'Default. Cream card, ember footer. Matches the live site.',
  },
  {
    id: 'ink',
    label: 'Ink',
    query: '?style=ink',
    why: 'Dark card for night posts.',
  },
  {
    id: 'type',
    label: 'Type',
    query: '?style=type',
    why: 'Giant title, no abstract. For short names that can shout.',
  },
] as const

function LabOg() {
  const { posts } = Route.useLoaderData()

  return (
    <section className="lab-page">
      <h1 className="lab-title">OG images</h1>
      <p className="lab-lead">
        Each card is SVG at <strong>1200×630</strong>, cached one hour, served from{' '}
        <code>/og/[slug]</code>. Parchment is the default <code>og:image</code>. Ink and type are
        query styles so you can pick per post later. Crawlers that refuse SVG still need a PNG
        pipeline — this gallery is how the cards look on the site.
      </p>

      <div className="og-gallery">
        {posts.map((post) => (
          <article key={post.slug} className="og-post-group">
            <h2 className="og-post-title">{post.title}</h2>
            <div className="og-style-grid">
              {STYLES.map((style) => (
                <figure key={style.id} className="og-card">
                  <a href={`/og/${post.slug}${style.query}`} target="_blank" rel="noopener noreferrer">
                    <img
                      src={`/og/${post.slug}${style.query}`}
                      alt={`${post.title} — ${style.label} OG`}
                      width={1200}
                      height={630}
                      loading="lazy"
                    />
                  </a>
                  <figcaption>
                    <span className="og-style-label">{style.label}</span>
                    <span>{style.why}</span>
                    <code>
                      /og/{post.slug}
                      {style.query}
                    </code>
                  </figcaption>
                </figure>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
