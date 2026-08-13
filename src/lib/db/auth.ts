import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDB } from "./client";

/**
 * Auth — Phase 2.
 *
 * Sessions are signed HMAC-SHA256 tokens in an httpOnly cookie; passwords
 * are hashed with PBKDF2-SHA256 (Web Crypto — identical in Node and Workers).
 * Every admin route calls `getSession()` at the server — access is enforced
 * at the auth layer, never by hiding UI.
 */

export type UserRole = "reader" | "author" | "editor" | "admin";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  /** Optional profile picture stored as a base64 data URI. */
  avatar?: string | null;
}

interface SessionPayload {
  uid: string;
  role: UserRole;
  exp: number; // epoch ms
}

export const SESSION_COOKIE = "aitech_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const PBKDF2_ITERATIONS = 100_000;
const PREFIX = "pbkdf2";

/* ------------------------------ env ------------------------------ */

async function getSecret(): Promise<string> {
  if (typeof process !== "undefined" && process.env?.AUTH_SECRET) {
    return process.env.AUTH_SECRET;
  }
  try {
    const env = getCloudflareContext().env;
    const fromEnv = (env as unknown as Record<string, unknown>).AUTH_SECRET;
    if (typeof fromEnv === "string" && fromEnv) return fromEnv;
  } catch {
    /* not on Cloudflare */
  }
  // Dev-only fallback so the site is usable before AUTH_SECRET is set.
  // Set AUTH_SECRET in production (see .env.example / Cloudflare secrets).
  return "dev-secret-do-not-use-in-production";
}

/* --------------------------- base64 ------------------------------ */

function toBase64(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function fromBase64(b64: string): Uint8Array<ArrayBuffer> {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/* ------------------------- passwords ----------------------------- */

const encoder = new TextEncoder();

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derived = await deriveBytes(password, salt);
  return `${PREFIX}$${toBase64(salt)}$${toBase64(derived)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== PREFIX) return false;
  const salt = fromBase64(parts[1]);
  const expected = fromBase64(parts[2]);
  const actual = await deriveBytes(password, salt);
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i];
  return diff === 0;
}

async function deriveBytes(password: string, salt: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    key,
    256,
  );
  return new Uint8Array(bits);
}

/* --------------------------- sessions ---------------------------- */

async function signToken(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(await getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${payload}.${toBase64(new Uint8Array(sig))}`;
}

async function verifyToken(token: string): Promise<SessionPayload | null> {
  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;
  const payload = token.slice(0, dot);
  const sigB64 = token.slice(dot + 1);

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(await getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const ok = await crypto.subtle.verify("HMAC", key, fromBase64(sigB64), encoder.encode(payload));
  if (!ok) return null;

  try {
    const parsed = JSON.parse(payload) as SessionPayload;
    if (typeof parsed.uid !== "string" || typeof parsed.exp !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Builds a signed session token for a user (does not touch cookies). */
export async function createSessionToken(user: SessionUser): Promise<string> {
  const payload: SessionPayload = {
    uid: user.id,
    role: user.role,
    exp: Date.now() + SESSION_TTL_MS,
  };
  return signToken(JSON.stringify(payload));
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

/** Returns the current session user, or null when signed out / invalid. */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload || payload.exp < Date.now()) return null;

  const db = await getDB();
  const user = await db
    .prepare("SELECT id, name, email, role, banned_at, avatar_data FROM users WHERE id = ?")
    .bind(payload.uid)
    .first<{
      id: string;
      name: string;
      email: string;
      role: UserRole;
      banned_at: string | null;
      avatar_data: string | null;
    }>();

  if (!user || user.banned_at) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar_data || null,
  };
}

const ROLE_LEVEL: Record<UserRole, number> = { reader: 0, author: 1, editor: 2, admin: 3 };

/**
 * Redirects unless the session user has at least the required role.
 * Returns the session when authorized (so pages can use it), never renders
 * admin content otherwise.
 */
export async function requireRole(minimum: UserRole = "editor"): Promise<SessionUser | null> {
  const user = await getSession();
  if (!user) {
    redirect("/login?next=/admin");
  }
  if (ROLE_LEVEL[user.role] < ROLE_LEVEL[minimum]) {
    redirect("/");
  }
  return user;
}

export async function requireAdmin(): Promise<SessionUser | null> {
  return requireRole("admin");
}
