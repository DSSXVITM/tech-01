"use client";

import { useEffect, useRef, useState } from "react";
import { Flag } from "./flag";

const LOCALES: { code: string; label: string; enabled: boolean }[] = [
  { code: "en", label: "English", enabled: true },
  { code: "de", label: "Deutsch", enabled: false },
  { code: "fr", label: "Français", enabled: false },
  { code: "es", label: "Español", enabled: false },
  { code: "it", label: "Italiano", enabled: false },
  { code: "pt", label: "Português", enabled: false },
  { code: "nl", label: "Nederlands", enabled: false },
  { code: "pl", label: "Polski", enabled: false },
  { code: "tr", label: "Türkçe", enabled: false },
];

const active = LOCALES.find((l) => l.enabled) ?? LOCALES[0];

/**
 * Language selector. The i18n architecture supports 10 locales; only English
 * ships at launch (per the brief's Phase 4 policy), so the rest are shown
 * disabled rather than shipping placeholder translations.
 */
export function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Change language"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 font-mono text-xs text-muted transition-colors hover:text-fg"
      >
        <Flag code={active.code} />
        <span className="font-semibold">{active.code.toUpperCase()}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-50 w-44 overflow-hidden rounded-lg border border-line bg-surface shadow-card">
          <p className="border-b border-line px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted">
            Language
          </p>
          <ul className="p-1">
            {LOCALES.map((l) => (
              <li key={l.code}>
                {l.enabled ? (
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-left text-sm text-fg hover:bg-surface-2"
                    onClick={() => setOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <Flag code={l.code} />
                      {l.label}
                    </span>
                    <span className="font-mono text-[10px] text-signal">●</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="flex w-full cursor-not-allowed items-center justify-between rounded-md px-3 py-1.5 text-left text-sm text-muted opacity-60"
                  >
                    <span className="flex items-center gap-2">
                      <Flag code={l.code} />
                      {l.label}
                    </span>
                    <span className="font-mono text-[10px]">soon</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
