import { createFileRoute, Link } from '@tanstack/react-router'
import { PostList } from '~/components/PostList'
import { EmberPulse } from '~/components/home/EmberPulse'
import { fetchPosts } from '~/lib/queries'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/')({
  loader: async ({ location }) => {
    const posts = await fetchPosts({ data: { tag: 'all', url: location.href } })
    return { posts }
  },
  component: Home,
  head: () => ({
    meta: seo({
      title: 'Om Naidu — engineering lab',
      description: 'Hard systems. Verified. Written down. A quiet lab blog — not a creator channel.',
      image: '/og/bankbot-turn-loop',
      url: '/',
    }),
  }),
})

function Home() {
  const { posts } = Route.useLoaderData()

  return (
    <div>
      <section className="wrap home-index">
        <p className="hero-kicker">
          Engineering lab · Goa
          <EmberPulse />
        </p>
        <p className="home-lede">Hard systems. Verified. Written down.</p>
        <p className="home-more">
          <Link className="link-ember" to="/lab">
            Homepage ideas, post components, OG, player →
          </Link>
        </p>
      </section>
      <section className="wrap section">
        <p className="section-label">Writing</p>
        <PostList posts={posts} />
      </section>
    </div>
  )
}
