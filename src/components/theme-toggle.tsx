"use client";

import { useCallback, useSyncExternalStore } from "react";

function subscribeTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  window.addEventListener("storage", callback);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", callback);
  };
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark");
}

/** Light is the default; hydration starts from the server value (false). */
function getServerSnapshot() {
  return false;
}

/**
 * Light is the default theme; this toggle adds/removes `.dark` on <html>
 * (see globals.css). Persisted in localStorage. No flash: an inline script
 * in the root layout sets the class before paint.
 */
export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("aitech-theme", next ? "dark" : "light");
    } catch {
      /* storage unavailable — ignore */
    }
  }, [dark]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface text-muted transition-colors hover:text-fg"
    >
      {dark ? (
        /* sun */
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        /* moon */
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
