'use client'

import { motion, useReducedMotion, useSpring } from 'motion/react'
import * as React from 'react'
import { ComputerScene } from '~/components/ComputerScene'

export function TiltLaptop({ compact = false }: { compact?: boolean }) {
  const reduceMotion = useReducedMotion()
  const rotateY = useSpring(0, { stiffness: 160, damping: 18 })
  const rotateX = useSpring(0, { stiffness: 160, damping: 18 })

  return (
    <motion.div
      className={compact ? 'tilt-stage tilt-stage-compact' : 'tilt-stage'}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={(event) => {
        if (reduceMotion) return
        const box = event.currentTarget.getBoundingClientRect()
        rotateY.set(((event.clientX - box.left) / box.width - 0.5) * 18)
        rotateX.set(((event.clientY - box.top) / box.height - 0.5) * -12)
      }}
      onMouseLeave={() => {
        rotateX.set(0)
        rotateY.set(0)
      }}
    >
      <ComputerScene />
    </motion.div>
  )
}

export function MagneticHero({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()
  const x = useSpring(48, { stiffness: 90, damping: 18 })
  const y = useSpring(28, { stiffness: 90, damping: 18 })

  return (
    <div
      className="magnetic-hero"
      onMouseMove={(event) => {
        if (reduceMotion) return
        const box = event.currentTarget.getBoundingClientRect()
        x.set(event.clientX - box.left)
        y.set(event.clientY - box.top)
      }}
    >
      <motion.span className="magnetic-ember" style={{ x, y }} aria-hidden />
      {children}
    </div>
  )
}

const GLYPHS = [
  { ch: '{', x: '8%', y: '18%' },
  { ch: '}', x: '78%', y: '22%' },
  { ch: '→', x: '18%', y: '62%' },
  { ch: ';', x: '88%', y: '58%' },
  { ch: '::', x: '52%', y: '12%' },
  { ch: 'fn', x: '62%', y: '70%' },
  { ch: 'ok', x: '32%', y: '38%' },
]

export function GlyphField({ children }: { children?: React.ReactNode }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="glyph-field">
      {GLYPHS.map((glyph, i) => (
        <motion.span
          key={glyph.ch + glyph.x}
          className="glyph-chip"
          style={{ left: glyph.x, top: glyph.y }}
          animate={
            reduceMotion
              ? undefined
              : { y: [0, -10, 0], opacity: [0.18, 0.45, 0.18] }
          }
          transition={{ duration: 3.6 + i * 0.35, repeat: Infinity, ease: 'easeInOut' }}
        >
          {glyph.ch}
        </motion.span>
      ))}
      <div className="glyph-field-copy">{children}</div>
    </div>
  )
}

const RAIL = ['projects', 'research', 'systems', 'writing', 'proof', 'demo']

export function TagRail() {
  const reduceMotion = useReducedMotion()
  const items = [...RAIL, ...RAIL]

  return (
    <div className="tag-rail" aria-hidden>
      <motion.div
        className="tag-rail-track"
        animate={reduceMotion ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((tag, i) => (
          <span key={`${tag}-${i}`}>{tag}</span>
        ))}
      </motion.div>
    </div>
  )
}

export function CurtainLine() {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className="curtain-line"
      initial={reduceMotion ? false : { scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}

export function CssCube() {
  const reduceMotion = useReducedMotion()
  return (
    <div className="css-cube-stage">
      <motion.div
        className="css-cube"
        animate={reduceMotion ? undefined : { rotateX: 360, rotateY: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      >
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </motion.div>
    </div>
  )
}
