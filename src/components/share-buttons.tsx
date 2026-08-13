"use client";

import { useState } from "react";

function encode(text: string) {
  return encodeURIComponent(text);
}

/**
 * Share buttons — copy link plus X / LinkedIn / Facebook intents and a
 * native share fallback where the platform supports it (falls back to
 * copying the link where navigator.share isn't available).
 */
export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const share = async () => {
    if (!navigator.share) {
      await copy();
      return;
    }
    try {
      await navigator.share({ title, url });
    } catch {
      /* user cancelled */
    }
  };

  const links = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encode(url)}&text=${encode(title)}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encode(url)}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encode(url)}`,
    },
  ];

  return (
    <div className="flex items-center gap-2" aria-label="Share this article">
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-surface px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-fg transition-colors hover:border-signal/50"
      >
        {copied ? "✓ Copied" : "Copy link"}
      </button>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center rounded-md border border-line bg-surface px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-fg transition-colors hover:border-signal/50"
        >
          {l.label}
        </a>
      ))}
      <button
        type="button"
        onClick={share}
        aria-label="Share"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface text-fg transition-colors hover:border-signal/50"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.7" />
          <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      </button>
    </div>
  );
}
