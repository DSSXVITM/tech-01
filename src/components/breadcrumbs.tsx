import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

/** Mono breadcrumb trail used on category, author and article pages. */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5">
      <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
        <li>
          <Link href="/" className="transition-colors hover:text-fg">
            Home
          </Link>
        </li>
        {crumbs.map((c) => (
          <li key={c.label} className="flex items-center gap-1.5">
            <span aria-hidden="true" className="text-signal">
              ▸
            </span>
            {c.href ? (
              <Link href={c.href} className="transition-colors hover:text-fg">
                {c.label}
              </Link>
            ) : (
              <span className="max-w-[220px] truncate text-fg">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
