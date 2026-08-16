import type { ReactNode } from 'react'

export function MdxDetails({
  summary,
  children,
}: {
  summary?: string
  children?: ReactNode
}) {
  return (
    <details className="mdx-details">
      <summary>{summary ?? 'Details'}</summary>
      <div className="mdx-details-body">{children}</div>
    </details>
  )
}
