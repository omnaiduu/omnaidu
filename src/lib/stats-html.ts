import {
  BUCKETS,
  BUCKET_LABEL,
  TZ,
  countryName,
  sourceLabel,
  type Bucket,
  type BuiltStats,
  type RangeKey,
  type VisitRecord,
} from './visits.ts'

const COLOR: Record<Bucket, string> = {
  linkedin: '#ff6a2a',
  x: '#9ec1ff',
  search: '#e6c07b',
  direct: '#a39e93',
  other: '#6f8f86',
}

const RANGE_LABEL: Record<RangeKey, string> = {
  today: 'Today',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    if (char === '&') return '&amp;'
    if (char === '<') return '&lt;'
    if (char === '>') return '&gt;'
    if (char === '"') return '&quot;'
    return '&#39;'
  })
}

const numFmt = new Intl.NumberFormat('en')

function num(value: number) {
  return numFmt.format(value)
}

function formatDay(key: string) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${key}T12:00:00+05:30`))
}

function formatStamp(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(iso))
}

function deviceLabel(device: string) {
  return device === 'desktop' ? 'Desktop' : 'Phone'
}

function lineChart(stats: BuiltStats) {
  const width = 640
  const height = 220
  const pad = { l: 36, r: 12, t: 16, b: 32 }
  const days = stats.days
  const n = Math.max(days.length, 1)
  const max = Math.max(1, ...BUCKETS.flatMap((bucket) => stats.series[bucket]))
  const innerW = width - pad.l - pad.r
  const innerH = height - pad.t - pad.b
  const xAt = (index: number) => pad.l + (n === 1 ? innerW / 2 : (index / (n - 1)) * innerW)
  const yAt = (value: number) => pad.t + innerH - (value / max) * innerH
  const labels = new Set<number>()
  if (n <= 8) {
    for (let i = 0; i < n; i += 1) labels.add(i)
  } else {
    for (let i = 0; i < n; i += 5) labels.add(i)
    labels.add(n - 1)
  }

  const grid = [0, max]
  if (max > 1) grid.splice(1, 0, Math.round(max / 2))
  const gridMarkup = [...new Set(grid)]
    .map((tick) => {
      const y = yAt(tick).toFixed(1)
      return `<line x1="${pad.l}" y1="${y}" x2="${width - pad.r}" y2="${y}" stroke="rgba(239,236,230,0.12)" />
        <text x="${pad.l - 8}" y="${Number(y) + 4}" text-anchor="end" fill="#6f6b62" font-size="11">${tick}</text>`
    })
    .join('')

  const series = BUCKETS.map((bucket) => {
    const values = stats.series[bucket]
    if (!values.some((value) => value > 0)) return ''
    const points = values.map((value, index) => `${xAt(index).toFixed(1)},${yAt(value).toFixed(1)}`).join(' ')
    const line =
      n > 1
        ? `<polyline fill="none" stroke="${COLOR[bucket]}" stroke-width="1.75" points="${points}" />`
        : ''
    const shift = (BUCKETS.indexOf(bucket) - 2) * 4
    const dots = values
      .map((value, index) => {
        if (value <= 0) return ''
        const label = `${formatDay(days[index] ?? '')} · ${BUCKET_LABEL[bucket]} · ${value}`
        return `<circle cx="${(xAt(index) + shift).toFixed(1)}" cy="${yAt(value).toFixed(1)}" r="3" fill="${COLOR[bucket]}"><title>${escapeHtml(label)}</title></circle>`
      })
      .join('')
    return line + dots
  }).join('')

  const axis = [...labels]
    .map((index) => {
      const anchor = index === 0 ? 'start' : index === n - 1 ? 'end' : 'middle'
      const day = days[index]
      if (!day) return ''
      return `<text x="${xAt(index).toFixed(1)}" y="${height - 8}" text-anchor="${anchor}" fill="#9a958a" font-size="11">${escapeHtml(formatDay(day))}</text>`
    })
    .join('')

  const empty =
    stats.total === 0
      ? `<text x="${width / 2}" y="${pad.t + innerH / 2}" text-anchor="middle" fill="#9a958a" font-size="13">No visits in this range</text>`
      : ''

  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Visits per day by source">
    ${gridMarkup}${series}${axis}${empty}
  </svg>`
}

