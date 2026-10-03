import type { ReactNode } from 'react'
import { ProofCard } from '~/components/ProofCard'
import { nodeText } from '~/lib/node-text'
import { rowsFromDirective } from '~/lib/proof-rows'

export function MdxProof({
  tests,
  label,
  repo,
  repoLabel,
  children,
}: {
  tests?: string
  label?: string
  repo?: string
  repoLabel?: string
  children?: ReactNode
}) {
  const rows = rowsFromDirective({
    tests,
    label,
    repo,
    repoLabel,
    body: nodeText(children),
  })
  return <ProofCard className="mdx-proof" rows={rows} />
}
