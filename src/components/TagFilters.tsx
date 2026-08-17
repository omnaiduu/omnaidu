import { Link } from '@tanstack/react-router'
import { TAGS, type Tag } from '~/lib/types'

export function TagFilters({ active }: { active: Tag }) {
  return (
    <nav className="filters" aria-label="Filter by category">
      {TAGS.map((tag) => (
        <Link
          key={tag}
          to="/blog"
          search={tag === 'all' ? {} : { tag }}
          className="chip"
          data-active={active === tag}
          aria-current={active === tag ? 'page' : undefined}
        >
          {tag}
        </Link>
      ))}
    </nav>
  )
}
