import { DemoPlayer } from '~/components/DemoPlayer'

function isVideo(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url)
}

function isImage(url: string) {
  return /\.(png|jpe?g|gif|webp|avif|svg)(\?|$)/i.test(url)
}

export function PostHero({
  src,
  poster,
  caption,
  alt,
  priority = false,
}: {
  src?: string | null
  poster?: string | null
  caption?: string
  alt?: string
  priority?: boolean
}) {
  const video = src && isVideo(src) ? src : null
  const image = video
    ? null
    : src && isImage(src)
      ? src
      : poster && isImage(poster)
        ? poster
        : poster ?? null

  if (video) {
    return <DemoPlayer src={video} poster={poster} caption={caption ?? 'Demo. 30–90s of the thing running.'} />
  }

  if (!image) return null

  return (
    <figure className="post-hero">
      <img
        src={image}
        alt={alt ?? caption ?? ''}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}
