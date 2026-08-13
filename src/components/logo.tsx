import Link from "next/link";

/**
 * AI Tech logo — a gradient rounded badge with a hexagon "chip" holding an
 * eight-point AI spark and a linked neural node, followed by the AI Tech
 * wordmark. Reused in the header, footer, mobile menu and admin shell; the
 * favicon (app/icon.svg) mirrors the mark.
 */

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ait-logo" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#d946ef" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#ait-logo)" />
      <path d="M16 7 23.1 11.2v9.6L16 25 8.9 20.8v-9.6z" stroke="#fff" strokeOpacity="0.28" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M16 8.8l6.5 3.75v7.5L16 23.8l-6.5-3.75v-7.5z" stroke="#fff" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M16 13.5v5M13.5 16h5M14.3 14.3l3.4 3.4M17.7 14.3l-3.4 3.4" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M22.5 12.55l2.6-3.1" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="25.6" cy="8.7" r="1.7" fill="#fff" />
    </svg>
  );
}

export function Logo({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const box = size === "sm" ? "h-6 w-6" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
  const text = size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-2xl";
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`} aria-label="AI Tech — home">
      <span className={`relative flex flex-none ${box}`}>
        <LogoMark className="h-full w-full" />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber ring-2 ring-bg" />
      </span>
      <span className={`font-display ${text} font-bold tracking-tight text-fg`}>
        AI<span className="text-signal">Tech</span>
      </span>
    </Link>
  );
}