function donut(stats: BuiltStats) {
  const total = stats.total
  const r = 52
  const c = 2 * Math.PI * r
  let offset = 0
  const only = BUCKETS.find((bucket) => total > 0 && stats.sources[bucket] === total)
  let arcs = ''
  if (total === 0) {
    arcs = `<circle cx="70" cy="70" r="${r}" fill="none" stroke="#2a271e" stroke-width="14" />`
  } else if (only) {
    arcs = `<circle cx="70" cy="70" r="${r}" fill="none" stroke="${COLOR[only]}" stroke-width="14" />`
  } else {
    arcs = BUCKETS.map((bucket) => {
      const len = (stats.sources[bucket] / total) * c
      const dash = `${len.toFixed(2)} ${(c - len).toFixed(2)}`
      const piece =
        len > 0
          ? `<circle cx="70" cy="70" r="${r}" fill="none" stroke="${COLOR[bucket]}" stroke-width="14" stroke-dasharray="${dash}" stroke-dashoffset="${(-offset).toFixed(2)}" />`
          : ''
      offset += len
      return piece
    }).join('')
  }

  const legend = BUCKETS.map(
    (bucket) =>
      `<li><i style="background:${COLOR[bucket]}"></i>${BUCKET_LABEL[bucket]}<span>${num(stats.sources[bucket])}</span></li>`,
  ).join('')

  return `<div class="donut">
    <svg viewBox="0 0 140 140" width="140" height="140" role="img" aria-label="Visits by source">
      <g transform="rotate(-90 70 70)">${arcs}</g>
      <text x="70" y="66" text-anchor="middle" fill="#efece6" font-size="22">${num(total)}</text>
      <text x="70" y="84" text-anchor="middle" fill="#9a958a" font-size="11">visits</text>
    </svg>
    <ul class="legend">${legend}</ul>
  </div>`
}

function deviceBar(stats: BuiltStats) {
  const phone = stats.devices.phone
  const desktop = stats.devices.desktop
  const total = phone + desktop
  const phoneWidth = total ? (phone / total) * 100 : 0
  const desktopWidth = total ? (desktop / total) * 100 : 0
  const phoneSpan = phoneWidth > 0 ? `<span style="width:${phoneWidth.toFixed(2)}%;background:#ff6a2a"></span>` : ''
  const desktopSpan =
    desktopWidth > 0 ? `<span style="width:${desktopWidth.toFixed(2)}%;background:#9a958a"></span>` : ''
  return `<div class="stack" role="img" aria-label="Phone ${phone}, desktop ${desktop}">${phoneSpan}${desktopSpan}</div>
    <p class="device-key"><span><i style="background:#ff6a2a"></i>Phone ${num(phone)}</span><span><i style="background:#9a958a"></i>Desktop ${num(desktop)}</span></p>`
}

function meter(value: number, max: number) {
  const width = max > 0 ? Math.max(4, Math.round((value / max) * 100)) : 0
  return `<span class="meter"><span style="width:${width}%"></span></span>`
}

function pagesTable(stats: BuiltStats) {
  if (stats.pages.length === 0) return `<p class="empty">No page views in this range.</p>`
  const max = stats.pages[0]?.n ?? 1
  const rows = stats.pages
    .map(
      (page) => `<tr><td class="path">${escapeHtml(page.path)}</td><td class="num">${num(page.n)} ${meter(page.n, max)}</td></tr>`,
    )
    .join('')
  return `<table><thead><tr><th>Path</th><th class="num">Visits</th></tr></thead><tbody>${rows}</tbody></table>`
}

function campaignsTable(stats: BuiltStats) {
  if (stats.campaigns.length === 0) return `<p class="empty">No campaign tags in this range.</p>`
  const head = BUCKETS.map((bucket) => `<th class="num">${BUCKET_LABEL[bucket]}</th>`).join('')
  const rows = stats.campaigns
    .map((row) => {
      const cells = BUCKETS.map((bucket) => `<td class="num">${num(row.counts[bucket])}</td>`).join('')
      return `<tr><td>${escapeHtml(row.campaign)}</td>${cells}<td class="num">${num(row.total)}</td></tr>`
    })
    .join('')
  return `<div class="scroll"><table><thead><tr><th>Campaign</th>${head}<th class="num">Total</th></tr></thead><tbody>${rows}</tbody></table></div>`
}

