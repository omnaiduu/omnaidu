import { Link } from '@tanstack/react-router'
import { TAGS, type Tag } from '~/lib/types'

/**
 * Category chips for /blog. A category with no posts is left out, and the row is
 * hidden when fewer than two categories have posts (a filter with one choice is noise).
 */
export function TagFilters({ active, counts }: { active: Tag; counts: Partial<Record<Tag, number>> }) {
  const filled = TAGS.filter((tag) => tag !== 'all' && (counts[tag] ?? 0) > 0)
  if (filled.length < 2 && active === 'all') return null
  const shown = TAGS.filter((tag) => tag === 'all' || tag === active || filled.includes(tag))

  return (
    <div className="filters">
      {shown.map((tag) => (
        <Link
          key={tag}
          to="/blog"
          search={tag === 'all' ? {} : { tag }}
          className="chip"
          data-active={active === tag}
        >
          {tag}
          {tag !== 'all' ? <span className="chip-count">{counts[tag] ?? 0}</span> : null}
        </Link>
      ))}
    </div>
  )
}
