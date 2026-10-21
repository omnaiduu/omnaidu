import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { presentedToken, secretsMatch } from './auth.ts'
import { renderStats } from './stats-html.ts'
import { VISIT_JS, VISIT_JS_MAX_BYTES } from './visit-js.ts'
import {
  buildStats,
  buildVisit,
  classifySource,
  cleanPath,
  cleanUtm,
  countryCode,
  countryName,
  dayKey,
  deviceType,
  isBot,
  isPrefetch,
  originsMatch,
  rangeStart,
  referrerHost,
  sourceBucket,
  taggedUrl,
  type VisitRecord,
} from './visits.ts'

const CHROME =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
const IPHONE =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'

function row(partial: Partial<VisitRecord> & Pick<VisitRecord, 'ts' | 'source'>): VisitRecord {
  return {
    path: '/',
    device: 'desktop',
    country: null,
    utmCampaign: null,
    ...partial,
  }
}

describe('source classification', () => {
  it('prefers utm_source over the referrer', () => {
    assert.equal(classifySource('linkedin', 'google.com'), 'linkedin')
    assert.equal(classifySource('newsletter', 'linkedin.com'), 'newsletter')
  })

  it('maps linkedin, x, and google referrers', () => {
    assert.equal(classifySource(null, 'linkedin.com'), 'linkedin')
    assert.equal(classifySource(null, 'lnkd.in'), 'linkedin')
    assert.equal(classifySource(null, 'm.linkedin.com'), 'linkedin')
    assert.equal(classifySource(null, 't.co'), 'x')
    assert.equal(classifySource(null, 'x.com'), 'x')
    assert.equal(classifySource(null, 'mobile.twitter.com'), 'x')
    assert.equal(classifySource(null, 'google.com'), 'search')
    assert.equal(classifySource(null, 'google.co.in'), 'search')
    assert.equal(classifySource(null, 'news.google.com'), 'search')
  })

  it('keeps other hosts and treats a missing referrer as direct', () => {
    assert.equal(classifySource(null, null), 'direct')
    assert.equal(classifySource(null, 'github.com'), 'github.com')
    assert.equal(sourceBucket('github.com'), 'other')
    assert.equal(sourceBucket('linkedin'), 'linkedin')
  })

  it('canonicalizes a few utm aliases', () => {
    assert.equal(classifySource('twitter', null), 'x')
    assert.equal(classifySource('lnkd.in', null), 'linkedin')
    assert.equal(classifySource('google', null), 'search')
  })

  it('drops same-site referrers', () => {
    assert.equal(referrerHost('https://omnaidu.com/blog/x', 'omnaidu.com'), null)
    assert.equal(referrerHost('https://www.linkedin.com/feed/', 'omnaidu.com'), 'linkedin.com')
    assert.equal(referrerHost('https://localhost:3000/', 'localhost:3000'), null)
  })
})

describe('visit fields', () => {
  it('cleans paths and utm values', () => {
    assert.equal(cleanPath('/blog/hello/?utm_source=linkedin'), '/blog/hello')
    assert.equal(cleanPath('https://evil.example/'), null)
    assert.equal(cleanPath('/admin/stats'), '/admin/stats')
    assert.equal(cleanUtm(' LinkedIn '), 'linkedin')
    assert.equal(cleanUtm('has space'), null)
  })

  it('classifies a linkedin-tagged phone visit and skips bots', () => {
    const visit = buildVisit({
      path: '/?utm_source=linkedin',
      referrer: 'https://www.linkedin.com/',
      utmSource: 'linkedin',
      utmMedium: 'social',
      utmCampaign: 'hello',
      userAgent: IPHONE,
      country: 'IN',
      pageHost: 'omnaidu.com',
    })
    assert.deepEqual(visit, {
      path: '/',
      referrerHost: 'linkedin.com',
      utmSource: 'linkedin',
      utmMedium: 'social',
      utmCampaign: 'hello',
      device: 'phone',
      source: 'linkedin',
      country: 'IN',
    })
    assert.equal(
      buildVisit({
        path: '/',
        referrer: '',
        utmSource: 'linkedin',
        utmMedium: null,
        utmCampaign: null,
        userAgent: 'curl/8.7.1',
        country: null,
        pageHost: 'omnaidu.com',
      }),
      null,
    )
  })

  it('splits phone and desktop from the user agent without storing it', () => {
    assert.equal(deviceType(IPHONE), 'phone')
    assert.equal(deviceType('Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15'), 'phone')
    assert.equal(deviceType(CHROME), 'desktop')
    assert.equal(isBot(''), true)
    assert.equal(isBot('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'), true)
    assert.equal(isBot(CHROME), false)
  })

  it('reads a country code and ignores unknown', () => {
    assert.equal(countryCode('in'), 'IN')
    assert.equal(countryCode('XX'), null)
    assert.equal(countryCode('USA'), null)
    assert.equal(countryName('IN'), 'India')
    assert.equal(countryName(null), 'Unknown')
  })

  it('builds the tagged link used in posts', () => {
    assert.equal(
      taggedUrl('/blog/hello', 'hello'),
      'https://omnaidu.com/blog/hello?utm_source=linkedin&utm_medium=social&utm_campaign=hello',
    )
    assert.equal(
      taggedUrl('/about', 'launch', { source: 'x', medium: 'social' }),
      'https://omnaidu.com/about?utm_source=x&utm_medium=social&utm_campaign=launch',
    )
  })
})

