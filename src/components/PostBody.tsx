import * as React from 'react'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import type { Root } from 'mdast'
import { visit } from 'unist-util-visit'
import { Callout } from '~/components/mdx/Callout'
import { MdxApiSpec } from '~/components/mdx/MdxApiSpec'
import { MdxArch } from '~/components/mdx/MdxArch'
import { MdxChart } from '~/components/mdx/MdxChart'
import { MdxDetails } from '~/components/mdx/MdxDetails'
import { MdxDiff } from '~/components/mdx/MdxDiff'
import { MdxFileTree } from '~/components/mdx/MdxFileTree'
import { MdxFigure } from '~/components/mdx/MdxFigure'
import { MdxGraph } from '~/components/mdx/MdxGraph'
import { MdxProof } from '~/components/mdx/MdxProof'
import { MdxPullquote } from '~/components/mdx/MdxPullquote'
import { MdxSteps } from '~/components/mdx/MdxSteps'
import { MdxTerminal } from '~/components/mdx/MdxTerminal'
import { MdxTimeline } from '~/components/mdx/MdxTimeline'

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

function languageLabel(className?: string) {
  if (!className) return null
  const match = className.match(/language-([\w-]+)/)
  return match?.[1] ?? null
}

function CodeBlock({ children, className }: { children?: React.ReactNode; className?: string }) {
  const [copied, setCopied] = React.useState(false)
  const text = getText(children).replace(/\n$/, '')
  const lang = languageLabel(className)

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
      {lang ? (
        <div className="code-block-header">
          <span className="code-lang">{lang}</span>
        </div>
      ) : null}
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
          apispec: MdxApiSpec,
          arch: MdxArch,
          callout: Callout,
          chart: MdxChart,
          demo: MdxDemo,
          details: MdxDetails,
          diff: MdxDiff,
          figure: MdxFigure,
          filetree: MdxFileTree,
          graph: MdxGraph,
          proof: MdxProof,
          pullquote: MdxPullquote,
          steps: MdxSteps,
          terminal: MdxTerminal,
          timeline: MdxTimeline,
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
