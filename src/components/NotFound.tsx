'use client'

import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { TiltLaptop } from '~/components/home/MotionLooks'

export function NotFound({ children }: { children?: ReactNode }) {
  return (
    <div className="wrap not-found">
      <div className="not-found-copy">
        <p className="section-label">404</p>
        <h1 className="article-title">No such page.</h1>
        <p className="page-lead">
          {children || 'The page you are looking for does not exist.'}
        </p>
        <Link to="/" className="link-ember">
          Back home →
        </Link>
        <p className="not-found-links">
          <Link to="/blog">Writing</Link>
          <Link to="/about">About</Link>
        </p>
      </div>
      <div className="not-found-desk" aria-hidden>
        <TiltLaptop />
      </div>
    </div>
  )
}
