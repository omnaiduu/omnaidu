import * as React from 'react'
import { nodeText } from '~/lib/node-text'
import { Diff } from './Diff'

type DiffPayload = {
  before?: string[]
  after?: string[]
  unified?: { line: string; type: 'add' | 'remove' | 'same' }[]
}

function parseUnifiedText(raw: string): DiffPayload {
  const unified = raw
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) => {
      if (line.startsWith('+++') || line.startsWith('---') || line.startsWith('@@')) {
        return { line, type: 'same' as const }
      }
      if (line.startsWith('+')) return { line: line.slice(1), type: 'add' as const }
      if (line.startsWith('-')) return { line: line.slice(1), type: 'remove' as const }
      return { line, type: 'same' as const }
    })
  return { unified }
}

export function MdxDiff({ children }: { children?: React.ReactNode }) {
  const parsed = React.useMemo(() => {
    const raw = nodeText(children).trim()
    if (raw.startsWith('{')) {
      try {
        return JSON.parse(raw) as DiffPayload
      } catch {
        return null
      }
    }
    return parseUnifiedText(raw)
  }, [children])

  if (!parsed) return null
  return <Diff before={parsed.before} after={parsed.after} unified={parsed.unified} />
}
