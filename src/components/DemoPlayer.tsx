import * as React from 'react'

export function DemoPlayer({
  src,
  poster,
  caption,
}: {
  src: string
  poster?: string | null
  caption?: string
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = React.useState(false)

  function play() {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    video.play().then(() => setPlaying(true)).catch(() => {})
  }

  function togglePlay() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      play()
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault()
      togglePlay()
    }
  }

  return (
    <figure className="demo-stage">
      <div className="demo-stage-bar" aria-hidden>
        <span className="demo-stage-bar-line" />
      </div>
      <div
        className="player"
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="group"
        aria-label="Demo video player"
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster ?? undefined}
          playsInline
          preload="metadata"
          controls={playing}
          muted
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
        {!playing ? (
          <button
            type="button"
            className="player-overlay"
            onClick={play}
            aria-label="Play demo video"
          >
            <span className="player-play-icon" aria-hidden />
          </button>
        ) : null}
      </div>
      {caption ? <figcaption className="player-caption">{caption}</figcaption> : null}
    </figure>
  )
}
