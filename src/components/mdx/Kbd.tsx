import type { ReactNode } from 'react'

export function Kbd({ children }: { children?: ReactNode }) {
  return <kbd className="kbd">{children}</kbd>
}

export function KbdCombo({ keys }: { keys: string[] }) {
  return (
    <span className="kbd-combo">
      {keys.map((key, i) => (
        <span key={key}>
          {i > 0 ? <span className="kbd-plus">+</span> : null}
          <Kbd>{key}</Kbd>
        </span>
      ))}
    </span>
  )
}
