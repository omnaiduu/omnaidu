import * as React from 'react'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import type { Root } from 'mdast'
import { visit } from 'unist-util-visit'
import { Callout } from '~/components/mdx/Callout'
import { MdxDemo } from '~/components/mdx/MdxDemo'
import { MdxFigure } from '~/components/mdx/MdxFigure'
import { MdxProof } from '~/components/mdx/MdxProof'
import { MdxPullquote } from '~/components/mdx/MdxPullquote'
import { MdxSteps } from '~/components/mdx/MdxSteps'

function remarkDirectiveHast() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const data = node.data || (node.data = {})
        data.hName = node.name
        data.hProperties = node.attributes ?? {}
      }
    })
  }
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function getText(children: React.ReactNode): string {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.map(getText).join('')
  if (React.isValidElement(children) && children.props.children) {
    return getText(children.props.children)
  }
  return ''
}

function CodeBlock({ children, className }: { children?: React.ReactNode; className?: string }) {
  const [copied, setCopied] = React.useState(false)
  const text = getText(children).replace(/\n$/, '')

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  if (!className) {
    return <code>{children}</code>
  }

  return (
    <div className="code-block">
      <pre className={className}>
        <code>{children}</code>
      </pre>
      <button type="button" className="code-copy" onClick={copy} aria-label="Copy code">
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}

function ProseImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null
  return (
    <figure className="mdx-figure">
      <img src={src} alt={alt ?? ''} loading="lazy" decoding="async" />
      {alt ? <figcaption>{alt}</figcaption> : null}
    </figure>
  )
}

function stripLeadingTitle(source: string) {
  return source.replace(/^# .+\n+/, '')
}

export function PostBody({ markdown }: { markdown: string }) {
  const body = stripLeadingTitle(markdown)

  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkDirective, remarkDirectiveHast]}
        components={{
          callout: Callout,
          demo: MdxDemo,
          figure: MdxFigure,
          proof: MdxProof,
          pullquote: MdxPullquote,
          steps: MdxSteps,
          a: ({ href, children }) => (
            <a className="link-ember" href={href} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}>
              {children}
            </a>
          ),
          img: ProseImage,
          pre: ({ children }) => <>{children}</>,
          code: CodeBlock,
          table: ({ children }) => (
            <div className="table-wrap">
              <table>{children}</table>
            </div>
          ),
          blockquote: ({ children }) => <blockquote className="mdx-blockquote">{children}</blockquote>,
          h2: ({ children }) => {
            const id = slugify(getText(children))
            return <h2 id={id}>{children}</h2>
          },
          h3: ({ children }) => {
            const id = slugify(getText(children))
            return <h3 id={id}>{children}</h3>
          },
          ol: ({ children }) => <ol>{children}</ol>,
        } as Components}
      >
        {body}
      </ReactMarkdown>
    </div>
  )
}
