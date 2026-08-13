"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/site";
import { ThemeToggle } from "./theme-toggle";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string; avatar?: string | null } | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      fetch("/api/auth/me")
        .then((r) => r.json())
        .then((data) => setUser((data as { session?: { name: string; role: string; avatar?: string | null } | null }).session ?? null))
        .catch(() => setUser(null));
    }
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface text-muted lg:hidden"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col border-l border-line bg-bg">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-display text-xl font-bold tracking-tight text-fg">
                AI<span className="text-signal">Tech</span>
              </span>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface text-muted"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-fg hover:bg-surface-2"
                >
                  <span className="font-mono text-[10px] text-signal">▸</span>
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-line px-5 py-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2">
                    {user.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatar}
                        alt=""
                        width={32}
                        height={32}
                        loading="lazy"
                        decoding="async"
                        className="h-8 w-8 flex-none rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-signal font-display text-sm font-bold text-white">
                        {user.name.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-fg">{user.name}</p>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                        Member
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/account"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-md border border-line px-3 py-2 text-center text-sm text-fg"
                    >
                      My Account
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setOpen(false)}
                        className="flex-1 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 px-3 py-2 text-center text-sm font-semibold text-white"
                      >
                        Admin
                      </Link>
                    )}
                    <form action="/api/auth/logout" method="post" className="flex-1">
                      <button
                        type="submit"
                        className="w-full rounded-md border border-line px-3 py-2 text-sm text-fg"
                      >
                        Sign out
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-md border border-line px-3 py-2 text-center text-sm text-fg"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-md bg-signal px-3 py-2 text-center text-sm font-semibold text-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