describe('stats window', () => {
  const now = new Date('2026-10-21T04:00:00.000Z')

  it('starts today at midnight in India', () => {
    assert.equal(dayKey(now), '2026-10-21')
    assert.equal(rangeStart('today', now).toISOString(), '2026-10-20T18:30:00.000Z')
  })

  it('counts linkedin inside the window and buckets the series', () => {
    const stats = buildStats(
      [
        row({ ts: '2026-10-20T12:00:00.000Z', source: 'direct', path: '/old' }),
        row({
          ts: '2026-10-20T19:00:00.000Z',
          source: 'linkedin',
          path: '/blog/hello',
          device: 'phone',
          country: 'IN',
          utmCampaign: 'hello',
        }),
        row({ ts: '2026-10-21T03:00:00.000Z', source: 'x', path: '/', device: 'desktop', country: 'US' }),
      ],
      'today',
      now,
    )
    assert.equal(stats.total, 2)
    assert.equal(stats.sources.linkedin, 1)
    assert.equal(stats.sources.x, 1)
    assert.equal(stats.devices.phone, 1)
    assert.equal(stats.devices.desktop, 1)
    assert.equal(stats.pages[0]?.path, '/')
    assert.equal(stats.campaigns[0]?.campaign, 'hello')
    assert.equal(stats.campaigns[0]?.counts.linkedin, 1)
    assert.equal(stats.countries.some((country) => country.code === 'IN'), true)
    assert.ok(stats.series.linkedin.some((value) => value === 1))
  })
})

describe('stats page', () => {
  it('renders the dashboard charts and escapes text', () => {
    const now = new Date('2026-10-21T04:00:00.000Z')
    const stats = buildStats(
      [
        row({
          ts: '2026-10-21T03:00:00.000Z',
          source: 'linkedin',
          path: '/blog/hello',
          device: 'phone',
          country: 'IN',
          utmCampaign: 'hello',
        }),
      ],
      '7d',
      now,
    )
    const html = renderStats(
      stats,
      [
        row({
          ts: '2026-10-21T03:30:00.000Z',
          source: 'linkedin',
          path: '/blog/hello',
          device: 'phone',
          country: 'IN',
          utmCampaign: 'hello',
        }),
      ],
      '7d',
    )
    assert.match(html, /class="n ember">1</)
    assert.match(html, /class="n x">0</)
    assert.match(html, /India/)
    assert.match(html, /stroke="#ff6a2a"/)
    assert.match(html, /aria-label="Visits per day by source"/)
    assert.match(html, /hello/)
    assert.match(html, /Last 30 minutes/)

    const evil = buildStats(
      [row({ ts: '2026-10-21T03:00:00.000Z', source: 'linkedin', path: '/a&b<script>', utmCampaign: '<script>' })],
      'today',
      now,
    )
    const escaped = renderStats(evil, [], 'today')
    assert.equal(escaped.includes('<script>'), false)
    assert.match(escaped, /\/a&amp;b&lt;script&gt;/)
    assert.match(escaped, /&lt;script&gt;/)
  })
})

describe('beacon and auth', () => {
  it('keeps the public beacon under 1KB and cookieless', () => {
    assert.ok(Buffer.byteLength(VISIT_JS) < VISIT_JS_MAX_BYTES)
    assert.equal(/cookie|localStorage|sessionStorage|indexedDB|fingerprint/i.test(VISIT_JS), false)
    assert.match(VISIT_JS, /sendBeacon/)
    assert.match(VISIT_JS, /pushState/)
  })

  it('reads the stats token from basic, bearer, or the header', () => {
    const basic = new Request('https://omnaidu.com/admin/stats', {
      headers: { authorization: `Basic ${btoa('om:dev-stats-token')}` },
    })
    const bearer = new Request('https://omnaidu.com/admin/stats', {
      headers: { authorization: 'Bearer dev-stats-token' },
    })
    const header = new Request('https://omnaidu.com/admin/stats', {
      headers: { 'x-stats-token': 'dev-stats-token' },
    })
    assert.equal(presentedToken(basic), 'dev-stats-token')
    assert.equal(presentedToken(bearer), 'dev-stats-token')
    assert.equal(presentedToken(header), 'dev-stats-token')
  })

  it('matches the token without a length shortcut', async () => {
    assert.equal(await secretsMatch('dev-stats-token', 'dev-stats-token'), true)
    assert.equal(await secretsMatch('nope', 'dev-stats-token'), false)
    assert.equal(await secretsMatch('', 'dev-stats-token'), false)
  })

  it('ignores prefetch and cross-site posts', () => {
    const prefetch = new Request('https://omnaidu.com/api/visit', { headers: { purpose: 'prefetch' } })
    assert.equal(isPrefetch(prefetch), true)
    assert.equal(originsMatch('omnaidu.com', 'https://omnaidu.com', null), true)
    assert.equal(originsMatch('omnaidu.com', 'https://evil.example', null), false)
    assert.equal(originsMatch('localhost:3000', 'http://localhost:3000', null), true)
  })
})
