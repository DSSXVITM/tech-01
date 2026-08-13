import { NextResponse } from "next/server";
import { getSession } from "@/lib/db/auth";
import { createComment, getArticleComments, getCommentById } from "@/lib/db/comments";

export const dynamic = "force-dynamic";

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const articleSlug = url.searchParams.get("article")?.trim() ?? "";
  if (!articleSlug) return json({ error: "Missing article slug." }, 422);

  const session = await getSession();
  const comments = await getArticleComments(articleSlug, session?.id);
  return json({ comments });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return json({ error: "You must be signed in to comment." }, 401);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const articleSlug = typeof body.article === "string" ? body.article.trim() : "";
  const text = typeof body.body === "string" ? body.body.trim() : "";
  const parentId = typeof body.parentId === "string" && body.parentId ? body.parentId : null;

  if (!articleSlug) return json({ error: "Missing article slug." }, 422);
  if (text.length < 2 || text.length > 2000) {
    return json({ error: "Comment must be between 2 and 2000 characters." }, 422);
  }

  if (parentId) {
    const parent = await getCommentById(parentId);
    if (!parent || parent.articleSlug !== articleSlug) {
      return json({ error: "Parent comment not found." }, 422);
    }
  }

  const comment = await createComment(articleSlug, session.id, text, parentId);
  return json({ ok: true, comment }, 201);
}
