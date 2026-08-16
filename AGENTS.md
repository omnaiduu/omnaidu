# omnaidu.com — agent context

Personal site for **Om Naidu** (Goa). Hiring-facing writing index, not a creator channel, not a resume splash, not a kitchen-sink lab.

Live: https://omnaidu.com  
Email: hello@omnaidu.com  
GitHub: https://github.com/omnaiduu

## Design (do not drift)

- **Dark only.** Warm near-black (`#14120b`), cream type (`#efece6`), ember (`#ff6a2a`). No light mode, no theme toggle, no parchment/paper/terminal skins, no `/themes`.
- **Quiet type.** Geist sans, Geist Mono for code, Newsreader only if a post needs a serif aside. Titles are regular weight, tight tracking.
- **Home is a hiring index.** Name, one sentence, About / GitHub. Then **Selected** (latest `projects` post, poster still only — never a video on `/`). Then the rest of the list with category chips.
- **One blog. Four tags.** `projects` | `research` | `systems` | `writing`. Filter on `/blog`. Every post must pick exactly one of those — there is no other taxonomy.
- **No Lab route.** Workshop pages are gone. Do not add `/lab`, `/themes`, or RSS.
- **2D laptop** is allowed on 404, compact on About, and `:::desk` in a post *about this site*. Never Three.js on `/`.
- **OG cards** are **PNG 1200×630**, dark, at `/og/$slug.png` and `/og/site.png`. Text is drawn with a bundled Inter TTF — Workers have no system fonts, so a font-less resvg PNG is a blank card. WhatsApp, X (`summary_large_image`), and LinkedIn need PNG/JPEG, not SVG. Keep key text in the center ~66% (X crops 16:9). Aim under 300 KB for WhatsApp. Include `og:image:width/height/type`, `og:image:secure_url`, and `twitter:card`. Posts use `og:type=article`.
- **Demos are receipts, not a channel.** 30–60s aim, 90s hard max. Poster required. Player mounts `<video>` only after play. Home never fetches the MP4.

## Stack

TanStack Start + Vite 8 on a **Cloudflare Worker**. React 19.

**React Server Components are on.** Post bodies (`react-markdown`, KaTeX, highlight.js) render with `renderServerComponent` inside `fetchPostPage`. Interactive islands are `"use client"`: code copy, demo player, cite, wordmark letters, 2D laptop.

Not Next.js. Do not introduce an App Router. RSC in Start is loader-owned Flight payloads, not a default server tree.

### Vite / Worker parent (easy to get wrong)

TanStack Start’s Worker `fetch` lives in the **`ssr` environment** (`@tanstack/react-start/server-entry`). RSC is a **child** module graph inside that Worker:

```ts
cloudflare({
  viteEnvironment: {
    name: 'ssr',
    childEnvironments: ['rsc'],
  },
}),
tanstackStart({ rsc: { enabled: true } }),
rsc(),
```

Cloudflare’s generic RSC sample uses `name: "rsc"` as the parent. That fails here: the RSC entry only exports `render` / `getServerFnById`, so wrangler builds a service-worker bundle and deploy errors with “More than one module can only be specified when type = 'esm'”. Keep `ssr` as parent.

### Cloudflare caching

- `cache.enabled: true` in `wrangler.jsonc` (Workers Cache — HTML can be served without running the Worker). Requires Wrangler ≥ 4.69.
- HTML: browsers `max-age=0`; edge `cdn-cache-control: max-age=60, stale-while-revalidate=600`. Do **not** put `s-maxage` on the same response as SWR — it disables stale-while-revalidate.
- OG PNG: browsers 300s, edge 86400s. `Cache-Tag: og`.
- `/files/*` media: immutable year cache + Range.
- D1 JSON (list/post) still uses the Cache API, 60s.
- On publish/unpublish: purge Cache API keys **and** `cache.purge({ tags: ['html','og'] })`.
- `/mcp` is `private, no-store`.

## Content

Posts live in **D1**, not git. Media in **R2**. There is **no admin UI**. Publish only through the private MCP (see `.cursor/skills/publish-to-omnaidu/SKILL.md` and README).

Copy the skill from `.cursor/skills/publish-to-omnaidu/` into `~/.cursor/skills/publish-to-omnaidu/` on any machine that should publish. Cursor MCP config: `.cursor/mcp.json.example`.

Demo seed posts were deleted. Do not re-seed Bankbot / attention / kitchen-sink copy. `ensureReady()` still deletes those slugs if they reappear.

## Post blocks

Markdown + directives mapped in `PostBody`. Fenced code with a language is highlighted automatically. There is no `:::code`.

Use often: `$math$`, `:::callout`, `:::demo` / `:::hero`, `:::figure`, `:::proof`, `:::steps`, `:::theorem` family, `:::refs`.

Use when needed: pullquote, chart, details, diff, filetree, graph, arch, terminal, timeline, apispec, compare, kbd, desk.

Full syntax: `.cursor/skills/publish-to-omnaidu/SKILL.md`.

## What not to do

- Do not restore light mode, RSS, Lab, or Three.js on the homepage.
- Do not put videos on `/`.
- Do not commit posts or mp4s into git.
- Do not publicize `/mcp` in on-site copy (README/skill for the owner is fine).
- Do not add a pile of new MDX toys. The set is already large.
- Do not add Exa-powered site search. Exa is for the agent researching while writing, not a public search box.
