"use client";

import { useRef, useState } from "react";
import { Avatar } from "@/components/avatar";

/**
 * Profile picture editor for the account page. Reads the file client-side,
 * resizes/crops it to a square via canvas, then uploads the base64 data URI
 * to /api/account/avatar. Emits an auth-changed event so the header avatar
 * refreshes immediately.
 */
export function ProfilePicture({
  name,
  initialAvatar,
}: {
  name: string;
  initialAvatar?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(initialAvatar ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (busy) return;
    if (!file.type.startsWith("image/")) {
      setError("That file isn't an image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("File too large. Choose an image under 8 MB.");
      return;
    }
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      const resized = await resizeToSquare(file, 256);
      const res = await fetch("/api/account/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: resized }),
      });
      const data = (await res.json()) as { error?: string; ok?: boolean; session?: { avatar?: string | null } };
      if (!res.ok) {
        setError(data.error ?? "Could not save the picture.");
        return;
      }
      setAvatar(data.session?.avatar ?? resized);
      setNotice("Profile picture updated.");
      window.dispatchEvent(new Event("auth-changed"));
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove() {
    if (busy) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch("/api/account/avatar", { method: "DELETE" });
      if (!res.ok) {
        setError("Could not remove the picture.");
        return;
      }
      setAvatar(null);
      setNotice("Profile picture removed.");
      window.dispatchEvent(new Event("auth-changed"));
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-5 rounded-lg border border-line bg-bg/40 p-4">
      <div className="relative">
        <Avatar seed={name} name={name} size={72} src={avatar} />
        <span
          className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-bg"
          style={{ background: avatar ? "#17a673" : "#f59e0b" }}
          title={avatar ? "Picture set" : "Initials"}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          Profile picture
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          Square image, recommended under 1.5 MB. Shown next to your name and
          comments.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="rounded-md bg-signal px-3.5 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Saving…" : "Upload photo"}
          </button>
          {avatar && (
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="rounded-md border border-line px-3.5 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-muted transition-colors hover:border-danger/40 hover:text-danger disabled:opacity-50"
            >
              Remove
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
            }}
          />
        </div>

        {error && (
          <p className="mt-2 font-mono text-[12px] text-danger">{error}</p>
        )}
        {notice && (
          <p className="mt-2 font-mono text-[12px] text-signal-ink">{notice}</p>
        )}
      </div>
    </div>
  );
}

/** Reads an image file, crops it to a centered square and resizes to `px`. */
function resizeToSquare(file: File, px: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        const canvas = document.createElement("canvas");
        canvas.width = px;
        canvas.height = px;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no canvas");
        ctx.drawImage(img, sx, sy, side, side, 0, 0, px, px);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      } catch (e) {
        reject(e instanceof Error ? e : new Error("could not process image"));
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("could not read image"));
    };
    img.src = url;
  });
}
