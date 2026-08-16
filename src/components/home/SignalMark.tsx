import { useReducedMotion } from 'motion/react'

export function SignalMark({ compact = false }: { compact?: boolean }) {
  const reduceMotion = useReducedMotion()

  return (
    <div
      className={`signal-mark${compact ? ' signal-mark-compact' : ''}${reduceMotion ? ' signal-mark-static' : ''}`}
      aria-hidden
    >
      <span className="signal-ring" />
      <span className="signal-ring signal-ring-delay" />
      <span className="signal-dot" />
    </div>
  )
}

export function EmberPulse() {
  return <span className="ember-pulse" aria-hidden />
}
