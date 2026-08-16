import { DemoPlayer } from '~/components/DemoPlayer'

export function MdxDemo({
  src,
  poster,
  children,
}: {
  src?: string
  poster?: string
  children?: React.ReactNode
}) {
  if (!src) return null
  const caption = typeof children === 'string' ? children : undefined
  return <DemoPlayer src={src} poster={poster} caption={caption} />
}
