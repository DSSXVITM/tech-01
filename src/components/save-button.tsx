"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Save / unsave bookmark button. Reads the session via /api/auth/me so it
 * works on any page; signed-out users are pointed to /login instead.
 */

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill={filled ? "currentColor" : "none"} aria-hidden="true">
      <path
        d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-3.6L6 21V4.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SaveButton({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = (await res.json()) as { session?: { id: string } | null };
        if (cancelled) return;
        const hasSession = Boolean(data.session);
        setLoggedIn(hasSession);
        if (hasSession) {
          const s = await fetch(`/api/saved?article=${encodeURIComponent(slug)}`);
          const sData = (await s.json()) as { saved?: boolean };
          if (!cancelled) setSaved(Boolean(sData.saved));
        }
      } catch {
        if (!cancelled) setLoggedIn(false);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function toggle() {
    if (loggedIn === false) return;
    setBusy(true);
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article: slug }),
      });
      const data = (await res.json()) as { saved?: boolean; error?: string };
      if (res.ok && typeof data.saved === "boolean") setSaved(data.saved);
    } catch {
      /* ignore transient errors */
    } finally {
      setBusy(false);
    }
  }

  const base =
    "inline-flex h-10 items-center gap-2 rounded-md border px-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors disabled:opacity-60";

  if (!loaded) {
    return <span className={`${base} border-line bg-surface text-muted`}>Save</span>;
  }

  if (loggedIn === false) {
    return (
      <Link
        href={`/login?next=/`}
        className={`${base} border-line bg-surface text-muted hover:text-fg`}
      >
        <BookmarkIcon filled={false} />
        Save
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={saved}
      className={`${base} ${
        saved
          ? "border-signal/40 bg-signal/10 text-signal-ink hover:bg-signal/20"
          : "border-line bg-surface text-muted hover:border-signal/40 hover:text-fg"
      }`}
    >
      <BookmarkIcon filled={saved} />
      {saved ? "Saved" : "Save"}
    </button>
  );
}
