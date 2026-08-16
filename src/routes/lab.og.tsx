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
      title: 'OG — Lab',
      description: 'Open Graph image gallery for post slugs.',
      url: '/lab/og',
    }),
  }),
})

const STYLES = [
  { id: 'default', label: 'Parchment', query: '' },
  { id: 'ink', label: 'Ink', query: '?style=ink' },
  { id: 'type', label: 'Type', query: '?style=type' },
] as const

function LabOg() {
  const { posts } = Route.useLoaderData()

  return (
    <section className="lab-page">
      <h1 className="lab-title">OG images</h1>
      <p className="lab-lead">
        Each card is an SVG at <strong>1200×630</strong> — the standard <code>og:image</code> aspect. Routes
        live at <code>/og/[slug]</code>. Three visual styles: parchment (default), ink, and type — query
        param wiring lands in parallel.
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
                    <code>/og/{post.slug}{style.query || ''}</code>
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
