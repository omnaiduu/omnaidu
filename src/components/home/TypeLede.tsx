import { motion, useReducedMotion } from 'motion/react'

export function TypeLede({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <p className={className}>{text}</p>
  }

  return (
    <p className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.028, duration: 0.18, ease: 'easeOut' }}
        >
          {char === ' ' ? '\u00a0' : char}
        </motion.span>
      ))}
      <motion.span
        className="type-caret"
        aria-hidden
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </p>
  )
}
