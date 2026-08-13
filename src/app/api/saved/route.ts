import { NextResponse } from "next/server";
import { getSession } from "@/lib/db/auth";
import { getSavedArticleSlugs, isArticleSaved, saveArticle, unsaveArticle } from "@/lib/db/saved";

export const dynamic = "force-dynamic";

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status });
}

/** Lists the signed-in user's saved article slugs. */
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return json({ error: "Sign in required." }, 401);

  const url = new URL(request.url);
  const check = url.searchParams.get("article");
  if (check) {
    const saved = await isArticleSaved(session.id, check);
    return json({ slug: check, saved });
  }

  const slugs = await getSavedArticleSlugs(session.id);
  return json({ saved: slugs });
}

/** Saves or unsaves an article depending on the current state. */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return json({ error: "Sign in required." }, 401);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const slug = typeof body.article === "string" ? body.article.trim() : "";
  if (!slug) return json({ error: "Missing article slug." }, 422);

  const saved = await isArticleSaved(session.id, slug);
  if (saved) {
    await unsaveArticle(session.id, slug);
  } else {
    await saveArticle(session.id, slug);
  }

  return json({ ok: true, slug, saved: !saved });
}
