CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  abstract TEXT NOT NULL,
  body TEXT NOT NULL,
  tag TEXT NOT NULL,
  published_at TEXT NOT NULL,
  demo_url TEXT,
  poster_url TEXT,
  repo TEXT,
  proof_tests TEXT,
  proof_benches TEXT,
  reading_minutes INTEGER NOT NULL DEFAULT 6,
  status TEXT NOT NULL DEFAULT 'published'
);

CREATE INDEX IF NOT EXISTS idx_posts_tag ON posts(tag);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published_at DESC);

CREATE TABLE IF NOT EXISTS visits (
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
);

CREATE INDEX IF NOT EXISTS idx_visits_ts ON visits(ts);
CREATE INDEX IF NOT EXISTS idx_visits_source_ts ON visits(source, ts);
