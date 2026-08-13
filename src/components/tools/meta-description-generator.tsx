"use client";

import { useMemo, useState } from "react";

const SUFFIXES = [
  "In-depth, independent and up to date.",
  "Tested in the real world — no fluff.",
  "Get the details, cut the noise.",
  "What changed, why it matters, and what to do next.",
];

function buildMeta(title: string, body: string, variant: number): string {
  const clean = body.replace(/\s+/g, " ").trim();
  if (!clean) return "";

  const sentences = clean.match(/[^.!?]+[.!?]+/g) ?? [];
  const first = (sentences[0] ?? clean).trim();

  // Start from the first sentence, hard-capped at ~150 chars.
  let base = first;
  if (base.length > 150) {
    base = base.slice(0, 150);
    const cut = Math.max(base.lastIndexOf("."), base.lastIndexOf(" "));
    if (cut > 80) base = base.slice(0, cut + 1);
  }

  // If there's room, append a value prop (variants cycle on "Nudge").
  const cap = 160;
  const suffix = SUFFIXES[variant % SUFFIXES.length];
  const glue = base.endsWith(".") ? " " : ". ";
  let out = base;
  if (out.length + glue.length + suffix.length <= cap) {
    out = out + glue + suffix;
  }
  // Absolute trim.
  if (out.length > cap) out = out.slice(0, cap - 1).trimEnd() + "…";
  return out;
}

export function MetaDescriptionGenerator() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [variant, setVariant] = useState(0);
  const [copied, setCopied] = useState(false);

  const meta = useMemo(() => buildMeta(title, body, variant), [title, body, variant]);

  const length = meta.length;
  const status = length === 0 ? "idle" : length <= 155 ? "ok" : "warn";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(meta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div>
          <label htmlFor="meta-title" className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Title (optional)
          </label>
          <input
            id="meta-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Best SEO Tools 2026"
            className="h-11 w-full rounded-md border border-line bg-surface px-3.5 font-mono text-sm text-fg outline-none focus:border-signal"
          />
        </div>
        <div>
          <label htmlFor="meta-body" className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Article copy
          </label>
          <textarea
            id="meta-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste the opening of your article. We extract the first sentence and shape it into a search-ready description."
            className="scroll-slim h-56 w-full rounded-xl border border-line bg-surface p-4 font-mono text-sm text-fg outline-none transition-colors focus:border-signal"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setVariant((v) => v + 1)}
            className="rounded-md bg-signal px-4 py-2.5 font-mono text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90"
          >
            Generate
          </button>
          <button
            type="button"
            onClick={() => setVariant((v) => v + 1)}
            className="rounded-md border border-line px-4 py-2.5 font-mono text-[12px] font-semibold uppercase tracking-[0.1em] text-muted transition-colors hover:text-fg"
          >
            Nudge
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-ink">
            Your meta description
          </h2>
          <span
            className={`font-mono text-[11px] ${status === "ok" ? "text-[#2FBF8F]" : status === "warn" ? "text-amber" : "text-muted"}`}
          >
            {length}/160
          </span>
        </div>

        <div
          className={`min-h-32 rounded-lg border p-4 ${
            status === "ok"
              ? "border-[#2FBF8F]/40 bg-[rgba(47,191,143,0.08)]"
              : status === "warn"
                ? "border-amber/40 bg-amber-soft"
                : "border-line bg-surface-2"
          }`}
        >
          {meta ? (
            <p className="font-mono text-[13px] leading-relaxed text-fg">{meta}</p>
          ) : (
            <p className="font-mono text-[12px] text-muted">
              Generated description will appear here. Paste copy on the left and press Generate.
            </p>
          )}
        </div>

        {status === "warn" && (
          <p className="mt-2 font-mono text-[11px] text-amber">
            Over the 160-character limit — Google may truncate. Hit Nudge or trim the copy.
          </p>
        )}
        {status === "ok" && (
          <p className="mt-2 font-mono text-[11px] text-muted">
            {length >= 120 ? "Great length — full description should display in SERPs." : "A bit short — consider adding a value prop (try Nudge)."}
          </p>
        )}

        <button
          type="button"
          onClick={copy}
          disabled={!meta}
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-md border border-line px-4 font-mono text-[12px] font-semibold uppercase tracking-[0.1em] text-fg transition-colors hover:border-signal/50 disabled:opacity-40"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
