-- ============================================================
-- AI Tech — Cloudflare D1 (SQLite) schema
-- Phase 2: auth + admin panel + analytics.
-- Apply with:  npx wrangler d1 migrations apply <db> --remote
-- Or migrate to any Postgres (Supabase/Neon) — tables map 1:1.
-- ============================================================

-- ---------- Users & auth ----------
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,                -- crypto.randomUUID()
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL DEFAULT '',
  password_hash TEXT,                            -- null for OAuth-only users
  role          TEXT NOT NULL DEFAULT 'reader'   -- reader | author | editor | admin
    CHECK (role IN ('reader', 'author', 'editor', 'admin')),
  bio           TEXT DEFAULT '',
  avatar_key    TEXT DEFAULT '',
  banned_at     TEXT,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at    TEXT NOT NULL,
  ip            TEXT DEFAULT '',
  user_agent    TEXT DEFAULT '',
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier    TEXT NOT NULL,
  token         TEXT PRIMARY KEY,
  expires_at    TEXT NOT NULL
);

-- ---------- Taxonomy ----------
CREATE TABLE IF NOT EXISTS categories (
  slug        TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT DEFAULT '',
  color       TEXT DEFAULT '#3B5BFF',
  position    INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS authors (
  slug       TEXT PRIMARY KEY,
  user_id    TEXT REFERENCES users(id) ON DELETE SET NULL,
  name       TEXT NOT NULL,
  role       TEXT DEFAULT '',
  bio        TEXT DEFAULT '',
  avatar_key TEXT DEFAULT ''
);

-- ---------- Articles ----------
CREATE TABLE IF NOT EXISTS articles (
  id             TEXT PRIMARY KEY,
  slug           TEXT NOT NULL UNIQUE,
  title          TEXT NOT NULL,
  excerpt        TEXT DEFAULT '',
  category_slug  TEXT NOT NULL REFERENCES categories(slug),
  author_slug    TEXT REFERENCES authors(slug),
  status         TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'scheduled', 'published', 'unpublished')),
  status_tag     TEXT,                          -- live | breaking | updated | trending
  is_featured    INTEGER NOT NULL DEFAULT 0,    -- SQLite boolean
  trending_rank  INTEGER,
  sponsored      INTEGER NOT NULL DEFAULT 0,
  affiliate_catalog TEXT,                       -- key into affiliate catalog table
  affiliate_disclosed INTEGER NOT NULL DEFAULT 0,
  content_json   TEXT NOT NULL,                 -- ContentBlock[] (see src/content/types.ts)
  sources_json   TEXT NOT NULL DEFAULT '[]',    -- ArticleSource[]
  image_json     TEXT DEFAULT '{}',             -- ArticleImage
  seo_title      TEXT DEFAULT '',
  seo_description TEXT DEFAULT '',
  published_at   TEXT,
  updated_at     TEXT,
  view_count     INTEGER NOT NULL DEFAULT 0,
  created_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_slug, status);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(status, published_at);

CREATE TABLE IF NOT EXISTS tags (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS article_tags (
  article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_slug   TEXT NOT NULL REFERENCES tags(slug) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_slug)
);

-- ---------- Reader engagement ----------
CREATE TABLE IF NOT EXISTS saved_articles (
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  PRIMARY KEY (user_id, article_id)
);

CREATE TABLE IF NOT EXISTS reading_history (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  viewed_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_reading_history_user ON reading_history(user_id, viewed_at);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id        TEXT PRIMARY KEY,
  email     TEXT NOT NULL UNIQUE,
  status    TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source    TEXT DEFAULT '',                    -- home | article | category | sponsor
  locale    TEXT DEFAULT 'en',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS comments (
  id          TEXT PRIMARY KEY,
  article_id  TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_id     TEXT REFERENCES users(id) ON DELETE SET NULL,
  parent_id   TEXT REFERENCES comments(id) ON DELETE CASCADE,
  body        TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'hidden')),
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_comments_article ON comments(article_id, status);

-- ---------- Analytics & monetization ----------
CREATE TABLE IF NOT EXISTS pageviews (
  id         TEXT PRIMARY KEY,
  path       TEXT NOT NULL,
  country    TEXT DEFAULT '',
  device     TEXT DEFAULT '',                   -- mobile | desktop | tablet
  referrer   TEXT DEFAULT '',
  locale     TEXT DEFAULT 'en',
  view_date  TEXT NOT NULL,                     -- YYYY-MM-DD (for daily rollups)
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_pageviews_date ON pageviews(view_date);
CREATE INDEX IF NOT EXISTS idx_pageviews_path ON pageviews(path);

CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id         TEXT PRIMARY KEY,
  article_id TEXT REFERENCES articles(id) ON DELETE SET NULL,
  product    TEXT NOT NULL,
  url        TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- ---------- Affiliate catalog (Phase 2: admin-managed) ----------
CREATE TABLE IF NOT EXISTS affiliate_products (
  catalog  TEXT NOT NULL,
  name     TEXT NOT NULL,
  tagline  TEXT DEFAULT '',
  rating   REAL DEFAULT 0,
  price    TEXT DEFAULT '',
  best_for TEXT DEFAULT '',
  url      TEXT NOT NULL,
  badge    TEXT DEFAULT '',
  pros_json TEXT DEFAULT '[]',
  cons_json TEXT DEFAULT '[]',
  position INTEGER DEFAULT 0,
  PRIMARY KEY (catalog, name)
);

-- ---------- Seed taxonomy ----------
INSERT OR IGNORE INTO categories (slug, name, color, position) VALUES
  ('ai',        'AI',             '#3B5BFF', 1),
  ('software',  'Software',       '#7C5CFF', 2),
  ('security',  'Cybersecurity',  '#2FBF8F', 3),
  ('gadgets',   'Gadgets',        '#FF7A59', 4),
  ('cloud',     'Cloud & Hosting','#3BB4FF', 5),
  ('reviews',   'Reviews',        '#FFB020', 6),
  ('guides',    'How-To Guides',  '#4AD2A6', 7);
