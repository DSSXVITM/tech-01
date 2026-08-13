import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

const TOOLS = [
  { href: "/tools/word-counter", label: "Word Counter" },
  { href: "/tools/character-counter", label: "Character Counter" },
  { href: "/tools/meta-description-generator", label: "Meta Description Generator" },
];

/**
 * Shared shell for the Free Tools section. Client-side only — your text
 * never leaves the browser, which is the whole point.
 */
export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-8">
      <Breadcrumbs crumbs={[{ label: "Tools" }]} />

      <header className="mb-8">
        <p className="mb-1.5 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-ink">
          <span className="status-dot is-trending" /> Free utilities
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight text-fg sm:text-6xl">
          Free Tools
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Fast, client-side utilities for writers and developers. Everything runs in your browser —
          nothing is uploaded, ever.
        </p>
      </header>

      <nav aria-label="Tools" className="mb-8 flex flex-wrap gap-2">
        {TOOLS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="rounded-md border border-line bg-surface px-3.5 py-2 font-mono text-[12px] uppercase tracking-[0.08em] text-muted transition-colors hover:border-signal/50 hover:text-fg"
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
