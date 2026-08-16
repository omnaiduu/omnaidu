import { Link } from '@tanstack/react-router'
import { TAGS, type Tag } from '~/lib/types'

export function TagFilters({ active }: { active: Tag }) {
  return (
    <div className="filters">
      {TAGS.map((tag) => (
        <Link
          key={tag}
          to="/blog"
          search={tag === 'all' ? {} : { tag }}
          className="chip"
          data-active={active === tag}
        >
          {tag}
        </Link>
      ))}
    </div>
  )
}
