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
  const [armed, setArmed] = React.useState(false)
  const [playing, setPlaying] = React.useState(false)

  React.useEffect(() => {
    if (!armed) return
    const video = videoRef.current
    if (!video) return
    video.muted = true
    void video.play().then(() => setPlaying(true)).catch(() => {})
  }, [armed, src])

  function play() {
    setArmed(true)
  }

  function togglePlay() {
    const video = videoRef.current
    if (!armed) {
      play()
      return
    }
    if (!video) return
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'Enter') {
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
          src={armed ? src : undefined}
          poster={poster ?? undefined}
          playsInline
          preload="none"
          controls={playing}
          muted
          width={1280}
          height={720}
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
