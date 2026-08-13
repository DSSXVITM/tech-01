"use client";

import { useMemo, useState } from "react";

const STOPWORDS = new Set(
  "the a an and or but if then else for to of in on at by with from as is are was were be been being it its this that these those i you he she we they them my your our their his her not no yes so very can will would should could".split(" "),
);

function countStats(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = (text.match(/[.!?…]+/g) ?? []).length;
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;

  const freq = new Map<string, number>();
  let total = 0;
  for (const raw of words) {
    const w = raw.toLowerCase().replace(/[^\p{L}\p{N}'-]/gu, "");
    if (!w || w.length < 3 || STOPWORDS.has(w)) continue;
    freq.set(w, (freq.get(w) ?? 0) + 1);
    total++;
  }
  const keywords = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({
      word,
      count,
      pct: total ? Math.round((count / total) * 1000) / 10 : 0,
    }));

  return { words: words.length, chars, charsNoSpaces, sentences, paragraphs, keywords };
}

const fmt = new Intl.NumberFormat("en-US");

export function WordCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => countStats(text), [text]);

  const cards = [
    { label: "Words", value: fmt.format(stats.words) },
    { label: "Characters", value: fmt.format(stats.chars) },
    { label: "Chars (no spaces)", value: fmt.format(stats.charsNoSpaces) },
    { label: "Sentences", value: fmt.format(stats.sentences) },
    { label: "Paragraphs", value: fmt.format(stats.paragraphs) },
    { label: "Reading time", value: stats.words ? `${Math.max(1, Math.round(stats.words / 200))} min` : "—" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here…"
          className="scroll-slim h-72 w-full rounded-xl border border-line bg-surface p-4 font-mono text-sm text-fg outline-none transition-colors focus:border-signal"
          spellCheck={false}
        />
        <div className="mt-3 flex items-center justify-between">
          <p className="font-mono text-[11px] text-muted">Processed locally — nothing is uploaded.</p>
          <button
            type="button"
            onClick={() => setText("")}
            className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted transition-colors hover:text-fg"
          >
            Reset
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {cards.map((c) => (
            <div key={c.label} className="rounded-lg border border-line bg-surface p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{c.label}</p>
              <p className="mt-1.5 font-display text-2xl font-extrabold uppercase text-fg">{c.value}</p>
            </div>
          ))}
        </div>
      </div>

      <aside className="rounded-xl border border-line bg-surface p-5 h-fit">
        <h2 className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-ink">
          Keyword density
        </h2>
        {stats.keywords.length === 0 ? (
          <p className="text-[13px] text-muted">Type something to see top keywords.</p>
        ) : (
          <ul className="space-y-2">
            {stats.keywords.map((k) => (
              <li key={k.word} className="flex items-center gap-2">
                <span className="w-24 truncate font-mono text-[12px] text-fg">{k.word}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <span className="block h-full rounded-full bg-signal" style={{ width: `${Math.min(100, k.pct * 4)}%` }} />
                </span>
                <span className="w-10 flex-none text-right font-mono text-[11px] text-muted">{k.pct}%</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 border-t border-line pt-3 font-mono text-[10px] leading-relaxed text-muted">
          1–3% keyword density is the healthy range for SEO. Stop words are excluded.
        </p>
      </aside>
    </div>
  );
}
