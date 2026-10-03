import type { ProofRow } from '~/lib/proof-rows'

export function ProofCard({ rows, className }: { rows: ProofRow[]; className?: string }) {
  if (rows.length === 0) return null

  return (
    <aside className={className ? `proof ${className}` : 'proof'}>
      <h2>Proof</h2>
      <div className="proof-rows">
        {rows.map((row, index) => (
          <div className="proof-row" key={`${row.label}:${row.value}:${index}`}>
            {row.label ? <small>{row.label}</small> : null}
            <strong>
              {row.href ? (
                <a className="link-ember" href={row.href}>
                  {row.value}
                </a>
              ) : (
                row.value
              )}
            </strong>
          </div>
        ))}
      </div>
    </aside>
  )
}
