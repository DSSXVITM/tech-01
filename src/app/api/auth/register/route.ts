import { NextResponse } from "next/server";
import { getDB } from "@/lib/db/client";
import {
  hashPassword,
} from "@/lib/db/auth";
import { sendVerificationEmail } from "@/lib/email";

const VERIFY_TTL_MS = 24 * 60 * 60 * 1000;

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

  const verificationToken = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const verificationExpires = Date.now() + VERIFY_TTL_MS;

  await db
    .prepare(
      "INSERT INTO users (id, email, name, password_hash, role, email_verified, verification_token, verification_token_expires) VALUES (?, ?, ?, ?, ?, 0, ?, ?)",
    )
    .bind(id, email, name, passwordHash, "reader", verificationToken, verificationExpires)
    .run();

  await sendVerificationEmail({ to: email, token: verificationToken, name });

  // Do not log the user in until the email is confirmed.
  return NextResponse.json({ ok: true, needsVerification: true, email });
}
