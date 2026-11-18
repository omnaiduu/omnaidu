import { createFileRoute, Link } from '@tanstack/react-router'
import { FeaturedPost, pickFeatured } from '~/components/FeaturedPost'
import { PostList } from '~/components/PostList'
import { fetchPosts } from '~/lib/queries'
import { GITHUB_URL, ogImagePath, OPEN_TO_WORK, SITE_DESCRIPTION, SITE_EMAIL_HREF } from '~/lib/site'
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
  const showTag = new Set(posts.map((post) => post.tag)).size > 1

  return (
    <div>
      <section className="wrap home-index">
        <h1 className="home-name">Om Naidu</h1>
        <p className="home-lede">
          AI engineer in Goa. I build search and agent systems around small open models, test them
          honestly, and write up what I find.
        </p>
        <p className="open-to-work">
          <span className="open-to-work-dot" aria-hidden />
          {OPEN_TO_WORK}
        </p>
        <p className="home-more">
          <Link className="link-ember" to="/about">
            About
          </Link>
          {' · '}
          <a className="link-ember" href={GITHUB_URL}>
            GitHub
          </a>
          {' · '}
          <a className="link-ember" href={SITE_EMAIL_HREF}>
            Email
          </a>
        </p>
      </section>
      {featured ? (
        <section className="wrap home-featured">
          <p className="section-label">Selected</p>
          <FeaturedPost post={featured} showTag={showTag} />
        </section>
      ) : null}
      <section className="wrap section">
        <p className="section-label">Writing</p>
        <PostList posts={rest} empty="Nothing published yet." showTag={showTag} />
      </section>
    </div>
  )
}
