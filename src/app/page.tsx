import type { Metadata } from "next";
import Link from "next/link";
import {
  getSiteLatest,
  getSiteTrending,
  getSiteBreaking,
  getSiteFeatured,
  getAllArticles,
  getCategories,
  getAuthors,
} from "@/content";
import { Hero } from "@/components/hero";
import { Ticker } from "@/components/ticker";
import { LiveStats } from "@/components/live-stats";
import { ArticleCard } from "@/components/article-card";
import { SectionHeading } from "@/components/section-heading";
import { CircuitDivider } from "@/components/circuit-divider";
import { AdSlot } from "@/components/ad-slot";
import { Newsletter } from "@/components/newsletter";
import { CoverArt } from "@/components/cover-art";

export const metadata: Metadata = {
  title: {
    absolute: "AI Tech — Computer Tutorials You Can Actually Follow",
  },
  description:
    "Step-by-step computer tutorials — Windows, macOS, hardware, software, security, coding and AI. Plain-English guides you can actually follow.",
  alternates: { canonical: "/" },
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const breaking = await getSiteBreaking();
  const featured = breaking ?? (await getSiteFeatured());
  const trending = await getSiteTrending();
  const latest = (await getSiteLatest(9)).filter(
    (a) => !(featured?.featured && a.slug === featured.slug),
  );

  if (!featured) return null;

  return (
    <>
      <Ticker articles={await getSiteLatest(6)} />
      <Hero featured={featured} trending={trending} />

      <div className="mt-5">
        <LiveStats
          articles={getAllArticles()}
          categories={getCategories().length}
          authors={getAuthors().length}
        />
      </div>

      {/* Latest tutorials grid */}
      <section className="mx-auto mt-12 max-w-[1440px] px-4">
        <SectionHeading
          kicker="New this week"
          title="Latest Tutorials"
          href="/tutorials"
          linkLabel="All tutorials"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4">
        <AdSlot slot="home-mid" />
      </div>

      {/* Trending strip */}
      <section className="mx-auto max-w-[1440px] px-4">
        <SectionHeading
          kicker="Most read right now"
          title="Trending"
          href="/trending"
          linkLabel="See rankings"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((article, i) => (
            <Link
              key={article.slug}
              href={`/${article.category}/${article.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-signal/40"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <CoverArt
                  image={article.image}
                  seed={article.slug}
                  className="h-full w-full transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <span className="absolute left-3 top-3 rounded-full border border-line bg-surface/90 px-2.5 py-1 font-display text-sm font-extrabold text-fg shadow-sm backdrop-blur-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-3 font-display text-lg font-bold uppercase leading-none text-fg group-hover:text-signal-ink">
                  {article.title}
                </h3>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted">
                  {article.category} · {new Date(article.publishedAt).toLocaleDateString("en", { month: "short", day: "numeric" })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4">
        <CircuitDivider className="mt-10" />
      </div>

      {/* Newsletter */}
      <section className="mx-auto mt-12 max-w-[1440px] px-4">
        <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-8 sm:p-12">
          <div className="circuit-trace pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative mx-auto max-w-2xl text-center">
            <p className="mb-2 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-ink">
              <span className="status-dot is-live" /> The How-To Digest
            </p>
            <h2 className="font-display text-3xl font-bold leading-tight text-fg sm:text-4xl">
              Get the Digest in your inbox
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
              One new how-to every week — the guide you actually needed,
              no fluff, straight to your inbox.
            </p>
            <div className="mx-auto mt-6 max-w-md">
              <Newsletter />
            </div>
            <p className="mt-3 font-mono text-[10px] text-muted">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4">
        <AdSlot slot="home-bottom" />
      </div>
    </>
  );
}
