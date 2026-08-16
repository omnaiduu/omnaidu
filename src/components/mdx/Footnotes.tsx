import type { ReactNode } from 'react'

export function Footnotes({
  notes,
  children,
}: {
  notes: { id: string; text: string }[]
  children?: ReactNode
}) {
  return (
    <div className="mdx-footnotes">
      <div className="mdx-footnotes-body">{children}</div>
      <ol className="mdx-footnotes-list">
        {notes.map((note, i) => (
          <li key={note.id} id={note.id}>
            <sup>{i + 1}</sup> {note.text}
          </li>
        ))}
      </ol>
    </div>
  )
}

export function FootnoteRef({ n, id }: { n: number; id: string }) {
  return (
    <sup>
      <a href={`#${id}`} className="footnote-ref">
        {n}
      </a>
    </sup>
  )
}
