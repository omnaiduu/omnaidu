import * as React from 'react'
import { nodeText } from '~/lib/node-text'
import { Terminal } from './Terminal'

export function MdxTerminal({
  prompt,
  children,
}: {
  prompt?: string
  children?: React.ReactNode
}) {
  const lines = React.useMemo(() => {
    const raw = nodeText(children).trim()
    if (raw.startsWith('[')) {
      try {
        return JSON.parse(raw) as string[]
      } catch {
        return []
      }
    }
    return raw.split('\n').filter((l) => l.length > 0)
  }, [children])

  if (!lines.length) return null
  return <Terminal prompt={prompt} lines={lines} />
}
