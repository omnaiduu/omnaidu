import { createFileRoute, Link } from '@tanstack/react-router'
import { fetchPosts } from '~/lib/queries'
import { ogImagePath, GITHUB_URL, SITE_EMAIL, SITE_EMAIL_HREF, SITE_URL } from '~/lib/site'
import { seo } from '~/utils/seo'

const FOCUS = [
  'Small open models, fine-tuned with LoRA and served on one GPU.',
  'Search and agent loops where code runs the steps and the model only reads.',
  'Testing that holds up: held-out questions, plain baselines, cost per answer.',
]

const TOOLS = [
  'Python',
  'PyTorch',
  'Transformers',
  'PEFT / LoRA',
  'vLLM',
  'SGLang',
  'Modal',
  'FastAPI',
  'TypeScript',
  'React',
  'Cloudflare Workers',
]

export const Route = createFileRoute('/about')({
  loader: async ({ location }) => {
    const posts = await fetchPosts({ data: { tag: 'all', url: location.href } })
    // Three most recent posts that carry a measured result.
    const selected = posts.filter((post) => post.proofBenches?.[0]?.value).slice(0, 3)
    return { selected }
  },
  head: () => ({
    meta: seo({
      title: 'About — Om Naidu',
      description: 'Software engineer in Goa. I ship systems, then write the receipt.',
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
          email: SITE_EMAIL_HREF,
          address: { '@type': 'PostalAddress', addressLocality: 'Goa', addressCountry: 'IN' },
          sameAs: [GITHUB_URL],
        }),
      },
    ],
  }),
  component: About,
})

function About() {
  const { selected } = Route.useLoaderData()

  return (
    <section className="narrow article about">
      <p className="post-meta">Software engineer · Goa, India</p>
      <h1 className="article-title">Om Naidu</h1>
      <div className="prose">
        <p>
          I am a software engineer in Goa. I take on systems where the behavior has to be owned —
          tools, backends, agent loops — and I put the work on this site as posts.
        </p>
        <p>
          I use AI to move faster. I still write the contract, the edge cases, and the proof. If I
          cannot demo it or test it, it is not shipped.
        </p>
      </div>

      <div className="about-block">
        <h2 className="section-label">What I work on</h2>
        <ul className="about-focus">
          {FOCUS.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>

      {selected.length > 0 ? (
        <div className="about-block">
          <h2 className="section-label">Selected work</h2>
          <ul className="about-work">
            {selected.map((post) => {
              const fact = post.proofBenches[0]
              return (
                <li key={post.slug}>
                  <Link className="about-work-title" to="/blog/$slug" params={{ slug: post.slug }}>
                    {post.title}
                  </Link>
                  <p className="about-work-fact">
                    <span className="about-work-value">{fact.value}</span>
                    {fact.name ? <span> · {fact.name}</span> : null}
                    {post.repo ? (
                      <>
                        {' · '}
                        <a className="link-ember" href={post.repo}>
                          Code
                        </a>
                      </>
                    ) : null}
                  </p>
                </li>
              )
            })}
          </ul>
          <p className="about-all">
            <Link className="link-ember" to="/blog">
              All writing →
            </Link>
          </p>
        </div>
      ) : null}

      <div className="about-block">
        <h2 className="section-label">Tools I use</h2>
        <p className="about-tools">{TOOLS.join(' · ')}</p>
      </div>

      <div className="about-block">
        <h2 className="section-label">Contact</h2>
        <p className="about-contact">
          <a className="link-ember" href={SITE_EMAIL_HREF}>
            {SITE_EMAIL}
          </a>
          {' · '}
          <a className="link-ember" href={GITHUB_URL}>
            GitHub
          </a>
        </p>
      </div>
    </section>
  )
}
