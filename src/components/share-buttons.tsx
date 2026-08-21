"use client";

import { useState } from "react";

function encode(text: string) {
  return encodeURIComponent(text);
}

/**
 * Share buttons — copy link plus X / LinkedIn / Facebook intents and a
 * native share fallback where the platform supports it.
 *
 * `url` is the canonical public URL (passed from the server). The copy
 * action tries the async Clipboard API first and falls back to a hidden
 * textarea + execCommand so it still works in non-secure contexts.
 */
export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  const copy = async () => {
    setFailed(false);
    let ok = false;
    try {
      await navigator.clipboard.writeText(url);
      ok = true;
    } catch {
      /* Clipboard API blocked — try the legacy fallback below. */
    }

    if (!ok) {
      try {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "-9999px";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }

    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setFailed(true);
      setTimeout(() => setFailed(false), 3000);
    }
  };

  const share = async () => {
    if (typeof navigator.share !== "function") {
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
      href: `https://x.com/intent/tweet?url=${encode(url)}&text=${encode(title)}`,
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
    <div className="flex flex-wrap items-center gap-2" aria-label="Share this article">
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-surface px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-fg transition-colors hover:border-signal/50"
      >
        {copied ? "✓ Copied" : failed ? "Copy failed" : "Copy link"}
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
