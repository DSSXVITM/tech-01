import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[760px] flex-col items-center px-4 py-24 text-center">
      <p className="font-display text-8xl font-extrabold uppercase leading-none text-line">
        404
      </p>
      <div className="mt-4 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-amber">
        <span className="status-dot is-live" /> Signal lost
      </div>
      <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-fg">
        Page not found
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
        This story may have moved, been taken down, or never existed. The news
        cycle waits for no one.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-md bg-signal px-4 py-2.5 font-mono text-[12px] font-semibold uppercase tracking-[0.1em] text-white"
        >
          Back to homepage
        </Link>
        <Link
          href="/news"
          className="rounded-md border border-line px-4 py-2.5 font-mono text-[12px] font-semibold uppercase tracking-[0.1em] text-fg"
        >
          Latest News
        </Link>
      </div>
    </div>
  );
}
