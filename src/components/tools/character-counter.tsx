"use client";

import { useMemo, useState } from "react";

const fmt = new Intl.NumberFormat("en-US");

function count(text: string) {
  return {
    chars: text.length,
    charsNoSpaces: text.replace(/\s/g, "").length,
    words: text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0,
    lines: text ? text.split(/\r?\n/).length : 0,
  };
}

export function CharacterCounter() {
  const [text, setText] = useState("");
  const c = useMemo(() => count(text), [text]);

  const items = [
    { label: "Characters", value: fmt.format(c.chars), sub: "including spaces" },
    { label: "Characters (no spaces)", value: fmt.format(c.charsNoSpaces), sub: "word characters only" },
    { label: "Words", value: fmt.format(c.words), sub: "whitespace-delimited" },
    { label: "Lines", value: fmt.format(c.lines), sub: "newline-separated" },
  ];

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here…"
        className="scroll-slim h-64 w-full rounded-xl border border-line bg-surface p-4 font-mono text-sm text-fg outline-none transition-colors focus:border-signal"
        spellCheck={false}
      />
      <div className="mt-3 flex items-center justify-between">
        <p className="font-mono text-[11px] text-muted">Character counts update live.</p>
        <button
          type="button"
          onClick={() => setText("")}
          className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted transition-colors hover:text-fg"
        >
          Reset
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.label} className="rounded-lg border border-line bg-surface p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{it.label}</p>
            <p className="mt-2 font-display text-4xl font-extrabold uppercase text-fg">{it.value}</p>
            <p className="mt-1 font-mono text-[10px] text-muted">{it.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
