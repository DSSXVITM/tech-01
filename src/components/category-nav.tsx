"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useLayoutEffect, useRef, useState } from "react";

export interface NavItem {
  href: string;
  label: string;
  color?: string;
}

/**
 * Big uppercase category links in the header.
 *
 * `moreAfter` pins the "More" button right after that item's link; every item
 * after it always lives in the dropdown. Items before it still auto-hide into
 * "More" on narrow screens. The dropdown is portaled to <body> because the nav
 * clips its contents with overflow-hidden.
 */
export function CategoryNav({
  items,
  utilities,
  moreAfter,
}: {
  items: NavItem[];
  utilities: NavItem[];
  moreAfter?: string;
}) {
  const splitIndex = moreAfter
    ? items.findIndex((i) => i.href === moreAfter)
    : items.length - 1;
  const split = splitIndex >= 0 ? splitIndex : items.length - 1;
  const primary = items.slice(0, split + 1);
  const secondary = items.slice(split + 1);

  const [hidden, setHidden] = useState(0);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ left: number; bottom: number } | null>(null);
  const barRef = useRef<HTMLElement>(null);
  const moreRef = useRef<HTMLButtonElement>(null);
  const widthsRef = useRef<number[]>([]);

  function toggleMore() {
    const rect = moreRef.current?.getBoundingClientRect();
    setAnchor(
      rect
        ? { left: Math.max(8, Math.min(rect.left, window.innerWidth - 264)), bottom: rect.bottom }
        : null,
    );
    setOpen((v) => !v);
  }

  const gap = 18;
  const hiddenPrimary = hidden;
  const hiddenItems = [...primary.slice(primary.length - hiddenPrimary), ...secondary];
  const moreVisible = secondary.length > 0 || hiddenPrimary > 0;

  function measure() {
    const el = barRef.current;
    if (!el) return;
    const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-nav-item]"));
    const moreNode = el.querySelector<HTMLElement>("[data-more]");
    if (widthsRef.current.length !== nodes.length) {
      widthsRef.current = nodes.map((n) => n.offsetWidth);
    } else {
      nodes.forEach((n, i) => {
        if (!n.hidden) widthsRef.current[i] = n.offsetWidth;
      });
    }
    const moreW = moreNode ? moreNode.offsetWidth + gap : 0;
    const avail = el.clientWidth - moreW;
    let used = 0;
    let count = 0;
    for (const w of widthsRef.current) {
      if (w > 0 && used + w + (count > 0 ? gap : 0) <= avail) {
        used += w + (count > 0 ? gap : 0);
        count++;
      } else break;
    }
    setHidden(nodes.length - count);
  }

  useLayoutEffect(() => {
    measure();
    const el = barRef.current;
    const ro = new ResizeObserver(() => measure());
    if (el) ro.observe(el);
    window.addEventListener("resize", () => {
      setOpen(false);
      measure();
    });
    window.addEventListener("scroll", () => setOpen(false), { capture: true });
    const t = window.setTimeout(measure, 400);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", () => setOpen(false), { capture: true });
      window.clearTimeout(t);
    };
  }, []);

  return (
    <>
      <nav
        ref={barRef}
        className="flex min-w-0 flex-1 items-center overflow-hidden"
        style={{ gap }}
        aria-label="Categories"
      >
        {primary.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            data-nav-item
            hidden={i >= primary.length - hiddenPrimary}
            className="inline-flex flex-none items-center gap-1.5 whitespace-nowrap font-display text-base font-bold uppercase tracking-tight text-fg transition-colors hover:text-signal"
          >
            {item.color && (
              <span
                className="h-2 w-2 flex-none rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
            )}
            {item.label}
          </Link>
        ))}

        {moreVisible && (
          <button
            ref={moreRef}
            data-more
            type="button"
            onClick={toggleMore}
            className="inline-flex flex-none items-center gap-1 whitespace-nowrap font-display text-base font-bold uppercase tracking-tight text-muted transition-colors hover:text-fg"
            aria-haspopup="menu"
            aria-expanded={open}
          >
            More
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </nav>

      {open &&
        moreVisible &&
        anchor &&
        createPortal(
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
            <div
              role="menu"
              className="fixed z-50 w-64 rounded-xl border border-line bg-bg p-2 shadow-xl"
              style={{
                top: anchor.bottom + 8,
                left: anchor.left,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {hiddenItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-display text-sm font-bold uppercase tracking-tight text-fg hover:bg-surface-2"
                >
                  {item.color && (
                    <span
                      className="h-2 w-2 flex-none rounded-full"
                      style={{ backgroundColor: item.color }}
                      aria-hidden="true"
                    />
                  )}
                  {item.label}
                </Link>
              ))}
              <div className="my-1 h-px bg-line" aria-hidden="true" />
              {utilities.map((u) => (
                <Link
                  key={u.href}
                  href={u.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-2 hover:text-fg"
                >
                  {u.label}
                </Link>
              ))}
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
