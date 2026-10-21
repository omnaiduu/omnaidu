import { env } from 'cloudflare:workers'
import type { VisitRecord } from './visits'

// Keep this in sync with schema.sql. CREATE IF NOT EXISTS is safe to re-run.
const DDL = [
  `CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts TEXT NOT NULL,
    path TEXT NOT NULL,
    referrer_host TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    device TEXT NOT NULL,
    source TEXT NOT NULL,
    country TEXT
  )`,
  `CREATE INDEX IF NOT EXISTS idx_visits_ts ON visits(ts)`,
  `CREATE INDEX IF NOT EXISTS idx_visits_source_ts ON visits(source, ts)`,
]

type VisitSqlRow = {
  ts: string
  path: string
  source: string
  device: string
  country: string | null
  utm_campaign: string | null
}

let ready = false

function hasDb() {
  try {
    return Boolean(env && 'DB' in env && env.DB)
  } catch {
    return false
  }
}

export async function ensureVisits() {
  if (ready || !hasDb()) return
  for (const sql of DDL) await env.DB.prepare(sql).run()
  ready = true
}

export async function insertVisit(row: {
  path: string
  referrerHost: string | null
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  device: string
  source: string
  country: string | null
}) {
  await ensureVisits()
  if (!hasDb()) return
  await env.DB.prepare(
    `INSERT INTO visits (
      ts, path, referrer_host, utm_source, utm_medium, utm_campaign, device, source, country
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      new Date().toISOString(),
      row.path,
      row.referrerHost,
      row.utmSource,
      row.utmMedium,
      row.utmCampaign,
      row.device,
      row.source,
      row.country,
    )
    .run()
}

function mapRow(row: VisitSqlRow): VisitRecord {
  return {
    ts: row.ts,
    path: row.path,
    source: row.source,
    device: row.device,
    country: row.country ?? null,
    utmCampaign: row.utm_campaign ?? null,
  }
}

export async function visitsSince(iso: string): Promise<VisitRecord[]> {
  await ensureVisits()
  if (!hasDb()) return []
  const { results } = await env.DB.prepare(
    `SELECT ts, path, source, device, country, utm_campaign
     FROM visits WHERE ts >= ? ORDER BY ts ASC`,
  )
    .bind(iso)
    .all<VisitSqlRow>()
  return (results ?? []).map(mapRow)
}

export async function recentVisits(iso: string, limit = 40): Promise<VisitRecord[]> {
  await ensureVisits()
  if (!hasDb()) return []
  const { results } = await env.DB.prepare(
    `SELECT ts, path, source, device, country, utm_campaign
     FROM visits WHERE ts >= ? ORDER BY ts DESC LIMIT ?`,
  )
    .bind(iso, limit)
    .all<VisitSqlRow>()
  return (results ?? []).map(mapRow)
}
