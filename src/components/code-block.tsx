"use client";

import { useState } from "react";

export function CodeBlock({ lang, text }: { lang?: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-line bg-surface-2">
      <div className="flex items-center justify-between border-b border-line bg-surface px-3.5 py-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          {lang ?? "code"}
        </span>
        <button
          type="button"
          onClick={copy}
          className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-fg"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <pre className="scroll-slim overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-fg">
        {text}
      </pre>
    </div>
  );
}
