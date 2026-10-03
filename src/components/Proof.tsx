import { ProofCard } from '~/components/ProofCard'
import { rowsFromPost } from '~/lib/proof-rows'
import type { Post } from '~/lib/types'

export function Proof({ post }: { post: Post }) {
  return <ProofCard rows={rowsFromPost(post)} />
}
