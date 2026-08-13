/** Date + reading-time formatting shared across cards and article pages. */

export function formatDate(iso: string, locale = "en"): string {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string, locale = "en"): string {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** Compact relative label, e.g. "2h ago". Static-friendly (computed at build). */
export function relativeTime(iso: string, now = Date.now()): string {
  const diffMs = now - new Date(iso).getTime();
  const minutes = Math.max(0, Math.round(diffMs / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return formatDate(iso);
}

/** Approximate reading time for a block-based article. */
export function readingMinutes(content: { type: string; text?: string; items?: string[] }[]): number {
  const words = content.reduce((total, block) => {
    if ("text" in block && typeof block.text === "string") {
      return total + block.text.split(/\s+/).length;
    }
    if ("items" in block && Array.isArray(block.items)) {
      return total + block.items.join(" ").split(/\s+/).length;
    }
    return total;
  }, 0);
  return Math.max(1, Math.round(words / 200));
}

export function toISO(date: Date): string {
  return date.toISOString();
}
