import { Academic } from './Academic'
import type { ReactNode } from 'react'

export function MdxTheorem({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <Academic kind="theorem" title={title}>
      {children}
    </Academic>
  )
}

export function MdxLemma({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <Academic kind="lemma" title={title}>
      {children}
    </Academic>
  )
}

export function MdxDefinition({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <Academic kind="definition" title={title}>
      {children}
    </Academic>
  )
}

export function MdxProposition({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <Academic kind="proposition" title={title}>
      {children}
    </Academic>
  )
}
