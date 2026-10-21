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

The Worker parent environment must be **`ssr`**, with RSC as a child (`childEnvironments: ['rsc']`). See `AGENTS.md`.

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

Copy `.cursor/mcp.json.example`, put the real secret in Cursor Settings → MCP (do not commit it):

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

### 3. Skill (copy this)

The publish contract lives at:

```
.cursor/skills/publish-to-omnaidu/SKILL.md
```

Cursor loads it automatically in this repo. To use it on another machine, copy that folder to:

```
~/.cursor/skills/publish-to-omnaidu/
```

Then type `/publish-to-omnaidu` or just ask to publish a post. The skill covers ffmpeg, posters, tags, and every markdown block.

### 4. Tools

| Tool | What it does |
|---|---|
| `list_posts` | Published posts (optional tag) |
| `get_post` | One slug, including drafts |
| `publish_post` | Create/update. Purges list + slug + HTML caches |
| `unpublish_post` | Set `status: draft` |
| `upload_media` | Optimized image/video → R2 → `/files/...` |
| `list_media` | Recent uploads |

### 5. A post

Required: `slug`, `title`, `abstract`, `body`, `tag` (`projects` \| `research` \| `systems` \| `writing`).

Body is markdown. Lead video: `demoUrl` + `posterUrl`. Image-only lead: `posterUrl` only.

## Video / images (short)

| | Hard max | Aim |
|---|---|---|
| Video length | 90s | 30–60s |
| Video size | 40 MB | 2–8 MB H.264 720p mp4 |
| Photo / poster | 8 MB | webp 40–200 KB |
| SVG | 512 KB | UTF-8 |

Encode, then upload. The player does not fetch the MP4 until play. Home never embeds video.

## OG

`/og/site.png` and `/og/{slug}.png` return **PNG 1200×630** (dark). Wired for WhatsApp, X large image, and LinkedIn. Crawlers are allowed in `/robots.txt`.

## Caching

`cache.enabled: true`. HTML is cached at the edge for 60s (`cdn-cache-control`) with stale-while-revalidate. Publish purges those tags. `/mcp` is never cached. `/admin` and `/api` are `private, no-store`.

## Visits

A first-party script, `/visit.js` (under 1KB), posts the path, referrer, and `utm_*` tags to `/api/visit` on load and on client navigations. No cookies, no third-party script, no IP. The user agent is used to drop bots and to mark phone vs desktop, then thrown away. Country is Cloudflare's `request.cf.country`.

`/admin/stats` is the dashboard (today / 7 days / 30 days). It is not linked from the site. Two locks:

1. Worker secret `STATS_TOKEN`. The browser asks for a password; the username can be anything and the password is the token. `Authorization: Bearer` and `x-stats-token` also work.
2. Cloudflare Access on `omnaidu.com/admin/*` (one email, one-time PIN). The token still applies. Access on the apex does not cover the `workers.dev` hostname.

```bash
pnpm db:migrate:remote
pnpm exec wrangler secret put STATS_TOKEN
pnpm deploy
```

`db:migrate:remote` runs `wrangler d1 execute omnaidu-lab --remote --file=./schema.sql`. That file only adds tables, so it is safe to re-run. The worker also creates `visits` on first write.

Access, in the Cloudflare dashboard:

1. Zero Trust → Integrations → Identity providers → Add new identity provider → One-time PIN.
2. Zero Trust → Access controls → Applications → Create new application → Self-hosted and private → Add public hostname.
3. Domain `omnaidu.com`, path `admin/*`. Leave the tunnel off. The site is already on Cloudflare, and a path of `admin/*` covers `/admin/stats`.
4. Policy: Allow. Include → Emails → the one address you read. Require → Login methods → One-time PIN.
5. Create the application. `/admin/stats` should ask for that email's PIN, then the stats token.

Tagged links:

```
https://omnaidu.com/<path>?utm_source=linkedin&utm_medium=social&utm_campaign=<slug>
```

Use `utm_source=x` for X. `taggedUrl()` in `src/lib/visits.ts` builds the same URL. If `utm_source` is missing, the referrer host is used: `linkedin.com` / `lnkd.in` → linkedin, `t.co` / `x.com` / `twitter.com` → x, Google → search, nothing → direct. Anything else is kept as the host and grouped under Other on the dashboard. `twitter`, `lnkd.in`, and `google` as a `utm_source` value are folded into x, linkedin, and search.

## Design

See `AGENTS.md`. Dark only. Quiet type. Selected work then the list. Future agents should read that file before editing UI.
