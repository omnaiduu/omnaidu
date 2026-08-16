# omnaidu.com

Om Naidu — software from Goa. Dark-only hiring index. Posts in D1. Agents publish through a private MCP.

Email: **hello@omnaidu.com**

## Local

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

## Stack

- **TanStack Start** on a **Cloudflare Worker** (Vite 8, React 19)
- **React Server Components** for post bodies (markdown, KaTeX, highlight.js stay on the server)
- Client islands: demo player, code copy, cite, wordmark, 2D laptop
- **Workers Cache** (`cache.enabled` in `wrangler.jsonc`) plus Cache API for D1 JSON
- D1 `omnaidu-lab` for posts, R2 `omnaidu` for media

There is no RSS feed and no `/lab` workshop.

## Deploy

```bash
pnpm deploy
```

Needs `CLOUDFLARE_API_TOKEN` (Workers, D1, R2, zone). Set the publish secret once:

```bash
pnpm exec wrangler secret put PUBLISH_SECRET
```

## Private MCP (how to publish)

There is **no admin page**. Cursor (or any MCP client) talks to the Worker.

### 1. Secret

Same value as `PUBLISH_SECRET` on the Worker.

### 2. Connect Cursor

Cursor Settings → MCP → add a remote server:

```json
{
  "mcpServers": {
    "omnaidu": {
      "url": "https://omnaidu.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_PUBLISH_SECRET"
      }
    }
  }
}
```

`x-publish-secret` is also accepted. Unauthenticated calls get 401. Visitors never see a UI for this.

### 3. Tools

| Tool | What it does |
|---|---|
| `list_posts` | Published posts (optional tag) |
| `get_post` | One slug, including drafts |
| `publish_post` | Create/update. Purges list + slug caches |
| `unpublish_post` | Set `status: draft` |
| `upload_media` | Optimized image/video → R2 → `/files/...` |
| `list_media` | Recent uploads |

### 4. A post

Required: `slug`, `title`, `abstract`, `body`, `tag` (`projects` \| `research` \| `systems` \| `writing`).

Body is markdown. Lead video: `demoUrl` + `posterUrl`. Image-only lead: `posterUrl` only.

Copy the Cursor skill from `.cursor/skills/publish-to-omnaidu/SKILL.md` into any machine that should publish. That file is the full contract (ffmpeg, posters, blocks).

## Video / images (short)

| | Hard max | Aim |
|---|---|---|
| Video length | 90s | 30–60s |
| Video size | 40 MB | 2–8 MB H.264 720p mp4 |
| Photo / poster | 8 MB | webp 40–200 KB |
| SVG | 512 KB | UTF-8 |

Encode, then upload. The player does not fetch the MP4 until play. Home never embeds video.

## OG

`/og/site` and `/og/{slug}` return **PNG 1200×630** (dark). Wired for WhatsApp, X large image, and LinkedIn.

## Design

See `AGENTS.md`. Dark only. Quiet type. Selected work then the list.
