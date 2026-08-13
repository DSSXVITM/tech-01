-- Threaded comments + comment voting.
-- Rebuilds `comments` so every comment is tied to an article slug (static and
-- CMS articles both work) and adds a comment_votes table for up/down voting.
-- Apply with:  npx wrangler d1 migrations apply <db> --remote

-- Rebuild comments so article_slug is the primary key (article_id stays for
-- CMS articles that have one, but is no longer required).
ALTER TABLE comments RENAME TO comments_old;
CREATE TABLE comments (
  id           TEXT PRIMARY KEY,
  article_slug TEXT NOT NULL DEFAULT '',
  article_id   TEXT REFERENCES articles(id) ON DELETE CASCADE,
  user_id      TEXT REFERENCES users(id) ON DELETE SET NULL,
  parent_id    TEXT REFERENCES comments(id) ON DELETE CASCADE,
  body         TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'hidden')),
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
INSERT INTO comments (id, article_slug, article_id, user_id, parent_id, body, status, created_at)
  SELECT id, article_slug, article_id, user_id, parent_id, body, status, created_at FROM comments_old;
DROP TABLE comments_old;
CREATE INDEX IF NOT EXISTS idx_comments_article_slug ON comments(article_slug, status);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);

-- Vote table (created after the rebuild so its FK points at the new comments).
CREATE TABLE IF NOT EXISTS comment_votes (
  comment_id TEXT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  value      INTEGER NOT NULL,                -- +1 upvote, -1 downvote
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  PRIMARY KEY (comment_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_comment_votes_comment ON comment_votes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_votes_user ON comment_votes(user_id);
