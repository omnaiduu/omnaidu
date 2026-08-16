import * as React from 'react'
import { nodeText } from '~/lib/node-text'
import { BarChart, type ChartItem } from './BarChart'
import { LineChart, type LinePoint } from './LineChart'

function parseJson<T>(children: React.ReactNode): T | null {
  const raw = nodeText(children).trim()
  if (!raw.startsWith('[') && !raw.startsWith('{')) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function MdxChart({
  kind = 'bar',
  children,
}: {
  kind?: string
  children?: React.ReactNode
}) {
  if (kind === 'line') {
    const points = parseJson<LinePoint[]>(children)
    if (!points?.length) return null
    return <LineChart points={points} />
  }

  const items = parseJson<ChartItem[]>(children)
  if (!items?.length) return null
  return <BarChart items={items} />
}
