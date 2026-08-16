export const TAGS = ['all', 'projects', 'research', 'systems', 'writing'] as const

export type Tag = (typeof TAGS)[number]

export type PostTag = Exclude<Tag, 'all'>

export type Bench = {
  name: string
  value: string
}

export type Post = {
  id: number
  slug: string
  title: string
  abstract: string
  body: string
  tag: PostTag
  publishedAt: string
  demoUrl: string | null
  posterUrl: string | null
  repo: string | null
  proofTests: string | null
  proofBenches: Bench[]
  readingMinutes: number
  status: 'published' | 'draft'
}

export type PostRow = {
  id: number
  slug: string
  title: string
  abstract: string
  body: string
  tag: string
  published_at: string
  demo_url: string | null
  poster_url: string | null
  repo: string | null
  proof_tests: string | null
  proof_benches: string | null
  reading_minutes: number
  status: string
}

export function rowToPost(row: PostRow): Post {
  let benches: Bench[] = []
  if (row.proof_benches) {
    try {
      benches = JSON.parse(row.proof_benches) as Bench[]
    } catch {
      benches = []
    }
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    abstract: row.abstract,
    body: row.body,
    tag: row.tag as PostTag,
    publishedAt: row.published_at,
    demoUrl: row.demo_url,
    posterUrl: row.poster_url,
    repo: row.repo,
    proofTests: row.proof_tests,
    proofBenches: benches,
    readingMinutes: row.reading_minutes,
    status: row.status === 'draft' ? 'draft' : 'published',
  }
}

export type PublishInput = {
  slug: string
  title: string
  abstract: string
  body: string
  tag: PostTag
  publishedAt?: string
  demoUrl?: string | null
  posterUrl?: string | null
  repo?: string | null
  proofTests?: string | null
  proofBenches?: string | null
  readingMinutes?: number
  status?: 'published' | 'draft'
}
