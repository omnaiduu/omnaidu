export function Terminal({
  prompt = 'om@omnaidu',
  lines,
}: {
  prompt?: string
  lines: string[]
}) {
  return (
    <div className="terminal-block" role="group" aria-label="Terminal output">
      <div className="terminal-chrome">
        <span />
        <span />
        <span />
      </div>
      <pre className="terminal-body">
        {lines.map((line, i) => (
          <div key={i} className="terminal-line">
            {i === lines.length - 1 ? (
              <>
                <span className="terminal-prompt">{prompt}</span>
                <span>{line}</span>
                <span className="terminal-cursor" aria-hidden />
              </>
            ) : (
              <>
                <span className="terminal-prompt">{prompt}</span>
                <span>{line}</span>
              </>
            )}
          </div>
        ))}
      </pre>
    </div>
  )
}

export const SAMPLE_TERMINAL_LINES = [
  'cargo test --quiet',
  'running 142 tests',
  'test result: ok. 142 passed',
  'pnpm exec vite build',
]
