-- Profile pictures: users can upload a photo, stored as a base64 data URI.
-- Kept in the DB (like article covers) so it works on D1 without any blob
-- storage. Sized/validated server-side; empty string = no picture.
-- Apply with:  npx wrangler d1 migrations apply <db> --remote
ALTER TABLE users ADD COLUMN avatar_data TEXT NOT NULL DEFAULT '';
