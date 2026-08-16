import { createFileRoute } from '@tanstack/react-router'
import { DemoPlayer } from '~/components/DemoPlayer'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/lab/player')({
  component: LabPlayer,
  head: () => ({
    meta: seo({
      title: 'Player — Lab',
      description: 'DemoPlayer variants and short-clip video contract.',
      url: '/lab/player',
    }),
  }),
})

const SPEC = [
  '30–90s H.264 MP4 with faststart, ≤720p, ~2–8MB',
  'Poster required — no black box before play',
  'preload=none until the user hits play (UI assumes this contract)',
  'Range requests on /files/* from R2; public demo at /media/demo.mp4',
  'Same file for site embed, X, and LinkedIn',
  'No HLS / Cloudflare Stream for short clips',
  'Cache-Control: immutable on R2 objects',
]

function LabPlayer() {
  return (
    <section className="lab-page">
      <h1 className="lab-title">Player</h1>
      <p className="lab-lead">Two DemoPlayer states and the video contract for lab posts and feeds.</p>

      <div className="lab-player-grid">
        <div>
          <h2 className="lab-block-heading">With poster overlay</h2>
          <p className="lab-block-when">Default — poster visible until play; muted autoplay not used.</p>
          <DemoPlayer
            src="/media/demo.mp4"
            poster="/media/demo-poster.svg"
            caption="Poster overlay hides the black first frame."
          />
        </div>
        <div>
          <h2 className="lab-block-heading">Optimization notes</h2>
          <p className="lab-block-when">
            Short clips: one MP4, faststart, immutable cache. No adaptive streaming overhead.
          </p>
          <DemoPlayer
            src="/media/demo.mp4"
            poster="/media/demo-poster.svg"
            caption="Same asset ships to X/LinkedIn — crop in the social UI, not in the file."
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
