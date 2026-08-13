import type { AffiliateProduct } from "@/content/types";

/**
 * Comparison table template — the monetization core of the "best of"
 * articles. Renders a compact side-by-side table plus full product cards,
 * each with a clearly-labeled (sponsored) affiliate link and a disclosure.
 */
export function ComparisonTable({
  products,
}: {
  products: AffiliateProduct[];
}) {
  if (products.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="font-display text-2xl font-extrabold uppercase leading-none text-fg">
        Side-by-side comparison
      </h2>
      <p className="mt-1.5 font-mono text-[11px] text-muted">
        Ranked by our overall score. Pricing checked {new Date().toLocaleDateString("en", { month: "short", year: "numeric" })}.
      </p>

      {/* Compact table */}
      <div className="mt-4 overflow-x-auto rounded-lg border border-line">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-2">
              <th className="px-3.5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-signal-ink">Tool</th>
              <th className="hidden px-3.5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-signal-ink md:table-cell">Best for</th>
              <th className="px-3.5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-signal-ink">Rating</th>
              <th className="hidden px-3.5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-signal-ink sm:table-cell">Price</th>
              <th className="px-3.5 py-2.5 text-right font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-signal-ink">Link</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.name} className="border-b border-line last:border-0">
                <td className="px-3.5 py-3">
                  <span className="block font-medium text-fg">{p.name}</span>
                  {p.badge && (
                    <span className="mt-1 inline-block rounded border border-amber/50 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-amber">
                      {p.badge}
                    </span>
                  )}
                </td>
                <td className="hidden px-3.5 py-3 text-[13px] text-muted md:table-cell">{p.bestFor}</td>
                <td className="px-3.5 py-3 font-mono text-[13px] text-amber">{p.rating.toFixed(1)}</td>
                <td className="hidden px-3.5 py-3 font-mono text-[12px] text-muted sm:table-cell">{p.price}</td>
                <td className="px-3.5 py-3 text-right">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-block rounded-md bg-signal px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90"
                  >
                    Visit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Full product cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {products.map((p) => (
          <article key={p.name} className="flex flex-col rounded-xl border border-line bg-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-bold uppercase leading-none text-fg">{p.name}</h3>
                <p className="mt-1 text-[13px] text-muted">{p.tagline}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[13px] font-bold text-amber">{p.rating.toFixed(1)}</p>
                <p className="font-mono text-[10px] text-muted">/ 5.0</p>
              </div>
            </div>

            <dl className="mt-4 grid gap-2 text-[13px]">
              <div className="flex gap-2">
                <dt className="w-20 flex-none font-mono text-[11px] uppercase tracking-wider text-muted">Best for</dt>
                <dd className="text-fg">{p.bestFor}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-20 flex-none font-mono text-[11px] uppercase tracking-wider text-muted">Price</dt>
                <dd className="text-fg">{p.price}</dd>
              </div>
            </dl>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#2FBF8F]">Pros</h4>
                <ul className="space-y-1">
                  {p.pros.map((pro) => (
                    <li key={pro} className="flex gap-1.5 text-[12.5px] leading-snug text-muted">
                      <span className="text-[#2FBF8F]">+</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-danger">Cons</h4>
                <ul className="space-y-1">
                  {p.cons.map((con) => (
                    <li key={con} className="flex gap-1.5 text-[12.5px] leading-snug text-muted">
                      <span className="text-danger">−</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-signal px-4 font-mono text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90"
            >
              Visit {p.name} →
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
