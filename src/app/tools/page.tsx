import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Tools",
  description:
    "Free SEO and developer tools — word counter, character counter and meta description generator. Fast, client-side, private.",
  alternates: { canonical: "/tools" },
};

const TOOLS = [
  {
    href: "/tools/word-counter",
    title: "Word Counter",
    desc: "Words, characters, sentences, paragraphs, reading time and keyword density — live.",
    group: "SEO Tools",
  },
  {
    href: "/tools/character-counter",
    title: "Character Counter",
    desc: "Character and word counts with and without spaces, plus line count.",
    group: "SEO Tools",
  },
  {
    href: "/tools/meta-description-generator",
    title: "Meta Description Generator",
    desc: "Turn article copy into a search-ready meta description under 160 characters.",
    group: "AI Tools",
  },
];

export default function ToolsIndexPage() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {TOOLS.map((tool) => (
        <Link
          key={tool.href}
          href={tool.href}
          className="group flex flex-col rounded-xl border border-line bg-surface p-6 transition-colors hover:border-signal/40"
        >
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-signal-ink">
            {tool.group}
          </p>
          <h2 className="mt-2 font-display text-xl font-bold uppercase leading-none text-fg group-hover:text-signal-ink">
            {tool.title}
          </h2>
          <p className="mt-3 flex-1 text-[13px] leading-relaxed text-muted">{tool.desc}</p>
          <span className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-signal">
            Open tool →
          </span>
        </Link>
      ))}
    </div>
  );
}
