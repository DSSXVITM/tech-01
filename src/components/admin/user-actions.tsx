"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UserRole } from "@/lib/db/auth";

const ROLES: UserRole[] = ["reader", "author", "editor", "admin"];

export function UserActions({
  userId,
  currentRole,
  banned,
  isSelf,
}: {
  userId: string;
  currentRole: UserRole;
  banned: boolean;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  async function run(action: string, extra?: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Request failed.");
        return;
      }
      setShowPassword(false);
      setPassword("");
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    await run("password", { password });
  }

  async function deleteUser() {
    if (!window.confirm(`Delete this user? This cannot be undone.`)) return;
    await run("delete");
  }

  const inputCls =
    "w-full rounded-md border border-line bg-surface px-2.5 py-1.5 font-display text-[12px] text-fg outline-none focus:border-signal/60";

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={currentRole}
          disabled={busy || isSelf}
          onChange={(e) => run("role", { role: e.target.value })}
          className={inputCls}
          title={isSelf ? "You cannot change your own role" : "Change role"}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={busy || isSelf}
          onClick={() => run(banned ? "unban" : "ban")}
          className={`rounded-md px-2.5 py-1.5 font-display text-[11px] font-semibold uppercase tracking-wider transition-opacity disabled:cursor-not-allowed disabled:opacity-40 ${
            banned
              ? "border border-signal/40 bg-signal/10 text-signal-ink"
              : "border border-danger/40 bg-danger/10 text-danger"
          }`}
          title={isSelf ? "You cannot ban your own account" : banned ? "Unban user" : "Ban user"}
        >
          {banned ? "Unban" : "Ban"}
        </button>

        <button
          type="button"
          disabled={busy || isSelf}
          onClick={() => setShowPassword((s) => !s)}
          className="rounded-md border border-line px-2.5 py-1.5 font-display text-[11px] uppercase tracking-wider text-muted transition-colors hover:text-fg"
        >
          {showPassword ? "Cancel" : "Set password"}
        </button>

        <button
          type="button"
          disabled={busy || isSelf}
          onClick={deleteUser}
          className="rounded-md border border-danger/40 px-2.5 py-1.5 font-display text-[11px] font-semibold uppercase tracking-wider text-danger transition-colors hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-40"
          title={isSelf ? "You cannot delete your own account" : "Delete user"}
        >
          Delete
        </button>
      </div>

      {showPassword && (
        <form onSubmit={changePassword} className="flex items-center gap-2">
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
            placeholder="New password (8+)"
            className={`${inputCls} flex-1`}
          />
          <button
            type="submit"
            disabled={busy || password.length < 8}
            className="rounded-md bg-signal px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Save
          </button>
        </form>
      )}

      {error && <p className="font-display text-[11px] text-danger">{error}</p>}
    </div>
  );
}