function countriesTable(stats: BuiltStats) {
  if (stats.countries.length === 0) return `<p class="empty">No country on these visits yet.</p>`
  const max = stats.countries[0]?.n ?? 1
  const rows = stats.countries
    .map(
      (row) =>
        `<tr><td>${escapeHtml(countryName(row.code))}</td><td class="num">${num(row.n)} ${meter(row.n, max)}</td></tr>`,
    )
    .join('')
  return `<table><thead><tr><th>Country</th><th class="num">Visits</th></tr></thead><tbody>${rows}</tbody></table>`
}

function liveTable(rows: VisitRecord[]) {
  if (rows.length === 0) return `<p class="empty">Nothing in the last 30 minutes.</p>`
  const body = rows
    .map(
      (row) => `<tr>
        <td class="when">${escapeHtml(formatStamp(row.ts))}</td>
        <td class="path">${escapeHtml(row.path)}</td>
        <td>${escapeHtml(sourceLabel(row.source))}</td>
        <td>${deviceLabel(row.device)}</td>
        <td>${escapeHtml(countryName(row.country))}</td>
        <td>${row.utmCampaign ? escapeHtml(row.utmCampaign) : '—'}</td>
      </tr>`,
    )
    .join('')
  return `<div class="scroll"><table><thead><tr><th>Time</th><th>Path</th><th>Source</th><th>Device</th><th>Country</th><th>Campaign</th></tr></thead><tbody>${body}</tbody></table></div>`
}

function rangeNav(range: RangeKey) {
  const items: { key: RangeKey; href: string; label: string }[] = [
    { key: 'today', href: '/admin/stats?range=today', label: 'Today' },
    { key: '7d', href: '/admin/stats?range=7d', label: '7 days' },
    { key: '30d', href: '/admin/stats?range=30d', label: '30 days' },
  ]
  return items
    .map((item) => {
      const current = item.key === range ? ' aria-current="page"' : ''
      return `<a href="${item.href}"${current}>${item.label}</a>`
    })
    .join('')
}

const legend = BUCKETS.map(
  (bucket) => `<span><i style="background:${COLOR[bucket]}"></i>${BUCKET_LABEL[bucket]}</span>`,
).join('')

