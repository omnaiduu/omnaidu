import type { ReactNode } from 'react'

export function MdxPullquote({
  cite,
  children,
}: {
  cite?: string
  children?: ReactNode
}) {
  return (
    <blockquote className="mdx-pullquote">
      {children}
      {cite ? <cite>{cite}</cite> : null}
    </blockquote>
  )
}
