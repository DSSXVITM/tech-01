import { getDB } from "./client";

/**
 * Saved articles — a reader's bookmark list.
 *
 * Keyed by `article_slug` so both static and CMS articles work (static
 * articles have no row in the `articles` table). One row per (user, slug);
 * saving twice is a no-op, unsaving removes the row.
 */

export interface SavedRow {
  article_slug: string;
  created_at: string;
}

/** Saves an article for a user. Returns true when it was newly saved. */
export async function saveArticle(userId: string, articleSlug: string): Promise<boolean> {
  const db = await getDB();
  const existing = await db
    .prepare("SELECT article_slug FROM saved_articles WHERE user_id = ? AND article_slug = ?")
    .bind(userId, articleSlug)
    .first<{ article_slug: string }>();
  if (existing) return false;
  await db
    .prepare("INSERT INTO saved_articles (user_id, article_slug) VALUES (?, ?)")
    .bind(userId, articleSlug)
    .run();
  return true;
}

/** Removes a saved article. Returns true when something was removed. */
export async function unsaveArticle(userId: string, articleSlug: string): Promise<boolean> {
  const db = await getDB();
  const res = await db
    .prepare("DELETE FROM saved_articles WHERE user_id = ? AND article_slug = ?")
    .bind(userId, articleSlug)
    .run();
  return res.success;
}

/** All slugs a user has saved, newest first. */
export async function getSavedArticleSlugs(userId: string): Promise<string[]> {
  const db = await getDB();
  const { results } = await db
    .prepare("SELECT article_slug FROM saved_articles WHERE user_id = ? ORDER BY created_at DESC")
    .bind(userId)
    .all<{ article_slug: string }>();
  return results.map((r) => r.article_slug);
}

/** Whether a user has saved a specific article. */
export async function isArticleSaved(userId: string, articleSlug: string): Promise<boolean> {
  const db = await getDB();
  const row = await db
    .prepare("SELECT article_slug FROM saved_articles WHERE user_id = ? AND article_slug = ?")
    .bind(userId, articleSlug)
    .first<{ article_slug: string }>();
  return Boolean(row);
}
