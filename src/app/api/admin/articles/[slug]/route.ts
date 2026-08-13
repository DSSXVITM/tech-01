import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/db/auth";
import { getDB } from "@/lib/db/client";
import { getDbArticle } from "@/lib/db/content";

export const dynamic = "force-dynamic";

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status });
}

/**
 * Delete a CMS article (created in the admin panel).
 * Static articles shipped in the codebase cannot be deleted this way.
 */
export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) return json({ error: "Unauthorized." }, 401);

  const url = new URL(request.url);
  const slug = url.pathname.split("/").filter(Boolean).at(-1) ?? "";

  const article = await getDbArticle(slug);
  if (!article) {
    return json(
      { error: "Article not found. Static articles can't be deleted from the admin panel." },
      404,
    );
  }

  const db = await getDB();

  // Delete related rows first (comments reference by article_slug, the rest by article_id).
  const commentIds = await db
    .prepare("SELECT id FROM comments WHERE article_slug = ?")
    .bind(slug)
    .all<{ id: string }>();
  for (const { id } of commentIds.results) {
    await db.prepare("DELETE FROM comment_votes WHERE comment_id = ?").bind(id).run();
  }
  await db.prepare("DELETE FROM comments WHERE article_slug = ?").bind(slug).run();

  const row = await db
    .prepare("SELECT id FROM articles WHERE slug = ?")
    .bind(slug)
    .first<{ id: string }>();
  if (row) {
    await db.prepare("DELETE FROM saved_articles WHERE article_id = ?").bind(row.id).run();
    await db.prepare("DELETE FROM reading_history WHERE article_id = ?").bind(row.id).run();
    await db.prepare("DELETE FROM affiliate_clicks WHERE article_id = ?").bind(row.id).run();
    await db.prepare("DELETE FROM article_tags WHERE article_id = ?").bind(row.id).run();
  }

  await db.prepare("DELETE FROM articles WHERE slug = ?").bind(slug).run();

  return json({ ok: true });
}
