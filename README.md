# omnaidu.com

Engineering lab site. TanStack Start on Cloudflare Workers.

Light (parchment) and dark (ink) live in the header toggle. Content is D1, not git. Agents publish through a **private** MCP endpoint. Visitors never see it.

## Local

```bash
pnpm install
pnpm dev
```

## Architecture

- **Read:** Worker → Cache API (`list:*`, `post:slug`) → D1 on miss. Purge on publish.
- **Write:** Authenticated `POST /mcp` (JSON-RPC). Header `x-publish-secret` or `Authorization: Bearer`.
- **Media:** Optimized images/video uploaded via MCP `upload_media` into R2, served at `/files/...` with Cache API + long cache. Demo clip in `public/media` for now.
- **Video:** H.264 MP4, faststart, 30–90s, ≤720p. HTML5 player, no HLS.

MCP tools (private): `list_posts`, `get_post`, `publish_post`, `unpublish_post`, `upload_media`, `list_media`.

Post bodies are markdown plus React directive blocks: `:::callout` `:::demo` `:::figure` `:::proof` `:::pullquote` `:::steps`.

## Deploy

```bash
pnpm deploy
```

Needs `CLOUDFLARE_API_TOKEN` with Workers, D1, R2, and Zone DNS edit (for omnaidu.com). Set `PUBLISH_SECRET` with `wrangler secret put PUBLISH_SECRET`.
