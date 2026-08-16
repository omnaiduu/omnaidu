# omnaidu.com

Theme-picker demo of the Om Naidu engineering lab site. TanStack Start on Cloudflare Workers — same routes, content, and MCP stack as production; the goal here is to compare four live design directions before locking one in.

## Click path

Walk the site in this order to feel each theme in context:

| Route | What you see |
| --- | --- |
| `/` | Home — hero, demo embed, latest posts |
| `/blog` | Writing index |
| `/blog?tag=projects` | Projects filter |
| `/blog/bankbot-turn-loop` | Sample post with proof block |
| `/themes` | Four theme preview cards + sticky dock |
| `/about` | About page |
| `/mcp` | MCP endpoint info |
| `/og/bankbot-turn-loop` | OG image route |

Use the sticky **Theme dock** at the bottom of every page (or the cards on `/themes`) to switch themes without losing your place.

## Four themes

| Theme | Vibe |
| --- | --- |
| **Parchment** *(recommended)* | Cursor-like cream lab — `#f7f7f4` bg, `#26251e` ink, `#f54e00` ember links |
| **Ink** | Warm near-black canvas, inverted geometry, night reading |
| **Paper** | Brighter white, serif titles, hairline rules — more journal |
| **Terminal** | Phosphor on charcoal, mono labels, amber links — systems notebook |

Parchment is the default and the recommended pick for the lab voice.

## Architecture (unchanged)

- **Content:** Cloudflare D1 (`omnaidu-lab`), not git markdown
- **Read cache:** Workers Cache API
- **Publish:** MCP at `POST /mcp` — not a login CMS or CLI
- **Media:** `public/media/demo.mp4` for now; production video is a short H.264 MP4 with faststart in R2 bucket `omnaidu`
- **Domain:** **omnaidu.com** (not omnidot.com)

## Local dev

```bash
pnpm install
pnpm dev
```

## Deploy

```bash
pnpm deploy
```

Requires Cloudflare login (`wrangler login`). D1 and R2 bindings are commented in `wrangler.jsonc` until a production deploy:

- D1 `omnaidu-lab` — id `d243c13e-4bb3-4a72-8830-095a01dd0c77`
- R2 `omnaidu`

Temporary `*.workers.dev` preview URLs are used when bindings and custom domains are not yet wired — this agent cannot log into your Cloudflare account via wrangler.
