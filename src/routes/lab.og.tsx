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
      description: 'Settled parchment share card, 1200×630, light mode.',
      url: '/lab/og',
    }),
  }),
})

function LabOg() {
  const { posts } = Route.useLoaderData()

  return (
    <section className="lab-page">
      <h1 className="lab-title">OG card — settled</h1>
      <p className="lab-lead">
        Light parchment only. 1200×630 SVG at <code>/og/[slug]</code>. Cream field, ember mark,
        title, two-line abstract, omnaidu.com. This is what posts share.
      </p>
      <div className="og-style-grid">
        {posts.map((post) => (
          <figure key={post.slug} className="og-card">
            <a href={`/og/${post.slug}`} target="_blank" rel="noopener noreferrer">
              <img src={`/og/${post.slug}`} alt={post.title} width={1200} height={630} loading="lazy" />
            </a>
            <figcaption>
              <span className="og-style-label">{post.title}</span>
              <code>/og/{post.slug}</code>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
