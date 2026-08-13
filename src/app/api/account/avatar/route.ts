import { NextResponse } from "next/server";
import { getSession } from "@/lib/db/auth";
import { getDB } from "@/lib/db/client";

export const dynamic = "force-dynamic";

const MAX_DATA_URI_LENGTH = 2_500_000; // ~1.9 MB of raw bytes after base64 overhead
const ALLOWED_PREFIXES = ["data:image/jpeg", "data:image/png", "data:image/webp", "data:image/gif"];

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status });
}

/** Accepts a base64 data URI, stores it, and returns the updated session. */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return json({ error: "Sign in required." }, 401);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const dataUri = typeof body.avatar === "string" ? body.avatar.trim() : "";
  if (!dataUri) return json({ error: "Missing avatar data." }, 422);
  if (dataUri.length > MAX_DATA_URI_LENGTH) {
    return json({ error: "Image is too large. Choose a file under ~1.5 MB." }, 413);
  }
  if (!ALLOWED_PREFIXES.some((p) => dataUri.startsWith(p))) {
    return json({ error: "Only JPEG, PNG, WebP or GIF images are supported." }, 422);
  }
  if (!dataUri.includes("base64,")) {
    return json({ error: "Invalid image data." }, 422);
  }

  const db = await getDB();
  await db
    .prepare("UPDATE users SET avatar_data = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?")
    .bind(dataUri, session.id)
    .run();

  return json({
    ok: true,
    session: { ...session, avatar: dataUri },
  });
}

/** Removes the profile picture. */
export async function DELETE() {
  const session = await getSession();
  if (!session) return json({ error: "Sign in required." }, 401);

  const db = await getDB();
  await db
    .prepare("UPDATE users SET avatar_data = '', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?")
    .bind(session.id)
    .run();

  return json({ ok: true });
}
