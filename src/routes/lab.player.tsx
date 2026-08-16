import { createFileRoute } from '@tanstack/react-router'
import { DemoPlayer } from '~/components/DemoPlayer'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/lab/player')({
  component: LabPlayer,
  head: () => ({
    meta: seo({
      title: 'Demo player — Lab',
      description: 'Poster-first H.264 player for 30–90s receipts.',
      url: '/lab/player',
    }),
  }),
})

const SPEC = [
  '30–90s of the thing running. No talking-head recap.',
  'H.264 MP4 + faststart (moov at the front). ≤720p. Target 2–8MB. The seed clip is 16KB / 6s / 1280×720.',
  'Poster required so the page never shows a black 16:9 hole. SVG or a still WebP is fine.',
  'No <video> element until play — only the poster image is in the DOM. Then preload="none". Scrolling home never downloads an MP4 (home uses the still only).',
  'Muted + playsInline so tap-to-play works on iOS without a fullscreen hijack.',
  'Optional WebVTT captions load with the file, not before.',
  'Uploads go to R2 via private MCP upload_media, served at /files/… with Range requests, Cache API, and Cache-Control: immutable.',
  'Public seed clip stays at /media/demo.mp4 (static asset, also cached at the edge).',
  'Same file for the site embed, X, and LinkedIn. Crop in the social UI, not in a second encode.',
  'No HLS and no Cloudflare Stream for these clips — extra transcode cost for a 45s loop.',
]

function LabPlayer() {
  return (
    <section className="lab-page">
      <h1 className="lab-title">Short demos, not a channel</h1>
      <p className="lab-lead">
        One file. Site embed, X, LinkedIn. The player does not fetch the MP4 until you hit play.
      </p>

      <div className="lab-player-grid">
        <div>
          <h2 className="lab-block-heading">Poster first</h2>
          <p className="lab-block-when">
            Default. Overlay + poster until play. The network tab stays quiet until then.
          </p>
          <DemoPlayer
            src="/media/demo.mp4"
            poster="/media/demo-poster.svg"
            captions="/media/demo.vtt"
            caption="Poster is SVG. Click play — then the 16KB H.264 file and captions load."
          />
        </div>
        <div>
          <h2 className="lab-block-heading">Same asset, feed-ready</h2>
          <p className="lab-block-when">
            Do not make a YouTube cut. Attach this MP4. Keep the poster in the post too.
          </p>
          <DemoPlayer
            src="/media/demo.mp4"
            poster="/media/demo-poster.svg"
            caption="Same 6s H.264 clip. Encode once: ffmpeg -movflags +faststart."
          />
        </div>
      </div>

      <h2 className="lab-block-heading" style={{ marginTop: 40 }}>
        Contract
      </h2>
      <ul className="lab-spec-list">
        {SPEC.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}
