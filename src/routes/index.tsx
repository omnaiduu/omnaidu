import { createFileRoute } from '@tanstack/react-router'
import { FeaturedPost, pickFeatured } from '~/components/FeaturedPost'
import { PostList } from '~/components/PostList'
import { fetchPosts } from '~/lib/queries'
import { ogImagePath, SITE_DESCRIPTION } from '~/lib/site'
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
      <section className="wrap home-index">
        <h1 className="home-name">Om Naidu</h1>
        <p className="home-lede">{SITE_DESCRIPTION}</p>
      </section>
      {featured ? (
        <section className="wrap home-featured">
          <p className="section-label">Selected</p>
          <FeaturedPost post={featured} />
        </section>
      ) : null}
      <section className="wrap section">
        <p className="section-label">Writing</p>
        <PostList posts={rest} empty="Nothing published yet." />
      </section>
    </div>
  )
}
