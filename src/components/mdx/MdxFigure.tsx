export function MdxFigure({
  src,
  alt,
  children,
}: {
  src?: string
  alt?: string
  children?: React.ReactNode
}) {
  if (!src) return null
  return (
    <figure className="mdx-figure">
      <img src={src} alt={alt ?? ''} loading="lazy" decoding="async" />
      {children ? <figcaption>{children}</figcaption> : null}
    </figure>
  )
}
