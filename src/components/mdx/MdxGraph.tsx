import * as React from 'react'
import { nodeText } from '~/lib/node-text'
import { NetworkGraph, SAMPLE_GRAPH, type GraphEdge, type GraphNode } from './NetworkGraph'

type GraphPayload = { nodes: GraphNode[]; edges: GraphEdge[] }

export function MdxGraph({ children }: { children?: React.ReactNode }) {
  const data = React.useMemo(() => {
    const raw = nodeText(children).trim()
    if (!raw.startsWith('{')) return SAMPLE_GRAPH
    try {
      return JSON.parse(raw) as GraphPayload
    } catch {
      return SAMPLE_GRAPH
    }
  }, [children])

  return <NetworkGraph nodes={data.nodes} edges={data.edges} />
}
