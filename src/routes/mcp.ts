import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { getPost, listPosts, publishPost, unpublishPost } from '~/lib/db'
import { purgePostCaches } from '~/lib/cache'
import type { PostTag } from '~/lib/types'

const PROTOCOL_VERSION = '2025-03-26'

const tools = [
  {
    name: 'list_posts',
    description: 'List published lab posts from D1 (optional tag filter).',
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
    description: 'Fetch one post by slug.',
    inputSchema: {
      type: 'object',
      properties: { slug: { type: 'string' } },
      required: ['slug'],
    },
  },
  {
    name: 'publish_post',
    description:
      'Create or update a post in D1. Requires x-publish-secret. Purges Cloudflare Cache API entries for the list and slug.',
    inputSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string' },
        title: { type: 'string' },
        abstract: { type: 'string' },
        body: { type: 'string', description: 'Markdown body' },
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
    description: 'Set a post to draft. Requires x-publish-secret.',
    inputSchema: {
      type: 'object',
      properties: { slug: { type: 'string' } },
      required: ['slug'],
    },
  },
]

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'content-type, x-publish-secret, authorization',
    },
  })
}

function authorized(request: Request) {
  const secret = env.PUBLISH_SECRET
  if (!secret) return false
  const header = request.headers.get('x-publish-secret')
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  return header === secret || bearer === secret
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
    }))
  }

  if (name === 'get_post') {
    const post = await getPost(String(args.slug ?? ''))
    if (!post) throw new Error('Post not found')
    return post
  }

  if (name === 'publish_post') {
    if (!env.PUBLISH_SECRET) {
      throw new Error('PUBLISH_SECRET is not set. Demo is read-only until a secret is configured.')
    }
    if (!authorized(request)) throw new Error('Unauthorized')
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
    return { ok: true, slug: post.slug }
  }

  if (name === 'unpublish_post') {
    if (!authorized(request)) throw new Error('Unauthorized')
    await unpublishPost(String(args.slug))
    await purgePostCaches(request, String(args.slug))
    return { ok: true }
  }

  throw new Error(`Unknown tool: ${name}`)
}

export const Route = createFileRoute('/mcp')({
  server: {
    handlers: {
      OPTIONS: () =>
        new Response(null, {
          headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-headers': 'content-type, x-publish-secret, authorization',
            'access-control-allow-methods': 'GET, POST, OPTIONS',
          },
        }),
      GET: () =>
        json({
          name: 'omnaidu-lab',
          version: '0.1.0',
          protocolVersion: PROTOCOL_VERSION,
          transport: 'json-rpc over HTTP POST /mcp',
          tools: tools.map((tool) => tool.name),
          note: 'Connect an MCP client here instead of a CLI. Writes need x-publish-secret.',
        }),
      POST: async ({ request }) => {
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
                serverInfo: { name: 'omnaidu-lab', version: '0.1.0' },
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
