import type { Bench } from '~/lib/types'

/**
 * The first few measured results of a post, shown before the reader scrolls.
 * Values come straight from the post's proofBenches, in the author's order.
 */
export function KeyResults({
  benches,
  limit = 3,
  className,
}: {
  benches: Bench[] | null | undefined
  limit?: number
  className?: string
}) {
  const rows = (benches ?? []).filter((bench) => bench.value?.trim()).slice(0, limit)
  if (rows.length === 0) return null

  return (
    <dl className={className ? `key-results ${className}` : 'key-results'}>
      {rows.map((bench, index) => (
        <div className="key-result" key={`${bench.name}:${index}`}>
          <dt className="key-result-label">{bench.name}</dt>
          <dd className="key-result-value">{bench.value}</dd>
        </div>
      ))}
    </dl>
  )
}
