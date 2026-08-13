import type { Article, StatusTag } from "@/content/types";

/** Build the status tag for an article. "UPDATED" is derived from updatedAt. */
export function getStatusTag(article: Article): StatusTag | null {
  if (article.status === "breaking") return { kind: "breaking", label: "Breaking" };
  if (article.status === "live") return { kind: "live", label: "Live" };
  if (article.status === "trending") return { kind: "trending", label: "Trending" };
  if (article.status === "updated" && article.updatedAt) {
    return { kind: "updated", minutesAgo: Math.round((Date.now() - new Date(article.updatedAt).getTime()) / 60000) };
  }
  if (article.updatedAt) {
    return { kind: "updated", minutesAgo: Math.round((Date.now() - new Date(article.updatedAt).getTime()) / 60000) };
  }
  return null;
}

function labelFor(tag: StatusTag): string {
  switch (tag.kind) {
    case "live":
      return tag.label.toUpperCase();
    case "breaking":
      return tag.label.toUpperCase();
    case "trending":
      return tag.label.toUpperCase();
    case "updated":
      return `UPDATED ${relativeTimeFromMinutes(tag.minutesAgo).toUpperCase()}`;
  }
}

function relativeTimeFromMinutes(minutes: number): string {
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

const DOT_CLASS: Record<StatusTag["kind"], string> = {
  live: "status-dot is-live",
  breaking: "status-dot is-breaking",
  updated: "status-dot is-updated",
  trending: "status-dot is-trending",
};

/**
 * Signature element — small colored dot + mono label encoding real recency
 * information. Amber is reserved for live/breaking/updated; blue for trending.
 */
export function StatusTag({ tag, size = "sm" }: { tag: StatusTag; size?: "sm" | "lg" }) {
  const sizeClass = size === "lg" ? "text-[0.72rem] gap-2" : "text-[0.62rem] gap-1.5";
  return (
    <span
      className={`inline-flex items-center font-mono font-semibold uppercase tracking-[0.14em] ${sizeClass}`}
      style={{ color: tag.kind === "trending" ? "var(--signal-ink)" : "var(--amber)" }}
    >
      <span className={DOT_CLASS[tag.kind]} aria-hidden="true" />
      {labelFor(tag)}
    </span>
  );
}
