import { getAllArticles, getAuthors, getCategories, getTrendingArticles } from "@/content";
import { getDB } from "@/lib/db/client";
import type { CommentStatus } from "@/lib/db/comments";

export const metadata = {
  title: "Dashboard — AI Tech Admin",
};

export const dynamic = "force-dynamic";

const statStyle = "rounded-lg border border-line bg-surface p-5";

export default async function AdminDashboardPage() {
  const articles = getAllArticles();
  const authors = getAuthors();
  const categories = getCategories();
  const trending = getTrendingArticles();

  const db = await getDB();
  const userCount = (
    await db.prepare("SELECT COUNT(*) AS n FROM users").first<{ n: number }>()
  )?.n ?? 0;
  const commentCounts = (await db
    .prepare(
      "SELECT COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0) AS pending, COALESCE(SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END), 0) AS approved, COUNT(*) AS total FROM comments",
    )
    .first<{ pending: number; approved: number; total: number }>()) ?? {
    pending: 0,
    approved: 0,
    total: 0,
  };

  const stats = [
    { label: "Articles", value: articles.length, sub: "total in content layer" },
    { label: "Categories", value: categories.length, sub: "site taxonomy" },
    { label: "Authors", value: authors.length, sub: "active profiles" },
    { label: "Users", value: userCount, sub: "registered accounts" },
    { label: "Comments", value: commentCounts.total, sub: `${commentCounts.pending} awaiting review` },
    { label: "Trending", value: trending.length, sub: "ranked on home" },
  ];

  const perCategory = categories
    .map((c) => ({
      name: c.name,
      count: articles.filter((a) => a.category === c.slug).length,
    }))
    .filter((c) => c.count > 0);

  const recentComments = (await db
    .prepare(
      `SELECT c.article_slug, c.body, c.status, c.created_at,
              COALESCE(u.name, 'Guest') AS author_name
         FROM comments c
         LEFT JOIN users u ON u.id = c.user_id
        ORDER BY c.created_at DESC LIMIT 5`,
    )
    .all<{
      article_slug: string;
      body: string;
      status: CommentStatus;
      created_at: string;
      author_name: string;
    }>()).results ?? [];

  const commentStatusLabel = (s: CommentStatus) => (s === "pending" ? "pending" : s === "approved" ? "live" : "hidden");

  return (
    <div>
      <header className="mb-8">
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-amber">
          <span className="status-dot is-live" /> Dashboard
        </p>
        <h2 className="mt-2 font-display text-4xl font-bold leading-tight text-fg">
          Overview
        </h2>
        <p className="mt-2 text-sm text-muted">
          Editorial and monetization metrics. Numbers below reflect the live content layer
          (Phase 1). Real-time analytics land in Phase 2.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={statStyle}>
            <p className="font-display text-[10px] uppercase tracking-[0.12em] text-muted">{s.label}</p>
            <p className="mt-2 font-display text-4xl font-extrabold text-fg">{s.value}</p>
            <p className="mt-1 font-display text-[11px] text-muted">{s.sub}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface p-5">
          <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-fg">
            Content by category
          </h3>
          <div className="mt-4 space-y-3">
            {perCategory.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between font-display text-[11px] text-muted">
                  <span>{c.name}</span>
                  <span>{c.count}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-signal"
                    style={{ width: `${Math.min(100, (c.count / Math.max(...perCategory.map((p) => p.count))) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {perCategory.length === 0 && (
              <p className="font-display text-[11px] text-muted">No articles yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-surface p-5">
          <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-fg">
            Recent articles
          </h3>
          <ul className="mt-4 space-y-2.5">
            {articles.slice(0, 5).map((a) => (
              <li key={a.slug} className="flex items-center justify-between gap-3">
                <span className="truncate text-sm text-fg">{a.title}</span>
                <span className="shrink-0 font-display text-[11px] text-muted">
                  {new Date(a.publishedAt).toLocaleDateString("en", { month: "short", day: "numeric" })}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-line bg-surface p-5">
          <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-fg">
            Recent comments
          </h3>
          <ul className="mt-4 space-y-3">
            {recentComments.map((c) => (
              <li key={`${c.article_slug}-${c.created_at}`} className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate font-mono text-[10px] uppercase tracking-wider text-muted">
                    {c.article_slug}
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="font-display text-[10px] uppercase text-muted">{commentStatusLabel(c.status)}</span>
                    <span className="font-display text-[10px] text-muted">
                      {new Date(c.created_at).toLocaleDateString("en", { month: "short", day: "numeric" })}
                    </span>
                  </span>
                </div>
                <p className="line-clamp-1 text-sm text-fg">{c.body}</p>
                <p className="font-display text-[10px] text-muted">by {c.author_name}</p>
              </li>
            ))}
            {recentComments.length === 0 && (
              <p className="font-display text-[11px] text-muted">No comments yet.</p>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
