'use client'

import { Link, useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  console.error('DefaultCatchBoundary Error:', error)

  return (
    <div className="wrap error-fallback">
      <p className="section-label">Error</p>
      <h1 className="article-title">Something broke.</h1>
      <p className="page-lead">The page failed to load. Try again, or go home.</p>
      <p className="home-more">
        <button
          type="button"
          className="link-ember"
          onClick={() => {
            router.invalidate()
          }}
        >
          Try again
        </button>
        {' · '}
        <Link to="/" className="link-ember">
          Back home →
        </Link>
      </p>
    </div>
  )
}
