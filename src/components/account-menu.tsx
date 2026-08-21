"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "reader" | "author" | "editor" | "admin";
  avatar?: string | null;
}

/**
 * Session-aware account area for the header. Reads the session from
 * /api/auth/me on the client so the shared layout stays static-friendly.
 */
export function AccountMenu() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        const res = await fetch("/api/auth/me");
        const data = (await res.json()) as { session?: SessionUser | null };
        if (!cancelled) setUser(data.session ?? null);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    void refresh();
    window.addEventListener("auth-changed", refresh);
    return () => {
      cancelled = true;
      window.removeEventListener("auth-changed", refresh);
    };
  }, []);

  if (!loaded) {
    return (
      <div className="hidden h-9 items-center lg:flex">
        <span className="h-6 w-24 animate-pulse rounded-md bg-surface-2" aria-hidden="true" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="hidden items-center gap-4 lg:flex">
        <Link
          href="/login"
          className="font-mono text-[12px] uppercase tracking-[0.06em] text-muted transition-colors hover:text-fg"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="rounded-md bg-signal px-3.5 py-2 font-mono text-[12px] font-semibold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-4 lg:flex">
      {user.role === "admin" && (
        <Link
          href="/admin"
          className="flex items-center gap-2 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 px-3 py-2 font-display text-sm font-bold uppercase tracking-wide text-white shadow-sm transition-opacity hover:opacity-90"
        >
          <AdminMark className="h-4 w-4" />
          Admin
        </Link>
      )}
      <Link
        href="/account"
        className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3 transition-colors hover:border-signal/40"
      >
        {user.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar}
            alt=""
            width={24}
            height={24}
            loading="lazy"
            decoding="async"
            className="h-6 w-6 flex-none rounded-full object-cover"
          />
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-signal font-mono text-[11px] font-bold text-white">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
        )}
        <span className="max-w-[140px] truncate font-mono text-[12px] text-fg">{user.name}</span>
      </Link>
      <form action="/api/auth/logout" method="post">
        <button
          type="submit"
          className="font-mono text-[12px] uppercase tracking-[0.06em] text-muted transition-colors hover:text-fg"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}

function AdminMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path d="M16 7 23.1 11.2v9.6L16 25 8.9 20.8v-9.6z" stroke="#fff" strokeOpacity="0.28" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M16 8.8l6.5 3.75v7.5L16 23.8l-6.5-3.75v-7.5z" stroke="#fff" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M16 13.5v5M13.5 16h5M14.3 14.3l3.4 3.4M17.7 14.3l-3.4 3.4" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M22.5 12.55l2.6-3.1" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="25.6" cy="8.7" r="1.7" fill="#fff" />
    </svg>
  );
}
