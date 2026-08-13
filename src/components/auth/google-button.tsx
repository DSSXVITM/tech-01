"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * "Continue with Google" — custom button backed by Google Identity Services.
 * We draw our own button (matching the site design) and trigger Google's
 * popup via `prompt()` on click, instead of using Google's default iframe
 * button. On success the ID token is posted to /api/auth/google, which
 * verifies it and starts a session.
 */

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            prompt_parent_id?: string;
            ux_mode?: "popup" | "redirect";
            use_fedcm_for_prompt?: boolean;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.08 3.57-5.15 3.57-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.29a12 12 0 0 0 0 10.76l3.98-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.76c1.76 0 3.35.6 4.6 1.8l3.43-3.43A11.99 11.99 0 0 0 1.29 6.62l3.98 3.1C6.22 6.87 8.87 4.76 12 4.76Z"
      />
    </svg>
  );
}

export function GoogleLoginButton({ clientId }: { clientId: string | null }) {
  const router = useRouter();
  const initRef = useRef(false);
  const promptRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!clientId || initRef.current) return;
    initRef.current = true;

    const cid: string = clientId;

    function init() {
      const gsi = window.google?.accounts?.id;
      if (!gsi) return;
      gsi.initialize({
        client_id: cid,
        ux_mode: "popup",
        prompt_parent_id: "google-login-area",
        // Disable FedCM. Chrome aborts the FedCM credential-get when a prompt
        // is interrupted, and GSI then logs a spurious
        // "[GSI_LOGGER]: FedCM get() rejects with AbortError" to the console.
        // Opting out of FedCM keeps the classic popup flow and removes that
        // console noise.
        use_fedcm_for_prompt: false,
        callback: async (response) => {
          setError(null);
          setBusy(true);
          try {
            const res = await fetch("/api/auth/google", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ credential: response.credential }),
            });
            const data = (await res.json()) as { error?: string };
            if (!res.ok) {
              setError(data.error ?? "Google sign-in failed.");
              return;
            }
            window.dispatchEvent(new Event("auth-changed"));
            const next = new URLSearchParams(window.location.search).get("next") ?? "/";
            router.push(next);
            router.refresh();
          } catch {
            setError("Network error. Please try again.");
          } finally {
            setBusy(false);
          }
        },
      });
    }

    if (window.google?.accounts?.id) {
      init();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => init();
    document.head.appendChild(script);
  }, [clientId, router]);

  if (!clientId) return null;

  function onSignIn() {
    setError(null);
    // The "FedCM get() rejects with AbortError" console error comes from
    // Google's own logger when prompt() fires while a FedCM prompt is already
    // pending (e.g. a double click). Guard so we only ever call it once per
    // interaction, which silences that spurious AbortError.
    if (promptRef.current) return;
    promptRef.current = true;
    window.google?.accounts?.id?.prompt();
    window.setTimeout(() => {
      promptRef.current = false;
    }, 8000);
  }

  function releasePrompt() {
    promptRef.current = false;
  }

  return (
    <div id="google-login-area" className="space-y-3">
      <button
        type="button"
        onClick={onSignIn}
        onBlur={releasePrompt}
        disabled={busy}
        className="group flex h-11 w-full items-center justify-center gap-3 rounded-md border border-line bg-surface px-4 font-display text-sm font-semibold text-fg transition-all hover:border-signal/50 hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <GoogleIcon />
        {busy ? "Signing in…" : "Continue with Google"}
        <span className="ml-auto text-muted opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
          →
        </span>
      </button>
      {error && (
        <p className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 font-mono text-[12px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
