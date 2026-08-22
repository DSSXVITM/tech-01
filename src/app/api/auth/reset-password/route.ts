import { NextResponse } from "next/server";
import { getDB } from "@/lib/db/client";
import { hashPassword } from "@/lib/db/auth";

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

  const token = typeof body.token === "string" ? body.token : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (password.length < 8) {
    return json({ error: "Password must be at least 8 characters." }, 422);
  }

  const db = await getDB();
  const user = await db
    .prepare("SELECT id, email FROM users WHERE reset_token = ? AND reset_token_expires > ?")
    .bind(token, Date.now())
    .first<{ id: string; email: string }>();

  if (!user) {
    return json({ error: "This reset link is invalid or has expired." }, 422);
  }

  const passwordHash = await hashPassword(password);

  await db
    .prepare(
      "UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL, updated_at = ? WHERE id = ?",
    )
    .bind(passwordHash, new Date().toISOString(), user.id)
    .run();

  return json({ ok: true });
}
