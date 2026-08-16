export function Diff({
  before,
  after,
  unified,
}: {
  before?: string[]
  after?: string[]
  unified?: { line: string; type: 'add' | 'remove' | 'same' }[]
}) {
  if (unified) {
    return (
      <div className="diff diff-unified">
        <pre>
          {unified.map((row, i) => (
            <div key={i} className={`diff-line diff-${row.type}`}>
              <span className="diff-gutter">{row.type === 'add' ? '+' : row.type === 'remove' ? '-' : ' '}</span>
              <code>{row.line}</code>
            </div>
          ))}
        </pre>
      </div>
    )
  }

  return (
    <div className="diff diff-split">
      <div className="diff-col">
        <span className="diff-col-label">Before</span>
        <pre>
          <code>{(before ?? []).join('\n')}</code>
        </pre>
      </div>
      <div className="diff-col">
        <span className="diff-col-label">After</span>
        <pre>
          <code>{(after ?? []).join('\n')}</code>
        </pre>
      </div>
    </div>
  )
}

export const SAMPLE_DIFF_UNIFIED = [
  { line: 'match intent {', type: 'same' as const },
  { line: '    Intent::Balance => tools.balance().await?,', type: 'remove' as const },
  { line: '    Intent::Balance => tools.balances(session).await?,', type: 'add' as const },
  { line: '    Intent::Transfer(spec) => tools.transfer(session, spec).await?,', type: 'same' as const },
  { line: '    Intent::Unknown => Reply::clarify("…"),', type: 'same' as const },
  { line: '}', type: 'same' as const },
]
