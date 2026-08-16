import { initWasm, Resvg } from '@resvg/resvg-wasm'
import wasm from '@resvg/resvg-wasm/index_bg.wasm'

const C = {
  bg: '#14120b',
  card: '#1c1a13',
  line: 'rgba(239, 236, 230, 0.12)',
  ink: '#efece6',
  muted: '#9a958a',
  ember: '#ff6a2a',
}

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

export function renderOgSvg(opts: { title: string; tag: string; abstract: string }) {
  const titles = wrapLines(opts.title, 26, 3)
  const abstracts = wrapLines(opts.abstract, 48, 2)
  const titleXml = titles
    .map(
      (line, i) =>
        `<text x="120" y="${248 + i * 56}" fill="${C.ink}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="46" font-weight="400">${escapeXml(line)}</text>`,
    )
    .join('\n  ')
  const abstractXml = abstracts
    .map(
      (line, i) =>
        `<text x="120" y="${248 + titles.length * 56 + 34 + i * 30}" fill="${C.muted}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="22">${escapeXml(line)}</text>`,
    )
    .join('\n  ')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${C.bg}"/>
  <rect x="48" y="48" width="1104" height="534" fill="${C.card}" stroke="${C.line}"/>
  <rect x="120" y="96" width="10" height="10" fill="${C.ember}"/>
  <text x="142" y="108" fill="${C.muted}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="20" letter-spacing="3.5">OMNAIDU.COM · ${escapeXml(opts.tag.toUpperCase())}</text>
  <line x1="120" y1="132" x2="1080" y2="132" stroke="${C.line}"/>
  ${titleXml}
  ${abstractXml}
  <text x="120" y="508" fill="${C.ember}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="20">omnaidu.com</text>
</svg>`
}

let wasmReady: Promise<void> | null = null

function ensureWasm() {
  wasmReady ??= initWasm(wasm as WebAssembly.Module)
  return wasmReady
}

export async function renderOgPng(opts: { title: string; tag: string; abstract: string }) {
  await ensureWasm()
  const svg = renderOgSvg(opts)
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    background: C.bg,
  })
  return resvg.render().asPng()
}
