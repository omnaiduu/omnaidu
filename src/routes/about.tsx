import { createFileRoute } from '@tanstack/react-router'
import { AnimatedLetters } from '~/components/Wordmark'
import { TiltLaptop } from '~/components/home/MotionLooks'
import { ogImagePath, GITHUB_URL, SITE_EMAIL, SITE_EMAIL_HREF, SITE_URL } from '~/lib/site'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: seo({
      title: 'About — Om Naidu',
      description: 'I like computers, programming, and shipping things that matter.',
      url: '/about',
      image: ogImagePath('site'),
    }),
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Om Naidu',
          url: SITE_URL,
          email: SITE_EMAIL,
          sameAs: [GITHUB_URL],
        }),
      },
    ],
  }),
  component: About,
})

function About() {
  return (
    <section className="narrow article">
      <h1 className="article-title">
        <AnimatedLetters text="Om Naidu" delay={0.08} />
      </h1>
      <div className="about-desk" aria-hidden>
        <TiltLaptop compact />
      </div>
      <div className="prose">
        <p>
          I like computers. Programming, deploying, poking at a thing until it exists. Curiosity is
          the part I trust — it pulls me into new tools, new systems, then I build.
        </p>
        <p>
          I want that work to be useful. Short posts here are the receipt: what I shipped, and how I
          knew it worked.
        </p>
        <p>
          <a className="link-ember" href={GITHUB_URL}>
            GitHub
          </a>
          {' · '}
          <a className="link-ember" href={SITE_EMAIL_HREF}>
            {SITE_EMAIL}
          </a>
        </p>
      </div>
    </section>
  )
}
