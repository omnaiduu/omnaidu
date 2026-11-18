import { createFileRoute } from '@tanstack/react-router'
import { PostList } from '~/components/PostList'
import { TagFilters } from '~/components/TagFilters'
import { fetchPosts } from '~/lib/queries'
import { TAGS, type Tag } from '~/lib/types'
import { ogImagePath } from '~/lib/site'
import { seo } from '~/utils/seo'

function parseTag(value: unknown): Tag {
  return TAGS.includes(value as Tag) ? (value as Tag) : 'all'
}

export const Route = createFileRoute('/blog/')({
  validateSearch: (search: Record<string, unknown>): { tag?: Tag } => {
    if (search.tag == null || search.tag === 'all') return {}
    return { tag: parseTag(search.tag) }
  },
  loaderDeps: ({ search }) => ({ tag: search.tag ?? 'all' }),
  loader: async ({ deps, location }) => {
    // One cached list; filter here so the chips know which categories have posts.
    const all = await fetchPosts({ data: { tag: 'all', url: location.href } })
    const counts: Partial<Record<Tag, number>> = {}
    for (const post of all) counts[post.tag] = (counts[post.tag] ?? 0) + 1
    const posts = deps.tag === 'all' ? all : all.filter((post) => post.tag === deps.tag)
    return { posts, counts }
  },
  head: ({ loaderData, match }) => ({
    meta: seo({
      title: `Writing${match.search.tag ? ` · ${match.search.tag}` : ''} — Om Naidu`,
      description: 'Projects, research, systems, and notes. Filter by category.',
      image: loaderData?.posts[0] ? ogImagePath(loaderData.posts[0].slug) : ogImagePath('site'),
    }),
  }),
  component: BlogIndex,
})

function BlogIndex() {
  const { posts, counts } = Route.useLoaderData()
  const tag = Route.useSearch().tag ?? 'all'

  return (
    <section className="wrap section" style={{ paddingTop: 48 }}>
      <p className="section-label">Writing</p>
      <h1 className="article-title" style={{ fontSize: 'clamp(36px, 6vw, 56px)' }}>
        Writing
      </h1>
      <p style={{ color: 'var(--muted)', maxWidth: '46ch', marginBottom: 28 }}>
        Projects, research, systems, and notes, newest first.
      </p>
      <TagFilters active={tag} counts={counts} />
      <PostList posts={posts} />
    </section>
  )
}
