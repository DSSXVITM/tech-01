/**
 * Generates one static SVG cover per article into public/images/articles/.
 * Every cover is visually UNIQUE:
 *  - one of four layout templates, chosen deterministically by slug hash;
 *  - a per-article accent hue (category color shifted by the slug hash);
 *  - a category-specific icon motif (windows panes, mac traffic lights,
 *    CPU chip, software windows, network nodes, shield, code brackets,
 *    AI spark);
 *  - the article title and a relevant topic label baked in.
 *
 * Covers every seed in src/content/articles/library/*.ts, plus the curated
 * news covers below.
 *
 * Run:  node scripts/generate-covers.mjs
 * Regenerate freely: output is deterministic per slug.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public", "images", "articles");
const SEEDS_DIR = path.join(ROOT, "src", "content", "articles", "library");

/** Base hues per category — each article shifts its own accent around these. */
const CATEGORY_HUE = {
  windows: 232,
  macos: 216,
  hardware: 16,
  software: 258,
  internet: 201,
  security: 162,
  coding: 40,
  ai: 330,
};

/** Curated news covers (kept manually in sync with the news pipeline). */
const NEWS_ARTICLES = [
  { slug: "openai-ships-o4-agentic-runtime", title: "OpenAI Ships o4: The Agentic Runtime Arrives", accent: "#3B5BFF", label: "LIVE", hue: 232 },
  { slug: "best-ai-video-generators-2026", title: "Best AI Video Generators 2026: Tested and Ranked", accent: "#FF7A59", label: "VIDEO", hue: 16 },
  { slug: "gemini-30-vs-claude-45", title: "Gemini 3.0 vs Claude 4.5: Two Different Ways of Thinking", accent: "#A970FF", label: "MODELS", hue: 268 },
  { slug: "build-an-ai-agent-no-code", title: "How to Build an AI Agent With No Code in 2026", accent: "#2FBF8F", label: "NO-CODE", hue: 162 },
  { slug: "flux-24-vs-midjourney-vs-dalle", title: "Flux.24 vs Midjourney vs DALL\u00B7E: AI Image Generation in 2026", accent: "#FFB020", label: "IMAGE", hue: 40 },
  { slug: "best-seo-tools-2026", title: "Best SEO Tools 2026: The Five We Actually Use", accent: "#3BB4FF", label: "SEO", hue: 201 },
  { slug: "best-ai-productivity-apps-2026", title: "Best AI Productivity Apps for 2026", accent: "#4AD2A6", label: "APPS", hue: 170 },
  { slug: "cursor-vs-copilot-vs-claude-code", title: "Cursor vs Copilot vs Claude Code: The 2026 Editor Shootout", accent: "#FF5C7A", label: "EDITORS", hue: 348 },
  { slug: "ssr-ssg-or-static-2026", title: "SSR, SSG or Static: Picking a Rendering Strategy in 2026", accent: "#C792EA", label: "RENDERING", hue: 285 },
];

/** Same slugify as src/content/articles/library/builder.ts. */
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Parse one seed file into { slug, title, tags }[] — mirrors the TS array shape. */
function parseSeeds(category, fileName) {
  const src = readFileSync(path.join(SEEDS_DIR, fileName), "utf8");
  const seeds = [];
  const blocks = src.split(/\n  \{/).slice(1);
  for (const block of blocks) {
    const title = block.match(/^\s{4}title:\s*"([^"]+)"/m)?.[1];
    if (!title) continue;
    const tagsStr = block.match(/tags:\s*\[([^\]]*)\]/)?.[1] ?? "";
    const tags = [...tagsStr.matchAll(/"([^"]*)"/g)].map((m) => m[1]);
    seeds.push({ slug: slugify(title), title, tags });
  }
  return seeds;
}

/** Pick the first tag that isn't the category name as the cover label. */
function labelFor(category, tags) {
  const rest = tags.filter((t) => t.toLowerCase() !== category.toLowerCase());
  const raw = (rest[0] ?? category).toUpperCase();
  return raw.length > 20 ? raw.slice(0, 19) : raw;
}

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

