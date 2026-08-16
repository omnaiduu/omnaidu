export type GraphNode = { id: string; label: string; x: number; y: number }
export type GraphEdge = { from: string; to: string }

export function NetworkGraph({
  nodes,
  edges,
}: {
  nodes: GraphNode[]
  edges: GraphEdge[]
}) {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]))

  return (
    <figure className="graph-svg" aria-label="Network graph">
      <svg viewBox="0 0 360 200" role="img">
        {edges.map((edge) => {
          const a = nodeMap[edge.from]
          const b = nodeMap[edge.to]
          if (!a || !b) return null
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              className="graph-edge"
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
            />
          )
        })}
        {nodes.map((node) => (
          <g key={node.id} className="graph-node">
            <circle cx={node.x} cy={node.y} r={22} />
            <text x={node.x} y={node.y + 4} textAnchor="middle">
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  )
}

export const SAMPLE_GRAPH = {
  nodes: [
    { id: 'fe', label: 'FE', x: 50, y: 100 },
    { id: 'api', label: 'API', x: 130, y: 60 },
    { id: 'nlu', label: 'NLU', x: 130, y: 140 },
    { id: 'loop', label: 'Loop', x: 230, y: 100 },
    { id: 'db', label: 'DB', x: 310, y: 100 },
  ] as GraphNode[],
  edges: [
    { from: 'fe', to: 'api' },
    { from: 'api', to: 'loop' },
    { from: 'nlu', to: 'loop' },
    { from: 'loop', to: 'db' },
    { from: 'api', to: 'nlu' },
  ] as GraphEdge[],
}
