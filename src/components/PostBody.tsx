import * as React from 'react'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import type { Root } from 'mdast'
import { visit } from 'unist-util-visit'
import { Callout } from '~/components/mdx/Callout'
import { Kbd } from '~/components/mdx/Kbd'
import {
  MdxDefinition,
  MdxLemma,
  MdxProposition,
  MdxTheorem,
} from '~/components/mdx/MdxAcademic'
import { MdxApiSpec } from '~/components/mdx/MdxApiSpec'
import { MdxArch } from '~/components/mdx/MdxArch'
import { MdxChart } from '~/components/mdx/MdxChart'
import { MdxCompare } from '~/components/mdx/MdxCompare'
import { MdxDemo } from '~/components/mdx/MdxDemo'
import { MdxDesk } from '~/components/mdx/MdxDesk'
import { MdxDetails } from '~/components/mdx/MdxDetails'
import { MdxDiff } from '~/components/mdx/MdxDiff'
import { MdxFileTree } from '~/components/mdx/MdxFileTree'
import { MdxFigure } from '~/components/mdx/MdxFigure'
import { MdxGraph } from '~/components/mdx/MdxGraph'
import { MdxHero } from '~/components/mdx/MdxHero'
import { MdxProof } from '~/components/mdx/MdxProof'
import { MdxPullquote } from '~/components/mdx/MdxPullquote'
import { MdxSteps } from '~/components/mdx/MdxSteps'
import { MdxTerminal } from '~/components/mdx/MdxTerminal'
import { MdxTimeline } from '~/components/mdx/MdxTimeline'
import { Refs } from '~/components/mdx/Refs'
import { CodeBlock } from '~/components/CodeBlock'
import { headingId } from '~/lib/headings'

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
  return headingId(text)
}

function getText(children: React.ReactNode): string {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.map(getText).join('')
  if (React.isValidElement(children) && children.props.children) {
    return getText(children.props.children)
  }
  return ''
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
        remarkPlugins={[remarkGfm, remarkMath, remarkDirective, remarkDirectiveHast]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: 'ignore' }]]}
        components={{
          apispec: MdxApiSpec,
          arch: MdxArch,
          callout: Callout,
          chart: MdxChart,
          compare: MdxCompare,
          definition: MdxDefinition,
          demo: MdxDemo,
          desk: MdxDesk,
          details: MdxDetails,
          diff: MdxDiff,
          figure: MdxFigure,
          filetree: MdxFileTree,
          graph: MdxGraph,
          hero: MdxHero,
          kbd: Kbd,
          lemma: MdxLemma,
          proof: MdxProof,
          proposition: MdxProposition,
          pullquote: MdxPullquote,
          refs: Refs,
          steps: MdxSteps,
          terminal: MdxTerminal,
          theorem: MdxTheorem,
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
