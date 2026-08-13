"use client";

import { useState } from "react";

/**
 * Newsletter block.
 * Phase 3: swap `onSubmit` for a real provider API (Mailchimp, beehiiv…).
 * MVP stores a "subscribed" flag locally and shows a success state — no data
 * leaves the browser until a provider is wired in.
 */
export function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    try {
      const existing = JSON.parse(localStorage.getItem("aitech-newsletter") ?? "[]");
      localStorage.setItem(
        "aitech-newsletter",
        JSON.stringify([...existing, { email, at: new Date().toISOString() }]),
      );
    } catch {
      /* ignore storage errors */
    }
    setDone(true);
  };

  if (done) {
    return (
      <div
        className={`flex items-center gap-3 rounded-lg border border-signal/30 bg-signal-soft px-4 py-3 ${
          compact ? "" : "py-4"
        }`}
        role="status"
      >
        <span className="status-dot is-trending" aria-hidden="true" />
        <p className="font-mono text-[13px] text-fg">
          You're on the list. Confirmation email is on its way.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-2 sm:flex-row">
      <label htmlFor={`nl-${compact ? "c" : "h"}`} className="sr-only">
        Email address
      </label>
      <input
        id={`nl-${compact ? "c" : "h"}`}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="h-11 flex-1 rounded-md border border-line bg-bg px-3.5 font-mono text-sm text-fg outline-none transition-colors focus:border-signal"
      />
      <button
        type="submit"
        className="h-11 flex-none rounded-md bg-signal px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90"
      >
        Subscribe
      </button>
    </form>
  );
}
