import { NextResponse } from "next/server";
import { getDB } from "@/lib/db/client";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
  type SessionUser,
  type UserRole,
} from "@/lib/db/auth";
import { getGoogleClientId, getGoogleClientSecret, verifyGoogleToken } from "@/lib/db/google";

export const dynamic = "force-dynamic";

/**
 * Step 2 of the server-side Google OAuth2 flow.
 *
 * Google redirects here with ?code=... after sign-in. We exchange the code for
 * an ID token (using the client secret), verify it, find/create the local user
 * and start a session. No FedCM involved.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state") ?? "";

  const cookies = request.headers.get("cookie") ?? "";
  let returnTo = "/";
  const m = /(?:^|;\s*)google_next=([^;]+)/.exec(cookies);
  if (m) {
    try {
      returnTo = decodeURIComponent(m[1]);
    } catch {
      returnTo = "/";
    }
  }
  if (!returnTo.startsWith("/")) returnTo = "/";
  if (state && state.startsWith("/")) returnTo = state;

  const fail = (reason: string) =>
    NextResponse.redirect(new URL(`/login?google=${reason}&next=${encodeURIComponent(returnTo)}`, request.url));

  const clientId = await getGoogleClientId();
  const clientSecret = await getGoogleClientSecret();
  if (!clientId || !clientSecret) return fail("not_configured");
  if (!code) return fail("failed");

  // Exchange the authorization code for tokens.
  let idToken: string | null = null;
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${url.origin}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    if (tokenRes.ok) {
      const data = (await tokenRes.json()) as { id_token?: string };
      idToken = data.id_token ?? null;
    }
  } catch {
    idToken = null;
  }
  if (!idToken) return fail("failed");

  let profile: Awaited<ReturnType<typeof verifyGoogleToken>>;
  try {
    profile = await verifyGoogleToken(idToken, clientId);
  } catch {
    profile = null;
  }
  if (!profile) return fail("failed");

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
      .prepare("INSERT INTO users (id, email, name, google_sub, role) VALUES (?, ?, ?, ?, ?)")
      .bind(id, email, name, profile.sub, "reader")
      .run();
    user = { id, name, email, role: "reader", banned_at: null };
  }

  if (user.banned_at) {
    return fail("banned");
  }

  const session: SessionUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  const token = await createSessionToken(session);

  const res = NextResponse.redirect(new URL(returnTo, request.url));
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  res.cookies.delete("google_next");
  return res;
}
