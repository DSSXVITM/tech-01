import Link from "next/link";
import type { Article } from "@/content/types";

/**
 * Quiet "Latest" strip. A simple flex row of the newest titles with a
 * compact signal chip on the left — no animation, no broadcast styling.
 */
export function Ticker({ articles }: { articles: Article[] }) {
  const items = articles.slice(0, 6);

  return (
    <div className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 overflow-hidden px-4">
        <span className="flex flex-none items-center gap-1.5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-signal-ink">
          <span className="status-dot is-trending" aria-hidden="true" />
          Latest
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-5 overflow-hidden">
          {items.map((article) => (
            <Link
              key={article.slug}
              href={`/${article.category}/${article.slug}`}
              className="truncate py-2.5 font-mono text-[12px] uppercase tracking-[0.04em] text-muted transition-colors hover:text-signal-ink"
            >
              {article.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
