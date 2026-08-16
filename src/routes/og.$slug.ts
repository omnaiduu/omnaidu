import { createFileRoute } from '@tanstack/react-router'
import { getPost } from '~/lib/db'

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function wrapLines(text: string, max: number, maxLines: number) {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length > max && current) {
      lines.push(current)
      if (lines.length === maxLines) return lines
      current = word
    } else {
      current = next
    }
  }
  if (current && lines.length < maxLines) lines.push(current)
  return lines
}

const C = {
  bg: '#f7f7f4',
  card: '#ffffff',
  line: '#e6e5e0',
  ink: '#26251e',
  muted: '#7a7974',
  ember: '#f54e00',
}

function renderSvg(opts: { title: string; tag: string; abstract: string }) {
  const titles = wrapLines(opts.title, 28, 3)
  const abstracts = wrapLines(opts.abstract, 52, 2)
  const titleXml = titles
    .map(
      (line, i) =>
        `<text x="88" y="${236 + i * 58}" fill="${C.ink}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="48" font-weight="400">${escapeXml(line)}</text>`,
    )
    .join('\n  ')
  const abstractXml = abstracts
    .map(
      (line, i) =>
        `<text x="88" y="${236 + titles.length * 58 + 36 + i * 32}" fill="${C.muted}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="22">${escapeXml(line)}</text>`,
    )
    .join('\n  ')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${C.bg}"/>
  <rect x="48" y="48" width="1104" height="534" fill="${C.card}" stroke="${C.line}"/>
  <rect x="88" y="92" width="10" height="10" fill="${C.ember}"/>
  <text x="110" y="104" fill="${C.muted}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="20" letter-spacing="3.5">OMNAIDU.COM · ${escapeXml(opts.tag.toUpperCase())}</text>
  <line x1="88" y1="128" x2="1112" y2="128" stroke="${C.line}"/>
  ${titleXml}
  ${abstractXml}
  <text x="88" y="534" fill="${C.ember}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="20">omnaidu.com</text>
</svg>`
}

export const Route = createFileRoute('/og/$slug')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const post = await getPost(params.slug)
        const svg = renderSvg({
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
