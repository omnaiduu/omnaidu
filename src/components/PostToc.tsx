import { extractHeadings } from '~/lib/headings'

export function PostToc({ markdown }: { markdown: string }) {
  const items = extractHeadings(markdown)
  if (items.length < 3) return null

  return (
    <nav className="post-toc" aria-label="On this page">
      <p className="post-toc-label">On this page</p>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.title}</a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
