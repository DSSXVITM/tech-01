"use client";

import { useCallback } from "react";

/**
 * "Continue with Google" — navigates to /api/auth/google/login, which
 * redirects to accounts.google.com (server-side OAuth2 flow). We use a full
 * page navigation (window.location) rather than the Next.js router, because
 * pushing an API route through the SPA router triggers a failed RSC payload
 * fetch and a "Failed to fetch" console error before falling back.
 */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-auto" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.08 3.57-5.15 3.57-8.81Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.29a12 12 0 0 0 0 10.76l3.98-3.1Z" />
      <path fill="#EA4335" d="M12 4.76c1.76 0 3.35.6 4.6 1.8l3.43-3.43A11.99 11.99 0 0 0 1.29 6.62l3.98 3.1C6.22 6.87 8.87 4.76 12 4.76Z" />
    </svg>
  );
}

export function GoogleLoginButton({ clientId }: { clientId: string | null }) {
  const onClick = useCallback(() => {
    const next = new URLSearchParams(window.location.search).get("next") ?? "/";
    window.location.href = `/api/auth/google/login?next=${encodeURIComponent(next)}`;
  }, []);

  if (!clientId) return null;

  return (
    <div id="google-login-area" className="space-y-3">
      <button
        type="button"
        onClick={onClick}
        className="group flex h-11 w-full items-center justify-center gap-3 rounded-md border border-line bg-surface px-4 font-display text-sm font-semibold text-fg transition-all hover:border-signal/50 hover:bg-surface-2"
      >
        <GoogleIcon />
        Continue with Google
        <span className="ml-auto text-muted opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
          →
        </span>
      </button>
    </div>
  );
}
