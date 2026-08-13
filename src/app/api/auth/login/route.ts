import { NextResponse } from "next/server";
import { getDB } from "@/lib/db/client";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/db/auth";
import type { UserRole } from "@/lib/db/auth";

export const dynamic = "force-dynamic";

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return json({ error: "Email and password are required." }, 422);
  }

  const db = await getDB();
  const user = await db
    .prepare(
      "SELECT id, name, email, password_hash, role, banned_at, avatar_data FROM users WHERE email = ?",
    )
    .bind(email)
    .first<{
      id: string;
      name: string;
      email: string;
      password_hash: string;
      role: UserRole;
      banned_at: string | null;
      avatar_data: string | null;
    }>();

  if (!user || !user.password_hash) {
    return json({ error: "Invalid email or password." }, 401);
  }
  if (user.banned_at) {
    return json({ error: "This account has been suspended." }, 403);
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return json({ error: "Invalid email or password." }, 401);
  }

  const session = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar_data || null,
  };
  const token = await createSessionToken(session);
  const res = NextResponse.json({ ok: true, user: session });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