function hexToHsl(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const to = (x) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${to(f(0))}${to(f(8))}${to(f(4))}`;
}

/** Per-article accent: category base hue shifted by the slug hash (±~22 deg). */
function accentFor(category, slug) {
  const base = CATEGORY_HUE[category] ?? 232;
  const shift = (hashString(slug) % 80) - 40;
  const hsl = hslToHex(((base + shift + 360) % 360), 88, 55);
  return hsl;
}

/** Category-specific icon motif, drawn around (x,y) with size s. */
function motifFor(category, stroke, x, y, s) {
  const open = `<g transform="translate(${x} ${y})" fill="none" stroke="${stroke}" strokeWidth="${Math.max(3, Math.round(s * 0.035))}" strokeLinecap="round" strokeLinejoin="round">`;
  switch (category) {
    case "windows": {
      const u = s / 2;
      const r = u * 0.16;
      return open + `<rect x="0" y="0" width="${u}" height="${u}" rx="${r}"/><rect x="${u * 1.12}" y="0" width="${u}" height="${u}" rx="${r}"/><rect x="0" y="${u * 1.12}" width="${u}" height="${u}" rx="${r}"/><rect x="${u * 1.12}" y="${u * 1.12}" width="${u}" height="${u}" rx="${r}"/></g>`;
    }
    case "macos":
      return (
        open +
        `<rect x="0" y="0" width="${s}" height="${s * 0.72}" rx="${s * 0.13}"/><line x1="0" y1="${s}" x2="${s}" y2="${s}"/><circle cx="${s * 0.15}" cy="${s * 0.18}" r="${s * 0.05}" fill="${stroke}" stroke="none"/><circle cx="${s * 0.29}" cy="${s * 0.18}" r="${s * 0.05}"/><circle cx="${s * 0.43}" cy="${s * 0.18}" r="${s * 0.05}"/></g>`
      );
    case "hardware": {
      const pin = s * 0.12;
      let pins = "";
      for (let i = 0; i < 4; i++) {
        const p = s * 0.12 + i * s * 0.2;
        pins += `<line x1="${p}" y1="0" x2="${p}" y2="${pin}"/><line x1="${p}" y1="${s - pin}" x2="${p}" y2="${s}"/><line x1="0" y1="${p}" x2="${pin}" y2="${p}"/><line x1="${s - pin}" y1="${p}" x2="${s}" y2="${p}"/>`;
      }
      return open + pins + `<rect x="${pin}" y="${pin}" width="${s - pin * 2}" height="${s - pin * 2}" rx="${s * 0.08}"/><rect x="${s * 0.3}" y="${s * 0.3}" width="${s * 0.4}" height="${s * 0.4}" rx="${s * 0.04}"/></g>`;
    }
    case "software":
      return (
        open +
        `<rect x="0" y="0" width="${s}" height="${s * 0.7}" rx="${s * 0.1}"/><line x1="0" y1="${s * 0.2}" x2="${s}" y2="${s * 0.2}"/><rect x="${s * 0.14}" y="${s * 0.46}" width="${s * 0.72}" height="${s * 0.44}" rx="${s * 0.08}" opacity="0.55"/></g>`
      );
    case "internet": {
      const r = s * 0.5;
      return (
        open +
        `<circle cx="${r}" cy="${r}" r="${s * 0.09}" fill="${stroke}" stroke="none"/><line x1="${r}" y1="${r}" x2="0" y2="0"/><line x1="${r}" y1="${r}" x2="${s}" y2="0"/><line x1="${r}" y1="${r}" x2="${s}" y2="${s}"/><line x1="${r}" y1="${r}" x2="0" y2="${s}"/><circle cx="0" cy="0" r="${s * 0.055}"/><circle cx="${s}" cy="0" r="${s * 0.055}"/><circle cx="${s}" cy="${s}" r="${s * 0.055}"/><circle cx="0" cy="${s}" r="${s * 0.055}"/></g>`
      );
    }
    case "security":
      return (
        open +
        `<path d="M${s * 0.5} 0 L${s} ${s * 0.13} L${s * 0.94} ${s * 0.66} Q${s * 0.78} ${s * 0.9} ${s * 0.5} ${s} Q${s * 0.22} ${s * 0.9} ${s * 0.06} ${s * 0.66} L0 ${s * 0.13} Z"/><path d="M${s * 0.28} ${s * 0.5} L${s * 0.44} ${s * 0.66} L${s * 0.74} ${s * 0.32}" strokeWidth="${Math.max(3, Math.round(s * 0.04))}"/></g>`
      );
    case "coding":
      return (
        open +
        `<path d="M${s * 0.18} ${s * 0.06} L0 ${s * 0.5} L${s * 0.18} ${s * 0.94}"/><path d="M${s * 0.82} ${s * 0.06} L${s} ${s * 0.5} L${s * 0.82} ${s * 0.94}"/><line x1="${s * 0.5}" y1="${s * 0.02}" x2="${s * 0.42}" y2="${s * 0.98}"/></g>`
      );
    case "ai": {
      let inner = `<circle cx="${s * 0.5}" cy="${s * 0.5}" r="${s * 0.13}" fill="${stroke}" stroke="none"/>`;
      const pts = [
        [s * 0.08, s * 0.14],
        [s * 0.9, s * 0.18],
        [s * 0.86, s * 0.84],
        [s * 0.14, s * 0.82],
      ];
      for (const p of pts) {
        inner += `<line x1="${s * 0.5}" y1="${s * 0.5}" x2="${p[0]}" y2="${p[1]}"/><circle cx="${p[0]}" cy="${p[1]}" r="${s * 0.07}"/>`;
      }
      return open + inner + `</g>`;
    }
    default:
      return open + `<circle cx="${s / 2}" cy="${s / 2}" r="${s * 0.5}"/></g>`;
  }
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

function defs(id, accent) {
  return `<defs>
<linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stopColor="#0D0E16"/>
<stop offset="100%" stopColor="#1B1E31"/>
</linearGradient>
<radialGradient id="glow-${id}" cx="72%" cy="18%" r="85%">
<stop offset="0%" stopColor="${accent}" stopOpacity="0.34"/>
<stop offset="100%" stopColor="${accent}" stopOpacity="0"/>
</radialGradient>
<pattern id="grid-${id}" width="44" height="44" patternUnits="userSpaceOnUse">
<path d="M44 0H0V44" fill="none" stroke="#8891A6" strokeOpacity="0.1" strokeWidth="1"/>
</pattern>
</defs>`;
}

function bgLayer(id, accent, withGrid = true) {
  let out = `<rect width="1200" height="630" fill="url(#bg-${id})"/><rect width="1200" height="630" fill="url(#glow-${id})"/>`;
  if (withGrid) out += `<rect width="1200" height="630" fill="url(#grid-${id})"/>`;
  return out;
}

function titleText(lines, x, y, size, lh, anchor = "start") {
  const anchorAttr = anchor === "middle" ? ' text-anchor="middle"' : "";
  return lines
    .map(
      (line, i) =>
        `<text x="${x}" y="${y + i * lh}"${anchorAttr} fontFamily="'Big Shoulders Display', sans-serif" fontSize="${size}" fontWeight="800" fill="#F2F3F7">${escapeXml(line)}</text>`,
    )
    .join("\n");
}

/* --- Layout templates -------------------------------------------------- */

function t1Broadcast(a, id, accent, motif) {
  const lines = wrapTitle(a.title, 34);
  const fontSize = lines.length >= 3 ? 52 : 64;
  const lh = Math.round(fontSize * 1.08);
  const titleY = 360;
  const motifX = 1030;
  const motifY = 260;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(a.title)}">
${defs(id, accent)}
${bgLayer(id, accent)}
${traces(a.slug, accent)}
<rect x="0" y="0" width="1200" height="6" fill="${accent}"/>
<text x="86" y="142" fontFamily="'Big Shoulders Display', sans-serif" fontSize="92" fontWeight="800" fill="#F2F3F7" opacity="0.92">AI TECH</text>
<rect x="86" y="166" width="120" height="5" fill="${accent}"/>
<rect x="86" y="60" width="10" height="10" fill="${accent}"/>
<rect x="104" y="78" width="6" height="6" fill="${accent}" opacity="0.5"/>
${motifFor(a.category, accent, motifX, motifY, 130)}
${titleText(lines, 86, titleY, fontSize, lh)}
<text x="86" y="566" fontFamily="IBM Plex Mono, monospace" fontSize="30" letterSpacing="10" fill="#8891A6">${escapeXml(a.label)}</text>
<text x="86" y="470" fontFamily="IBM Plex Mono, monospace" fontSize="20" letterSpacing="6" fill="${accent}">AI TECH MEDIA</text>
<rect x="1096" y="460" width="18" height="110" fill="${accent}" opacity="0.9"/>
<rect x="1122" y="484" width="8" height="86" fill="${accent}" opacity="0.45"/>
<rect x="86" y="594" width="1028" height="2" fill="${accent}" opacity="0.35"/>
</svg>
`;
}

