import { createFileRoute } from '@tanstack/react-router'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: seo({
      title: 'About — Om Naidu',
      description: 'Builder from Goa. Owns design and verification. Ships hard systems with AI as an accelerator.',
    }),
  }),
  component: About,
})

function About() {
  return (
    <section className="narrow article">
      <p className="section-label">About</p>
      <h1 className="article-title">Builder. Design owner. Verifier.</h1>
      <div className="prose">
        <p>
          I am Om Naidu, from Goa. This site is an engineering lab home — not a resume splash, not a
          creator channel. People should skim it and think: this person tries hard things, ships real
          systems, checks the work, and writes like a lab notebook.
        </p>
        <p>
          I use AI as an implementation accelerator. I own behavior, boundaries, and proof. The public
          format is the same as the private one: problem → options → why this → what shipped → how
          verified → demo / numbers.
        </p>
        <p>
          Projects are posts with a <code>projects</code> tag, not a second website. Short video is a
          30–90s embed of the thing running. Long talking YouTube is not the plan.
        </p>
        <p>
          <a className="link-ember" href="https://github.com/omnaiduu">
            GitHub →
          </a>
        </p>
      </div>
    </section>
  )
}
