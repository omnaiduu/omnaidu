import { useEffect, useState } from 'react'
import { extractHeadings, type Heading } from '~/lib/headings'

function useHeadings(markdown: string) {
  const items = extractHeadings(markdown)
  return items.length < 3 ? [] : items
}

function TocList({ items, active }: { items: Heading[]; active?: string }) {
  return (
    <ol>
      {items.map((item) => (
        <li key={item.id}>
          <a href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined}>
            {item.title}
          </a>
        </li>
      ))}
    </ol>
  )
}

/** Collapsed contents under the post header. Shown below the wide breakpoint. */
export function PostToc({ markdown }: { markdown: string }) {
  const items = useHeadings(markdown)
  if (items.length === 0) return null

  return (
    <details className="post-toc post-toc-inline">
      <summary>
        <span className="post-toc-label">On this page</span>
        <span className="post-toc-count">{items.length} sections</span>
      </summary>
      <nav aria-label="On this page">
        <TocList items={items} />
      </nav>
    </details>
  )
}

/** Sticky rail beside the body on wide screens, with the current section marked. */
export function PostTocRail({ markdown }: { markdown: string }) {
  const items = useHeadings(markdown)
  const [active, setActive] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (items.length === 0) return
    const nodes = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node != null)
    if (nodes.length === 0) return

    // The current section is the last heading above the top fifth of the viewport.
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.2
      let current: string | undefined
      for (const node of nodes) {
        if (node.getBoundingClientRect().top <= line) current = node.id
        else break
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markdown])

  if (items.length === 0) return null

  return (
    <aside className="post-rail">
      <nav className="post-toc" aria-label="On this page">
        <p className="post-toc-label">On this page</p>
        <TocList items={items} active={active} />
      </nav>
    </aside>
  )
}
