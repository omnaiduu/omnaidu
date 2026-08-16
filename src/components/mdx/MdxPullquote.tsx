export function MdxPullquote({
  cite,
  children,
}: {
  cite?: string
  children?: React.ReactNode
}) {
  return (
    <blockquote className="mdx-pullquote">
      {children}
      {cite ? <cite>{cite}</cite> : null}
    </blockquote>
  )
}
