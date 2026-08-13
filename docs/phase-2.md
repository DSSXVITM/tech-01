# Phase 2 — Auth, Admin Panel, Database, Analytics

Phase 1 ships a fully static, SEO-strong news site with zero backend. Phase 2
turns on the editorial machine: accounts, an admin panel, and a real database.

## Goals (from the brief)

1. **Auth** — sign up / log in for readers and staff (email+password first,
   Google/GitHub OAuth after launch). Roles: reader → author → editor → admin.
2. **Admin panel** — manage articles (create/edit/publish/schedule), authors,
   categories, users, and read analytics. Enforced at the auth layer.
3. **Database** — Cloudflare D1 (SQLite) as the primary store; the schema is
   intentionally SQLite-compatible so the same tables can move to Postgres
   (Supabase/Neon) if the project scales out of D1.
4. **Analytics** — first-party pageview tracking (no GA dependency): daily
   pageviews, top articles, countries, devices, referrers. Plus affiliate
   click tracking and newsletter subscriber counts.
5. **Monetization hooks** — write path for the affiliate catalog; affiliate
   clicks attribution table already seeded in the schema.

## Status — done

### Database (D1, local wired; remote pending login)

- `wrangler.jsonc` — Cloudflare Workers config for the OpenNext adapter with
  the `DB` D1 binding **enabled** and `compatibility_date: "2026-08-08"`.
  Replace the placeholder `database_id` before remote deploy.
- `db/migrations/0001_schema.sql` — full D1 schema: users, sessions,
  verification_tokens, categories, authors, articles, tags, article_tags,
  saved_articles, reading_history, newsletter_subscribers, comments,
  pageviews, affiliate_clicks, affiliate_products. Applied locally (7
  categories seeded).
- `src/lib/db/client.ts` — `getDB()`: Cloudflare runtime → real D1 binding;
  plain Node (`next dev`) → `node:sqlite` shim on `.data/local.sqlite` with
  the same D1-shaped interface.
- `src/lib/db/local-sqlite.ts` — local SQLite backend bootstrapped from the
  same migration file.
- `npm run cf-typegen` regenerates `cloudflare-env.d.ts` (types `DB` + `ASSETS`).

### Auth (custom, dependency-free)

- `src/lib/db/auth.ts` — real auth on Web Crypto: PBKDF2-SHA256 password
  hashes (format `pbkdf2$salt$hash`, 100k iterations), HMAC-SHA256 signed
  session tokens, httpOnly `aitech_session` cookie (30 days), `getSession`,
  `requireRole` / `requireAdmin`.
- API: `POST /api/auth/register`, `POST /api/auth/login`,
  `POST /api/auth/logout` (303 redirect for HTML forms), `GET /api/auth/me`.
- Pages: `/login` and `/register` wired to client forms
  (`src/components/auth/*`). Register creates reader accounts; login sets the
  session cookie; banned users are rejected by `getSession`.
- Admin users are seeded with:
  ```bash
  npm run seed:admin                    # admin@aitech.media / Admin2026!
  npm run seed:admin -- you@site.com pass
  npx wrangler d1 execute aitech-db --remote --file=db/seeds/admin.sql
  ```
  The script writes `db/seeds/admin.sql` (gitignored) for Cloudflare D1.

### Admin panel

- `src/app/admin/layout.tsx` — server-side gate via `getSession()` + role
  check: signed-out users see a sign-in screen, non-admins are redirected
  home. The old `AITECH_PHASE2` preview switch is **gone**.
- Dashboard (live user count from D1), `/admin/articles`,
  `/admin/users` (real rows from the `users` table), `/admin/analytics`
  (placeholder until the analytics pipeline ships).

## Roadmap

### 1. Remote database (pending `npx wrangler login`)

```bash
npx wrangler login
npx wrangler d1 create aitech-db        # paste database_id into wrangler.jsonc
npx wrangler d1 migrations apply aitech-db --remote
npx wrangler d1 execute aitech-db --remote --file=db/seeds/admin.sql
```

### 2. Admin content management

- `GET/POST /api/articles`, `PUT /api/articles/[id]`,
  `DELETE /api/articles/[id]` — route handlers guarded by `requireAdmin`
  (`editor` for writes, `admin` for delete).
- Editor UI on `/admin/articles/[slug]/edit`: blocks map to `ContentBlock[]`
  (`src/content/types.ts`); publish/schedule/draft states stored in
  `articles.status`.
- Wire `/admin/articles` table + dashboard stats to the D1 repository.
- Swap `src/lib/db/repository.ts` to the D1 implementation — templates
  unchanged (they already consume the same interface).

### 3. Analytics pipeline

- `POST /api/v` — client beacon (pageview, locale, referrer, device via UA
  bucket, country via `CF-IPCountry` header). Written to `pageviews`.
- Admin `/admin/analytics` — daily totals, top articles, countries, devices.
- Affiliate clicks: `POST /api/affiliate/click` → `affiliate_clicks`.
- Newsletter: replace the local-storage MVP with a provider API + store
  rows in `newsletter_subscribers`.

### 4. Users & moderation

- `/admin/users` — change roles, ban (sets `banned_at`; `getSession` rejects
  banned users).
- Comments moderation (`comments.status`), spam flags.

## Data layer contract

`src/lib/db/repository.ts` defines `ContentRepository`:

- `getArticles(): Article[]`
- `getAuthors(): Author[]`
- `getCategories(): Category[]`
- `getAffiliateProducts(catalog?: string): AffiliateProductData[]`

The D1 implementation returns rows mapped to the same `Article`/`Author`/
`Category` types (`src/content/types.ts`), so pages stay untouched. Prefer
generated column accessors over `env.DB.prepare()` inline queries.

## Conventions

- **Server-only auth**: every `/admin` route and API handler checks the
  session at the server. Never gate by hiding UI alone.
- **Secrets**: `AUTH_SECRET`, OAuth keys, DB credentials live in Cloudflare
  Variables (or `.dev.vars` / `.env` for local), never in the repo.
  `.env*` and `.dev.vars` are gitignored.
- **Build checks**: `npm run lint` then `npm run build` before any feature
  ships; `npm run preview` verifies the Cloudflare bundle.
