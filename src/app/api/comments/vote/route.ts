import { NextResponse } from "next/server";
import { getSession } from "@/lib/db/auth";
import { clearCommentVote, getCommentById, setCommentVote } from "@/lib/db/comments";

export const dynamic = "force-dynamic";

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return json({ error: "You must be signed in to vote." }, 401);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const commentId = typeof body.commentId === "string" ? body.commentId : "";
  const value = body.value;

  if (!commentId) return json({ error: "Missing comment id." }, 422);
  if (value !== 1 && value !== -1) return json({ error: "Invalid vote value." }, 422);

  const comment = await getCommentById(commentId);
  if (!comment) return json({ error: "Comment not found." }, 404);

  const result = await setCommentVote(commentId, session.id, value);
  return json({ ok: true, ...result });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return json({ error: "You must be signed in to vote." }, 401);

  const url = new URL(request.url);
  const commentId = url.searchParams.get("commentId")?.trim() ?? "";
  if (!commentId) return json({ error: "Missing comment id." }, 422);

  const comment = await getCommentById(commentId);
  if (!comment) return json({ error: "Comment not found." }, 404);

  const score = await clearCommentVote(commentId, session.id);
  return json({ ok: true, score, userVote: 0 });
}
