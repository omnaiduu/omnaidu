import type { ReactNode } from 'react'

type Tone = 'note' | 'warn' | 'idea'

export function Callout({
  tone = 'note',
  children,
}: {
  tone?: Tone | string
  children?: ReactNode
}) {
  const t = tone === 'warn' || tone === 'idea' ? tone : 'note'
  return (
    <aside className="mdx-callout" data-tone={t}>
      {children}
    </aside>
  )
}
