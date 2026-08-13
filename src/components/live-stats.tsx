import type { Article } from "@/content/types";

/**
 * Control-room readout: live pulse + editorial counts in a hairline grid.
 * `gap-px` on the container with `bg-line` shows the dividers through the
 * gap, so cells read as one dashboard strip.
 */
export function LiveStats({
  articles,
  categories,
  authors,
}: {
  articles: Article[];
  categories: number;
  authors: number;
}) {
  const latest = new Date(
    Math.max(...articles.map((a) => +new Date(a.publishedAt))),
  );
  const updated = latest.toLocaleTimeString("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const cells = [
    {
      live: true,
      label: "Feed updated",
      value: `24/7 · ${updated}`,
    },
    { label: "Guides live", value: String(articles.length).padStart(2, "0") },
    { label: "Categories", value: String(categories).padStart(2, "0") },
    { label: "Writers", value: String(authors).padStart(2, "0") },
  ];

  return (
    <section className="mx-auto max-w-[1440px] px-4" aria-label="Live feed statistics">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
        {cells.map((cell) => (
          <div
            key={cell.label}
            className={`bg-surface px-5 py-4 ${cell.live ? "col-span-2 sm:col-span-1" : ""}`}
          >
            <p
              className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] ${
                cell.live ? "text-amber" : "text-muted"
              }`}
            >
              {cell.live && <span className="status-dot is-live" aria-hidden="true" />}
              {cell.label}
            </p>
            <p className="mt-1.5 font-mono text-[13px] font-semibold uppercase tracking-[0.04em] text-fg">
              {cell.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
