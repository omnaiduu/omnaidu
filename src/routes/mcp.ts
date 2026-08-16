import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { getPost, listPosts, publishPost, unpublishPost } from '~/lib/db'
import { purgePostCaches } from '~/lib/cache'
import { listMedia, putMedia } from '~/lib/media'
import type { PostTag } from '~/lib/types'

const PROTOCOL_VERSION = '2025-03-26'

const tools = [
  {
    name: 'list_posts',
    description: 'List lab posts from D1 (optional tag filter). Private — AI publish path only.',
    inputSchema: {
      type: 'object',
      properties: {
        tag: {
          type: 'string',
          enum: ['projects', 'research', 'systems', 'writing'],
        },
      },
    },
  },
  {
    name: 'get_post',
    description: 'Fetch one post by slug, including drafts.',
    inputSchema: {
      type: 'object',
      properties: { slug: { type: 'string' } },
      required: ['slug'],
    },
  },
  {
    name: 'publish_post',
    description:
      'Create or update a post in D1. Purges Cache API entries for the list and slug. Body is markdown with :::callout :::demo :::figure :::proof :::pullquote directives.',
    inputSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string' },
        title: { type: 'string' },
        abstract: { type: 'string' },
        body: { type: 'string', description: 'Markdown body with React directive blocks' },
        tag: {
          type: 'string',
          enum: ['projects', 'research', 'systems', 'writing'],
        },
        publishedAt: { type: 'string' },
        demoUrl: { type: 'string' },
        posterUrl: { type: 'string' },
        repo: { type: 'string' },
        proofTests: { type: 'string' },
        proofBenches: { type: 'string', description: 'JSON array of {name,value}' },
        readingMinutes: { type: 'number' },
        status: { type: 'string', enum: ['published', 'draft'] },
      },
      required: ['slug', 'title', 'abstract', 'body', 'tag'],
    },
  },
  {
    name: 'unpublish_post',
    description: 'Set a post to draft and purge caches.',
    inputSchema: {
      type: 'object',
      properties: { slug: { type: 'string' } },
      required: ['slug'],
    },
  },
  {
    name: 'upload_media',
    description:
      'Upload an already-optimized image or short video to R2. Images: webp/avif/jpeg/png. Video: H.264 MP4 faststart, 30–90s, ≤720p. Returns a /files/... URL for posts.',
    inputSchema: {
      type: 'object',
      properties: {
        filename: { type: 'string' },
        contentType: { type: 'string' },
        bytesBase64: { type: 'string', description: 'Raw file bytes, base64-encoded' },
      },
      required: ['filename', 'contentType', 'bytesBase64'],
    },
  },
  {
    name: 'list_media',
    description: 'List recent R2 uploads.',
    inputSchema: {
      type: 'object',
      properties: { limit: { type: 'number' } },
    },
  },
]

const privateHeaders = {
  'cache-control': 'private, no-store',
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'content-type, x-publish-secret, authorization',
  'access-control-allow-methods': 'POST, OPTIONS',
}

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: privateHeaders })
}

function unauthorized() {
  return json({ error: 'Unauthorized' }, 401)
}

function authorized(request: Request) {
  const secret = env.PUBLISH_SECRET
  if (!secret) return false
  const header = request.headers.get('x-publish-secret')
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  return header === secret || bearer === secret
}

function decodeBase64(value: string) {
  const clean = value.replace(/^data:[^;]+;base64,/, '')
  const binary = atob(clean)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

async function callTool(name: string, args: Record<string, unknown>, request: Request) {
  if (name === 'list_posts') {
    const tag = args.tag as PostTag | undefined
    const posts = await listPosts(tag ?? 'all')
    return posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      tag: post.tag,
      publishedAt: post.publishedAt,
      abstract: post.abstract,
      status: post.status,
    }))
  }

  if (name === 'get_post') {
    const post = await getPost(String(args.slug ?? ''), { includeDrafts: true })
    if (!post) throw new Error('Post not found')
    return post
  }

  if (name === 'publish_post') {
    const post = await publishPost({
      slug: String(args.slug),
      title: String(args.title),
      abstract: String(args.abstract),
      body: String(args.body),
      tag: args.tag as PostTag,
      publishedAt: args.publishedAt ? String(args.publishedAt) : undefined,
      demoUrl: args.demoUrl ? String(args.demoUrl) : null,
      posterUrl: args.posterUrl ? String(args.posterUrl) : null,
      repo: args.repo ? String(args.repo) : null,
      proofTests: args.proofTests ? String(args.proofTests) : null,
      proofBenches: args.proofBenches ? String(args.proofBenches) : '[]',
      readingMinutes: args.readingMinutes ? Number(args.readingMinutes) : 6,
      status: args.status === 'draft' ? 'draft' : 'published',
    })
    await purgePostCaches(request, post.slug)
    return { ok: true, slug: post.slug, url: `/blog/${post.slug}` }
  }

  if (name === 'unpublish_post') {
    await unpublishPost(String(args.slug))
    await purgePostCaches(request, String(args.slug))
    return { ok: true }
  }

  if (name === 'upload_media') {
    const uploaded = await putMedia({
      filename: String(args.filename ?? 'file'),
      contentType: String(args.contentType ?? ''),
      bytes: decodeBase64(String(args.bytesBase64 ?? '')),
    })
    return uploaded
  }

  if (name === 'list_media') {
    return listMedia(Number(args.limit ?? 40))
  }

  throw new Error(`Unknown tool: ${name}`)
}

export const Route = createFileRoute('/mcp')({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: privateHeaders }),
      GET: ({ request }) => {
        if (!authorized(request)) return unauthorized()
        return json({
          name: 'omnaidu-lab',
          version: '0.2.0',
          protocolVersion: PROTOCOL_VERSION,
          transport: 'json-rpc over HTTP POST /mcp',
          tools: tools.map((tool) => tool.name),
        })
      },
      POST: async ({ request }) => {
        if (!authorized(request)) return unauthorized()

        const body = (await request.json()) as {
          jsonrpc?: string
          id?: string | number | null
          method?: string
          params?: { name?: string; arguments?: Record<string, unknown> }
        }

        const id = body.id ?? 1

        try {
          if (body.method === 'initialize') {
            return json({
              jsonrpc: '2.0',
              id,
              result: {
                protocolVersion: PROTOCOL_VERSION,
                capabilities: { tools: {} },
                serverInfo: { name: 'omnaidu-lab', version: '0.2.0' },
              },
            })
          }

          if (body.method === 'tools/list') {
            return json({ jsonrpc: '2.0', id, result: { tools } })
          }

          if (body.method === 'tools/call') {
            const name = body.params?.name ?? ''
            const result = await callTool(name, body.params?.arguments ?? {}, request)
            return json({
              jsonrpc: '2.0',
              id,
              result: {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
              },
            })
          }

          return json({
            jsonrpc: '2.0',
            id,
            error: { code: -32601, message: `Method not found: ${body.method}` },
          })
        } catch (error) {
          return json({
            jsonrpc: '2.0',
            id,
            error: { code: -32000, message: error instanceof Error ? error.message : 'Error' },
          })
        }
      },
    },
  },
})
