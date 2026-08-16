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

Hard caps are enforced on upload. Aim for the smaller numbers.

| What | Hard max | Aim for |
|---|---|---|
| File type | `.mp4` or `.webm` | **H.264 `.mp4`** |
| Length | **90 seconds** | **30–60s** |
| File size | **40 MB** | **2–8 MB** |
| Frame size | — | **720p or smaller** (1280×720) |
| Frame rate | — | 30 fps |
| Sound | — | Strip it (`-an`). Player starts muted |

The player does **not** download the MP4 until someone hits play. The page still downloads the **poster**. Home never embeds the video — only the still.

## Image limits (simple)

| What | Hard max | Aim for |
|---|---|---|
| Poster / photo | **8 MB** jpeg/png/webp/avif | **webp, 40–200 KB**, 1280×720 |
| Diagram | **512 KB** SVG | Small UTF-8 SVG (not a Latin-1 export) |
| GIF | **4 MB** | Prefer a 5–10s mp4 instead |

Do **not** upload: phone camera originals, 4K, screenshots of code (use a fenced block), a video with no poster.

## How to process a demo (required)

On disk, before `upload_media`:

```bash
# 1. Clip → small H.264, no audio, moov at the front
ffmpeg -i take.mov -an -c:v libx264 -pix_fmt yuv420p -r 30 -vf scale=-2:720 -movflags +faststart -crf 23 demo.mp4

# 2. One still from ~1s in. This is the page load.
ffmpeg -i demo.mp4 -ss 00:00:01 -frames:v 1 -vf scale=-2:720 poster.webp
```

If the mp4 is still over ~8 MB, raise `-crf` to 26 or cut the clip. Do not upload the `.mov`.

## How to upload a demo

1. Encode the clip (and a poster) on disk.
2. Call `upload_media` for the mp4 (`contentType: video/mp4`).
3. Call `upload_media` for the poster (`contentType: image/webp` or `image/jpeg`).
4. You get URLs like `/files/uploads/....mp4`.
5. Call `publish_post` with:
   - `demoUrl` = the mp4 URL (this makes the **top of the post** a video)
   - `posterUrl` = the still (**required** if there is a video)
   - or only `posterUrl` if there is no video (a picture at the top)

If `demoUrl` is set, do **not** also paste `:::demo` of the **same** file in the body. That would be two posters and two players. Use `:::demo` only for a second, different clip.

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
