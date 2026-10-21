import { Link } from '@tanstack/react-router'

export function EmptySelected() {
  return (
    <div className="selected-open">
      <div className="selected-open-still" aria-hidden>
        <span className="selected-open-mark" />
        <span className="selected-open-label">omnaidu.com</span>
        <span className="selected-open-rule" />
      </div>
      <div className="selected-open-copy">
        <p className="section-label">Selected</p>
        <p className="selected-open-title">Open slot</p>
        <p className="selected-open-abstract">
          The next shipped system sits here as a still. Home never plays a clip.
        </p>
      </div>
    </div>
  )
}

export function EmptyList({
  title = 'The index is empty',
  body = 'Work goes here when it has a receipt — what shipped, and how I checked it.',
}: {
  title?: string
  body?: string
}) {
  return (
    <div className="index-empty">
      <p className="index-empty-title">{title}</p>
      <p>{body}</p>
      <p className="index-empty-more">
        <Link className="link-ember" to="/about">
          About
        </Link>
        {' · '}
        <Link className="link-ember" to="/blog">
          All writing
        </Link>
      </p>
    </div>
  )
}
