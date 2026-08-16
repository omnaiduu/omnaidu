import { createFileRoute, Link } from '@tanstack/react-router'
import { FeaturedPost, pickFeatured } from '~/components/FeaturedPost'
import { PostList } from '~/components/PostList'
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
      title: 'Om Naidu',
      description: 'Software from Goa. I ship systems, then write what shipped and how I checked it.',
      image: '/og/bankbot-turn-loop',
      url: '/',
    }),
  }),
})

function Home() {
  const { posts } = Route.useLoaderData()
  const featured = pickFeatured(posts)
  const rest = featured ? posts.filter((post) => post.slug !== featured.slug) : posts

  return (
    <div>
      <section className="wrap home-index">
        <h1 className="home-name">Om Naidu</h1>
        <p className="home-lede">I build software in Goa. I ship the system, then write what I shipped and how I checked it.</p>
        <p className="home-more">
          <Link className="link-ember" to="/about">
            About
          </Link>
          {' · '}
          <a className="link-ember" href="https://github.com/omnaiduu">
            GitHub
          </a>
        </p>
      </section>
      {featured ? (
        <section className="wrap home-featured">
          <p className="section-label">Selected</p>
          <FeaturedPost post={featured} />
        </section>
      ) : null}
      <section className="wrap section">
        <p className="section-label">Writing</p>
        <PostList posts={rest} />
      </section>
    </div>
  )
}
