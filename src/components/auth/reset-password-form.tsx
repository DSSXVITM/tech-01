"use client";

import { useState } from "react";
import Link from "next/link";

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="mt-6 rounded-md border border-danger/40 bg-danger/10 px-4 py-4 font-mono text-[12px] text-danger">
        This reset link is missing its token. Request a new one from the forgot
        password page.
      </div>
    );
  }

  if (done) {
    return (
      <div className="mt-6 rounded-md border border-signal/30 bg-signal/10 px-4 py-4 font-mono text-[12px] leading-relaxed text-signal-ink">
        Your password has been updated. You can now{" "}
        <Link href="/login" className="font-semibold underline">
          sign in
        </Link>{" "}
        with your new password.
      </div>
    );
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <div>
        <label
          htmlFor="reset-password"
          className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted"
        >
          New password
        </label>
        <input
          id="reset-password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 w-full rounded-md border border-line bg-bg px-3.5 font-mono text-sm text-fg outline-none focus:border-signal"
        />
      </div>
      <div>
        <label
          htmlFor="reset-confirm"
          className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted"
        >
          Confirm password
        </label>
        <input
          id="reset-confirm"
          type="password"
          required
          autoComplete="new-password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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
        {loading ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
