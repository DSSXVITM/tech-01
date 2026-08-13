import { randomUUID } from "node:crypto";
import { getDB } from "./client";

/**
 * Comments — Phase 2.
 *
 * Threaded comments keyed by article slug (works for static + CMS articles).
 * Votes are stored in `comment_votes` (one row per user per comment, value
 * +1/-1) and aggregated per comment on read.
 */

export type CommentStatus = "pending" | "approved" | "hidden";

export interface CommentRecord {
  id: string;
  articleSlug: string;
  userId: string | null;
  parentId: string | null;
  body: string;
  status: CommentStatus;
  createdAt: string;
}

interface CommentRow {
  id: string;
  article_slug: string;
  user_id: string | null;
  parent_id: string | null;
  body: string;
  status: CommentStatus;
  created_at: string;
}

export interface CommentView extends CommentRecord {
  authorName: string;
  authorRole: string | null;
  authorAvatar: string | null;
  score: number;
  userVote: 1 | -1 | 0;
}

const rowToComment = (r: CommentRow): CommentRecord => ({
  id: r.id,
  articleSlug: r.article_slug,
  userId: r.user_id,
  parentId: r.parent_id,
  body: r.body,
  status: r.status,
  createdAt: r.created_at,
});

/** Approves a comment; used when posting (or by admins). */
export async function createComment(
  articleSlug: string,
  userId: string | null,
  body: string,
  parentId: string | null,
): Promise<CommentRecord> {
  const id = randomUUID();
  const db = await getDB();
  await db
    .prepare(
      "INSERT INTO comments (id, article_slug, article_id, user_id, parent_id, body, status) VALUES (?, ?, NULL, ?, ?, ?, 'approved')",
    )
    .bind(id, articleSlug, userId, parentId, body)
    .run();
  const row = await db.prepare("SELECT * FROM comments WHERE id = ?").bind(id).first<CommentRow>();
  return rowToComment(row!);
}

/** All approved comments for an article, with author info + aggregated votes. */
export async function getArticleComments(articleSlug: string, viewerId?: string | null): Promise<CommentView[]> {
  const db = await getDB();
  const { results } = await db
    .prepare(
      `SELECT c.*,
              COALESCE(u.name, 'Guest') AS author_name,
              u.role AS author_role,
              u.avatar_data AS author_avatar,
              COALESCE(SUM(v.value), 0) AS score,
              COALESCE(MAX(CASE WHEN v.user_id = ? THEN v.value END), 0) AS user_vote
         FROM comments c
         LEFT JOIN users u ON u.id = c.user_id
         LEFT JOIN comment_votes v ON v.comment_id = c.id
        WHERE c.article_slug = ? AND c.status = 'approved'
        GROUP BY c.id
        ORDER BY c.created_at ASC`,
    )
    .bind(viewerId ?? "", articleSlug)
    .all<
      CommentRow & {
        author_name: string;
        author_role: string | null;
        author_avatar: string | null;
        score: number;
        user_vote: number | null;
      }
    >();

  return results.map((r) => ({
    ...rowToComment(r),
    authorName: r.author_name,
    authorRole: r.author_role,
    authorAvatar: r.author_avatar || null,
    score: r.score,
    userVote: r.user_vote === 1 ? 1 : r.user_vote === -1 ? -1 : 0,
  }));
}

/** Registers (or clears) a user's vote on a comment. Returns the new score. */
export async function setCommentVote(
  commentId: string,
  userId: string,
  value: 1 | -1,
): Promise<{ score: number; userVote: 1 | -1 | 0 }> {
  const db = await getDB();
  await db
    .prepare(
      `INSERT INTO comment_votes (comment_id, user_id, value) VALUES (?, ?, ?)
         ON CONFLICT(comment_id, user_id) DO UPDATE SET value = excluded.value`,
    )
    .bind(commentId, userId, value)
    .run();

  const row = await db
    .prepare(
      `SELECT COALESCE(SUM(v.value), 0) AS score,
              COALESCE(MAX(CASE WHEN v.user_id = ? THEN v.value END), 0) AS user_vote
         FROM comments c
         LEFT JOIN comment_votes v ON v.comment_id = c.id
        WHERE c.id = ?
        GROUP BY c.id`,
    )
    .bind(userId, commentId)
    .first<{ score: number; user_vote: number | null }>();

  return {
    score: row?.score ?? 0,
    userVote: row?.user_vote === 1 ? 1 : row?.user_vote === -1 ? -1 : 0,
  };
}

/** Removes a user's vote entirely (toggle-off). Returns the new score. */
export async function clearCommentVote(commentId: string, userId: string): Promise<number> {
  const db = await getDB();
  await db
    .prepare("DELETE FROM comment_votes WHERE comment_id = ? AND user_id = ?")
    .bind(commentId, userId)
    .run();
  const row = await db
    .prepare("SELECT COALESCE(SUM(value), 0) AS score FROM comment_votes WHERE comment_id = ?")
    .bind(commentId)
    .first<{ score: number }>();
  return row?.score ?? 0;
}

export async function getCommentById(id: string): Promise<CommentRecord | null> {
  const db = await getDB();
  const row = await db.prepare("SELECT * FROM comments WHERE id = ?").bind(id).first<CommentRow>();
  return row ? rowToComment(row) : null;
}
