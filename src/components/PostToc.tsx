'use client'

import * as React from 'react'

export function PostToc({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = React.useState<string | null>(null)
  const ids = items.map((item) => item.id).join('|')

  React.useEffect(() => {
    const nodes = ids
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node))
    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const id = visible[0]?.target.id
        if (id) setActive(id)
      },
      { rootMargin: '-88px 0px -55% 0px', threshold: 0 },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [ids])

  if (items.length < 3) return null

  return (
    <nav className="post-toc" aria-label="On this page">
      <p className="post-toc-label">On this page</p>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined}>
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