function t2Center(a, id, accent) {
  const lines = wrapTitle(a.title, 38);
  const fontSize = lines.length >= 3 ? 46 : 54;
  const lh = Math.round(fontSize * 1.12);
  const titleY = 506;
  const motifSize = 300;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(a.title)}">
${defs(id, accent)}
${bgLayer(id, accent)}
<rect x="0" y="0" width="1200" height="6" fill="${accent}"/>
<rect x="0" y="624" width="1200" height="6" fill="${accent}"/>
<text x="600" y="118" fontFamily="IBM Plex Mono, monospace" fontSize="26" letterSpacing="12" fill="${accent}" text-anchor="middle">${escapeXml(a.label)}</text>
<circle cx="600" cy="290" r="196" fill="none" stroke="${accent}" strokeOpacity="0.12" strokeWidth="2"/>
${motifFor(a.category, accent, 450, 140, motifSize)}
${titleText(lines, 600, titleY, fontSize, lh, "middle")}
<text x="600" y="612" fontFamily="IBM Plex Mono, monospace" fontSize="18" letterSpacing="8" fill="#8891A6" text-anchor="middle">AI TECH MEDIA</text>
</svg>
`;
}

function t3Split(a, id, accent) {
  const lines = wrapTitle(a.title, 30);
  const fontSize = lines.length >= 3 ? 54 : 62;
  const lh = Math.round(fontSize * 1.06);
  const titleY = 320;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(a.title)}">
${defs(id, accent)}
${bgLayer(id, accent)}
<rect x="0" y="0" width="300" height="630" fill="${accent}" opacity="0.92"/>
<rect x="300" y="0" width="6" height="630" fill="${accent}" opacity="0.35"/>
<text x="150" y="116" fontFamily="'Big Shoulders Display', sans-serif" fontSize="34" fontWeight="800" fill="#FFFFFF" opacity="0.9" text-anchor="middle">AI TECH</text>
${motifFor(a.category, "#FFFFFF", 75, 205, 150)}
<rect x="70" y="566" width="160" height="4" fill="#FFFFFF" opacity="0.7"/>
<text x="380" y="122" fontFamily="IBM Plex Mono, monospace" fontSize="26" letterSpacing="10" fill="${accent}">${escapeXml(a.label)}</text>
${titleText(lines, 380, titleY, fontSize, lh)}
<rect x="380" y="${titleY + lines.length * lh + 24}" width="220" height="6" fill="${accent}"/>
<text x="380" y="588" fontFamily="IBM Plex Mono, monospace" fontSize="20" letterSpacing="6" fill="#8891A6">AI TECH MEDIA</text>
<rect x="1096" y="60" width="18" height="110" fill="${accent}" opacity="0.9"/>
<rect x="1122" y="84" width="8" height="86" fill="${accent}" opacity="0.45"/>
</svg>
`;
}

