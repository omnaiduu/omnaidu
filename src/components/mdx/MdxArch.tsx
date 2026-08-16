import * as React from 'react'
import { nodeText } from '~/lib/node-text'
import { ArchDiagram, SAMPLE_ARCH, type ArchBox } from './ArchDiagram'

export function MdxArch({ children }: { children?: React.ReactNode }) {
  const boxes = React.useMemo(() => {
    const raw = nodeText(children).trim()
    if (!raw.startsWith('[')) return SAMPLE_ARCH
    try {
      return JSON.parse(raw) as ArchBox[]
    } catch {
      return SAMPLE_ARCH
    }
  }, [children])

  return <ArchDiagram boxes={boxes} />
}
