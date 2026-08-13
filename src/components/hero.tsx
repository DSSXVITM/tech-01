import Link from "next/link";
import type { Article } from "@/content/types";
import { getAuthorBySlug, getCategoryBySlugSafe } from "@/content";
import { relativeTime, readingMinutes } from "@/lib/format";
import { CoverArt } from "./cover-art";
import { StatusTag, getStatusTag } from "./status-tag";

/**
 * Clean editorial hero. Left: the featured story as a large card with the
 * cover on top and the headline below. Right: compact "Most read" list.
 */
export function Hero({ featured, trending }: { featured: Article; trending: Article[] }) {
  const tag = getStatusTag(featured);
  const author = getAuthorBySlug(featured.author);
  const category = getCategoryBySlugSafe(featured.category);

  return (
    <section className="mx-auto max-w-[1440px] px-4 pt-6 sm:pt-8">
      <div className="grid gap-5 lg:grid-cols-[1.85fr_1fr]">
        {/* Left — featured story */}
        <Link
          href={`/${featured.category}/${featured.slug}`}
          className="group overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-shadow hover:shadow-none"
        >
          <div className="relative aspect-[16/8] overflow-hidden sm:aspect-[16/7]">
            <CoverArt
              image={featured.image}
              seed={featured.slug}
              className="h-full w-full transition-transform duration-700 group-hover:scale-[1.02]"
            />
            {tag && (
              <div className="absolute left-4 top-4">
                <span className="rounded-full border border-line bg-surface/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">
                  <StatusTag tag={tag} size="lg" />
                </span>
              </div>
            )}
            {featured.sponsored && (
              <span className="absolute right-4 top-4 rounded-full border border-amber/40 bg-surface/90 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-amber shadow-sm backdrop-blur-sm">
                Sponsored
              </span>
            )}
          </div>

          <div className="p-5 sm:p-8">
            <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted">
              {category && (
                <span
                  className="rounded-full border border-line px-2.5 py-0.5 font-semibold uppercase tracking-[0.12em]"
                  style={{ color: category.color }}
                >
                  {category.name}
                </span>
              )}
              <span>{author?.name ?? "AI Tech Desk"}</span>
              <span aria-hidden="true">·</span>
              <span>{relativeTime(featured.publishedAt)}</span>
              <span aria-hidden="true">·</span>
              <span>{readingMinutes(featured.content)} min read</span>
            </div>
            <h1 className="max-w-3xl font-display text-3xl font-bold text-fg group-hover:text-signal-ink sm:text-5xl">
              {featured.title}
            </h1>
            <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              {featured.excerpt}
            </p>
            <span className="mt-4 inline-flex items-center gap-2 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-signal-ink">
              Read the guide <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </div>
        </Link>

        {/* Right — trending list */}
        <aside className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 className="flex items-center gap-2 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-signal-ink">
              <span className="status-dot is-trending" />
              Most read
            </h2>
            <Link
              href="/trending"
              className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-fg"
            >
              View all →
            </Link>
          </div>
          <div className="scroll-slim flex-1 divide-y divide-line overflow-y-auto" style={{ maxHeight: 540 }}>
            {trending.map((item) => (
              <TrendingRow key={item.slug} article={item} />
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function TrendingRow({ article }: { article: Article }) {
  const tag = getStatusTag(article);
  return (
    <Link
      href={`/${article.category}/${article.slug}`}
      className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-2"
    >
      <span className="font-display text-xl font-bold text-muted/40 transition-colors group-hover:text-signal">
        {String(article.trendingRank ?? "").padStart(2, "0")}
      </span>
      <div className="relative h-12 w-16 flex-none overflow-hidden rounded-md border border-line">
        <CoverArt image={article.image} seed={article.slug} className="h-full w-full" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-[13px] font-medium leading-snug text-fg group-hover:text-signal-ink">
          {article.title}
        </p>
        <p className="mt-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted">
          {relativeTime(article.publishedAt)}
          {tag && (
            <span className="flex items-center gap-1 text-amber">
              <span className={`${tag.kind === "trending" ? "status-dot is-trending" : "status-dot is-updated"}`} />
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
