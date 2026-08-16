import { PostHero } from '~/components/PostHero'
import { nodeText } from '~/lib/node-text'
import type { ReactNode } from 'react'

export function MdxHero({
  src,
  poster,
  children,
}: {
  src?: string
  poster?: string
  children?: ReactNode
}) {
  if (!src && !poster) return null
  const caption = nodeText(children).trim() || undefined
  return <PostHero src={src} poster={poster} caption={caption} />
}
