"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CommentStatus } from "@/lib/db/comments";

const STATUS_ORDER: CommentStatus[] = ["pending", "approved", "hidden"];

export function CommentActions({ commentId, status }: { commentId: string; status: CommentStatus }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function setStatus(next: CommentStatus) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Request failed.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm("Delete this comment permanently?")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/comments/${commentId}`, { method: "DELETE" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Request failed.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  const btn =
    "rounded-md border px-2.5 py-1.5 font-display text-[11px] font-semibold uppercase tracking-wider transition-opacity disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={status}
          disabled={busy}
          onChange={(e) => setStatus(e.target.value as CommentStatus)}
          className="rounded-md border border-line bg-surface px-2.5 py-1.5 font-display text-[12px] text-fg outline-none focus:border-signal/60"
          title="Change moderation status"
        >
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {status === "pending" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => setStatus("approved")}
            className={`${btn} border border-signal/40 bg-signal/10 text-signal-ink hover:opacity-80`}
          >
            Approve
          </button>
        )}

        <button
          type="button"
          disabled={busy}
          onClick={remove}
          className={`${btn} border border-danger/40 bg-danger/10 text-danger hover:opacity-80`}
        >
          Delete
        </button>
      </div>

      {error && <p className="font-display text-[11px] text-danger">{error}</p>}
    </div>
  );
}
