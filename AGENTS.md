# omnaidu.com — agent context

Personal site for **Om Naidu** (Goa). Hiring-facing writing index, not a creator channel, not a resume splash, not a kitchen-sink lab.

Live: https://omnaidu.com  
Email: hello@omnaidu.com  
GitHub: https://github.com/omnaiduu

## Design (do not drift)

- **Dark only.** Warm near-black (`#14120b`), cream type (`#efece6`), ember (`#ff6a2a`). No light mode, no theme toggle, no parchment/paper/terminal.
- **Quiet type.** Geist sans, Geist Mono for code, Newsreader only if a post needs a serif aside. Titles are regular weight, tight tracking.
- **Home is a hiring index.** Name, one sentence, About / GitHub. Then **Selected** (latest `projects` post, poster still only — never a video on `/`). Then the rest of the list with category chips.
- **One blog.** Tags: `projects | research | systems | writing`. Filter on `/blog`.
- **No Lab route.** Workshop pages are gone. Do not add `/lab`, `/themes`, or RSS.
- **2D laptop** is allowed on 404, compact on About, and `:::desk` in a post *about this site*. Never Three.js on `/`.
- **OG cards** are **PNG 1200×630**, dark, at `/og/$slug` and `/og/site`. WhatsApp, X (`summary_large_image`), and LinkedIn need PNG/JPEG, not SVG. Include `og:image:width/height/type` and `twitter:card`.
- **Demos are receipts, not a channel.** 30–60s aim, 90s hard max. Poster required. Player mounts `<video>` only after play. Home never fetches the MP4.

## Stack

TanStack Start + Vite 8 on a **Cloudflare Worker**. React 19.

**React Server Components are on.** Post bodies (`react-markdown`, KaTeX, highlight.js) render with `renderServerComponent` inside `fetchPostPage`. Interactive islands are `"use client"`: code copy, demo player, cite, wordmark letters, 2D laptop.

Not Next.js. Do not introduce an App Router. RSC in Start is loader-owned Flight payloads, not a default server tree.

**Cloudflare caching**

- `cache.enabled: true` in `wrangler.jsonc` (Workers Cache — HTML can be served without running the Worker).
- HTML: `s-maxage=60`, `stale-while-revalidate=600`.
- OG PNG: `s-maxage=86400`.
- `/files/*` media: immutable year cache + Range.
- D1 JSON (list/post) still uses the Cache API, 60s, purged on publish.
- `/mcp` is `private, no-store`.

## Content

Posts live in **D1**, not git. Media in **R2**. There is **no admin UI**. Publish only through the private MCP (see `.cursor/skills/publish-to-omnaidu/SKILL.md` and README).

Demo seed posts were deleted. Do not re-seed Bankbot / attention / kitchen-sink copy.

## Post blocks

Markdown + directives mapped in `PostBody`. Fenced code with a language is highlighted automatically. There is no `:::code`.

Use often: `$math$`, `:::callout`, `:::demo` / `:::hero`, `:::figure`, `:::proof`, `:::steps`, `:::theorem` family, `:::refs`.

Use when needed: pullquote, chart, details, diff, filetree, graph, arch, terminal, timeline, apispec, compare, kbd, desk.

## What not to do

- Do not restore light mode, RSS, Lab, or Three.js on the homepage.
- Do not put videos on `/`.
- Do not commit posts or mp4s into git.
- Do not publicize `/mcp` in on-site copy (README/skill for the owner is fine).
- Do not add a pile of new MDX toys. The set is already large.
