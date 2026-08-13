import type { ArticleSource } from "@/content/types";

/**
 * Sources block — required element for AI/tech news. Claims are linked to
 * their origin rather than left unsourced.
 */
export function SourcesBlock({ sources }: { sources: ArticleSource[] }) {
  return (
    <section className="mt-10 rounded-xl border border-line bg-surface p-5" aria-label="Sources">
      <h3 className="mb-4 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-ink">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        Sources
      </h3>
      <ol className="space-y-2.5">
        {sources.map((source, i) => (
          <li key={source.url} className="flex items-baseline gap-3 font-mono text-[13px]">
            <span className="flex-none text-signal-ink">{String(i + 1).padStart(2, "0")}</span>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 truncate text-fg underline-offset-3 transition-colors hover:text-signal hover:underline"
            >
              {source.label}
            </a>
            <span className="ml-auto flex-none text-muted" aria-hidden="true">
              ↗
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
