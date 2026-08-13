"use client";

/** Opens the search dialog (dialog subscribes to the "aitech:search" event). */
export function SearchTrigger() {
  return (
    <button
      type="button"
      aria-label="Search articles"
      onClick={() => window.dispatchEvent(new Event("aitech:search"))}
      className="hidden h-9 w-9 items-center justify-center rounded-md border border-line bg-surface text-muted transition-colors hover:text-fg sm:inline-flex"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
        <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </button>
  );
}
