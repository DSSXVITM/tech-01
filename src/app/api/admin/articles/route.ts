import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/db/auth";
import { getDB } from "@/lib/db/client";
import { getDbArticle } from "@/lib/db/content";
import { getArticle } from "@/content";
import type { CategorySlug, ContentBlock, Difficulty } from "@/content/types";

export const dynamic = "force-dynamic";

const CATEGORIES: CategorySlug[] = [
  "windows",
  "macos",
  "hardware",
  "software",
  "internet",
  "security",
  "coding",
  "ai",
];

const DIFFICULTIES: Difficulty[] = ["beginner", "intermediate", "advanced"];
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status });
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Lightweight markdown-lite:
 *   ``` ``` ```  → code block
 *   ## / ###     → h2 / h3
 *   - item       → unordered list
 *   1. item      → ordered list
 *   > text       → quote
 *   blank lines  → paragraph separator
 */
function parseBody(body: string): ContentBlock[] {
  const lines = body.split(/\r?\n/);
  const blocks: ContentBlock[] = [];
  let para: string[] = [];
  let list: string[] = [];
  let listOrdered = false;
  let inCode = false;
  let codeLang = "";
  let codeLines: string[] = [];

  const flushPara = () => {
    if (para.length) {
      blocks.push({ type: "p", text: para.join(" ").trim() });
      para = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      blocks.push({ type: "list", ordered: listOrdered, items: list.map((l) => l.trim()) });
      list = [];
    }
  };
  const flushCode = () => {
    if (inCode) {
      blocks.push({ type: "code", lang: codeLang || undefined, text: codeLines.join("\n").replace(/\n+$/, "") });
      codeLines = [];
      inCode = false;
      codeLang = "";
    }
  };
  const flushAll = () => {
    flushPara();
    flushList();
    flushCode();
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.trim().startsWith("```")) {
      if (!inCode) {
        flushPara();
        flushList();
        inCode = true;
        codeLang = line.trim().slice(3).trim();
      } else {
        flushCode();
      }
      continue;
    }
    if (inCode) {
      codeLines.push(line);
      continue;
    }
    if (line.trim() === "") {
      flushAll();
      continue;
    }
    if (line.startsWith("### ")) {
      flushPara(); flushList();
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      continue;
    }
    if (line.startsWith("## ")) {
      flushPara(); flushList();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      continue;
    }
    if (line.startsWith("> ")) {
      flushPara(); flushList();
      blocks.push({ type: "quote", text: line.slice(2).trim() });
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      flushPara();
      if (list.length && !listOrdered) flushList();
      listOrdered = true;
      list.push(line.replace(/^\d+\.\s+/, ""));
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      flushPara();
      if (list.length && listOrdered) flushList();
      listOrdered = false;
      list.push(line.replace(/^[-*]\s+/, ""));
      continue;
    }
    flushList();
    para.push(line.trim());
  }
  flushAll();
  if (blocks.length === 0) blocks.push({ type: "p", text: body.trim() });
  return blocks;
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return json({ error: "Unauthorized." }, 401);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const category = typeof body.category === "string" ? (body.category as CategorySlug) : "";
  const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : "";
  const contentText = typeof body.content === "string" ? body.content.trim() : "";
  const tagsRaw = typeof body.tags === "string" ? body.tags : "";
  const imageDataUrl = typeof body.imageDataUrl === "string" ? body.imageDataUrl.trim() : "";
  const imageAlt = typeof body.imageAlt === "string" ? body.imageAlt.trim() : "";
  const publish = body.publish === true;

  // Tutorial metadata (optional)
  const difficulty = typeof body.difficulty === "string" ? (body.difficulty as Difficulty) : "";
  const timeMinutes = Number(body.timeMinutes);
  const prerequisitesRaw = typeof body.prerequisites === "string" ? body.prerequisites : "";
  const learnRaw = typeof body.learn === "string" ? body.learn : "";

  if (!title || !category || !contentText) {
    return json({ error: "Title, category and content are required." }, 422);
  }
  if (!CATEGORIES.includes(category)) {
    return json({ error: "Unknown category." }, 422);
  }
  if (imageDataUrl && imageDataUrl.length > MAX_IMAGE_BYTES) {
    return json({ error: "Image is too large (max ~2 MB)." }, 422);
  }
  if (difficulty && !DIFFICULTIES.includes(difficulty)) {
    return json({ error: "Unknown difficulty level." }, 422);
  }

  // Unique slug
  let slug = slugify(title) || "article";
  let candidate = slug;
  let n = 2;
  while ((await getDbArticle(candidate)) || getArticle(candidate)) {
    candidate = `${slug}-${n++}`;
  }
  slug = candidate;

  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim().toLowerCase().replace(/\s+/g, "-"))
    .filter(Boolean)
    .slice(0, 6);

  const linesToList = (raw: string) =>
    raw
      .split(/\r?\n/)
      .map((l) => l.trim().replace(/^[-*]\s+/, ""))
      .filter(Boolean)
      .slice(0, 8);

  const tutorial =
    difficulty || Number.isFinite(timeMinutes)
      ? {
          difficulty: (difficulty || "beginner") as Difficulty,
          timeMinutes: Number.isFinite(timeMinutes) ? Math.max(1, Math.round(timeMinutes)) : 5,
          prerequisites: linesToList(prerequisitesRaw),
          learn: linesToList(learnRaw),
        }
      : null;

  const now = new Date().toISOString();
  const id = randomUUID();

  const image = imageDataUrl.startsWith("data:image/")
    ? { cover: category, alt: imageAlt || title, src: imageDataUrl }
    : { cover: category, alt: imageAlt || title };

  await (await getDB())
    .prepare(
      `INSERT INTO articles
        (id, slug, title, excerpt, category_slug, author_slug, status, status_tag,
         is_featured, sponsored, affiliate_disclosed, content_json, sources_json,
         image_json, seo_title, seo_description, tags_csv, tutorial_json, published_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?, '[]', ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      slug,
      title,
      excerpt,
      category,
      null, // author_slug — rowToArticle falls back to the static maya-kovac
      publish ? "published" : "draft",
      publish ? "breaking" : null,
      JSON.stringify(parseBody(contentText)),
      JSON.stringify(image),
      title,
      excerpt,
      tags.join(","),
      tutorial ? JSON.stringify(tutorial) : null,
      now,
      now,
    )
    .run();

  return json({ ok: true, slug });
}
