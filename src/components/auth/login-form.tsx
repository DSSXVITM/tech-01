"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [unverified, setUnverified] = useState(false);
  const [resendDone, setResendDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setUnverified(false);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string; code?: string };
      if (!res.ok) {
        setError(data.error ?? "Login failed. Please try again.");
        if (data.code === "unverified") setUnverified(true);
        return;
      }
      const next = new URLSearchParams(window.location.search).get("next") ?? "/";
      window.dispatchEvent(new Event("auth-changed"));
      router.push(next);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function resendVerification() {
    setResendDone(false);
    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setResendDone(true);
    } catch {
      /* ignore */
    }
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <div>
        <label htmlFor="login-email" className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 w-full rounded-md border border-line bg-bg px-3.5 font-mono text-sm text-fg outline-none focus:border-signal"
        />
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="login-password" className="font-mono text-[11px] uppercase tracking-wider text-muted">
            Password
          </label>
          <Link href="/forgot-password" className="font-mono text-[10px] uppercase tracking-wider text-muted hover:text-signal-ink">
            Forgot password?
          </Link>
        </div>
        <input
          id="login-password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 w-full rounded-md border border-line bg-bg px-3.5 font-mono text-sm text-fg outline-none focus:border-signal"
        />
      </div>

      {error && (
        <p className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 font-mono text-[12px] text-danger">
          {error}
        </p>
      )}

      {unverified && (
        <div className="rounded-md border border-signal/30 bg-signal/10 px-3 py-2 font-mono text-[12px] text-signal-ink">
          <p>We sent a confirmation link to your inbox. Didn&apos;t get it?</p>
          <button
            type="button"
            onClick={resendVerification}
            className="mt-1 font-semibold underline"
          >
            Resend verification email
          </button>
          {resendDone && <p className="mt-1">Sent — check your email.</p>}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-md bg-signal font-mono text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
