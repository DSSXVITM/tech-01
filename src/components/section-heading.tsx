import Link from "next/link";

/** Section header — mono kicker + display headline + optional "view all" link. */
export function SectionHeading({
  kicker,
  title,
  href,
  linkLabel = "View all",
}: {
  kicker?: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {kicker && (
          <p className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-ink">
            {kicker}
          </p>
        )}
        <h2 className="font-display text-2xl font-bold leading-tight text-fg sm:text-3xl">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="flex-none font-mono text-[11px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-fg"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
