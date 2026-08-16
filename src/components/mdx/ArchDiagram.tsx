export type ArchBox = { id: string; label: string }

export function ArchDiagram({ boxes }: { boxes: ArchBox[] }) {
  return (
    <div className="arch" role="img" aria-label="Architecture diagram">
      <div className="arch-row">
        {boxes.map((box, i) => (
          <div key={box.id} className="arch-step">
            <div className="arch-box">{box.label}</div>
            {i < boxes.length - 1 ? <span className="arch-arrow" aria-hidden>→</span> : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export const SAMPLE_ARCH: ArchBox[] = [
  { id: 'client', label: 'Client' },
  { id: 'nlu', label: 'NLU' },
  { id: 'turn', label: 'Turn loop' },
  { id: 'tools', label: 'Tools' },
]
