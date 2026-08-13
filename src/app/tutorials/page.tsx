import type { Metadata } from "next";
import { getSiteLatest } from "@/content";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArticleCard } from "@/components/article-card";
import { AdSlot } from "@/components/ad-slot";

export const metadata: Metadata = {
  title: "All Tutorials",
  description:
    "Every how-to on the site, newest first — Windows, macOS, hardware, software, internet, security, coding and AI.",
  alternates: { canonical: "/tutorials" },
};

export const dynamic = "force-dynamic";

export default async function TutorialsPage() {
  const articles = await getSiteLatest(60);

  return (
    <div className="mx-auto max-w-[1440px] px-4 pt-8">
      <Breadcrumbs crumbs={[{ label: "All Tutorials" }]} />
      <header className="mb-8">
        <p className="mb-1.5 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-ink">
          <span className="status-dot is-live" /> Every guide
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight text-fg sm:text-6xl">
          All Tutorials
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Step-by-step guides in plain English, newest first. Every step is tested on a
          clean machine before it goes live.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      <AdSlot slot="tutorials-bottom" />
    </div>
  );
}
