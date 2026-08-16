import * as React from 'react'
import { nodeText } from '~/lib/node-text'
import { Diff } from './Diff'

type DiffPayload = {
  before?: string[]
  after?: string[]
  unified?: { line: string; type: 'add' | 'remove' | 'same' }[]
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
    const lines = raw.split('\n').filter(Boolean)
    return { unified: lines.map((line) => ({ line, type: 'same' as const })) }
  }, [children])

  if (!parsed) return null
  return <Diff before={parsed.before} after={parsed.after} unified={parsed.unified} />
}
