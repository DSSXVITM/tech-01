# AI Tech — AI & Tech News Platform

A broadcast-styled technology news and tools site built with Next.js 16
(App Router), TypeScript, Tailwind v4, and deployed to **Cloudflare
(Workers/Pages)** via the OpenNext adapter.

- **Phase 1 (done):** fully static, SEO-strong public site — live feeds,
  trending, categories, articles, comparison tables, affiliate disclosure,
  free client-side tools, sitemap/robots/OG images.
- **Phase 2 (in progress):** auth, admin panel, D1 database, first-party
  analytics. Plan: [`docs/phase-2.md`](docs/phase-2.md).

## Local development

```bash
npm install
npm run dev
```

Phase 1 needs no environment variables. `.env.example` documents Phase 2+
variables (auth secret, database, analytics).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Next.js dev server (localhost:3000) |
| `npm run build` | Production build (Turbopack) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run preview` | OpenNext build + local Cloudflare preview (Wrangler) |
| `npm run deploy` | OpenNext build + deploy to Cloudflare Workers |
| `npm run cf-typegen` | Regenerate `cloudflare-env.d.ts` from `wrangler.jsonc` |

## Deployment (Cloudflare)

This project deploys as a Cloudflare Worker with static assets, using the
OpenNext for Cloudflare adapter. Configure once:

```bash
npx wrangler login
npm run deploy
```

For previews against the Cloudflare runtime:

```bash
npm run preview
```

Notes:

- `wrangler.jsonc` — worker entry (`.open-next/worker.js`), assets binding,
  `nodejs_compat` compatibility flag.
- Phase 2 database (D1): create `aitech-db`, paste its `database_id` into
  the `d1_databases` block, apply migrations. See `docs/phase-2.md`.
- Secrets (e.g. `AUTH_SECRET`) are stored as Cloudflare Variables / Secrets —
  never committed. Local equivalents go in `.dev.vars`.

## Project structure

```
src/
  app/                 # App Router pages
    [category]/        # category + article routes
    admin/             # Phase 2 admin panel (gated)
    tools/             # free in-browser tools
  components/          # UI: hero, cards, article renderer, ad slots…
  content/             # Phase 1 data layer (articles, authors, categories)
  lib/                 # site config, i18n, utils
  lib/db/              # Phase 2 seams: repository + auth
docs/phase-2.md        # Phase 2 roadmap (auth, admin, D1, analytics)
db/migrations/          # D1 migrations (0001_schema.sql)
wrangler.jsonc         # Cloudflare deployment config
open-next.config.ts    # OpenNext adapter config
```

## Content model

Articles are typed, block-based content (`src/content/types.ts`). Phase 1
ships them as static data; Phase 2 stores the same shape in D1
(`db/migrations`, `articles.content_json`) and swaps the repository in
`src/lib/db/repository.ts` — templates don't change.

## Admin (Phase 2)

The admin panel is server-gated at the auth layer: signed-out visitors see a
sign-in screen, non-admins are redirected home. Register an account, then
promote it to admin by seeding:

```bash
npm run seed:admin                  # admin@aitech.media / Admin2026!
npm run seed:admin -- you@site.com pass
```

Local dev writes straight to `.data/local.sqlite` (plain Node) or the local
D1 store under `wrangler dev`. Before deploying to Cloudflare, seed the
remote database too:

```bash
npx wrangler d1 execute aitech-db --remote --file=db/seeds/admin.sql
```

Set `AUTH_SECRET` (see `.env.example`) in production — without it the local
dev fallback secret is used, which is unsafe on a public site.

## License

Private project. All rights reserved.
