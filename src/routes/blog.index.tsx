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
    const posts = await fetchPosts({ data: { tag: deps.tag, url: location.href } })
    return { posts }
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
  const { posts } = Route.useLoaderData()
  const tag = Route.useSearch().tag ?? 'all'

  return (
    <section className="wrap section page-writing">
      <h1 className="article-title page-title">Writing</h1>
      <p className="page-lead">Projects, research, systems, and notes. One list. Filter by category.</p>
      <TagFilters active={tag} />
      <PostList
        posts={posts}
        empty={tag === 'all' ? 'Nothing published yet.' : `Nothing in ${tag} yet.`}
      />
    </section>
  )
}
