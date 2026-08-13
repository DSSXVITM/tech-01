import { getAllArticles } from "@/content";

export const metadata = {
  title: "Analytics — AI Tech Admin",
};

export default function AdminAnalyticsPage() {
  const articles = getAllArticles();

  return (
    <div>
      <header className="mb-6">
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Monetization</p>
        <h2 className="mt-1 font-display text-3xl font-bold leading-tight text-fg">
          Analytics
        </h2>
        <p className="mt-2 text-sm text-muted">
          Pageviews, top articles, affiliate clicks and newsletter growth — populated by the Phase 2
          analytics pipeline (<code className="rounded bg-surface-2 px-1.5 py-0.5 font-display text-[12px]">pageviews</code> /{" "}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 font-display text-[12px]">affiliate_clicks</code> tables).
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-line bg-surface p-5">
          <p className="font-display text-[10px] uppercase tracking-[0.12em] text-muted">Total pageviews</p>
          <p className="mt-2 font-display text-4xl font-extrabold text-fg">—</p>
          <p className="mt-1 font-display text-[11px] text-muted">awaiting analytics</p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-5">
          <p className="font-display text-[10px] uppercase tracking-[0.12em] text-muted">Affiliate clicks</p>
          <p className="mt-2 font-display text-4xl font-extrabold text-fg">—</p>
          <p className="mt-1 font-display text-[11px] text-muted">awaiting tracking</p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-5">
          <p className="font-display text-[10px] uppercase tracking-[0.12em] text-muted">Newsletter subs</p>
          <p className="mt-2 font-display text-4xl font-extrabold text-fg">—</p>
          <p className="mt-1 font-display text-[11px] text-muted">local MVP only</p>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-line bg-surface p-5">
        <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-fg">
          Readiest content (by publish recency)
        </h3>
        <ul className="mt-4 divide-y divide-line">
          {articles
            .slice()
            .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
            .slice(0, 5)
            .map((a) => (
              <li key={a.slug} className="flex items-center justify-between gap-3 py-2.5">
                <span className="truncate text-sm text-fg">{a.title}</span>
                <span className="shrink-0 font-display text-[11px] text-muted">{a.category}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
