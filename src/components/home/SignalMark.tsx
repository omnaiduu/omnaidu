import { motion, useReducedMotion } from 'motion/react'

export function SignalMark({ compact = false }: { compact?: boolean }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className={`signal-mark${compact ? ' signal-mark-compact' : ''}`} aria-hidden>
      {[0, 1].map((i) => (
        <motion.span
          key={i}
          className="signal-ring"
          animate={reduceMotion ? undefined : { scale: [0.35, 1.55], opacity: [0.65, 0] }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeOut',
            delay: i * 1.4,
          }}
        />
      ))}
      <motion.span
        className="signal-dot"
        animate={reduceMotion ? undefined : { scale: [1, 1.15, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
