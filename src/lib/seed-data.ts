import type { PublishInput } from './types'

export const SEED_POSTS: PublishInput[] = [
  {
    slug: 'bankbot-turn-loop',
    title: 'A code-owned bank turn loop in Rust',
    abstract:
      'Banking tools stay in code. The model only does NLU. This post is the receipt: design, constraints, tests, and a 45s sandbox demo.',
    tag: 'projects',
    publishedAt: '2026-08-12',
    demoUrl: '/media/demo.mp4',
    posterUrl: '/media/demo-poster.svg',
    repo: 'https://github.com/omnaiduu/bankbot-rs',
    proofTests: '142 passing',
    proofBenches: JSON.stringify([
      { name: 'turn p99', value: '12ms' },
      { name: 'binary', value: '4.1MB' },
    ]),
    readingMinutes: 8,
    body: `# A code-owned bank turn loop in Rust

:::callout{tone="note"}
This is a **demo post** so you can judge layout, type, proof blocks, and the short demo player.
:::

## Problem

Agent frameworks want to own the loop. For money movement that is the wrong shape. A turn in a bank bot is a state machine: authenticate, parse intent, call a typed tool, render a reply. The LLM should classify. It should not invent a transfer.

:::pullquote{cite="lab note"}
The turn loop is code. The model only does NLU.
:::

## Options

1. Drop the whole product into an agent SDK.
2. Keep a thin NLU call, own the rest in Rust.
3. Generate tools from OpenAPI and let the model pick.

## Why this

Option 2. The FE contract is OpenAPI. agentkit is a library for other work — it is not this backend.

## What shipped

:::steps
1. Rust turn loop with explicit intents
2. OpenAPI types shared with a React GenUI client
3. Sandbox transfer path with fixtures
:::

\`\`\`rust
match intent {
    Intent::Balance => tools.balances(session).await?,
    Intent::Transfer(spec) => tools.transfer(session, spec).await?,
    Intent::Unknown => Reply::clarify("I can check balances or send a transfer."),
}
\`\`\`

:::demo{src="/media/demo.mp4" poster="/media/demo-poster.svg"}
Short sandbox run — same asset embedded on feeds.
:::

:::figure{src="/media/demo-poster.svg" alt="Sandbox frame still"}
Poster frame pulled from the demo asset.
:::

## How verified

| Case | Result |
| --- | --- |
| Happy path | green |
| Bad JSON | typed error |
| Missing auth | reject |
| Sandbox run | demo matches fixture |

:::proof{tests="142 passing" repo="https://github.com/omnaiduu/bankbot-rs"}
{"benches":[{"name":"turn p99","value":"12ms"},{"name":"binary","value":"4.1MB"}]}
:::

Tests are the referee. The demo is the receipt.
`,
  },
  {
    slug: 'agentkit-tool-schema',
    title: 'agentkit: tool schemas without the handbook tax',
    abstract:
      'A reusable LLM library. Nested objects, arrays, optional fields. Behavior first, then proof. Not a bank backend.',
    tag: 'projects',
    publishedAt: '2026-08-08',
    demoUrl: '/media/demo.mp4',
    posterUrl: '/media/demo-poster.svg',
    repo: 'https://github.com/omnaiduu/agentkit',
    proofTests: '87 passing',
    proofBenches: JSON.stringify([{ name: 'schema gen', value: '0.4ms' }]),
    readingMinutes: 5,
    body: `# agentkit: tool schemas without the handbook tax

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

:::proof{tests="87 passing" repo="https://github.com/omnaiduu/agentkit"}
{"benches":[{"name":"schema gen","value":"0.4ms"}]}
:::

This post is tagged **projects**. Same writing surface as research — no separate projects site.
`,
  },
  {
    slug: 'verify-dont-read-every-line',
    title: 'Verify behavior. Zoom into code only on disagreement.',
    abstract:
      'Writing code is no longer the bottleneck. Judgment is. A research note on the loop I actually use with AI.',
    tag: 'research',
    publishedAt: '2026-08-04',
    proofTests: 'n/a — essay',
    proofBenches: '[]',
    readingMinutes: 6,
    body: `# Verify behavior. Zoom into code only on disagreement.

## The shift

Old model: I understand code deeply → I write it → I trust it because I wrote it.

New model: I understand **behavior** deeply → AI writes → I trust it because I verified behavior.

## What I still own

:::steps
1. Behavior — what should happen
2. Boundaries — what is not allowed
3. Proof — tests, fixtures, a real run
:::

## Format for every public post

problem → options → why this → what shipped → how verified → demo / numbers

This note is tagged **research**. Same index as projects and systems. Filter, do not fork the IA.
`,
  },
  {
    slug: 'lab-blog-not-long-youtube',
    title: 'The site is the lab. Feeds are the megaphone.',
    abstract:
      'Why omnaidu.com is a durable home for receipts, and why a long talking YouTube channel is the wrong main channel for this work.',
    tag: 'writing',
    publishedAt: '2026-08-05',
    demoUrl: '/media/demo.mp4',
    posterUrl: '/media/demo-poster.svg',
    repo: 'https://github.com/omnaiduu/mywebsite',
    proofBenches: '[]',
    readingMinutes: 4,
    body: `# The site is the lab. Feeds are the megaphone.

Hiring managers skim a post, open the site, read the writeup, watch a short demo, check GitHub.

## What video is for

30–90s of the thing running. Demo only. Embed here. Attach the same file on X and LinkedIn.

## What video is not for

A 15 minute talking remake of this page.

## Traffic model

:::steps
1. Feed discovery
2. Click home
3. SEO on the post
4. Not YouTube search for a lecture
:::

Tagged **writing**. Still a post. Still proof-shaped.
`,
  },
  {
    slug: 'edge-cache-d1-mcp',
    title: 'Posts live in D1. Agents publish privately. Cache sits in front.',
    abstract:
      'Git is the app. D1 is the content. Cloudflare Cache is the read path. Agents publish through a private MCP surface — not a CMS with logins.',
    tag: 'systems',
    publishedAt: '2026-08-16',
    demoUrl: '/media/demo.mp4',
    posterUrl: '/media/demo-poster.svg',
    repo: 'https://github.com/omnaiduu/mywebsite',
    proofTests: 'seed + cache purge on write',
    proofBenches: JSON.stringify([
      { name: 'list cache', value: 'Cache API' },
      { name: 'store', value: 'D1' },
    ]),
    readingMinutes: 7,
    body: `# Posts live in D1. Agents publish privately. Cache sits in front.

:::callout{tone="idea"}
Git is the app. D1 is the content. Cloudflare Cache is the read path — not a CMS with logins.
:::

## Read path

Worker → Cache API (\`posts:list\`, \`posts:slug\`) → D1 on miss → store JSON with a short TTL and purge on publish.

## Write path

No admin UI. Agents publish through a private MCP surface — authenticated tool calls, not something visitors need to know about.

:::steps
1. Agent calls \`list_posts\`, \`get_post\`, \`publish_post\`, or \`unpublish_post\`
2. Worker validates auth header
3. D1 write + cache purge
4. Media lands in R2 when needed
:::

Short demos are H.264 MP4 with \`faststart\`, not HLS.

:::proof{tests="seed + cache purge on write" repo="https://github.com/omnaiduu/mywebsite"}
{"benches":[{"name":"list cache","value":"Cache API"},{"name":"store","value":"D1"}]}
:::

## Why not git-as-CMS

Agents should publish without opening a PR for every paragraph. The site code lives in git. The words live in D1 so a publish is one tool call.
`,
  },
  {
    slug: 'attention-as-a-dot-product',
    title: 'Attention is a scaled dot product. Write it down.',
    abstract:
      'A short research note: the transformer attention map as notation, a bound, and a picture — the shape a lab post should have.',
    tag: 'research',
    publishedAt: '2026-08-16',
    posterUrl: '/media/attention-hero.svg',
    proofTests: 'n/a — note',
    proofBenches: '[]',
    readingMinutes: 5,
    body: `# Attention is a scaled dot product. Write it down.

The lead figure is a still — set \`posterUrl\` when the receipt is a diagram, \`demoUrl\` when it is a 45s run. Inline math belongs in the sentence, not in a screenshot.

## Shape of a note

A research post here is notation, a bound, a figure, and a citation. Not a thread. Not a lecture.

## Notation

Queries, keys, and values. The map everyone ships:

$$
\\mathrm{Attention}(Q, K, V) = \\mathrm{softmax}\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V
$$

The $\\sqrt{d_k}$ term keeps the logits from saturating the softmax as the key dimension grows.[^scale]

:::definition{title="Scaled dot-product attention"}
Given $Q, K \\in \\mathbb{R}^{n \\times d_k}$ and $V \\in \\mathbb{R}^{n \\times d_v}$, attention is the convex combination of value rows weighted by a softmax over scaled query–key inner products.
:::

## Why the scale

If coordinates of $Q$ and $K$ are $O(1)$, entries of $QK^\\top$ have variance that grows like $d_k$. Softmax then collapses onto the max.

$$
\\mathrm{Var}(q \\cdot k) = d_k \\quad \\Rightarrow \\quad \\frac{q \\cdot k}{\\sqrt{d_k}} \\text{ has variance } O(1)
$$

:::theorem{title="Softmax saturates without scaling"}
If entries of $QK^\\top$ grow like $\\sqrt{d_k}$, the softmax concentrates on the max. Scaling by $\\sqrt{d_k}$ keeps the variance of the logits $O(1)$ when coordinates are $O(1)$.
:::

:::lemma{title="Row-stochastic map"}
Each row of $\\mathrm{softmax}(QK^\\top / \\sqrt{d_k})$ is non-negative and sums to one, so the output is a convex combination of the rows of $V$.
:::

[^scale]: Vaswani et al. introduce the $\\sqrt{d_k}$ factor in §3.2.1 of *Attention Is All You Need*.

:::refs
Vaswani et al. Attention Is All You Need. NeurIPS 2017.
Elhage et al. A Mathematical Framework for Transformer Circuits. 2021.
:::
`,
  },
]
