/**
 * Seed the first admin user.
 *
 * Usage:
 *   npm run seed:admin                    → admin@aitech.media / Admin2026!
 *   npm run seed:admin -- user@x.com pass
 *
 * Applies to the LOCAL dev database (.data/local.sqlite) and writes
 * db/seeds/admin.sql for Cloudflare D1 (wrangler dev + remote).
 * The hash format (pbkdf2$salt$hash) matches src/lib/db/auth.ts.
 */
import { randomBytes, pbkdf2Sync, randomUUID } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const root = process.cwd();
const email = (process.argv[2] || "admin@aitech.media").trim().toLowerCase();
const password = process.argv[3] || "Admin2026!";

const salt = randomBytes(16);
const derived = pbkdf2Sync(password, salt, 100_000, 32, "sha256");
const hash = `pbkdf2$${salt.toString("base64")}$${derived.toString("base64")}`;
const id = randomUUID();

// --- Local SQLite (next dev) ---
const dataDir = path.join(root, ".data");
mkdirSync(dataDir, { recursive: true });
const dbFile = path.join(dataDir, "local.sqlite");
const db = new DatabaseSync(dbFile);
db.exec("PRAGMA journal_mode = WAL;");
// Apply every pending migration (same tracking as src/lib/db/local-sqlite.ts).
db.exec(
  "CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')))",
);
const applied = new Set(db.prepare("SELECT name FROM _migrations").all().map((r) => r.name));
const migrationsDir = path.join(root, "db", "migrations");
for (const file of readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort()) {
  if (applied.has(file)) continue;
  db.exec(readFileSync(path.join(migrationsDir, file), "utf8"));
  db.prepare("INSERT INTO _migrations (name) VALUES (?)").run(file);
}
db.prepare(
  "INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, 'admin') " +
    "ON CONFLICT(email) DO UPDATE SET name = excluded.name, password_hash = excluded.password_hash, role = 'admin', banned_at = NULL",
).run(id, email, "DSSSX", hash);

// --- SQL for Cloudflare D1 (local + remote) ---
const sql =
  `INSERT INTO users (id, email, name, password_hash, role) VALUES ('${id}', '${email}', 'DSSSX', '${hash}', 'admin') ` +
  `ON CONFLICT(email) DO UPDATE SET name = excluded.name, password_hash = excluded.password_hash, role = 'admin', banned_at = NULL;\n`;
const seedsDir = path.join(root, "db", "seeds");
mkdirSync(seedsDir, { recursive: true });
const sqlFile = path.join(seedsDir, "admin.sql");
writeFileSync(sqlFile, sql);

console.log(`
✅ Admin user ready
   Email:    ${email}
   Password: ${password}
   Role:     admin

Applied to:
   Local dev (next dev)     → .data/local.sqlite (done)

To also enable admin for Cloudflare D1, run:
   Local (wrangler dev):    npx wrangler d1 execute aitech-db --local  --file=db/seeds/admin.sql
   Remote (production):     npx wrangler d1 execute aitech-db --remote --file=db/seeds/admin.sql
`);
