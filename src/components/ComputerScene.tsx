'use client'

import { useReducedMotion } from 'motion/react'

const RUST_LINES = [
  // Short enough to fit the compact laptop on /about without clipping.
  'match intent {',
  '  Balance => tools.balance(s)?,',
  '  Transfer(t) => tools.send(s, t)?,',
  '  _ => Reply::clarify("…"),',
  '}',
]

export function ComputerScene() {
  const reduceMotion = useReducedMotion()

  return (
    <div
      className={`computer-scene${reduceMotion ? ' computer-scene-static' : ''}`}
      aria-hidden
    >
      <div className="computer-desk" />
      <div className="computer-laptop">
        <div className="computer-lid">
          <div className="computer-screen">
            {!reduceMotion ? <div className="computer-scanline" /> : null}
            <pre className="computer-code">
              {RUST_LINES.map((line) => (
                <div key={line}>{line}</div>
              ))}
              <div className="computer-cursor-line">
                <span className="computer-cursor" />
              </div>
            </pre>
            <span className="computer-ember-pixel" />
          </div>
        </div>
        <div className="computer-base" />
      </div>
    </div>
  )
}
