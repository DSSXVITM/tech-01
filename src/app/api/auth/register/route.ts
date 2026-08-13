import { NextResponse } from "next/server";
import { getDB } from "@/lib/db/client";
import {
  SESSION_COOKIE,
  createSessionToken,
  hashPassword,
  sessionCookieOptions,
} from "@/lib/db/auth";

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

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!name || name.length > 80) return json({ error: "Name is required." }, 422);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Enter a valid email address." }, 422);
  }
  if (password.length < 8) {
    return json({ error: "Password must be at least 8 characters." }, 422);
  }

  const db = await getDB();
  const existing = await db
    .prepare("SELECT id FROM users WHERE email = ?")
    .bind(email)
    .first<{ id: string }>();
  if (existing) {
    return json({ error: "An account with this email already exists." }, 409);
  }

  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  await db
    .prepare("INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)")
    .bind(id, email, name, passwordHash, "reader")
    .run();

  const user = { id, name, email, role: "reader" as const };
  const token = await createSessionToken(user);
  const res = NextResponse.json({ ok: true, user });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
