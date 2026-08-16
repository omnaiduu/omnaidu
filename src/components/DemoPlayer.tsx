export function DemoPlayer({
  src,
  poster,
  caption,
}: {
  src: string
  poster?: string | null
  caption?: string
}) {
  return (
    <figure className="demo-stage">
      <div className="demo-stage-bar">
        <span />
        <span />
        <span />
      </div>
      <div className="player">
        <video
          src={src}
          poster={poster ?? undefined}
          controls
          playsInline
          preload="metadata"
          muted
        />
      </div>
      {caption ? (
        <figcaption style={{ color: 'var(--muted)', fontSize: 13, padding: '10px 8px 4px' }}>
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
