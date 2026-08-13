"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { getCategoryBySlug } from "@/content/categories";

interface SearchIndexEntry {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
}

const OPEN_EVENT = "aitech:search";

/**
 * Lightweight client-side search over a small static index passed in from
 * the header. No API call, works on fully static hosting.
 *   - The header search button dispatches `aitech:search`.
 *   - "/" opens it from anywhere; Escape closes it.
 */
export function SearchDialog({ index }: { index: SearchIndexEntry[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const openDialog = useCallback(() => {
    setQuery("");
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const closeDialog = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !open && !isTyping(e.target)) {
        e.preventDefault();
        openDialog();
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpenEvent = () => openDialog();
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpenEvent);
    };
  }, [open, openDialog]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [query, index]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={closeDialog}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-line bg-surface shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-muted">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, tools, categories…"
            className="h-14 w-full bg-transparent font-mono text-sm outline-none placeholder:text-muted"
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">ESC</kbd>
        </div>
        <ul className="scroll-slim max-h-[48vh] overflow-y-auto p-2">
          {query && results.length === 0 && (
            <li className="px-3 py-6 text-center font-mono text-xs text-muted">
              No results for “{query}”
            </li>
          )}
          {results.map((a) => {
            const cat = getCategoryBySlug(a.category as never);
            return (
              <li key={a.slug}>
                <Link
                  href={`/${a.category}/${a.slug}`}
                  onClick={closeDialog}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-2"
                >
                  <span
                    className="h-1.5 w-1.5 flex-none rounded-full"
                    style={{ background: cat?.color ?? "var(--signal)" }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-fg">{a.title}</span>
                    <span className="block truncate font-mono text-[11px] text-muted">
                      {a.category.toUpperCase()} · {a.excerpt.slice(0, 80)}…
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}
