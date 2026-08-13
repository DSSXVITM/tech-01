import type { Metadata } from "next";
import { getSiteLatest } from "@/content";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArticleCard } from "@/components/article-card";
import { AdSlot } from "@/components/ad-slot";

export const metadata: Metadata = {
  title: "Latest News",
  description:
    "The full AI and technology news feed — live coverage of models, launches, security incidents and software.",
  alternates: { canonical: "/news" },
};

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const articles = await getSiteLatest(60);

  return (
    <div className="mx-auto max-w-[1440px] px-4 pt-8">
      <Breadcrumbs crumbs={[{ label: "Latest News" }]} />
      <header className="mb-8">
        <p className="mb-1.5 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-ink">
          <span className="status-dot is-live" /> Live feed
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight text-fg sm:text-6xl">
          Latest News
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Every article on the feed, newest first. Bookmark this page — it's where the news cycle
          lands.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      <AdSlot slot="news-bottom" />
    </div>
  );
}
