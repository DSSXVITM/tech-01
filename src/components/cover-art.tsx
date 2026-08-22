import Image from "next/image";
import { CoverImage } from "@/components/cover-image";
import type { ArticleImage } from "@/content/types";

/**
 * Deterministic, dependency-free cover art.
 *
 * Renders a clean, light abstract "editorial still" — soft gradient
 * background tinted by the category accent, a faint grid and a few
 * geometric accents — seeded from the article slug so it never changes
 * between deploys. No external images, crisp at any size.
 */

const TONES: Record<string, { accent: string; label: string }> = {
  windows: { accent: "#3b5bff", label: "WINDOWS" },
  macos: { accent: "#5b8def", label: "MACOS" },
  hardware: { accent: "#ff7a59", label: "HARDWARE" },
  software: { accent: "#7c5cff", label: "SOFTWARE" },
  internet: { accent: "#2ba8f0", label: "INTERNET" },
  security: { accent: "#17a673", label: "SECURITY" },
  coding: { accent: "#f59e0b", label: "CODING" },
  ai: { accent: "#e85bb0", label: "AI & AUTO" },
  live: { accent: "#f59e0b", label: "LIVE" },
  generic: { accent: "#4f46e5", label: "AI TECH" },
};

/** Mulberry32 — tiny deterministic PRNG so art is stable per seed. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function Accents({ seed, accent }: { seed: string; accent: string }) {
  const rnd = mulberry32(hashString(seed) ^ 0x9e3779b9);
  const shapes: React.ReactNode[] = [];
  const W = 1200;
  const H = 630;
  for (let i = 0; i < 7; i++) {
    const x = Math.round(rnd() * W);
    const y = Math.round(rnd() * H);
    const s = 22 + Math.round(rnd() * 60);
    const kind = i % 3;
    if (kind === 0) {
      shapes.push(
        <circle key={i} cx={x} cy={y} r={s / 2} fill="none" stroke={accent} strokeOpacity={0.18} strokeWidth={2} />,
      );
    } else if (kind === 1) {
      shapes.push(
        <rect
          key={i}
          x={x}
          y={y}
          width={s}
          height={s}
          rx={6}
          fill={accent}
          fillOpacity={0.08}
          transform={`rotate(${Math.round(rnd() * 24)} ${x + s / 2} ${y + s / 2})`}
        />,
      );
    } else {
      shapes.push(
        <path
          key={i}
          d={`M${x} ${y} l${s * 0.6} ${-s * 0.35} l0 ${s * 0.7} Z`}
          fill={accent}
          fillOpacity={0.1}
        />,
      );
    }
  }
  return <>{shapes}</>;
}

export function CoverArt({
  image,
  seed,
  className,
}: {
  image: ArticleImage;
  seed: string;
  className?: string;
}) {
  // Bundled static cover (public/images/articles/<slug>.svg) wins over the
  // generated fallback art. These are tiny already-optimized SVGs, so the
  // Next.js image optimizer is skipped via `unoptimized`.
  if (image.src) {
    // Bundled article covers live in public/images/articles and are served
    // from GitHub via CDN(s) — use the multi-source fallback component so a
    // cover still appears even if a specific CDN is blocked in the visitor's
    // region.
    if (image.src.includes("/images/articles/")) {
      return <CoverImage slug={seed} alt={image.alt} className={className} />;
    }
    // Admin-uploaded covers are stored as base64 data URIs — the Next.js
    // Image optimizer can't serve those, so render a plain <img> instead.
    if (image.src.startsWith("data:")) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          className={className}
        />
      );
    }
    return (
      <Image
        src={image.src}
        alt={image.alt}
        width={1200}
        height={630}
        unoptimized
        loading="lazy"
        decoding="async"
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
        className={className}
      />
    );
  }

  const tone = TONES[image.cover] ?? TONES.generic;
  // Derive a unique accent per article from the slug so every fallback cover
  // looks different — otherwise articles without an uploaded image would all
  // share the same template and appear to "repeat".
  const hue = hashString(seed) % 360;
  const accent = `hsl(${hue}, 78%, 54%)`;
  return (
    <svg
      viewBox="0 0 1200 630"
      role="img"
      aria-label={image.alt}
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`bg-${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f4f5f8" />
          <stop offset="55%" stopColor="#fbfbfd" />
          <stop offset="100%" stopColor="#f1f2f7" />
        </linearGradient>
        <radialGradient id={`glow-${seed}`} cx="74%" cy="20%" r="85%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.22" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <pattern id={`grid-${seed}`} width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M44 0H0V44" fill="none" stroke="#1b2133" strokeOpacity="0.05" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="1200" height="630" fill={`url(#bg-${seed})`} />
      <rect width="1200" height="630" fill={`url(#glow-${seed})`} />
      <rect width="1200" height="630" fill={`url(#grid-${seed})`} />
      <Accents seed={seed} accent={accent} />

      {/* accent corner block */}
      <rect x="0" y="0" width="6" height="630" fill={accent} opacity="0.9" />

      {/* category label */}
      <text
        x="86"
        y="92"
        fontFamily="JetBrains Mono, monospace"
        fontSize="30"
        letterSpacing="9"
        fill="#1b2133"
        fillOpacity="0.55"
      >
        {tone.label}
      </text>

      {/* soft wordmark */}
      <text
        x="86"
        y="470"
        fontFamily="'Sora', sans-serif"
        fontSize="150"
        fontWeight="700"
        letterSpacing="-2"
        fill="#171a22"
        fillOpacity="0.07"
      >
        AI TECH
      </text>
    </svg>
  );
}
