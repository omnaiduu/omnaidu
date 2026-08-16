import type { Post } from '~/lib/types'

export function Proof({ post }: { post: Post }) {
  if (!post.proofTests && post.proofBenches.length === 0 && !post.repo) return null

  return (
    <aside className="proof">
      <h2>Proof</h2>
      <div className="proof-grid">
        {post.proofTests ? (
          <div>
            <small>Tests</small>
            <strong>{post.proofTests}</strong>
          </div>
        ) : null}
        {post.proofBenches.map((bench) => (
          <div key={bench.name}>
            <small>{bench.name}</small>
            <strong>{bench.value}</strong>
          </div>
        ))}
        {post.repo ? (
          <div>
            <small>Repo</small>
            <a className="link-ember" href={post.repo}>
              Open GitHub →
            </a>
          </div>
        ) : null}
      </div>
    </aside>
  )
}
