import { createFileRoute, Link } from '@tanstack/react-router'
import { ComputerScene } from '~/components/ComputerScene'
import { DemoPlayer } from '~/components/DemoPlayer'
import { PostList } from '~/components/PostList'
import { fetchPosts } from '~/lib/queries'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/lab/homes')({
  loader: async ({ location }) => {
    const posts = await fetchPosts({ data: { tag: 'all', url: location.href } })
    return { posts }
  },
  head: () => ({
    meta: seo({
      title: 'Homepage ideas — Lab',
      description: 'Four homepage concepts. Index-first is live. The rest are options.',
      url: '/lab/homes',
    }),
  }),
  component: LabHomes,
})

function LabHomes() {
  const { posts } = Route.useLoaderData()
  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <div className="lab-homes">
      <h1 className="article-title" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>
        Four homes. Same writing list.
      </h1>
      <p className="home-lede" style={{ marginBottom: 36 }}>
        You already liked the list. A is that list with almost no chrome. B–D add a desk, a featured post, or a split manifesto.
      </p>

      <article className="home-concept" id="concept-a">
        <p className="home-concept-label">
          <strong>A · Index first</strong>
          <span className="home-concept-badge">Live · recommended</span>
        </p>
        <p className="home-concept-why">
          Closest to Cursor’s blog. The homepage is the index. No giant name, no video above the fold. Identity is one quiet line.
        </p>
        <div className="home-concept-frame">
          <p className="hero-kicker">Engineering lab · Goa</p>
          <p className="home-lede">Hard systems. Verified. Written down.</p>
          <p className="section-label" style={{ marginTop: 28 }}>
            Writing
          </p>
          <PostList posts={posts} />
        </div>
      </article>

      <article className="home-concept" id="concept-b">
        <p className="home-concept-label">
          <strong>B · Desk 2D</strong>
        </p>
        <p className="home-concept-why">
          A looping laptop on a desk — not a stock 3D hero. Code ticks on the screen. The list still does the work.
        </p>
        <div className="home-concept-frame">
          <div className="desk-grid">
            <div>
              <p className="hero-kicker">Engineering lab</p>
              <h2 className="article-title" style={{ fontSize: 'clamp(28px, 4vw, 44px)', marginTop: 8 }}>
                Om Naidu
              </h2>
              <p className="home-lede">Hard systems. Verified. Written down.</p>
              <div className="hero-actions">
                <Link to="/blog" className="btn btn-primary">
                  Writing →
                </Link>
              </div>
            </div>
            <ComputerScene />
          </div>
          <p className="section-label" style={{ marginTop: 36 }}>
            Writing
          </p>
          <PostList posts={posts} />
        </div>
      </article>

      <article className="home-concept" id="concept-c">
        <p className="home-concept-label">
          <strong>C · Featured + list</strong>
        </p>
        <p className="home-concept-why">
          Latest receipt gets a large slot and a short demo. Everything else stays the list. Good if demos are the hook.
        </p>
        <div className="home-concept-frame">
          {featured ? (
            <div className="featured-post">
              <p className="post-meta">
                {featured.tag} · {featured.readingMinutes} min
              </p>
              <h2 className="article-title" style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>
                {featured.title}
              </h2>
              <p className="home-lede">{featured.abstract}</p>
              <DemoPlayer
                src="/media/demo.mp4"
                poster="/media/demo-poster.svg"
                caption="Same 6s H.264 clip. Poster first — the file does not load until play."
              />
              <Link className="link-ember" to="/blog/$slug" params={{ slug: featured.slug }}>
                Read →
              </Link>
            </div>
          ) : null}
          <p className="section-label" style={{ marginTop: 36 }}>
            More
          </p>
          <PostList posts={rest} />
        </div>
      </article>

      <article className="home-concept" id="concept-d">
        <p className="home-concept-label">
          <strong>D · Split manifesto</strong>
        </p>
        <p className="home-concept-why">
          Name and stance stay put on the left. The list is the page. Works on a wide desktop; stacks on a phone.
        </p>
        <div className="home-concept-frame">
          <div className="home-split">
            <aside className="home-split-rail">
              <p className="hero-kicker">Goa</p>
              <h2 className="article-title" style={{ fontSize: 36, marginTop: 8 }}>
                Om Naidu
              </h2>
              <p className="home-lede">Hard systems. Verified. Written down.</p>
            </aside>
            <div>
              <p className="section-label">Writing</p>
              <PostList posts={posts} />
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
