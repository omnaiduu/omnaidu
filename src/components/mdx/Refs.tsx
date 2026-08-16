import type { ReactNode } from 'react'
import { nodeText } from '~/lib/node-text'

export function Refs({ children }: { children?: ReactNode }) {
  const lines = nodeText(children)
    .split('\n')
    .map((line) => line.replace(/^\s*\d+\.\s*/, '').trim())
    .filter(Boolean)

  if (!lines.length) return null

  return (
    <section className="mdx-refs">
      <h2 className="mdx-refs-title" id="references">
        References
      </h2>
      <ol>
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ol>
    </section>
  )
}
