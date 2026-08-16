type Bench = { name: string; value: string }

export function MdxProof({
  tests,
  repo,
  children,
}: {
  tests?: string
  repo?: string
  children?: React.ReactNode
}) {
  let benches: Bench[] = []
  if (children) {
    const raw = String(children).trim()
    if (raw.startsWith('{')) {
      try {
        const parsed = JSON.parse(raw) as { benches?: Bench[] }
        benches = parsed.benches ?? []
      } catch {
        /* ignore malformed JSON */
      }
    }
  }

  return (
    <aside className="proof mdx-proof">
      <h2>Proof</h2>
      <div className="proof-grid">
        {tests ? (
          <div>
            <small>Tests</small>
            <strong>{tests}</strong>
          </div>
        ) : null}
        {benches.map((bench) => (
          <div key={bench.name}>
            <small>{bench.name}</small>
            <strong>{bench.value}</strong>
          </div>
        ))}
        {repo ? (
          <div>
            <small>Repo</small>
            <a className="link-ember" href={repo}>
              Open GitHub →
            </a>
          </div>
        ) : null}
      </div>
    </aside>
  )
}
