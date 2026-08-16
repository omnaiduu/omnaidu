import { env } from 'cloudflare:workers'
import { rowToPost, type Post, type PostRow, type PostTag, type PublishInput } from './types'

const DEMO_SLUGS = [
  'bankbot-turn-loop',
  'agentkit-tool-schema',
  'verify-dont-read-every-line',
  'lab-blog-not-long-youtube',
  'edge-cache-d1-mcp',
  'attention-as-a-dot-product',
]

let ready = false
let memoryPosts: Post[] = []

function hasDb() {
  try {
    return Boolean(env && 'DB' in env && env.DB)
  } catch {
    return false
  }
}

function fromInput(input: PublishInput, id: number): Post {
  let benches: Post['proofBenches'] = []
  if (input.proofBenches) {
    try {
      benches = JSON.parse(input.proofBenches)
    } catch {
      benches = []
    }
  }
  return {
    id,
    slug: input.slug,
    title: input.title,
    abstract: input.abstract,
    body: input.body,
    tag: input.tag,
    publishedAt: input.publishedAt ?? new Date().toISOString().slice(0, 10),
    demoUrl: input.demoUrl ?? null,
    posterUrl: input.posterUrl ?? null,
    repo: input.repo ?? null,
    proofTests: input.proofTests ?? null,
    proofBenches: benches,
    readingMinutes: input.readingMinutes ?? 6,
    status: input.status === 'draft' ? 'draft' : 'published',
  }
}

export async function ensureReady() {
  if (ready) return
  if (!hasDb()) {
    memoryPosts = []
    ready = true
    return
  }

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      abstract TEXT NOT NULL,
      body TEXT NOT NULL,
      tag TEXT NOT NULL,
      published_at TEXT NOT NULL,
      demo_url TEXT,
      poster_url TEXT,
      repo TEXT,
      proof_tests TEXT,
      proof_benches TEXT,
      reading_minutes INTEGER NOT NULL DEFAULT 6,
      status TEXT NOT NULL DEFAULT 'published'
    )
  `).run()
  await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_posts_tag ON posts(tag)').run()
  await env.DB.prepare(
    'CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published_at DESC)',
  ).run()

  for (const slug of DEMO_SLUGS) {
    await env.DB.prepare('DELETE FROM posts WHERE slug = ?').bind(slug).run()
  }

  ready = true
}

export async function listPosts(tag?: PostTag | 'all'): Promise<Post[]> {
  await ensureReady()
  if (!hasDb()) {
    return memoryPosts.filter(
      (post) => post.status === 'published' && (!tag || tag === 'all' || post.tag === tag),
    )
  }
  const filter = tag && tag !== 'all'
  const query = filter
    ? env.DB.prepare(
        `SELECT * FROM posts WHERE status = 'published' AND tag = ? ORDER BY published_at DESC`,
      ).bind(tag)
    : env.DB.prepare(
        `SELECT * FROM posts WHERE status = 'published' ORDER BY published_at DESC`,
      )

  const { results } = await query.all<PostRow>()
  return (results ?? []).map(rowToPost)
}

export async function getPost(slug: string, opts?: { includeDrafts?: boolean }): Promise<Post | null> {
  await ensureReady()
  const includeDrafts = opts?.includeDrafts === true
  if (!hasDb()) {
    return (
      memoryPosts.find(
        (post) => post.slug === slug && (includeDrafts || post.status === 'published'),
      ) ?? null
    )
  }
  const row = includeDrafts
    ? await env.DB.prepare(`SELECT * FROM posts WHERE slug = ?`).bind(slug).first<PostRow>()
    : await env.DB.prepare(`SELECT * FROM posts WHERE slug = ? AND status = 'published'`)
        .bind(slug)
        .first<PostRow>()
  return row ? rowToPost(row) : null
}

export async function relatedPosts(slug: string, tag: string, limit = 2): Promise<Post[]> {
  await ensureReady()
  if (!hasDb()) {
    return memoryPosts
      .filter((post) => post.slug !== slug && post.tag === tag && post.status === 'published')
      .slice(0, limit)
  }
  const { results } = await env.DB.prepare(
    `SELECT * FROM posts WHERE status = 'published' AND slug != ? AND tag = ? ORDER BY published_at DESC LIMIT ?`,
  )
    .bind(slug, tag, limit)
    .all<PostRow>()
  return (results ?? []).map(rowToPost)
}

async function upsertPost(input: PublishInput) {
  const publishedAt = input.publishedAt ?? new Date().toISOString().slice(0, 10)
  const status = input.status ?? 'published'
  if (!hasDb()) {
    const existing = memoryPosts.findIndex((post) => post.slug === input.slug)
    const next = fromInput(input, existing >= 0 ? memoryPosts[existing].id : memoryPosts.length + 1)
    if (existing >= 0) memoryPosts[existing] = next
    else memoryPosts.unshift(next)
    return
  }
  await env.DB.prepare(
    `INSERT INTO posts (
      slug, title, abstract, body, tag, published_at,
      demo_url, poster_url, repo, proof_tests, proof_benches, reading_minutes, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title,
      abstract = excluded.abstract,
      body = excluded.body,
      tag = excluded.tag,
      published_at = excluded.published_at,
      demo_url = excluded.demo_url,
      poster_url = excluded.poster_url,
      repo = excluded.repo,
      proof_tests = excluded.proof_tests,
      proof_benches = excluded.proof_benches,
      reading_minutes = excluded.reading_minutes,
      status = excluded.status`,
  )
    .bind(
      input.slug,
      input.title,
      input.abstract,
      input.body,
      input.tag,
      publishedAt,
      input.demoUrl ?? null,
      input.posterUrl ?? null,
      input.repo ?? null,
      input.proofTests ?? null,
      input.proofBenches ?? null,
      input.readingMinutes ?? 6,
      status,
    )
    .run()
}

export async function publishPost(input: PublishInput): Promise<Post> {
  await ensureReady()
  await upsertPost(input)
  const post = await getPost(input.slug, { includeDrafts: true })
  if (!post && input.status === 'draft') {
    return fromInput(input, 0)
  }
  if (!post) {
    throw new Error('Publish succeeded but post was not readable')
  }
  return post
}

export async function unpublishPost(slug: string) {
  await ensureReady()
  if (!hasDb()) {
    memoryPosts = memoryPosts.map((post) =>
      post.slug === slug ? { ...post, status: 'draft' as const } : post,
    )
    return
  }
  await env.DB.prepare(`UPDATE posts SET status = 'draft' WHERE slug = ?`).bind(slug).run()
}
