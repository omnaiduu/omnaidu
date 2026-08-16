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
