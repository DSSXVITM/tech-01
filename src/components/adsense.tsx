"use client";

import { usePathname } from "next/navigation";

const ADSENSE_CLIENT = "ca-pub-3684897541406213";

const EXCLUDED = [
  "/api",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/account",
  "/admin",
];

function isRestricted(pathname: string): boolean {
  const p = pathname || "/";
  return EXCLUDED.some(
    (prefix) => p === prefix || p.startsWith(prefix + "/"),
  );
}

export function AdsenseScript() {
  const pathname = usePathname() || "/";
  if (isRestricted(pathname)) return null;
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}

export function AdUnit({
  slot,
  format = "auto",
  style,
  className,
}: {
  slot: string;
  format?: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  const pathname = usePathname() || "/";
  if (isRestricted(pathname)) return null;
  return (
    <ins
      className={`adsbygoogle ${className ?? ""}`.trim()}
      style={style ?? { display: "block" }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
