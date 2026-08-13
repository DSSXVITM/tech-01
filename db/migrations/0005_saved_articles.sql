-- Saved articles: keyed by article_slug so static AND CMS articles both work
-- (static articles have no row in the `articles` table, so a slug key is the
-- only stable reference). Apply with: npx wrangler d1 migrations apply <db> --remote
ALTER TABLE saved_articles RENAME TO saved_articles_old;
CREATE TABLE saved_articles (
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  article_slug TEXT NOT NULL,
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  PRIMARY KEY (user_id, article_slug)
);
INSERT INTO saved_articles (user_id, article_slug, created_at)
  SELECT s.user_id, a.slug, s.created_at
    FROM saved_articles_old s
    LEFT JOIN articles a ON a.id = s.article_id
   WHERE a.slug IS NOT NULL;
DROP TABLE saved_articles_old;
CREATE INDEX IF NOT EXISTS idx_saved_articles_user ON saved_articles(user_id, created_at);
