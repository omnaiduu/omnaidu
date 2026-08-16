import type { ReactNode } from 'react'

const TONES = new Set(['note', 'warn', 'idea', 'result', 'danger'])

export function Callout({
  tone,
  kind,
  title,
  children,
}: {
  tone?: string
  kind?: string
  title?: string
  children?: ReactNode
}) {
  const raw = (tone || kind || 'note').toLowerCase()
  const t = TONES.has(raw) ? raw : 'note'

  return (
    <aside className="mdx-callout" data-tone={t}>
      {title ? <strong className="mdx-callout-title">{title}</strong> : null}
      <div className="mdx-callout-body">{children}</div>
    </aside>
  )
}
