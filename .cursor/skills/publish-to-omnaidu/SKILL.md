---
name: publish-to-omnaidu
description: Publish a post or demo clip to omnaidu.com through the private MCP. Use when Om asks to write a post, update a post, or upload a short demo video/image.
---

# Publish to omnaidu.com

This site has **no admin page**. You publish with MCP tools. Visitors never see that.

## Before you start

You need the omnaidu MCP connected, with `PUBLISH_SECRET`.

Do **not**:
- Commit videos or posts into git
- Mention `/mcp` in public text
- Upload a huge camera file

## Video limits (simple)

| What | Limit |
|---|---|
| File type | `.mp4` (best) or `.webm` |
| Longest | 90 seconds. Aim 30–60s |
| Size | **40 MB max**. Aim 2–8 MB |
| Size on screen | 720p or smaller |
| Sound | Off is fine. The player starts muted |

Images: jpeg/png/webp/avif, **8 MB max**. SVG **512 KB**. GIF **4 MB**.

Encode first:

```bash
ffmpeg -i take.mov -an -c:v libx264 -pix_fmt yuv420p -vf scale=-2:720 -movflags +faststart -crf 23 demo.mp4
```

Also save one still frame as `poster.webp`. Every video needs a poster so the page is not a black box.

## How to upload a demo

1. Encode the clip (and a poster) on disk.
2. Call `upload_media` for the mp4 (`contentType: video/mp4`).
3. Call `upload_media` for the poster (`contentType: image/webp` or `image/jpeg`).
4. You get URLs like `/files/uploads/....mp4`.
5. Call `publish_post` with:
   - `demoUrl` = the mp4 URL (this makes the **top of the post** a video)
   - `posterUrl` = the still
   - or only `posterUrl` if there is no video (a picture at the top)

You can also put a player in the body:

```md
:::demo{src="/files/uploads/….mp4" poster="/files/uploads/….webp"}
45s sandbox run.
:::
```

## How to write a post

Call `publish_post`. Required: `slug`, `title`, `abstract`, `body`, `tag`.

Tags: `projects` | `research` | `systems` | `writing`

Body is markdown. First `# title` is stripped (the page already has a title).

### Blocks you can use

**Use often**

- `$inline math$` and `$$display math$$`
- `:::callout{tone="note"}` (tones: note, warn, idea, result, danger)
- `:::demo{src poster}` short video
- `:::hero{src poster}` image or video lead
- `:::figure{src alt}` picture
- `:::proof{tests repo}` tests / benches
- `:::steps` numbered steps
- `:::theorem` `:::lemma` `:::definition` `:::proposition`
- `:::refs` bibliography
- `:::desk` 2D laptop (only on a post about this site, or similar)

**Use when the post needs them**

- `:::pullquote` `:::chart` `:::details` `:::diff` `:::filetree` `:::graph` `:::arch` `:::terminal` `:::timeline` `:::apispec` `:::compare` `:::kbd`

## Other tools

- `list_posts` — see what is live
- `get_post` — one slug, including drafts
- `unpublish_post` — hide it (`status: draft`)
- `list_media` — recent uploads

## Shape of a good post

1. Problem
2. What you tried
3. What you shipped
4. How you checked it (tests / numbers)
5. Short demo or a figure

Do not write a YouTube script. Keep it readable.

## Code

Write a normal markdown fence with a language. Highlighting is automatic. There is no `:::code` block.

```rust
match intent {
    Intent::Balance => tools.balances(session).await?,
}
```

Languages that color: rust, ts/tsx, js, json, bash, python, go, sql, css, html, yaml, markdown, toml.

## How the AI picks a block

It is **not** automatic from the topic. You write the markdown (or the agent does).

- A video at the top → `demoUrl` + `posterUrl`, or `:::demo` / `:::hero`
- A warning → `:::callout`
- Math → `$...$` / `$$...$$`
- A theorem → `:::theorem`
- Code → ` ```rust ` (no extra component)

The skill + the `publish_post` tool text are how the agent knows. If those are missing, it will guess and often skip posters or use the wrong tag.
