import type { Metadata } from "next";
import Link from "next/link";
import { getDB } from "@/lib/db/client";
import { getSiteArticle } from "@/content";
import { CommentActions } from "@/components/admin/comment-actions";
import type { CommentStatus } from "@/lib/db/comments";

export const metadata: Metadata = {
  title: "Comments — AI Tech Admin",
};

export const dynamic = "force-dynamic";

interface CommentRow {
  id: string;
  article_slug: string;
  user_id: string | null;
  parent_id: string | null;
  body: string;
  status: CommentStatus;
  created_at: string;
  author_name: string;
  author_email: string;
  author_role: string | null;
  score: number;
}

const STATUS_STYLE: Record<CommentStatus, string> = {
  pending: "border-amber/40 bg-amber/10 text-amber",
  approved: "border-signal/40 bg-signal/10 text-signal-ink",
  hidden: "border-line bg-surface-2 text-muted",
};

export default async function AdminCommentsPage() {
  const db = await getDB();
  const { results: comments } = await db
    .prepare(
      `SELECT c.*,
              COALESCE(u.name, 'Guest') AS author_name,
              COALESCE(u.email, '')     AS author_email,
              u.role                    AS author_role,
              COALESCE(SUM(v.value), 0) AS score
         FROM comments c
         LEFT JOIN users u ON u.id = c.user_id
         LEFT JOIN comment_votes v ON v.comment_id = c.id
        GROUP BY c.id
        ORDER BY c.created_at DESC`,
    )
    .all<CommentRow>();

  const counts = comments.reduce<Record<CommentStatus, number>>(
    (acc, c) => {
      acc[c.status] += 1;
      return acc;
    },
    { pending: 0, approved: 0, hidden: 0 },
  );

  const commentArticleSlugs = [...new Set(comments.map((c) => c.article_slug).filter(Boolean))];
  const articleBySlug = new Map<string, Awaited<ReturnType<typeof getSiteArticle>>>();
  for (const slug of commentArticleSlugs) {
    articleBySlug.set(slug, await getSiteArticle(slug));
  }

  return (
    <div>
      <header className="mb-6">
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Moderation</p>
        <h2 className="mt-1 font-display text-3xl font-bold leading-tight text-fg">Comments</h2>
        <p className="mt-2 text-sm text-muted">
          {comments.length} comment{comments.length === 1 ? "" : "s"} · {counts.pending} awaiting review ·{" "}
          {counts.approved} live · {counts.hidden} hidden
        </p>
      </header>

      {comments.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line p-12 text-center">
          <p className="font-display text-sm text-muted">No comments yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => {
            const article = c.article_slug ? articleBySlug.get(c.article_slug) : undefined;
            const href = article
              ? `/${article.category}/${article.slug}`
              : c.article_slug;
            return (
            <li key={c.id} className="rounded-lg border border-line bg-surface p-4">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted">
                <span className={`rounded-full border px-2 py-0.5 font-semibold ${STATUS_STYLE[c.status]}`}>
                  {c.status}
                </span>
                <span>{c.author_name}</span>
                {c.author_email && <span>· {c.author_email}</span>}
                <span>· score {c.score}</span>
                <span>· {new Date(c.created_at).toLocaleString("en")}</span>
              </div>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-fg">{c.body}</p>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={href}
                  className="font-mono text-[10px] uppercase tracking-wider text-signal-ink hover:underline"
                >
                  {c.article_slug}
                </Link>
                <CommentActions commentId={c.id} status={c.status} />
              </div>
            </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
