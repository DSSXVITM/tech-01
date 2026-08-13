import Link from "next/link";
import type { Article } from "@/content/types";
import { getAuthorBySlug, getCategoryBySlugSafe } from "@/content";
import { relativeTime, readingMinutes } from "@/lib/format";
import { CoverArt } from "./cover-art";
import { StatusTag, getStatusTag } from "./status-tag";

/**
 * Article card. `featured` is the homepage live-feed hero variant;
 * `compact` is the "Trending now" ticker row.
 */
export function ArticleCard({
  article,
  variant = "default",
}: {
  article: Article;
  variant?: "default" | "featured" | "compact";
}) {
  const tag = getStatusTag(article);
  const author = getAuthorBySlug(article.author);
  const category = getCategoryBySlugSafe(article.category);

  if (variant === "compact") {
    return (
      <Link
        href={`/${article.category}/${article.slug}`}
        className="group flex items-center gap-3 rounded-lg border border-transparent px-2 py-2.5 transition-colors hover:border-line hover:bg-surface-2"
      >
        <div className="relative h-11 w-16 flex-none overflow-hidden rounded-md border border-line">
          <CoverArt image={article.image} seed={article.slug} className="h-full w-full" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-[13px] font-medium leading-snug text-fg group-hover:text-signal-ink">
            {article.title}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted">
            {relativeTime(article.publishedAt)}
          </p>
        </div>
        {tag && <StatusTag tag={tag} />}
      </Link>
    );
  }

  return (
    <Link
      href={`/${article.category}/${article.slug}`}
      className={`group flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-card transition-shadow hover:shadow-none ${
        variant === "featured" ? "" : "h-full"
      }`}
    >
      <div className={`relative flex-none overflow-hidden ${variant === "featured" ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        <CoverArt
          image={article.image}
          seed={article.slug}
          className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          {tag && (
            <span className="rounded-full border border-line bg-bg/80 px-2.5 py-1 backdrop-blur-sm">
              <StatusTag tag={tag} />
            </span>
          )}
        </div>
        {category && (
          <span className="absolute right-3 top-3 rounded-full border border-line bg-bg/80 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted backdrop-blur-sm">
            {category.name}
          </span>
        )}
        {article.sponsored && (
          <span className="absolute bottom-3 right-3 rounded border border-amber/50 bg-bg/80 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-amber">
            Sponsored
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3
          className={`font-display font-bold leading-relaxed text-fg transition-colors group-hover:text-signal-ink ${
            variant === "featured" ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
        >
          {article.title}
        </h3>
        {variant === "featured" ? (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">{article.excerpt}</p>
        ) : (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted">{article.excerpt}</p>
        )}
        <div className="mt-auto flex items-center gap-2 pt-3 font-mono text-[11px] text-muted">
          <span className="truncate">{author?.name ?? "AI Tech Desk"}</span>
          <span aria-hidden="true" className="text-signal">
            ▸
          </span>
          <span className="flex-none">{relativeTime(article.publishedAt)}</span>
          <span aria-hidden="true" className="flex-none text-signal">
            ·
          </span>
          <span className="flex-none">{readingMinutes(article.content)} min read</span>
        </div>
      </div>
    </Link>
  );
}
