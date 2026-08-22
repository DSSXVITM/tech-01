"use client";

import { useState } from "react";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="mt-6 rounded-md border border-signal/30 bg-signal/10 px-4 py-4 font-mono text-[12px] leading-relaxed text-signal-ink">
        If an account exists for <span className="font-semibold">{email}</span>, we&apos;ve sent a
        password reset link. Check your inbox (and spam folder). The link expires in 1 hour.
      </div>
    );
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <div>
        <label
          htmlFor="forgot-email"
          className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted"
        >
          Email
        </label>
        <input
          id="forgot-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 w-full rounded-md border border-line bg-bg px-3.5 font-mono text-sm text-fg outline-none focus:border-signal"
        />
      </div>

      {error && (
        <p className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 font-mono text-[12px] text-danger">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-md bg-signal font-mono text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send reset link"}
      </button>

      <p className="text-center font-mono text-[11px] text-muted">
        <Link href="/login" className="text-signal-ink hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  );
}
