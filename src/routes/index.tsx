import { createFileRoute, Link } from '@tanstack/react-router'
import { EmptyList, EmptySelected } from '~/components/EmptyIndex'
import { FeaturedPost, pickFeatured } from '~/components/FeaturedPost'
import { PostList } from '~/components/PostList'
import { fetchPosts } from '~/lib/queries'
import { GITHUB_URL, ogImagePath, SITE_DESCRIPTION, SITE_EMAIL, SITE_EMAIL_HREF } from '~/lib/site'
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
      description: SITE_DESCRIPTION,
      image: ogImagePath('site'),
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
      <section className="wrap home-folio">
        <div className="home-folio-copy">
          <p className="home-kicker">Software from Goa</p>
          <h1 className="home-name">Om Naidu</h1>
          <p className="home-lede">
            I build software in Goa. I ship the system, then write what I shipped and how I checked
            it.
          </p>
          <p className="home-more">
            <Link className="link-ember" to="/about">
              About
            </Link>
            {' · '}
            <a className="link-ember" href={GITHUB_URL}>
              GitHub
            </a>
          </p>
        </div>
        <aside className="home-folio-rail" aria-label="Contact">
          <span>Goa</span>
          <a className="link-ember" href={SITE_EMAIL_HREF}>
            {SITE_EMAIL}
          </a>
          <a className="link-ember" href={GITHUB_URL}>
            GitHub
          </a>
        </aside>
      </section>
      <div className="wrap">
        <div className="home-rule" aria-hidden />
      </div>
      {featured ? (
        <section className="wrap home-featured">
          <p className="section-label">Selected</p>
          <FeaturedPost post={featured} />
        </section>
      ) : (
        <section className="wrap home-featured">
          <EmptySelected />
        </section>
      )}
      {rest.length > 0 ? (
        <section className="wrap section">
          <p className="section-label">Writing</p>
          <PostList posts={rest} stagger />
        </section>
      ) : featured ? null : (
        <section className="wrap section">
          <p className="section-label">Writing</p>
          <EmptyList />
        </section>
      )}
    </div>
  )
}
