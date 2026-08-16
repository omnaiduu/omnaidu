import * as React from 'react'
import { highlightCode } from '~/lib/highlight'
import { nodeText } from '~/lib/node-text'

function languageLabel(className?: string) {
  if (!className) return null
  const match = className.match(/language-([\w-]+)/)
  return match?.[1] ?? null
}

export function CodeBlock({ children, className }: { children?: React.ReactNode; className?: string }) {
  const [copied, setCopied] = React.useState(false)
  const text = nodeText(children).replace(/\n$/, '')
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

  const html = highlightCode(text, lang)

  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="code-lang">{lang ?? 'code'}</span>
        <button type="button" className="code-copy" onClick={copy} aria-label="Copy code">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className={className}>
        <code className="hljs" dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  )
}