export function renderStats(stats: BuiltStats, live: VisitRecord[], range: RangeKey) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Stats · Om Naidu</title>
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #14120b;
      color: #efece6;
      font: 15px/1.5 ui-sans-serif, system-ui, sans-serif;
    }
    main { width: min(1040px, calc(100% - 32px)); margin: 32px auto 72px; }
    header { display: flex; justify-content: space-between; gap: 16px; align-items: flex-end; flex-wrap: wrap; }
    .eyebrow { margin: 0; color: #6f6b62; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; }
    h1 { margin: 4px 0 0; font-size: 36px; font-weight: 400; letter-spacing: -0.04em; }
    .sub { margin: 6px 0 0; color: #9a958a; }
    nav { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
    nav a { color: #9a958a; text-decoration: none; padding: 6px 12px; border-radius: 999px; }
    nav a[aria-current="page"] { color: #efece6; background: #221f16; }
    .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 28px; }
    .card, .panel { background: #1c1a13; border: 1px solid rgba(239,236,230,0.1); border-radius: 8px; }
    .card { padding: 18px 18px 16px; }
    .card .n { margin: 0; font-size: 36px; line-height: 1; letter-spacing: -0.04em; font-variant-numeric: tabular-nums; }
    .card .n.ember { color: #ff6a2a; }
    .card .n.x { color: #9ec1ff; }
    .card .l { margin: 8px 0 0; color: #9a958a; }
    h2 { margin: 28px 0 12px; font-size: 13px; font-weight: 400; letter-spacing: 0.06em; text-transform: uppercase; color: #9a958a; }
    .panel { padding: 16px 18px 18px; }
    .split { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 12px; }
    svg { display: block; width: 100%; height: auto; font-family: ui-sans-serif, system-ui, sans-serif; }
    .chart-legend, .device-key, .legend { display: flex; flex-wrap: wrap; gap: 12px 16px; color: #9a958a; font-size: 13px; }
    .chart-legend { margin-top: 8px; }
    .chart-legend i, .device-key i, .legend i { display: inline-block; width: 8px; height: 8px; border-radius: 99px; margin-right: 6px; }
    .donut { display: flex; gap: 18px; align-items: center; }
    .donut svg { width: 140px; height: 140px; flex: none; }
    .legend { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; min-width: 160px; }
    .legend li { display: flex; align-items: center; gap: 8px; }
    .legend span, .device-key { font-variant-numeric: tabular-nums; }
    .legend span { margin-left: auto; color: #efece6; }
    .stack { display: flex; height: 12px; border-radius: 99px; overflow: hidden; background: #221f16; margin-top: 28px; }
    .stack span { display: block; height: 100%; }
    .device-key { margin: 14px 0 0; }
    .device-key span { display: inline-flex; align-items: center; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 9px 12px 9px 0; vertical-align: baseline; }
    th { color: #6f6b62; font-weight: 400; font-size: 12px; letter-spacing: 0.04em; text-transform: uppercase; }
    td { border-top: 1px solid rgba(239,236,230,0.1); }
    td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
    td.path { font-family: ui-monospace, monospace; font-size: 13px; max-width: 420px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    td.when { white-space: nowrap; color: #9a958a; }
    .meter { display: inline-block; width: 72px; height: 6px; margin-left: 8px; background: #221f16; border-radius: 99px; vertical-align: middle; overflow: hidden; }
    .meter span { display: block; height: 100%; background: #ff6a2a; border-radius: 99px; }
    .empty { margin: 0; color: #9a958a; }
    .scroll { overflow-x: auto; }
    footer { margin-top: 36px; color: #6f6b62; font-size: 13px; }
    footer code { color: #9a958a; font-family: ui-monospace, monospace; font-size: 12px; }
    @media (max-width: 800px) {
      .cards, .split { grid-template-columns: 1fr; }
      header { align-items: flex-start; }
      nav { width: 100%; }
      h1 { font-size: 30px; }
      .donut { align-items: flex-start; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <div>
        <p class="eyebrow">omnaidu.com</p>
        <h1>Stats</h1>
        <p class="sub">${RANGE_LABEL[range]} · India time</p>
      </div>
      <nav aria-label="Range">${rangeNav(range)}</nav>
    </header>
    <section class="cards">
      <article class="card"><p class="n">${num(stats.total)}</p><p class="l">Visits</p></article>
      <article class="card"><p class="n ember">${num(stats.sources.linkedin)}</p><p class="l">LinkedIn</p></article>
      <article class="card"><p class="n x">${num(stats.sources.x)}</p><p class="l">X</p></article>
    </section>
    <h2>Visits by day</h2>
    <div class="panel">
      ${lineChart(stats)}
      <div class="chart-legend">${legend}</div>
    </div>
    <div class="split">
      <div>
        <h2>Sources</h2>
        <div class="panel">${donut(stats)}</div>
      </div>
      <div>
        <h2>Devices</h2>
        <div class="panel">${deviceBar(stats)}</div>
      </div>
    </div>
    <h2>Top pages</h2>
    <div class="panel">${pagesTable(stats)}</div>
    <h2>Campaigns</h2>
    <div class="panel">${campaignsTable(stats)}</div>
    <h2>Countries</h2>
    <div class="panel">${countriesTable(stats)}</div>
    <h2>Last 30 minutes</h2>
    <div class="panel">${liveTable(live)}</div>
    <footer>
      <p>No cookies and no IP addresses. Country is Cloudflare’s request country code.</p>
      <p>Tagged link: <code>https://omnaidu.com/&lt;path&gt;?utm_source=linkedin&amp;utm_medium=social&amp;utm_campaign=&lt;slug&gt;</code></p>
    </footer>
  </main>
</body>
</html>`
}
