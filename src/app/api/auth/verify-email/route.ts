import { NextResponse } from "next/server";
import { getDB } from "@/lib/db/client";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/db/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const base = new URL(request.url).origin;

  if (!token) {
    return NextResponse.redirect(`${base}/login?verified=invalid`);
  }

  const db = await getDB();
  const user = await db
    .prepare(
      "SELECT id, name, email, role FROM users WHERE verification_token = ? AND verification_token_expires > ?",
    )
    .bind(token, Date.now())
    .first<{ id: string; name: string; email: string; role: "reader" | "author" | "editor" | "admin" }>();

  if (!user) {
    return NextResponse.redirect(`${base}/login?verified=invalid`);
  }

  await db
    .prepare(
      "UPDATE users SET email_verified = 1, verified_at = ?, verification_token = NULL, verification_token_expires = NULL WHERE id = ?",
    )
    .bind(new Date().toISOString(), user.id)
    .run();

  const sessionUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  const sessionToken = await createSessionToken(sessionUser);
  const res = NextResponse.redirect(`${base}/?verified=1`);
  res.cookies.set(SESSION_COOKIE, sessionToken, sessionCookieOptions());
  return res;
}
