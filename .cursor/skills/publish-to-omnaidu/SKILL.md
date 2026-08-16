---
name: publish-to-omnaidu
description: Publish a post or demo clip to omnaidu.com through the private MCP. Use when Om asks to write a post, update a post, or upload a short demo video/image.
---

# Publish to omnaidu.com

This site has **no admin page**. You publish with MCP tools. Visitors never see that.

Owner: Om Naidu, Goa. Email **hello@omnaidu.com**. Dark-only hiring index. Content in D1, not git.

## Connect MCP (Cursor)

You need the omnaidu MCP connected, with `PUBLISH_SECRET`.

Cursor → Settings → MCP:

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

The Worker also accepts `x-publish-secret`. If the server is missing, stop and say so — do not invent a publish UI or commit the post into git.

Do **not**:
- Commit videos or posts into git
- Mention `/mcp` in public post copy
- Upload a huge camera file
- Restore light mode, RSS, or a Lab route
- Put a video on the homepage (home is poster-only)

## Video limits

Hard caps are enforced on upload. Aim for the smaller numbers.

| What | Hard max | Aim for |
|---|---|---|
| File type | `.mp4` or `.webm` | **H.264 `.mp4`** |
| Length | **90 seconds** | **30–60s** |
| File size | **40 MB** | **2–8 MB** |
| Frame size | — | **720p** (1280×720) |
| Frame rate | — | 30 fps |
| Sound | — | Strip it (`-an`). Player starts muted |

The player does **not** download the MP4 until someone hits play. The page still downloads the **poster**. Home never embeds the video — only the still.

## Image limits

| What | Hard max | Aim for |
|---|---|---|
| Poster / photo | **8 MB** jpeg/png/webp/avif | **webp, 40–200 KB**, 1280×720 |
| Diagram | **512 KB** SVG | Small UTF-8 SVG |
| GIF | **4 MB** | Prefer a short mp4 |

Do **not** upload: phone originals, 4K, screenshots of code (use a fenced block), a video with no poster.

## How to process a demo (required)

On disk, before `upload_media`:

```bash
ffmpeg -i take.mov -an -c:v libx264 -pix_fmt yuv420p -r 30 -vf scale=-2:720 -movflags +faststart -crf 23 demo.mp4
ffmpeg -i demo.mp4 -ss 00:00:01 -frames:v 1 -vf scale=-2:720 poster.webp
```

If the mp4 is still over ~8 MB, raise `-crf` to 26 or cut the clip. Do not upload the `.mov`.

## How to upload a demo

1. Encode the clip and poster on disk.
2. `upload_media` for the mp4 (`contentType: video/mp4`).
3. `upload_media` for the poster (`contentType: image/webp` or `image/jpeg`).
4. You get `/files/uploads/....mp4` URLs.
5. `publish_post` with:
   - `demoUrl` = mp4 (top of the post is a video)
   - `posterUrl` = still (**required** if there is a video)
   - or only `posterUrl` for a picture at the top

If `demoUrl` is set, do **not** also paste `:::demo` of the **same** file in the body.

```md
:::demo{src="/files/uploads/….mp4" poster="/files/uploads/….webp"}
45s sandbox run.
:::
```

## How to write a post

`publish_post`. Required: `slug`, `title`, `abstract`, `body`, `tag`.

Tags: `projects` | `research` | `systems` | `writing`

Body is markdown. First `# title` is stripped.

### Blocks

**Use often**

- `$inline math$` and `$$display math$$`
- `:::callout{tone="note"}` (note, warn, idea, result, danger)
- `:::demo{src poster}` short video
- `:::hero{src poster}` image or video lead
- `:::figure{src alt}` picture
- `:::proof{tests repo}` tests / benches
- `:::steps`
- `:::theorem` `:::lemma` `:::definition` `:::proposition`
- `:::refs`
- `:::desk` 2D laptop (only on a post about this site)

**Use when needed**

- `:::pullquote` `:::chart` `:::details` `:::diff` `:::filetree` `:::graph` `:::arch` `:::terminal` `:::timeline` `:::apispec` `:::compare` `:::kbd`

## Code

Normal markdown fence with a language. Highlighting is automatic. No `:::code`.

```rust
match intent {
    Intent::Balance => tools.balances(session).await?,
}
```

Languages that color: rust, ts/tsx, js, json, bash, python, go, sql, css, html, yaml, markdown, toml.

## How the AI picks a block

It is **not** automatic from the topic. You write the markdown.

- Video at the top → `demoUrl` + `posterUrl`
- Warning → `:::callout`
- Math → `$...$`
- Theorem → `:::theorem`
- Code → ` ```rust `

## Other tools

- `list_posts` — what is live
- `get_post` — one slug, including drafts
- `unpublish_post` — hide (`status: draft`)
- `list_media` — recent uploads

## Shape of a good post

1. Problem
2. What you tried
3. What you shipped
4. How you checked it (tests / numbers)
5. Short demo or a figure

Do not write a YouTube script. Keep it readable. Dark OG card is generated from title + abstract at `/og/{slug}`.
