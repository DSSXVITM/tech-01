import { NextResponse } from "next/server";
import { getDB } from "@/lib/db/client";
import { sendVerificationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const VERIFY_TTL_MS = 24 * 60 * 60 * 1000;

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
    .prepare("SELECT id, name, email, email_verified FROM users WHERE email = ?")
    .bind(email)
    .first<{ id: string; name: string; email: string; email_verified: number }>();

  // Always return ok to avoid leaking which emails are registered.
  if (!user || user.email_verified) {
    return json({ ok: true });
  }

  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const expires = Date.now() + VERIFY_TTL_MS;

  await db
    .prepare("UPDATE users SET verification_token = ?, verification_token_expires = ? WHERE id = ?")
    .bind(token, expires, user.id)
    .run();

  await sendVerificationEmail({ to: user.email, token, name: user.name });

  return json({ ok: true });
}
