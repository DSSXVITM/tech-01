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

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status });
}

/**
 * Google Sign-In callback. Receives the ID token from the GIS button,
 * verifies it, then finds or creates a local user and starts a session.
 */
export async function POST(request: Request) {
  const clientId = await getGoogleClientId();
  if (!clientId) {
    return json({ error: "Google sign-in is not configured." }, 503);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const credential = typeof body.credential === "string" ? body.credential : "";
  if (!credential) {
    return json({ error: "Missing Google credential." }, 422);
  }

  let profile: Awaited<ReturnType<typeof verifyGoogleToken>>;
  try {
    profile = await verifyGoogleToken(credential, clientId);
  } catch {
    return json({ error: "Google verification failed." }, 502);
  }
  if (!profile) {
    return json({ error: "Google verification failed." }, 401);
  }

  const email = profile.email.toLowerCase();
  const name = profile.name || email.split("@")[0] || "Google User";

  const db = await getDB();

  // 1. Match by Google sub.
  let user = await db
    .prepare("SELECT id, name, email, role, banned_at FROM users WHERE google_sub = ?")
    .bind(profile.sub)
    .first<{ id: string; name: string; email: string; role: UserRole; banned_at: string | null }>();

  // 2. Fall back to matching by email, then link the Google account.
  if (!user) {
    const byEmail = await db
      .prepare("SELECT id, name, email, role, banned_at FROM users WHERE email = ?")
      .bind(email)
      .first<{ id: string; name: string; email: string; role: UserRole; banned_at: string | null }>();
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
      .prepare(
        "INSERT INTO users (id, email, name, google_sub, role) VALUES (?, ?, ?, ?, ?)",
      )
      .bind(id, email, name, profile.sub, "reader")
      .run();
    user = { id, name, email, role: "reader", banned_at: null };
  }

  if (user.banned_at) {
    return json({ error: "This account has been suspended." }, 403);
  }

  const session: SessionUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  const token = await createSessionToken(session);
  const res = NextResponse.json({ ok: true, user: session });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
