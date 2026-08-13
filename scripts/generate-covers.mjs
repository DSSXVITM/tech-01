/**
 * Generates one static SVG cover per article into public/images/articles/.
 * Recreates the CoverArt "broadcast still" language (dark control-room,
 * circuit traces, accent bars) but gives each article a real image file with
 * a unique accent, label and the article title baked in — so every article
 * has its own cover for cards, hero and sharing.
 *
 * Run:  node scripts/generate-covers.mjs
 * Regenerate freely: output is deterministic per slug.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "images", "articles");

const ARTICLES = [
  {
    slug: "openai-ships-o4-agentic-runtime",
    title: "OpenAI Ships o4: The Agentic Runtime Arrives",
    accent: "#3B5BFF",
    label: "LIVE",
  },
  {
    slug: "best-ai-video-generators-2026",
    title: "Best AI Video Generators 2026: Tested and Ranked",
    accent: "#FF7A59",
    label: "VIDEO",
  },
  {
    slug: "gemini-30-vs-claude-45",
    title: "Gemini 3.0 vs Claude 4.5: Two Different Ways of Thinking",
    accent: "#A970FF",
    label: "MODELS",
  },
  {
    slug: "build-an-ai-agent-no-code",
    title: "How to Build an AI Agent With No Code in 2026",
    accent: "#2FBF8F",
    label: "NO-CODE",
  },
  {
    slug: "flux-24-vs-midjourney-vs-dalle",
    title: "Flux.24 vs Midjourney vs DALL\u00B7E: AI Image Generation in 2026",
    accent: "#FFB020",
    label: "IMAGE",
  },
  {
    slug: "best-seo-tools-2026",
    title: "Best SEO Tools 2026: The Five We Actually Use",
    accent: "#3BB4FF",
    label: "SEO",
  },
  {
    slug: "best-ai-productivity-apps-2026",
    title: "Best AI Productivity Apps for 2026",
    accent: "#4AD2A6",
    label: "APPS",
  },
  {
    slug: "cursor-vs-copilot-vs-claude-code",
    title: "Cursor vs Copilot vs Claude Code: The 2026 Editor Shootout",
    accent: "#FF5C7A",
    label: "EDITORS",
  },
  {
    slug: "ssr-ssg-or-static-2026",
    title: "SSR, SSG or Static: Picking a Rendering Strategy in 2026",
    accent: "#C792EA",
    label: "RENDERING",
  },
];

/** Mulberry32 — deterministic PRNG (same algorithm as src/components/cover-art.tsx). */
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wrapTitle(title, maxChars) {
  const words = title.split(" ");
  const lines = [];
  let cur = "";
  for (const word of words) {
    if (cur && (cur + " " + word).length > maxChars) {
      lines.push(cur);
      cur = word;
    } else {
      cur = cur ? cur + " " + word : word;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function traces(seed, accent) {
  const rnd = mulberry32(hashString(seed) ^ 0x9e3779b9);
  const W = 1200;
  const H = 630;
  let out = "";
  for (let i = 0; i < 11; i++) {
    let x = Math.round(rnd() * W);
    let y = Math.round(rnd() * H);
    const segments = 2 + Math.floor(rnd() * 3);
    let d = `M${x} ${y}`;
    for (let s = 0; s < segments; s++) {
      if (rnd() > 0.5) x += Math.round((rnd() - 0.2) * 260);
      else y += Math.round((rnd() - 0.2) * 260);
      d += ` L${Math.max(0, Math.min(W, x))} ${Math.max(0, Math.min(H, y))}`;
    }
    out += `<path d="${d}" fill="none" stroke="${accent}" strokeOpacity="0.16" strokeWidth="2"/>
<circle cx="${Math.max(0, Math.min(W, x))}" cy="${Math.max(0, Math.min(H, y))}" r="5" fill="${accent}" fillOpacity="0.35"/>`;
  }
  return out;
}

function buildSvg(a) {
  const id = `a-${a.slug.replace(/[^a-z0-9]/g, "")}`;
  const lines = wrapTitle(a.title, 34);
  const fontSize = lines.length >= 3 ? 52 : 64;
  const lh = Math.round(fontSize * 1.08);
  const titleY = 360;
  const titleGroup = lines
    .map(
      (line, i) =>
        `<text x="86" y="${titleY + i * lh}" fontFamily="'Big Shoulders Display', sans-serif" fontSize="${fontSize}" fontWeight="800" fill="#F2F3F7">${escapeXml(line)}</text>`,
    )
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(a.title)}">
<defs>
<linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stopColor="#0D0E16"/>
<stop offset="100%" stopColor="#1B1E31"/>
</linearGradient>
<radialGradient id="glow-${id}" cx="72%" cy="18%" r="85%">
<stop offset="0%" stopColor="${a.accent}" stopOpacity="0.34"/>
<stop offset="100%" stopColor="${a.accent}" stopOpacity="0"/>
</radialGradient>
<pattern id="grid-${id}" width="44" height="44" patternUnits="userSpaceOnUse">
<path d="M44 0H0V44" fill="none" stroke="#8891A6" strokeOpacity="0.1" strokeWidth="1"/>
</pattern>
</defs>
<rect width="1200" height="630" fill="url(#bg-${id})"/>
<rect width="1200" height="630" fill="url(#glow-${id})"/>
<rect width="1200" height="630" fill="url(#grid-${id})"/>
${traces(a.slug, a.accent)}
<rect x="0" y="0" width="1200" height="6" fill="${a.accent}"/>
<text x="86" y="142" fontFamily="'Big Shoulders Display', sans-serif" fontSize="92" fontWeight="800" fill="#F2F3F7" opacity="0.92">AI TECH</text>
<rect x="86" y="166" width="120" height="5" fill="${a.accent}"/>
<rect x="86" y="60" width="10" height="10" fill="${a.accent}"/>
<rect x="104" y="78" width="6" height="6" fill="${a.accent}" opacity="0.5"/>
${titleGroup}
<text x="86" y="566" fontFamily="IBM Plex Mono, monospace" fontSize="30" letterSpacing="10" fill="#8891A6">${escapeXml(a.label)}</text>
<text x="86" y="470" fontFamily="IBM Plex Mono, monospace" fontSize="20" letterSpacing="6" fill="${a.accent}">AI TECH MEDIA</text>
<rect x="1096" y="460" width="18" height="110" fill="${a.accent}" opacity="0.9"/>
<rect x="1122" y="484" width="8" height="86" fill="${a.accent}" opacity="0.45"/>
<rect x="86" y="594" width="1028" height="2" fill="${a.accent}" opacity="0.35"/>
</svg>
`;
}

mkdirSync(OUT, { recursive: true });
for (const article of ARTICLES) {
  const file = path.join(OUT, `${article.slug}.svg`);
  writeFileSync(file, buildSvg(article), "utf8");
  console.log("wrote", path.relative(process.cwd(), file));
}
console.log(`\nDone — ${ARTICLES.length} covers in public/images/articles/`);
