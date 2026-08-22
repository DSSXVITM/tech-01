import { NextResponse } from "next/server";
import { getDB } from "@/lib/db/client";
import { sendPasswordResetEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

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

  const db = await getDB();
  const user = await db
    .prepare("SELECT id, name, email FROM users WHERE email = ?")
    .bind(email)
    .first<{ id: string; name: string; email: string }>();

  // Always return ok to avoid leaking which emails are registered.
  if (!user) {
    return json({ ok: true });
  }

  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const expires = Date.now() + RESET_TTL_MS;

  await db
    .prepare("UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?")
    .bind(token, expires, user.id)
    .run();

  await sendPasswordResetEmail({ to: user.email, token, name: user.name });

  return json({ ok: true });
}
