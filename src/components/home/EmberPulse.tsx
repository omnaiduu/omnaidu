import { motion, useReducedMotion } from 'motion/react'

export function EmberPulse() {
  const reduceMotion = useReducedMotion()
  return (
    <motion.span
      className="ember-pulse"
      aria-hidden
      animate={reduceMotion ? undefined : { opacity: [0.5, 1, 0.5], scale: [1, 1.18, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}
