"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not create your account.");
        return;
      }
      window.dispatchEvent(new Event("auth-changed"));
      router.push("/account");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "h-11 w-full rounded-md border border-line bg-bg px-3.5 font-mono text-sm text-fg outline-none focus:border-signal";

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <div>
        <label htmlFor="reg-name" className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted">
          Name
        </label>
        <input
          id="reg-name"
          type="text"
          required
          autoComplete="name"
          placeholder="Ada Lovelace"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="reg-email" className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted">
          Email
        </label>
        <input
          id="reg-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="reg-password" className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted">
          Password
        </label>
        <input
          id="reg-password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Minimum 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
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
        {loading ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