function t4Poster(a, id, accent, motif) {
  const lines = wrapTitle(a.title, 28);
  const fontSize = lines.length >= 3 ? 62 : 74;
  const lh = Math.round(fontSize * 1.05);
  const titleY = 330;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(a.title)}">
${defs(id, accent)}
${bgLayer(id, accent)}
<text x="600" y="470" fontFamily="'Big Shoulders Display', sans-serif" fontSize="300" fontWeight="800" fill="#F2F3F7" opacity="0.05" text-anchor="middle">AI TECH</text>
<rect x="0" y="624" width="1200" height="6" fill="${accent}"/>
<text x="86" y="116" fontFamily="IBM Plex Mono, monospace" fontSize="26" letterSpacing="10" fill="${accent}">${escapeXml(a.label)}</text>
${titleText(lines, 86, titleY, fontSize, lh)}
<rect x="86" y="${titleY + lines.length * lh + 22}" width="260" height="6" fill="${accent}"/>
${motifFor(a.category, accent, 966, 96, 150)}
<rect x="1096" y="504" width="18" height="110" fill="${accent}" opacity="0.9"/>
<rect x="1122" y="528" width="8" height="86" fill="${accent}" opacity="0.45"/>
<text x="86" y="580" fontFamily="IBM Plex Mono, monospace" fontSize="20" letterSpacing="6" fill="#8891A6">AI TECH MEDIA</text>
</svg>
`;
}

function buildSvg(a) {
  const id = `a-${a.slug.replace(/[^a-z0-9]/g, "")}`;
  const template = hashString(a.slug) % 4;
  const accent = a.accent;
  if (template === 0) return t1Broadcast(a, id, accent, a.category);
  if (template === 1) return t2Center(a, id, accent);
  if (template === 2) return t3Split(a, id, accent);
  return t4Poster(a, id, accent, a.category);
}

mkdirSync(OUT, { recursive: true });

let written = 0;
const all = [];

for (const news of NEWS_ARTICLES) {
  all.push({ slug: news.slug, title: news.title, accent: news.accent, label: news.label, category: "ai" });
}

for (const category of Object.keys(CATEGORY_HUE)) {
  const seeds = parseSeeds(category, `${category}.ts`);
  for (const seed of seeds) {
    all.push({
      slug: seed.slug,
      title: seed.title,
      accent: accentFor(category, seed.slug),
      label: labelFor(category, seed.tags),
      category,
    });
  }
}

for (const article of all) {
  const file = path.join(OUT, `${article.slug}.svg`);
  writeFileSync(file, buildSvg(article), "utf8");
  written++;
}

console.log(`\nDone — ${written} unique covers written to ${path.relative(process.cwd(), OUT)}/`);
