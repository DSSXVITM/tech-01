import type { Metadata } from "next";
import Link from "next/link";
import { getTrendingArticles } from "@/content";
import { relativeTime, readingMinutes } from "@/lib/format";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CoverArt } from "@/components/cover-art";
import { StatusTag, getStatusTag } from "@/components/status-tag";

export const metadata: Metadata = {
  title: "Trending",
  description:
    "The most-read AI and technology articles right now — ranked by live reader interest.",
  alternates: { canonical: "/trending" },
};

export default function TrendingPage() {
  const trending = getTrendingArticles();

  return (
    <div className="mx-auto max-w-[960px] px-4 pt-8">
      <Breadcrumbs crumbs={[{ label: "Trending" }]} />
      <header className="mb-8">
        <p className="mb-1.5 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-ink">
          <span className="status-dot is-trending" /> Ranked now
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight text-fg sm:text-6xl">
          Trending
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          What the audience is reading this week — ranked by reader activity.
        </p>
      </header>

      <ol className="divide-y divide-line rounded-2xl border border-line bg-surface">
        {trending.map((article, i) => {
          const tag = getStatusTag(article);
          return (
            <li key={article.slug}>
              <Link
                href={`/${article.category}/${article.slug}`}
                className="group relative block min-h-32 overflow-hidden sm:min-h-36"
              >
                <div className="absolute inset-0 scale-105 transition-transform duration-700 group-hover:scale-110">
                  <CoverArt image={article.image} seed={article.slug} className="h-full w-full" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/90 to-surface/20 transition-colors group-hover:via-surface/80" />
                <div className="relative flex items-center gap-4 p-4 sm:gap-6 sm:p-5">
                  <span className="font-display w-10 flex-none text-4xl font-extrabold text-line transition-colors group-hover:text-signal sm:text-5xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-lg font-bold uppercase leading-tight text-fg group-hover:text-signal-ink sm:text-xl">
                      {article.title}
                    </h2>
                    <p className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted">
                      <span>{article.category.toUpperCase()}</span>
                      <span aria-hidden="true">·</span>
                      <span>{relativeTime(article.publishedAt)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{readingMinutes(article.content)} min</span>
                    </p>
                  </div>
                  {tag && <StatusTag tag={tag} />}
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
