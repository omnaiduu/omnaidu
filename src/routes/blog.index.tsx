import { createFileRoute } from '@tanstack/react-router'
import { PostList } from '~/components/PostList'
import { TagFilters } from '~/components/TagFilters'
import { fetchPosts } from '~/lib/queries'
import { TAGS, type Tag } from '~/lib/types'
import { seo } from '~/utils/seo'

function parseTag(value: unknown): Tag {
  return TAGS.includes(value as Tag) ? (value as Tag) : 'all'
}

export const Route = createFileRoute('/blog/')({
  validateSearch: (search: Record<string, unknown>) => ({
    tag: parseTag(search.tag),
  }),
  loaderDeps: ({ search }) => ({ tag: search.tag }),
  loader: async ({ deps, location }) => {
    const posts = await fetchPosts({ data: { tag: deps.tag, url: location.href } })
    return { posts }
  },
  head: ({ loaderData, match }) => ({
    meta: seo({
      title: `Writing${match.search.tag !== 'all' ? ` · ${match.search.tag}` : ''} — Om Naidu`,
      description: 'Lab writeups tagged projects, research, systems, writing. No separate projects site.',
      image: loaderData?.posts[0] ? `/og/${loaderData.posts[0].slug}` : undefined,
    }),
  }),
  component: BlogIndex,
})

function BlogIndex() {
  const { posts } = Route.useLoaderData()
  const { tag } = Route.useSearch()

  return (
    <section className="wrap section" style={{ paddingTop: 48 }}>
      <p className="section-label">Writing</p>
      <h1 className="article-title" style={{ fontSize: 'clamp(36px, 6vw, 56px)' }}>
        Receipts, not a feed.
      </h1>
      <p style={{ color: 'var(--muted)', maxWidth: '46ch', marginBottom: 28 }}>
        Projects, research, systems, and notes live in one index. Filter by tag. Each serious post
        gets a short demo and a proof block.
      </p>
      <TagFilters active={tag} />
      <PostList posts={posts} />
    </section>
  )
}
