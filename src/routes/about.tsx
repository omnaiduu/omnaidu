import { createFileRoute, Link } from '@tanstack/react-router'
import { AnimatedLetters } from '~/components/Wordmark'
import { TiltLaptop } from '~/components/home/MotionLooks'
import { seo } from '~/utils/seo'

const SITE = 'https://omnaidu.com'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: seo({
      title: 'About — Om Naidu',
      description: 'Software engineer in Goa. I ship systems, then write the receipt.',
      url: '/about',
    }),
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Om Naidu',
          url: SITE,
          email: 'mailto:omnaidu42@gmail.com',
          address: { '@type': 'PostalAddress', addressLocality: 'Goa', addressCountry: 'IN' },
          sameAs: ['https://github.com/omnaiduu'],
        }),
      },
    ],
  }),
  component: About,
})

function About() {
  return (
    <section className="narrow article">
      <p className="post-meta">Goa</p>
      <h1 className="article-title">
        <AnimatedLetters text="Om Naidu" delay={0.08} />
      </h1>
      <div className="about-desk" aria-hidden>
        <TiltLaptop compact />
      </div>
      <div className="prose">
        <p>
          I am a software engineer in Goa. I take on systems where the behavior has to be owned —
          tools, backends, agent loops — and I put the work on this site as posts.
        </p>
        <p>
          I use AI to move faster. I still write the contract, the edge cases, and the proof. If I
          cannot demo it or test it, it is not shipped.
        </p>
        <p>
          Start with{' '}
          <Link className="link-ember" to="/">
            selected work
          </Link>
          , or filter{' '}
          <Link className="link-ember" to="/blog" search={{ tag: 'projects' }}>
            projects
          </Link>
          . Notes and research live in the same list.
        </p>
        <p>
          <a className="link-ember" href="https://github.com/omnaiduu">
            GitHub
          </a>
          {' · '}
          <a className="link-ember" href="mailto:omnaidu42@gmail.com">
            Email
          </a>
        </p>
      </div>
    </section>
  )
}
