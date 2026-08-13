import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/db/auth";
import { getDB } from "@/lib/db/client";
import type { CommentStatus } from "@/lib/db/comments";

export const dynamic = "force-dynamic";

const STATUSES: CommentStatus[] = ["pending", "approved", "hidden"];

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status });
}

/**
 * Admin comment moderation: approve / hide / delete.
 * Only `admin` can call this (enforced by `requireAdmin`).
 */
export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return json({ error: "Unauthorized." }, 401);

  const url = new URL(request.url);
  const id = url.pathname.split("/").filter(Boolean).at(-1) ?? "";

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const status = body.status;
  if (!STATUSES.includes(status as CommentStatus)) {
    return json({ error: "Invalid status." }, 422);
  }

  const db = await getDB();
  const comment = await db
    .prepare("SELECT id FROM comments WHERE id = ?")
    .bind(id)
    .first<{ id: string }>();
  if (!comment) return json({ error: "Comment not found." }, 404);

  await db.prepare("UPDATE comments SET status = ? WHERE id = ?").bind(status, id).run();
  return json({ ok: true, comment: { id, status } });
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return json({ error: "Unauthorized." }, 401);

  const url = new URL(request.url);
  const id = url.pathname.split("/").filter(Boolean).at(-1) ?? "";

  const db = await getDB();
  const comment = await db
    .prepare("SELECT id FROM comments WHERE id = ?")
    .bind(id)
    .first<{ id: string }>();
  if (!comment) return json({ error: "Comment not found." }, 404);

  await db.prepare("DELETE FROM comments WHERE id = ?").bind(id).run();
  return json({ ok: true });
}
