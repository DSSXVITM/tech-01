-- Phase 2 addenda: comments keyed by article slug (works for static + DB
-- articles) and a plain tags CSV column on articles for the admin CMS.
-- Apply with:  npx wrangler d1 migrations apply <db> --remote

ALTER TABLE comments ADD COLUMN article_slug TEXT DEFAULT '';
CREATE INDEX IF NOT EXISTS idx_comments_article_slug ON comments(article_slug, status);

ALTER TABLE articles ADD COLUMN tags_csv TEXT DEFAULT '';
