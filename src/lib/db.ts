import { env } from 'cloudflare:workers'
import { SEED_POSTS } from './seed-data'
import { rowToPost, type Post, type PostRow, type PostTag, type PublishInput } from './types'

let seeded = false
let memoryPosts: Post[] = []

function hasDb() {
  try {
    return Boolean(env && 'DB' in env && env.DB)
  } catch {
    return false
  }
}

function fromSeed(input: PublishInput, id: number): Post {
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
    publishedAt: input.publishedAt ?? '2026-08-16',
    demoUrl: input.demoUrl ?? null,
    posterUrl: input.posterUrl ?? null,
    repo: input.repo ?? null,
    proofTests: input.proofTests ?? null,
    proofBenches: benches,
    readingMinutes: input.readingMinutes ?? 6,
    status: input.status === 'draft' ? 'draft' : 'published',
  }
}

export async function ensureSeeded() {
  if (seeded) return
  if (!hasDb()) {
    memoryPosts = SEED_POSTS.map((post, index) => fromSeed(post, index + 1))
    seeded = true
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

  const count = await env.DB.prepare('SELECT COUNT(*) as n FROM posts').first<{ n: number }>()
  if (!count || count.n === 0) {
    for (const post of SEED_POSTS) {
      await upsertPost(post)
    }
  }

  seeded = true
}

export async function listPosts(tag?: PostTag | 'all'): Promise<Post[]> {
  await ensureSeeded()
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

export async function getPost(slug: string): Promise<Post | null> {
  await ensureSeeded()
  if (!hasDb()) {
    return memoryPosts.find((post) => post.slug === slug && post.status === 'published') ?? null
  }
  const row = await env.DB.prepare(
    `SELECT * FROM posts WHERE slug = ? AND status = 'published'`,
  )
    .bind(slug)
    .first<PostRow>()
  return row ? rowToPost(row) : null
}

export async function relatedPosts(slug: string, tag: string, limit = 2): Promise<Post[]> {
  await ensureSeeded()
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
    const next = fromSeed(input, existing >= 0 ? memoryPosts[existing].id : memoryPosts.length + 1)
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
  await ensureSeeded()
  await upsertPost(input)
  const post = await getPost(input.slug)
  if (!post && input.status === 'draft') {
    return fromSeed(input, 0)
  }
  if (!post) {
    throw new Error('Publish succeeded but post was not readable')
  }
  return post
}

export async function unpublishPost(slug: string) {
  await ensureSeeded()
  if (!hasDb()) {
    memoryPosts = memoryPosts.map((post) =>
      post.slug === slug ? { ...post, status: 'draft' as const } : post,
    )
    return
  }
  await env.DB.prepare(`UPDATE posts SET status = 'draft' WHERE slug = ?`).bind(slug).run()
}
