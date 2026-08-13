import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

export function StaticPage({
  title,
  kicker = "Reference",
  children,
}: {
  title: string;
  kicker?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[760px] px-4 pt-8">
      <Breadcrumbs crumbs={[{ label: title }]} />
      <header className="mb-8">
        <p className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-ink">
          {kicker}
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight text-fg sm:text-5xl">
          {title}
        </h1>
      </header>
      <div className="prose-article">{children}</div>
      <p className="mt-10">
        <Link href="/" className="font-mono text-[12px] text-signal-ink hover:underline">
          ← Back to AI Tech
        </Link>
      </p>
    </div>
  );
}
