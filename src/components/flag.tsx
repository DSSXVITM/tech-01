"use client";

/**
 * Inline SVG flags for the language selector. Windows does not render
 * flag emoji (they show as empty boxes), so we ship small, dependency-free
 * SVG flags instead. Each is a 3:2 rounded rectangle.
 */

function Base({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 30 20"
      className="h-3.5 w-5 flex-none rounded-[3px] ring-1 ring-line"
      aria-hidden="true"
      role="img"
      preserveAspectRatio="xMidYMid slice"
    >
      {children}
    </svg>
  );
}

function Flags({ code }: { code: string }) {
  switch (code) {
    case "de": // Germany
      return (
        <Base>
          <rect width="30" height="20" fill="#000" />
          <rect y="6.66" width="30" height="6.66" fill="#DD0000" />
          <rect y="13.33" width="30" height="6.66" fill="#FFCE00" />
        </Base>
      );
    case "fr": // France
      return (
        <Base>
          <rect width="30" height="20" fill="#fff" />
          <rect width="10" height="20" fill="#0055A4" />
          <rect x="20" width="10" height="20" fill="#EF4135" />
        </Base>
      );
    case "es": // Spain
      return (
        <Base>
          <rect width="30" height="20" fill="#AA151B" />
          <rect y="5" width="30" height="10" fill="#F1BF00" />
          <rect x="13.5" y="7" width="3" height="6" fill="#AA151B" />
        </Base>
      );
    case "it": // Italy
      return (
        <Base>
          <rect width="30" height="20" fill="#fff" />
          <rect width="10" height="20" fill="#009246" />
          <rect x="20" width="10" height="20" fill="#CE2B37" />
        </Base>
      );
    case "pt": // Portugal
      return (
        <Base>
          <rect width="30" height="20" fill="#046A38" />
          <rect x="10.5" width="19.5" height="20" fill="#DA291C" />
          <circle cx="9.5" cy="10" r="4" fill="#FFE900" />
        </Base>
      );
    case "nl": // Netherlands
      return (
        <Base>
          <rect width="30" height="20" fill="#AE1C28" />
          <rect y="6.66" width="30" height="6.66" fill="#fff" />
          <rect y="13.33" width="30" height="6.66" fill="#21468B" />
        </Base>
      );
    case "pl": // Poland
      return (
        <Base>
          <rect width="30" height="20" fill="#fff" />
          <rect y="10" width="30" height="10" fill="#DC143C" />
        </Base>
      );
    case "tr": // Turkey
      return (
        <Base>
          <rect width="30" height="20" fill="#E30A17" />
          <circle cx="13" cy="10" r="4.5" fill="#fff" />
          <circle cx="14.5" cy="10" r="3.6" fill="#E30A17" />
          <path
            d="M17.5 7.2 L18.6 9.6 L21.2 9.6 L19.1 11.2 L20 13.6 L17.5 12.1 L15 13.6 L15.9 11.2 L13.8 9.6 L16.4 9.6 Z"
            fill="#fff"
          />
        </Base>
      );
    case "en":
    default: // United Kingdom
      return (
        <Base>
          <rect width="30" height="20" fill="#012169" />
          <path d="M0 0 L30 20 M30 0 L0 20" stroke="#fff" strokeWidth="6" />
          <path d="M0 0 L30 20 M30 0 L0 20" stroke="#C8102E" strokeWidth="3.2" />
          <path d="M15 0 V20 M0 10 H30" stroke="#fff" strokeWidth="8" />
          <path d="M15 0 V20 M0 10 H30" stroke="#C8102E" strokeWidth="4" />
        </Base>
      );
  }
}

export function Flag({ code }: { code: string }) {
  return <Flags code={code} />;
}
