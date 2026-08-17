'use client'

import * as React from 'react'
import type { Post } from '~/lib/types'

function apa(post: Post) {
  const year = post.publishedAt.slice(0, 4)
  return `Naidu, O. (${year}). ${post.title}. omnaidu.com. https://omnaidu.com/blog/${post.slug}`
}

function bibtex(post: Post) {
  const year = post.publishedAt.slice(0, 4)
  const key = `naidu${year}${post.slug.replace(/[^a-z0-9]+/gi, '').slice(0, 28)}`
  const title = post.title.replaceAll('{', '').replaceAll('}', '')
  return `@misc{${key},
  author = {Naidu, Om},
  title = {${title}},
  year = {${year}},
  howpublished = {\\url{https://omnaidu.com/blog/${post.slug}}},
}`
}

export function CiteButton({ post }: { post: Post }) {
  const [copied, setCopied] = React.useState<'apa' | 'bib' | null>(null)

  async function copy(kind: 'apa' | 'bib') {
    try {
      await navigator.clipboard.writeText(kind === 'apa' ? apa(post) : bibtex(post))
      setCopied(kind)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <>
      <button type="button" className="cite-btn" onClick={() => copy('apa')}>
        {copied === 'apa' ? 'Copied' : 'Copy citation'}
      </button>
      <button type="button" className="cite-btn" onClick={() => copy('bib')}>
        {copied === 'bib' ? 'Copied' : 'BibTeX'}
      </button>
    </>
  )
}
