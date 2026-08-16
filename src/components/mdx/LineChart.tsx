export type LinePoint = { label: string; value: number }

export function LineChart({ points }: { points: LinePoint[] }) {
  const w = 320
  const h = 120
  const pad = 16
  const max = Math.max(...points.map((p) => p.value), 1)
  const min = Math.min(...points.map((p) => p.value), 0)
  const range = max - min || 1

  const coords = points.map((p, i) => {
    const x = pad + (i / Math.max(points.length - 1, 1)) * (w - pad * 2)
    const y = h - pad - ((p.value - min) / range) * (h - pad * 2)
    return { x, y, ...p }
  })

  const polyline = coords.map((c) => `${c.x},${c.y}`).join(' ')

  return (
    <figure className="chart chart-line" aria-label="Line chart">
      <svg viewBox={`0 0 ${w} ${h}`} className="chart-line-svg" role="img">
        <polyline className="chart-line-path" points={polyline} fill="none" />
        {coords.map((c) => (
          <circle key={c.label} className="chart-line-dot" cx={c.x} cy={c.y} r={3} />
        ))}
      </svg>
      <figcaption className="chart-line-labels">
        {points.map((p) => (
          <span key={p.label}>{p.label}</span>
        ))}
      </figcaption>
    </figure>
  )
}
