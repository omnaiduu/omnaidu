export type ChartItem = { label: string; value: number; unit?: string }

export function BarChart({ items }: { items: ChartItem[] }) {
  const max = Math.max(...items.map((i) => i.value), 1)

  return (
    <figure className="chart chart-bar" aria-label="Bar chart">
      <div className="chart-bars">
        {items.map((item) => (
          <div key={item.label} className="chart-bar-row">
            <span className="chart-bar-label">{item.label}</span>
            <div className="chart-bar-track">
              <div
                className="chart-bar-fill"
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
            <span className="chart-bar-value">
              {item.value}
              {item.unit ?? ''}
            </span>
          </div>
        ))}
      </div>
    </figure>
  )
}
