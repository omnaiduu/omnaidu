-- Cloudflare D1 seed for the omnaidu.com theme demo.
DELETE FROM posts;

INSERT INTO posts (
  slug, title, abstract, body, tag, published_at,
  demo_url, poster_url, repo, proof_tests, proof_benches, reading_minutes, status
) VALUES (
  'bankbot-turn-loop',
  'A code-owned bank turn loop in Rust',
  'Banking tools stay in code. The model only does NLU. This post is the receipt: design, constraints, tests, and a 45s sandbox demo.',
  '# A code-owned bank turn loop in Rust

This is a **demo post** so you can judge layout, type, proof blocks, and the short demo player. The engineering is real; some numbers are illustrative for the theme preview.

## Problem

Agent frameworks want to own the loop. For money movement that is the wrong shape. A turn in a bank bot is a state machine: authenticate, parse intent, call a typed tool, render a reply. The LLM should classify. It should not invent a transfer.

## Options

1. Drop the whole product into an agent SDK.
2. Keep a thin NLU call, own the rest in Rust.
3. Generate tools from OpenAPI and let the model pick.

## Why this

Option 2. The FE contract is OpenAPI. The turn loop is code. agentkit is a library for other work — it is not this backend.

## What shipped

- Rust turn loop with explicit intents
- OpenAPI types shared with a React GenUI client
- Sandbox transfer path with fixtures

```rust
match intent {
    Intent::Balance => tools.balances(session).await?,
    Intent::Transfer(spec) => tools.transfer(session, spec).await?,
    Intent::Unknown => Reply::clarify("I can check balances or send a transfer."),
}
```

## How verified

Happy path, bad JSON, missing auth, and a real sandbox run. Tests are the referee. The demo is the receipt.

Watch the clip, then open the repo.
',
  'projects',
  '2026-08-12',
  '/media/demo.mp4',
  '/media/demo-poster.svg',
  'https://github.com/omnaiduu/bankbot-rs',
  '142 passing',
  '[{"name":"turn p99","value":"12ms"},{"name":"binary","value":"4.1MB"}]',
  8,
  'published'
);

INSERT INTO posts (
  slug, title, abstract, body, tag, published_at,
  demo_url, poster_url, repo, proof_tests, proof_benches, reading_minutes, status
) VALUES (
  'agentkit-tool-schema',
  'agentkit: tool schemas without the handbook tax',
  'A reusable LLM library. Nested objects, arrays, optional fields. Behavior first, then proof. Not a bank backend.',
  '# agentkit: tool schemas without the handbook tax

Demo writing in the lab voice: **problem → options → why → shipped → verified**.

## Problem

Hand-written JSON Schema drifts from the Rust types the tools actually take.

## What shipped

Struct tags → tool schema. Nested objects and arrays work. Bad types fail loudly.

## How verified

| Case | Result |
| --- | --- |
| Nested object | schema matches fixture |
| Array of objects | schema matches fixture |
| Unsupported type | compile-time / runtime fail |

This post is tagged **projects**. Same writing surface as research — no separate projects site.
',
  'projects',
  '2026-08-08',
  '/media/demo.mp4',
  '/media/demo-poster.svg',
  'https://github.com/omnaiduu/agentkit',
  '87 passing',
  '[{"name":"schema gen","value":"0.4ms"}]',
  5,
  'published'
);

INSERT INTO posts (
  slug, title, abstract, body, tag, published_at,
  demo_url, poster_url, repo, proof_tests, proof_benches, reading_minutes, status
) VALUES (
  'verify-dont-read-every-line',
  'Verify behavior. Zoom into code only on disagreement.',
  'Writing code is no longer the bottleneck. Judgment is. A research note on the loop I actually use with AI.',
  '# Verify behavior. Zoom into code only on disagreement.

## The shift

Old model: I understand code deeply → I write it → I trust it because I wrote it.

New model: I understand **behavior** deeply → AI writes → I trust it because I verified behavior.

## What I still own

1. Behavior — what should happen
2. Boundaries — what is not allowed
3. Proof — tests, fixtures, a real run

## Format for every public post

problem → options → why this → what shipped → how verified → demo / numbers

This note is tagged **research**. Same index as projects and systems. Filter, do not fork the IA.
',
  'research',
  '2026-08-04',
  NULL,
  NULL,
  NULL,
  'n/a — essay',
  '[]',
  6,
  'published'
);

INSERT INTO posts (
  slug, title, abstract, body, tag, published_at,
  demo_url, poster_url, repo, proof_tests, proof_benches, reading_minutes, status
) VALUES (
  'lab-blog-not-long-youtube',
  'The site is the lab. Feeds are the megaphone.',
  'Why omnaidu.com is a durable home for receipts, and why a long talking YouTube channel is the wrong main channel for this work.',
  '# The site is the lab. Feeds are the megaphone.

Hiring managers skim a post, open the site, read the writeup, watch a short demo, check GitHub.

## What video is for

30–90s of the thing running. Demo only. Embed here. Attach the same file on X and LinkedIn.

## What video is not for

A 15 minute talking remake of this page.

## Traffic model

1. Feed discovery
2. Click home
3. SEO on the post
4. Not YouTube search for a lecture

Tagged **writing**. Still a post. Still proof-shaped.
',
  'writing',
  '2026-08-05',
  '/media/demo.mp4',
  '/media/demo-poster.svg',
  'https://github.com/omnaiduu/mywebsite',
  NULL,
  '[]',
  4,
  'published'
);

INSERT INTO posts (
  slug, title, abstract, body, tag, published_at,
  demo_url, poster_url, repo, proof_tests, proof_benches, reading_minutes, status
) VALUES (
  'edge-cache-d1-mcp',
  'Posts live in D1. Agents publish over MCP. Cache sits in front.',
  'Git is the app. D1 is the content. Cloudflare Cache is the read path. This demo is that architecture, not a CMS with logins.',
  '# Posts live in D1. Agents publish over MCP. Cache sits in front.

## Read path

Worker → Cache API (`posts:list`, `posts:slug`) → D1 on miss → store HTML/JSON with a short TTL and purge on publish.

## Write path

No admin UI. An agent calls MCP tools:

- `list_posts`
- `get_post`
- `publish_post`
- `unpublish_post`

Auth is a shared secret header. Media goes to R2. Short demos are H.264 MP4 with `faststart`, not HLS.

## Why not git-as-CMS

Agents should publish without opening a PR for every paragraph. The site code still lives in git. The words live in D1 so a publish is one tool call.

Hit `/mcp` for the protocol surface. Hit `/og/edge-cache-d1-mcp` for the generated share image.
',
  'systems',
  '2026-08-16',
  '/media/demo.mp4',
  '/media/demo-poster.svg',
  'https://github.com/omnaiduu/mywebsite',
  'seed + cache purge on write',
  '[{"name":"list cache","value":"Cache API"},{"name":"store","value":"D1"}]',
  7,
  'published'
);
