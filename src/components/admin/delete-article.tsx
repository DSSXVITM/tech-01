"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteArticleButton({ slug, disabled }: { slug: string; disabled?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    if (!window.confirm("Delete this article permanently? This can't be undone.")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/articles/${slug}`, { method: "DELETE" });
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

  return (
    <div className="space-y-1 text-right">
      <button
        type="button"
        disabled={busy || disabled}
        onClick={remove}
        title={disabled ? "Static articles can't be deleted from the admin panel" : "Delete article"}
        className={`rounded-md border border-danger/40 bg-danger/10 px-2.5 py-1.5 font-display text-[11px] font-semibold uppercase tracking-wider text-danger transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30`}
      >
        {busy ? "Deleting…" : "Delete"}
      </button>
      {error && <p className="font-display text-[10px] text-danger">{error}</p>}
    </div>
  );
}
