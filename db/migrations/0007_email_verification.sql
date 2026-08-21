-- Email verification for new registrations.
ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN verification_token TEXT;
ALTER TABLE users ADD COLUMN verification_token_expires TEXT;  -- epoch ms
ALTER TABLE users ADD COLUMN verified_at TEXT;

-- Accounts created before verification existed were already active, so mark
-- them verified to avoid locking anyone out. New rows default to 0.
UPDATE users SET email_verified = 1 WHERE email_verified = 0;
