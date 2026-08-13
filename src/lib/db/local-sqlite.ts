import { existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import type { DBLike, DBPrepared } from "./client";

/**
 * Local dev database for plain-Node Next.js (`npm run dev` / `next start`),
 * where no Cloudflare binding exists. Uses the built-in `node:sqlite`
 * (Node ≥ 22.5) against `.data/local.sqlite`, bootstrapped from the same
 * migration file the production D1 database uses — so schema stays in sync.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "local.sqlite");
const MIGRATIONS_DIR = path.join(process.cwd(), "db", "migrations");

let db: DatabaseSync | null = null;

/** Applies every migration in db/migrations that hasn't run yet (tracked in
 * `_migrations`), keeping the local SQLite file in sync with D1. */
export function runMigrations(handle: DatabaseSync) {
  handle.exec(
    "CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')))",
  );
  const applied = new Set(
    handle.prepare("SELECT name FROM _migrations").all().map((r) => (r as { name: string }).name),
  );
  if (!existsSync(MIGRATIONS_DIR)) return;
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql")).sort();
  const insert = handle.prepare("INSERT INTO _migrations (name) VALUES (?)");
  for (const file of files) {
    if (applied.has(file)) continue;
    handle.exec(readFileSync(path.join(MIGRATIONS_DIR, file), "utf8"));
    insert.run(file);
  }
}

function open(): DatabaseSync {
  if (db) return db;

  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

  const handle = new DatabaseSync(DB_FILE);
  handle.exec("PRAGMA journal_mode = WAL;");
  runMigrations(handle);

  db = handle;
  return handle;
}

class SqlitePrepared implements DBPrepared {
  private params: unknown[] = [];

  constructor(private sql: string) {}

  bind(...values: unknown[]): this {
    this.params = values;
    return this;
  }

  async first<T = Record<string, unknown>>(): Promise<T | null> {
    const row = open().prepare(this.sql).get(...(this.params as SQLInputValue[])) as T | undefined;
    return row ?? null;
  }

  async all<T = Record<string, unknown>>(): Promise<{ results: T[] }> {
    const results = open().prepare(this.sql).all(...(this.params as SQLInputValue[])) as T[];
    return { results };
  }

  async run(): Promise<{ success: boolean; meta?: unknown }> {
    const meta = open().prepare(this.sql).run(...(this.params as SQLInputValue[]));
    return { success: true, meta };
  }
}

export function getLocalDbClient(): DBLike {
  open();
  return {
    prepare(sql: string): DBPrepared {
      return new SqlitePrepared(sql);
    },
  };
}

/** Path of the local SQLite file (used by seed scripts). */
export function getLocalDbPath(): string {
  return DB_FILE;
}
