"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Avatar } from "@/components/avatar";

interface CommentItem {
  id: string;
  articleSlug: string;
  userId: string | null;
  parentId: string | null;
  body: string;
  createdAt: string;
  authorName: string;
  authorRole: string | null;
  authorAvatar: string | null;
  score: number;
  userVote: 1 | -1 | 0;
}

interface SessionUser {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en", { month: "short", day: "numeric" });
}

export function CommentsSection({ articleSlug }: { articleSlug: string }) {
  const [comments, setComments] = useState<CommentItem[] | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [voteBusy, setVoteBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [me, list] = await Promise.all([
        fetch("/api/auth/me").then((r) => r.json()),
        fetch(`/api/comments?article=${encodeURIComponent(articleSlug)}`).then((r) => r.json()),
      ]);
      setUser((me as { session?: SessionUser | null }).session ?? null);
      setComments((list as { comments: CommentItem[] }).comments ?? []);
    } catch {
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  }, [articleSlug]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch(`/api/comments?article=${encodeURIComponent(articleSlug)}`).then((r) => r.json()),
    ])
      .then(([me, list]) => {
        if (cancelled) return;
        setUser((me as { session?: SessionUser | null }).session ?? null);
        setComments((list as { comments: CommentItem[] }).comments ?? []);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load comments.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [articleSlug]);

  const tree = useMemo(() => {
    const byParent = new Map<string | null, CommentItem[]>();
    for (const c of comments ?? []) {
      const key = c.parentId;
      const arr = byParent.get(key) ?? [];
      arr.push(c);
      byParent.set(key, arr);
    }
    const sortTop = (a: CommentItem, b: CommentItem) => b.score - a.score || +new Date(a.createdAt) - +new Date(b.createdAt);
    const sortReplies = (a: CommentItem, b: CommentItem) => +new Date(a.createdAt) - +new Date(b.createdAt);
    return { byParent, sortTop, sortReplies };
  }, [comments]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const text = body.trim();
    if (text.length < 2 || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          article: articleSlug,
          body: text,
          parentId: replyingTo,
        }),
      });
      const data = (await res.json()) as { error?: string; comment?: CommentItem };
      if (!res.ok) {
        setError(data.error ?? "Failed to post comment.");
        return;
      }
      setBody("");
      setReplyingTo(null);
      await load();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  async function vote(commentId: string, value: 1 | -1) {
    if (!user || voteBusy) return;
    const current = comments?.find((c) => c.id === commentId);
    if (!current) return;
    const same = current.userVote === value;
    setVoteBusy(commentId);
    try {
      const res = await fetch(`/api/comments/vote${same ? `?commentId=${encodeURIComponent(commentId)}` : ""}`, {
        method: same ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: same ? undefined : JSON.stringify({ commentId, value }),
      });
      const data = (await res.json()) as { error?: string; score?: number; userVote?: 1 | -1 | 0 };
      if (!res.ok) {
        setError(data.error ?? "Failed to vote.");
        return;
      }
      setComments((prev) =>
        (prev ?? []).map((c) =>
          c.id === commentId
            ? { ...c, score: data.score ?? c.score, userVote: data.userVote ?? (same ? 0 : c.userVote) }
            : c,
        ),
      );
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setVoteBusy(null);
    }
  }

  function renderComment(comment: CommentItem, depth: number) {
    const replies = tree.byParent.get(comment.id) ?? [];
    return (
      <div key={comment.id} className={depth > 0 ? "ml-5 border-l border-line pl-4 sm:ml-8 sm:pl-5" : ""}>
        <div className="rounded-lg border border-line bg-surface px-4 py-3">
          <div className="flex items-center gap-2">
            <Avatar seed={comment.userId ?? comment.id} name={comment.authorName} size={28} src={comment.authorAvatar} />
            <span className="text-[13px] font-semibold text-fg">{comment.authorName}</span>
            {comment.authorRole && comment.authorRole !== "reader" && (
              <span className="rounded border border-signal/40 bg-signal/10 px-1.5 py-0.5 font-display text-[9px] uppercase tracking-wider text-signal-ink">
                {comment.authorRole}
              </span>
            )}
            <span className="font-display text-[11px] text-muted">· {timeAgo(comment.createdAt)}</span>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-fg/90">{comment.body}</p>
          <div className="mt-2.5 flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-md border border-line px-1">
              <VoteButton
                label="▲"
                active={comment.userVote === 1}
                busy={voteBusy === comment.id}
                disabled={!user || voteBusy !== null}
                onClick={() => vote(comment.id, 1)}
                title="Upvote"
              />
              <span className={`min-w-[2ch] text-center font-display text-[12px] font-semibold ${comment.score > 0 ? "text-signal-ink" : comment.score < 0 ? "text-danger" : "text-muted"}`}>
                {comment.score}
              </span>
              <VoteButton
                label="▼"
                active={comment.userVote === -1}
                busy={voteBusy === comment.id}
                disabled={!user || voteBusy !== null}
                onClick={() => vote(comment.id, -1)}
                title="Downvote"
              />
            </div>
            {user ? (
              <button
                type="button"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="font-display text-[11px] font-semibold uppercase tracking-wider text-muted transition-colors hover:text-signal-ink"
              >
                Reply
              </button>
            ) : (
              <Link
                href="/login"
                className="font-display text-[11px] font-semibold uppercase tracking-wider text-muted transition-colors hover:text-signal-ink"
              >
                Reply
              </Link>
            )}
          </div>
        </div>
        {replies.map((r) => renderComment(r, depth + 1))}
        {replyingTo === comment.id && (
          <form onSubmit={submit} className="mt-3 ml-5 sm:ml-8">
            <CommentInput
              value={body}
              onChange={setBody}
              sending={sending}
              placeholder={`Reply to ${comment.authorName}…`}
              onCancel={() => setReplyingTo(null)}
            />
          </form>
        )}
      </div>
    );
  }

  const topLevel = tree.byParent.get(null) ?? [];

  return (
    <section id="comments" className="mx-auto mt-12 max-w-[720px] px-4 lg:px-0">
      <h2 className="font-display text-2xl font-bold leading-tight text-fg">
        Comments{" "}
        <span className="font-display text-lg text-muted">({comments?.length ?? 0})</span>
      </h2>

      {!user ? (
        <p className="mt-4 rounded-lg border border-line bg-surface px-4 py-3 text-sm text-muted">
          <Link href="/login" className="font-semibold text-signal-ink hover:underline">
            Sign in
          </Link>{" "}
          to join the discussion.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-4">
          <CommentInput
            value={body}
            onChange={setBody}
            sending={sending}
            placeholder="Share your thoughts…"
          />
        </form>
      )}

      {error && (
        <p className="mt-3 rounded-md border border-danger/40 bg-danger/10 px-3 py-2 font-display text-[12px] text-danger">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {loading && <p className="py-6 text-center text-sm text-muted">Loading comments…</p>}
        {!loading && topLevel.length === 0 && (
          <p className="py-6 text-center text-sm text-muted">
            No comments yet. Be the first to share your thoughts.
          </p>
        )}
        {!loading && topLevel.map((c) => renderComment(c, 0))}
      </div>
    </section>
  );
}

function VoteButton({
  label,
  active,
  busy,
  disabled,
  onClick,
  title,
}: {
  label: string;
  active: boolean;
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      aria-pressed={active}
      className={`px-1.5 py-0.5 text-[11px] leading-none transition-colors ${
        active ? "text-signal-ink" : "text-muted hover:text-signal-ink"
      } ${busy ? "animate-pulse opacity-50" : ""} disabled:cursor-not-allowed`}
    >
      {label}
    </button>
  );
}

function CommentInput({
  value,
  onChange,
  sending,
  placeholder,
  onCancel,
}: {
  value: string;
  onChange: (v: string) => void;
  sending: boolean;
  placeholder: string;
  onCancel?: () => void;
}) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        required
        minLength={2}
        maxLength={2000}
        placeholder={placeholder}
        className="w-full resize-y rounded-lg border border-line bg-bg px-3.5 py-3 text-sm text-fg outline-none focus:border-signal/60"
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={sending || value.trim().length < 2}
          className="rounded-md bg-signal px-4 py-2 font-display text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? "Posting…" : "Post comment"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="font-display text-[12px] uppercase tracking-wider text-muted transition-colors hover:text-fg"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
