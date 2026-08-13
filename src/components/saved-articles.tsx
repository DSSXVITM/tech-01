"use client";

import Link from "next/link";
import { useState } from "react";
import type { Article } from "@/content/types";
import { CoverArt } from "./cover-art";
import { getStatusTag, StatusTag } from "./status-tag";
import { relativeTime } from "@/lib/format";

/**
 * Saved-articles list for the account page. Receives the resolved articles
 * from the server; removes an article optimistically when the user unsaves it.
 */
export function SavedArticles({ articles }: { articles: Article[] }) {
  const [list, setList] = useState<Article[]>(articles);
  const [busy, setBusy] = useState<string | null>(null);

  async function remove(slug: string) {
    if (busy) return;
    setBusy(slug);
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article: slug }),
      });
      const data = (await res.json()) as { saved?: boolean };
      if (res.ok && data.saved === false) {
        setList((prev) => prev.filter((a) => a.slug !== slug));
      }
    } catch {
      /* ignore */
    } finally {
      setBusy(null);
    }
  }

  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface/40 px-6 py-12 text-center">
        <p className="font-display text-lg font-bold text-fg">Nothing saved yet</p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Use the <span className="font-semibold text-fg">Save</span> button on any
          tutorial to build your reading list.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex h-10 items-center rounded-md bg-signal px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90"
        >
          Browse tutorials
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {list.map((a) => {
        const tag = getStatusTag(a);
        return (
          <div
            key={a.slug}
            className="group overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-signal/40"
          >
            <Link href={`/${a.category}/${a.slug}`} className="block">
              <div className="relative h-32 overflow-hidden">
                <CoverArt image={a.image} seed={a.slug} className="h-full w-full" />
                {tag && (
                  <span className="absolute left-3 top-3">
                    <StatusTag tag={tag} />
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="line-clamp-2 font-display text-[15px] font-bold leading-snug text-fg group-hover:text-signal-ink">
                  {a.title}
                </h3>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted">
                  {relativeTime(a.publishedAt)}
                </p>
              </div>
            </Link>
            <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Saved</span>
              <button
                type="button"
                onClick={() => remove(a.slug)}
                disabled={busy === a.slug}
                className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted transition-colors hover:text-danger disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
