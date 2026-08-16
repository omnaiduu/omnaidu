import { createFileRoute } from '@tanstack/react-router'
import { getPost } from '~/lib/db'

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function wrapTitle(title: string, max = 26) {
  const words = title.split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length > max && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines.slice(0, 3)
}

type OgStyle = 'parchment' | 'ink' | 'type'

function parseStyle(url: string): OgStyle {
  const value = new URL(url).searchParams.get('style')
  if (value === 'ink' || value === 'type') return value
  return 'parchment'
}

function palette(style: OgStyle) {
  if (style === 'ink') {
    return {
      bg: '#14120b',
      card: '#1c1a13',
      line: '#3a362c',
      ink: '#efece6',
      muted: '#9a958a',
      ember: '#ff6a2a',
    }
  }
  return {
    bg: '#f7f7f4',
    card: '#ffffff',
    line: '#e6e5e0',
    ink: '#26251e',
    muted: '#7a7974',
    ember: '#f54e00',
  }
}

function renderSvg(opts: {
  style: OgStyle
  title: string
  tag: string
  abstract: string
}) {
  const { style, title, tag, abstract } = opts
  const c = palette(style)
  const lines = wrapTitle(title, style === 'type' ? 18 : 26)
  const titleSize = style === 'type' ? 72 : 52
  const titleXml = lines
    .map(
      (line, i) =>
        `<text x="88" y="${style === 'type' ? 250 + i * 86 : 250 + i * 64}" fill="${c.ink}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="${titleSize}" font-weight="400">${escapeXml(line)}</text>`,
    )
    .join('\n  ')
  const abstractY = style === 'type' ? 250 + lines.length * 86 + 36 : 250 + lines.length * 64 + 28
  const abstractXml =
    style === 'type'
      ? ''
      : `<text x="88" y="${abstractY}" fill="${c.muted}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="24">${escapeXml(abstract.slice(0, 96))}</text>`

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${c.bg}"/>
  <rect x="48" y="48" width="1104" height="534" fill="${c.card}" stroke="${c.line}"/>
  <text x="88" y="120" fill="${c.muted}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="22" letter-spacing="4">OMNAIDU.COM · ${escapeXml(tag.toUpperCase())}</text>
  ${titleXml}
  ${abstractXml}
  <text x="88" y="520" fill="${c.ember}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="22">proof → demo → repo</text>
</svg>`
}

export const Route = createFileRoute('/og/$slug')({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const post = await getPost(params.slug)
        const style = parseStyle(request.url)
        const svg = renderSvg({
          style,
          title: post?.title ?? 'Om Naidu',
          tag: post?.tag ?? 'lab',
          abstract: post?.abstract ?? 'Engineering lab. Hard systems, verified, written down.',
        })
        return new Response(svg, {
          headers: {
            'content-type': 'image/svg+xml; charset=utf-8',
            'cache-control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})
