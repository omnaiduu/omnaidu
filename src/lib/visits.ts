export const TZ = 'Asia/Kolkata'

export const BUCKETS = ['linkedin', 'x', 'search', 'direct', 'other'] as const
export type Bucket = (typeof BUCKETS)[number]
export type RangeKey = 'today' | '7d' | '30d'
export type Device = 'phone' | 'desktop'

export const BUCKET_LABEL: Record<Bucket, string> = {
  linkedin: 'LinkedIn',
  x: 'X',
  search: 'Search',
  direct: 'Direct',
  other: 'Other',
}

const UTM_ALIAS: Record<string, string> = {
  lnkd: 'linkedin',
  'lnkd.in': 'linkedin',
  twitter: 'x',
  'twitter.com': 'x',
  'x.com': 'x',
  't.co': 'x',
  google: 'search',
}

const BOT_UA =
  /bot\b|crawl|spider|slurp|facebookexternalhit|whatsapp|embedly|slackbot|discordbot|telegrambot|headless|phantom|wget|curl\/|python-requests|go-http-client|scrapy|lighthouse|pagespeed|pingdom|uptimerobot|ahrefs|semrush|petalbot|bytespider|gptbot|claudebot|amazonbot|applebot|bingbot|googlebot|duckduckbot|baiduspider|yandexbot|ia_archiver|prerender|libwww|okhttp|httpunit/i

export type VisitRecord = {
  ts: string
  path: string
  source: string
  device: string
  country: string | null
  utmCampaign: string | null
}

export type BuiltStats = {
  range: RangeKey
  total: number
  sources: Record<Bucket, number>
  series: Record<Bucket, number[]>
  days: string[]
  devices: Record<Device, number>
  pages: { path: string; n: number }[]
  campaigns: { campaign: string; counts: Record<Bucket, number>; total: number }[]
  countries: { code: string | null; n: number }[]
}

export function parseRange(value: string | null): RangeKey {
  if (value === 'today' || value === '7d' || value === '30d') return value
  return '7d'
}

