"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "aitech-consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const apply = (granted: boolean) => {
    const value = granted ? "granted" : "denied";
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: value,
        ad_user_data: value,
        ad_personalization: value,
        analytics_storage: value,
      });
    }
    try {
      localStorage.setItem(STORAGE_KEY, granted ? "granted" : "denied");
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/95 px-4 py-4 shadow-lg backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-700">
          We use cookies to measure traffic and serve personalized ads. You can
          accept or reject non-essential cookies. See our{" "}
          <a
            href="/privacy"
            className="font-medium text-slate-900 underline"
          >
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => apply(false)}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => apply(true)}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
