import { useReducedMotion } from 'motion/react'
import * as React from 'react'

export function TypeLede({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const [count, setCount] = React.useState(reduceMotion ? text.length : 0)

  React.useEffect(() => {
    if (reduceMotion) {
      setCount(text.length)
      return
    }
    setCount(0)
    const id = window.setInterval(() => {
      setCount((n) => {
        if (n >= text.length) {
          window.clearInterval(id)
          return n
        }
        return n + 1
      })
    }, 36)
    return () => window.clearInterval(id)
  }, [text, reduceMotion])

  return (
    <p className={className}>
      {text.slice(0, count)}
      <span className="type-caret" aria-hidden />
    </p>
  )
}
