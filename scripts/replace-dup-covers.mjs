/**
 * Replaces duplicate cover images: for each group of articles sharing the
 * exact same JPG bytes, keep the first one and re-fetch a DISTINCT, freely
 * licensed Wikimedia photo for every other slug. Guarantees (best-effort) that
 * no two articles end up with identical cover bytes.
 *
 * Run: node scripts/replace-dup-covers.mjs
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public", "images", "articles");
const SEEDS_DIR = path.join(ROOT, "src", "content", "articles", "library");
const CREDITS = path.join(SEEDS_DIR, "credits.ts");

const CATS = ["windows", "macos", "hardware", "software", "internet", "security", "coding", "ai"];
const UA = "AITechMedia/1.0 (https://ai-tech.fit; cover fetch script; contact desk@ai-tech.fit)";

function slugify(title) {
  return title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function md5(buf) { return crypto.createHash("md5").update(buf).digest("hex"); }

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
  const extra = seed.tags.filter((t) => t.toLowerCase() !== seed.category);
  const firstTag = extra[0] ?? seed.tags[0];
  const secondTag = extra[1] ?? firstTag;
  return [
    cleaned,
    `${cleaned} ${firstTag ?? ""}`.trim(),
    `${seed.slug.split("-").slice(-2).join(" ")} ${firstTag ?? ""}`.trim(),
    `${cleaned} ${secondTag ?? ""}`.trim(),
  ].filter(Boolean);
}

function stripTags(html) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&quot;/g, "'").replace(/\s+/g, " ").trim();
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
    `&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=12` +
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

async function download(url) {
  const res = await fetchWithRetry(url);
  return Buffer.from(await res.arrayBuffer());
}

async function fetchUnique(seed, usedMd5, usedUrls) {
  const queries = [...queryFor(seed), ...(CATEGORY_FALLBACK[seed.category] ?? [])];
  for (const q of queries) {
    if (!q) continue;
    let results;
    try { results = await commonsSearch(q); } catch (e) { continue; }
    for (const r of results) {
      if (r.mime !== "image/jpeg" || r.width < 480 || r.height < 360) continue;
      if (usedUrls.has(r.url)) continue;
      let buf;
      try { buf = await download(r.url); } catch (e) { continue; }
      const h = md5(buf);
      if (usedMd5.has(h) || usedUrls.has(r.url)) continue;
      usedMd5.add(h);
      usedUrls.add(r.url);
      return { buf, artist: r.artist };
    }
  }
  return null;
}

async function main() {
  mkdirSync(OUT, { recursive: true });

  // current md5 per slug
  const all = [];
  for (const c of CATS) for (const s of parseSeeds(`${c}.ts`)) all.push(s);
  const curMd5 = new Map();
  for (const s of all) {
    const p = path.join(OUT, `${s.slug}.jpg`);
    if (existsSync(p)) curMd5.set(s.slug, md5(readFileSync(p)));
  }

  // group by md5
  const groups = new Map();
  for (const s of all) {
    const h = curMd5.get(s.slug);
    if (!h) continue;
    if (!groups.has(h)) groups.set(h, []);
    groups.get(h).push(s);
  }

  // keeper md5s (first of each group) must stay reserved
  const usedMd5 = new Set();
  const redundant = [];
  for (const [, slugs] of groups) {
    if (slugs.length <= 1) { usedMd5.add(md5(readFileSync(path.join(OUT, `${slugs[0].slug}.jpg`)))); continue; }
    const keeper = slugs[0];
    usedMd5.add(curMd5.get(keeper.slug));
    for (let i = 1; i < slugs.length; i++) redundant.push(slugs[i]);
  }
  // also reserve unique singletons already on disk
  const usedUrls = new Set();

  console.log(`redundant covers to replace: ${redundant.length}`);

  const updated = [];
  let done = 0, failed = 0;
  for (const seed of redundant) {
    try {
      const res = await fetchUnique(seed, usedMd5, usedUrls);
      if (!res) { failed++; continue; }
      writeFileSync(path.join(OUT, `${seed.slug}.jpg`), res.buf);
      updated.push([seed.slug, res.artist]);
      done++;
      if (done % 25 === 0) console.log(`  replaced ${done}/${redundant.length}`);
    } catch (e) {
      failed++;
    }
    await new Promise((r) => setTimeout(r, 800));
  }

  if (updated.length) {
    let text = readFileSync(CREDITS, "utf8");
    for (const [s, c] of updated) {
      const emptyLine = `  "${s}": "",`;
      const existing = new RegExp(`  "${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}":\\s*"`);
      if (text.includes(emptyLine)) {
        text = text.replace(emptyLine, `  "${s}": ${JSON.stringify(c)},`);
      } else if (existing.test(text)) {
        text = text.replace(new RegExp(`(  "${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}":\\s*")[^"]*(")`), `$1${JSON.stringify(c).slice(1, -1)}$2`);
      } else {
        const closing = text.lastIndexOf("};");
        text = `${text.slice(0, closing)}\n  "${s}": ${JSON.stringify(c)},\n};\n`;
      }
    }
    writeFileSync(CREDITS, text);
  }

  console.log(`\nDone. Replaced ${done} covers, failed/skipped ${failed}.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
