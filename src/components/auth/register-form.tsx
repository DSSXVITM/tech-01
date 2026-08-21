"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

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
      const data = (await res.json()) as { error?: string; needsVerification?: boolean; email?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not create your account.");
        return;
      }
      if (data.needsVerification) {
        setRegisteredEmail(data.email ?? email);
        setNeedsVerification(true);
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

  if (needsVerification) {
    return (
      <div className="mt-6 rounded-lg border border-signal/30 bg-signal-soft p-5 text-center">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-ink">
          Almost there
        </p>
        <h2 className="mt-1 font-display text-xl font-bold text-fg">Check your email</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          We sent a confirmation link to{" "}
          <span className="font-medium text-fg">{registeredEmail}</span>. Click it to activate your
          account. If it doesn&apos;t arrive in a few minutes, check your spam folder.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block font-mono text-[12px] uppercase tracking-[0.06em] text-signal-ink hover:underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

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
