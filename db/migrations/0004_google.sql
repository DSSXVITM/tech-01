-- Google Sign-In: link accounts to a Google subject id.
-- Apply with:  npx wrangler d1 migrations apply <db> --remote
ALTER TABLE users ADD COLUMN google_sub TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_sub ON users(google_sub);
