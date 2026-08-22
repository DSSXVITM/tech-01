-- Password reset tokens (kept separate from email-verification tokens).
ALTER TABLE users ADD COLUMN reset_token TEXT;
ALTER TABLE users ADD COLUMN reset_token_expires TEXT;  -- epoch ms
