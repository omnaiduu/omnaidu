import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1] as const

export function AnimatedLetters({
  text,
  className,
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <span className={className}>{text}</span>
  }

  return (
    <span className={className}>
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          className="letter"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + i * 0.028, duration: 0.38, ease: EASE }}
        >
          {ch === ' ' ? '\u00a0' : ch}
        </motion.span>
      ))}
    </span>
  )
}

export function Wordmark() {
  const reduceMotion = useReducedMotion()

  return (
    <Link to="/" className="wordmark" aria-label="omnaidu home">
      <AnimatedLetters text="omnaidu" className="wordmark-text" />
      <motion.span
        className="wordmark-mark"
        aria-hidden
        initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={
          reduceMotion
            ? undefined
            : { delay: 0.3, type: 'spring', stiffness: 480, damping: 20 }
        }
      />
    </Link>
  )
}
