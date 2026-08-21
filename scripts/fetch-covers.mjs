/**
 * Recreates the cover-fetch pipeline: downloads one real, freely-licensed
 * JPG photo from Wikimedia Commons per NEW article slug and records the
 * author credit in src/content/articles/library/credits.ts.
 *
 * Only slugs that do NOT already have a cover JPG on disk are fetched.
 * Existing credits.ts entries are preserved verbatim (new entries appended).
 *
 * Run:  node scripts/fetch-covers.mjs
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public", "images", "articles");
const SEEDS_DIR = path.join(ROOT, "src", "content", "articles", "library");
const CREDITS = path.join(SEEDS_DIR, "credits.ts");

const CATS = ["windows", "macos", "hardware", "software", "internet", "security", "coding", "ai"];
const UA = "AITechMedia/1.0 (https://ai-tech.fit; cover fetch script; contact desk@ai-tech.fit)";

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseSeeds(fileName) {
  const category = fileName.replace(/\.ts$/, "");
  const src = readFileSync(path.join(SEEDS_DIR, fileName), "utf8");
  const seeds = [];
  const blocks = src.split(/\n  \{/).slice(1);
  for (const block of blocks) {
    const title = block.match(/^\s{4}title:\s*"([^"]+)"/m)?.[1];
    if (!title) continue;
    const tagsStr = block.match(/tags:\s*\[([^\]]*)\]/)?.[1] ?? "";
    const tags = [...tagsStr.matchAll(/"([^"]*)"/g)].map((m) => m[1]);
    seeds.push({ slug: slugify(title), title, tags, category });
  }
  return seeds;
}

const CATEGORY_FALLBACK = {
  windows: ["Microsoft Windows", "Windows desktop screenshot", "Windows computer"],
  macos: ["MacBook", "macOS desktop", "Apple Mac computer"],
  hardware: ["Computer hardware", "PC components", "Desktop computer"],
  software: ["Application software", "Computer program", "Software window"],
  internet: ["Wi-Fi router", "Internet connection", "Network cable"],
  security: ["Computer security", "Cybersecurity", "Padlock on laptop"],
  coding: ["Computer code", "Programming", "Source code editor"],
  ai: ["Artificial intelligence", "AI chip", "Neural network"],
};

function queryFor(seed) {
  const cleaned = seed.title
    .replace(/^how to\s+/i, "")
    .replace(/\b(in windows|on a mac|on windows|in macos|on a pc|on the mac|on mac|for beginners|step by step)\b/gi, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const firstTag = seed.tags.find((t) => t.toLowerCase() !== seed.category) ?? seed.tags[0];
  return [
    cleaned,
    `${seed.slug.split("-").slice(-2).join(" ")} ${firstTag ?? ""}`.trim(),
    ...(CATEGORY_FALLBACK[seed.category] ?? []),
  ].filter(Boolean);
}

function stripTags(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchWithRetry(url, tries = 4) {
  for (let attempt = 0; attempt < tries; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.ok) return res;
    if (res.status === 429) {
      const wait = 4000 * (attempt + 1);
      process.stderr.write(`  rate-limited, backing off ${wait}ms\n`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    throw new Error(`http ${res.status}`);
  }
  throw new Error("exhausted retries (429)");
}

async function commonsSearch(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
    `&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=10` +
    "&prop=imageinfo&iiprop=url%7Cmime%7Csize%7Cextmetadata&iiurlwidth=1200&format=json";
  const res = await fetchWithRetry(url);
  const data = await res.json();
  const pages = data.query?.pages ?? {};
  const out = [];
  for (const p of Object.values(pages)) {
    const ii = p.imageinfo?.[0];
    if (!ii) continue;
    out.push({
      url: ii.thumburl || ii.url,
      mime: ii.mime,
      width: ii.width,
      height: ii.height,
      artist: stripTags(ii.extmetadata?.Artist?.value ?? ""),
    });
  }
  return out;
}

async function fetchOne(seed) {
  const queries = queryFor(seed);
  let chosen = null;
  let artist = "";
  for (const q of queries) {
    if (!q) continue;
    const results = await commonsSearch(q);
    const jpeg = results.find(
      (r) => r.mime === "image/jpeg" && r.width >= 480 && r.height >= 360,
    );
    if (jpeg) {
      chosen = jpeg.url;
      artist = jpeg.artist;
      break;
    }
  }
  if (!chosen) return { slug: seed.slug, credit: "" };
  const imgRes = await fetchWithRetry(chosen);
  const buf = Buffer.from(await imgRes.arrayBuffer());
  writeFileSync(path.join(OUT, `${seed.slug}.jpg`), buf);
  return { slug: seed.slug, credit: artist };
}

async function main() {
  mkdirSync(OUT, { recursive: true });

  const all = [];
  for (const c of CATS) for (const s of parseSeeds(`${c}.ts`)) all.push(s);

  // Already covered = a JPG already exists on disk (these are skipped).
  const todo = all.filter((s) => !existsSync(path.join(OUT, `${s.slug}.jpg`)));
  console.log(`Total seeds: ${all.length} | already have JPG: ${all.length - todo.length} | to fetch: ${todo.length}`);

  const newCredits = [];
  let done = 0;
  for (const seed of todo) {
    try {
      const { slug, credit } = await fetchOne(seed);
      newCredits.push([slug, credit]);
      done++;
      if (done % 10 === 0) console.log(`  fetched ${done}/${todo.length}`);
    } catch (e) {
      console.warn(`  FAIL ${seed.slug}: ${e.message}`);
      newCredits.push([seed.slug, ""]);
    }
    await new Promise((r) => setTimeout(r, 1200));
  }

  if (newCredits.length) {
    let text = readFileSync(CREDITS, "utf8");
    const append = [];
    for (const [s, c] of newCredits) {
      const emptyLine = `  "${s}": "",`;
      const existing = new RegExp(`  "${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}":\\s*"`);
      if (text.includes(emptyLine)) {
        // Upgrade an existing empty credit in place.
        text = text.replace(emptyLine, `  "${s}": ${JSON.stringify(c)},`);
      } else if (existing.test(text)) {
        // Non-empty credit already present — leave it.
      } else {
        append.push(`  "${s}": ${JSON.stringify(c)},`);
      }
    }
    if (append.length) {
      const closing = text.lastIndexOf("};");
      text = `${text.slice(0, closing)}\n${append.join("\n")}\n};\n`;
    }
    writeFileSync(CREDITS, text);
  }

  console.log(`\nDone. Added ${newCredits.length} cover credits.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
