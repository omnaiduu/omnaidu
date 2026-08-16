import type { ReactNode } from 'react'

const KINDS = new Set(['theorem', 'lemma', 'definition', 'proposition'])

export function Academic({
  kind = 'theorem',
  title,
  children,
}: {
  kind?: string
  title?: string
  children?: ReactNode
}) {
  const raw = (kind ?? 'theorem').toLowerCase()
  const k = KINDS.has(raw) ? raw : 'theorem'
  return (
    <aside className="mdx-academic" data-kind={k}>
      <strong className="mdx-academic-label">{title ?? ''}</strong>
      <div className="mdx-academic-body">{children}</div>
    </aside>
  )
}