export function dayKey(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function rangeStart(range: RangeKey, now = new Date()): Date {
  if (range === 'today') return new Date(`${dayKey(now)}T00:00:00+05:30`)
  const days = range === '30d' ? 30 : 7
  return new Date(now.getTime() - days * 86_400_000)
}

export function eachDay(start: Date, end: Date): string[] {
  const last = dayKey(end)
  const days: string[] = []
  let cursor = new Date(`${dayKey(start)}T12:00:00+05:30`)
  for (let i = 0; i < 40; i += 1) {
    const key = dayKey(cursor)
    days.push(key)
    if (key >= last) break
    cursor = new Date(cursor.getTime() + 86_400_000)
  }
  return days
}

export function cleanPath(value: unknown): string | null {
  if (typeof value !== 'string') return null
  let path = value.trim()
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\') || path.includes('://')) {
    return null
  }
  path = path.split(/[?#]/)[0] ?? ''
  try {
    path = decodeURI(path)
  } catch {
    return null
  }
  if (!path.startsWith('/') || path.includes('\0') || /[<>"']/.test(path)) return null
  path = path.replace(/\/{2,}/g, '/')
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
  if (!path || path.length > 200) return null
  return path
}

export function skipPath(path: string): boolean {
  if (/^\/(admin|api|mcp|og|files|assets|media)(\/|$)/.test(path)) return true
  return path === '/visit.js' || path === '/robots.txt' || path === '/sitemap.xml' || path === '/favicon.ico'
}

export function cleanUtm(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const cleaned = value.trim().toLowerCase()
  if (!cleaned || cleaned.length > 64) return null
  if (!/^[a-z0-9][a-z0-9._+-]*$/.test(cleaned)) return null
  return cleaned
}

export function referrerHost(referrer: string | null | undefined, pageHost: string | null): string | null {
  if (!referrer) return null
  let url: URL
  try {
    url = new URL(referrer)
  } catch {
    return null
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
  const host = url.hostname.toLowerCase().replace(/\.$/, '')
  if (!host || host === 'localhost' || host === '127.0.0.1') return null
  const bare = host.replace(/^www\./, '')
  if (bare === 'omnaidu.com' || bare === pageHostname(pageHost)) return null
  return bare
}

function pageHostname(pageHost: string | null): string {
  if (!pageHost) return ''
  try {
    return new URL(`http://${pageHost.trim()}`).hostname.replace(/^www\./, '').toLowerCase()
  } catch {
    return ''
  }
}

export function classifySource(utmSource: string | null, host: string | null): string {
  if (utmSource) return UTM_ALIAS[utmSource] ?? utmSource
  if (!host) return 'direct'
  const h = host.replace(/^www\./, '')
  if (h === 'linkedin.com' || h.endsWith('.linkedin.com') || h === 'lnkd.in' || h.endsWith('.lnkd.in')) {
    return 'linkedin'
  }
  if (
    h === 't.co' ||
    h.endsWith('.t.co') ||
    h === 'x.com' ||
    h.endsWith('.x.com') ||
    h === 'twitter.com' ||
    h.endsWith('.twitter.com')
  ) {
    return 'x'
  }
  if (h === 'google.com' || h.endsWith('.google.com') || /^google\.[a-z]{2,3}(\.[a-z]{2})?$/.test(h)) {
    return 'search'
  }
  return h
}

export function sourceBucket(source: string): Bucket {
  if (source === 'linkedin' || source === 'x' || source === 'search' || source === 'direct') return source
  return 'other'
}

export function sourceLabel(source: string): string {
  const bucket = sourceBucket(source)
  return bucket === 'other' ? source : BUCKET_LABEL[bucket]
}

export function deviceType(ua: string): Device {
  const s = ua.toLowerCase()
  if (/ipad|tablet|playbook|silk|android(?!.*mobile)/.test(s)) return 'phone'
  if (/mobi|iphone|ipod|phone|android/.test(s)) return 'phone'
  return 'desktop'
}

export function isBot(ua: string | null | undefined): boolean {
  if (!ua) return true
  const trimmed = ua.trim()
  if (trimmed.length < 12) return true
  return BOT_UA.test(trimmed)
}

export function isPrefetch(request: Request): boolean {
  const blob = [
    request.headers.get('purpose'),
    request.headers.get('sec-purpose'),
    request.headers.get('sec-fetch-purpose'),
    request.headers.get('x-purpose'),
    request.headers.get('x-moz'),
  ]
    .filter(Boolean)
    .join(' ')
  return /prefetch|prerender/i.test(blob)
}

export function originsMatch(pageHost: string | null, origin: string | null, referer: string | null): boolean {
  if (!pageHost) return false
  const candidate = origin || referer
  if (!candidate) return false
  try {
    return new URL(candidate).host === pageHost
  } catch {
    return false
  }
}

export function countryCode(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const code = value.trim().toUpperCase()
  if (!/^[A-Z]{2}$/.test(code) || code === 'XX') return null
  return code
}

const regions = new Intl.DisplayNames(['en'], { type: 'region' })

export function countryName(code: string | null): string {
  if (!code) return 'Unknown'
  if (code === 'T1') return 'Tor'
  try {
    return regions.of(code) ?? code
  } catch {
    return code
  }
}

export function taggedUrl(
  path: string,
  campaign: string,
  options?: { source?: string; medium?: string; origin?: string },
) {
  const url = new URL(path, options?.origin ?? 'https://omnaidu.com')
  url.searchParams.set('utm_source', options?.source ?? 'linkedin')
  url.searchParams.set('utm_medium', options?.medium ?? 'social')
  url.searchParams.set('utm_campaign', campaign)
  return url.toString()
}

function emptyCounts(): Record<Bucket, number> {
  return { linkedin: 0, x: 0, search: 0, direct: 0, other: 0 }
}

export function buildStats(rows: VisitRecord[], range: RangeKey, now = new Date()): BuiltStats {
  const start = rangeStart(range, now).getTime()
  const days = eachDay(new Date(start), now)
  const dayIndex = new Map(days.map((day, index) => [day, index]))
  const sources = emptyCounts()
  const series = {
    linkedin: days.map(() => 0),
    x: days.map(() => 0),
    search: days.map(() => 0),
    direct: days.map(() => 0),
    other: days.map(() => 0),
  } satisfies Record<Bucket, number[]>
  const devices: Record<Device, number> = { phone: 0, desktop: 0 }
  const pageMap = new Map<string, number>()
  const campaignMap = new Map<string, Record<Bucket, number>>()
  const countryMap = new Map<string, number>()

  for (const row of rows) {
    const when = new Date(row.ts).getTime()
    if (Number.isNaN(when) || when < start) continue
    const bucket = sourceBucket(row.source)
    sources[bucket] += 1
    const index = dayIndex.get(dayKey(new Date(when)))
    if (index !== undefined) series[bucket][index] += 1
    devices[row.device === 'desktop' ? 'desktop' : 'phone'] += 1
    pageMap.set(row.path, (pageMap.get(row.path) ?? 0) + 1)
    if (row.utmCampaign) {
      const counts = campaignMap.get(row.utmCampaign) ?? emptyCounts()
      counts[bucket] += 1
      campaignMap.set(row.utmCampaign, counts)
    }
    countryMap.set(row.country ?? '', (countryMap.get(row.country ?? '') ?? 0) + 1)
  }

  const pages = [...pageMap.entries()]
    .map(([path, n]) => ({ path, n }))
    .sort((a, b) => b.n - a.n || a.path.localeCompare(b.path))
    .slice(0, 12)

  const campaigns = [...campaignMap.entries()]
    .map(([campaign, counts]) => ({
      campaign,
      counts,
      total: BUCKETS.reduce((sum, bucket) => sum + counts[bucket], 0),
    }))
    .sort((a, b) => b.total - a.total || a.campaign.localeCompare(b.campaign))
    .slice(0, 20)

  const countries = [...countryMap.entries()]
    .map(([code, n]) => ({ code: code || null, n }))
    .sort((a, b) => b.n - a.n || (a.code ?? '').localeCompare(b.code ?? ''))
    .slice(0, 10)

  return {
    range,
    total: BUCKETS.reduce((sum, bucket) => sum + sources[bucket], 0),
    sources,
    series,
    days,
    devices,
    pages,
    campaigns,
    countries,
  }
}

export function buildVisit(input: {
  path: unknown
  referrer: unknown
  utmSource: unknown
  utmMedium: unknown
  utmCampaign: unknown
  userAgent: string | null
  country: string | null
  pageHost: string | null
}) {
  if (isBot(input.userAgent)) return null
  const path = cleanPath(input.path)
  if (!path || skipPath(path)) return null
  const utmSource = cleanUtm(input.utmSource)
  const utmMedium = cleanUtm(input.utmMedium)
  const utmCampaign = cleanUtm(input.utmCampaign)
  const host = referrerHost(typeof input.referrer === 'string' ? input.referrer : null, input.pageHost)
  return {
    path,
    referrerHost: host,
    utmSource,
    utmMedium,
    utmCampaign,
    device: deviceType(input.userAgent ?? ''),
    source: classifySource(utmSource, host),
    country: input.country,
  }
}
