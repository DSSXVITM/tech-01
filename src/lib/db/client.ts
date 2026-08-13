import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getLocalDbClient } from "./local-sqlite";

/**
 * Database access — the single way the app talks to storage.
 *
 * - On Cloudflare (Workers/OpenNext): returns the real D1 binding `DB`.
 * - Locally under `next dev` (plain Node): returns a `node:sqlite` client
 *   with the same schema, stored in `.data/local.sqlite`.
 *
 * Both expose the same minimal D1-shaped interface, so queries written once
 * run identically in dev and production.
 */

/** Minimal subset of the D1 statement API shared by both backends. */
export interface DBPrepared {
  bind(...values: unknown[]): DBPrepared;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  run(): Promise<{ success: boolean; meta?: unknown }>;
}

/** Minimal subset of the D1 database API shared by both backends. */
export interface DBLike {
  prepare(sql: string): DBPrepared;
}

let cached: DBLike | null | undefined;

/**
 * Returns the active database. Under the Cloudflare runtime this resolves to
 * the D1 binding; in Node (next dev / next start) it falls back to the local
 * SQLite file so auth and admin work without wrangler.
 */
export async function getDB(): Promise<DBLike> {
  if (cached) return cached;

  const cloudflare = await tryCloudflareDB();
  if (cloudflare) {
    cached = cloudflare;
    return cloudflare;
  }

  cached = getLocalDbClient();
  return cached;
}

async function tryCloudflareDB(): Promise<DBLike | null> {
  try {
    const ctx = getCloudflareContext();
    const db = ctx.env.DB;
    if (db) return db as unknown as DBLike;
    return null;
  } catch {
    return null;
  }
}
