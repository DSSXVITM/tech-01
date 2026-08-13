-- ============================================================
-- TechHow — how-to/tutorial rebrand (Phase 2 follow-up)
-- 1) Add tutorial metadata column to articles (JSON: difficulty,
--    time_minutes, prerequisites, learn).
-- 2) Re-seed taxonomy as tutorial categories.
-- ============================================================

ALTER TABLE articles ADD COLUMN tutorial_json TEXT DEFAULT NULL;

INSERT INTO categories (slug, name, description, color, position) VALUES
  ('windows',  'Windows',        'Set up, customize and troubleshoot Windows.',        '#3B5BFF', 1),
  ('macos',    'macOS',          'Master your Mac — backups, Terminal and workflows.', '#5B8DEF', 2),
  ('hardware', 'Hardware',       'Build, upgrade and fix PCs.',                        '#FF7A59', 3),
  ('software', 'Software',       'Everyday apps, installs and workflows.',             '#7C5CFF', 4),
  ('internet', 'Internet',       'Wi-Fi, routers and home networking.',                '#3BB4FF', 5),
  ('security', 'Security',       'Passwords, 2FA, privacy and safe habits.',           '#2FBF8F', 6),
  ('coding',   'Coding',         'Learn to code from the ground up.',                  '#FFB020', 7),
  ('ai',       'AI & Automation','Use AI tools safely and productively.',              '#FF5CA8', 8)
ON CONFLICT(slug) DO UPDATE SET
  name = excluded.name,
  description = excluded.description,
  color = excluded.color,
  position = excluded.position;
