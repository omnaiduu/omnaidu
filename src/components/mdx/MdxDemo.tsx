import * as React from 'react'
import { DemoPlayer } from '~/components/DemoPlayer'
import { nodeText } from '~/lib/node-text'

export function MdxDemo({
  src,
  poster,
  captions,
  children,
}: {
  src?: string
  poster?: string
  captions?: string
  children?: React.ReactNode
}) {
  if (!src) return null
  const caption = nodeText(children).trim() || undefined
  return <DemoPlayer src={src} poster={poster} captions={captions} caption={caption} />
}
