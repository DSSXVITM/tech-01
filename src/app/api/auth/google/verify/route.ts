import { NextResponse } from "next/server";
import { getDB } from "@/lib/db/client";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
  type SessionUser,
  type UserRole,
} from "@/lib/db/auth";
import { getGoogleClientId, verifyGoogleToken } from "@/lib/db/google";

export const dynamic = "force-dynamic";

/**
 * Google Identity Services (GIS) ID-token flow.
 *
 * The browser button obtains an ID token (JWT) directly from Google and POSTs
 * it here. We verify the signature/claims with the public client ID only — no
 * client secret and no server-side redirect URI are required. On success we
 * find-or-create the local user and start a normal AI Tech session.
 */
type DbUser = { id: string; name: string; email: string; role: UserRole; banned_at: string | null };

export async function POST(request: Request) {
  const clientId = await getGoogleClientId();
  if (!clientId) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 400 });
  }

  let body: { credential?: string; next?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const { credential, next: rawNext } = body;
  if (!credential) {
    return NextResponse.json({ ok: false, error: "missing_credential" }, { status: 400 });
  }

  const profile = await verifyGoogleToken(credential, clientId);
  if (!profile) {
    return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 401 });
  }

  const email = profile.email.toLowerCase();
  const name = profile.name || email.split("@")[0] || "Google User";

  const db = await getDB();

  // 1. Match by Google sub.
  let user = await db
    .prepare("SELECT id, name, email, role, banned_at FROM users WHERE google_sub = ?")
    .bind(profile.sub)
    .first<DbUser>();

  // 2. Fall back to matching by email, then link the Google account.
  if (!user) {
    const byEmail = await db
      .prepare("SELECT id, name, email, role, banned_at FROM users WHERE email = ?")
      .bind(email)
      .first<DbUser>();
    if (byEmail) {
      await db
        .prepare("UPDATE users SET google_sub = ?, updated_at = ? WHERE id = ?")
        .bind(profile.sub, new Date().toISOString(), byEmail.id)
        .run();
      user = byEmail;
    }
  }

  // 3. No match → create a reader account.
  if (!user) {
    const id = crypto.randomUUID();
    await db
      .prepare("INSERT INTO users (id, email, name, google_sub, role) VALUES (?, ?, ?, ?, ?)")
      .bind(id, email, name, profile.sub, "reader")
      .run();
    user = { id, name, email, role: "reader", banned_at: null };
  }

  if (user.banned_at) {
    return NextResponse.json({ ok: false, error: "banned" }, { status: 403 });
  }

  const session: SessionUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  const token = await createSessionToken(session);

  const next = rawNext && rawNext.startsWith("/") ? rawNext : "/";
  const res = NextResponse.json({ ok: true, next });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
