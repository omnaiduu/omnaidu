import * as React from 'react'
import { nodeText } from '~/lib/node-text'
import { Timeline, type TimelineEvent } from './Timeline'

export function MdxTimeline({ children }: { children?: React.ReactNode }) {
  const events = React.useMemo(() => {
    const raw = nodeText(children).trim()
    if (!raw.startsWith('[')) return null
    try {
      return JSON.parse(raw) as TimelineEvent[]
    } catch {
      return null
    }
  }, [children])

  if (!events?.length) return null
  return <Timeline events={events} />
}
