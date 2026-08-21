import type {
  Article,
  ArticleImage,
  ArticleSource,
  CategorySlug,
  ContentBlock,
  ArticleStatus,
} from "@/content/types";
import { getDB } from "./client";

/**
 * DB-backed articles (created in the admin CMS).
 *
 * The site ships static TypeScript content (src/content/articles/*). Articles
 * created in the admin panel are stored in D1's `articles` table as the full
 * Article JSON (content_json, image_json, …) and read back here, so the two
 * sources can be merged without duplicating templates.
 */

interface ArticleRow {
  slug: string;
  title: string;
  excerpt: string;
  category_slug: string;
  author_slug: string | null;
  status_tag: string | null;
  is_featured: number;
  trending_rank: number | null;
  sponsored: number;
  affiliate_disclosed: number;
  content_json: string;
  sources_json: string;
  image_json: string;
  seo_title: string;
  seo_description: string;
  tags_csv: string;
  tutorial_json: string | null;
  published_at: string | null;
  updated_at: string | null;
}

const VALID_STATUS: ArticleStatus[] = ["live", "breaking", "updated", "trending"];
const FALLBACK_AUTHOR = "ai-tech-desk";

function rowToArticle(row: ArticleRow): Article {
  const status = VALID_STATUS.includes(row.status_tag as ArticleStatus)
    ? (row.status_tag as ArticleStatus)
    : undefined;

  let content: ContentBlock[] = [];
  try {
    content = JSON.parse(row.content_json) as ContentBlock[];
  } catch {
    content = [];
  }

  let image: ArticleImage = { cover: "generic", alt: row.title };
  try {
    const parsed = JSON.parse(row.image_json || "{}") as Partial<ArticleImage>;
    if (parsed && typeof parsed === "object") {
      image = {
        cover: (parsed.cover as ArticleImage["cover"]) ?? "generic",
        alt: parsed.alt || row.title,
        ...(parsed.src ? { src: parsed.src } : {}),
      };
    }
  } catch {
    /* keep fallback */
  }

  let sources: ArticleSource[] = [];
  try {
    sources = JSON.parse(row.sources_json || "[]") as ArticleSource[];
  } catch {
    sources = [];
  }

  const tags = (row.tags_csv || "").split(",").map((t) => t.trim()).filter(Boolean);

  let tutorial: Article["tutorial"];
  try {
    const parsed = JSON.parse(row.tutorial_json || "null") as Article["tutorial"] | null;
    if (parsed && parsed.difficulty) tutorial = parsed;
  } catch {
    tutorial = undefined;
  }

  const article: Article = {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category_slug as CategorySlug,
    tags,
    author: row.author_slug ?? FALLBACK_AUTHOR,
    publishedAt: row.published_at ?? "",
    ...(row.updated_at ? { updatedAt: row.updated_at } : {}),
    ...(status ? { status } : {}),
    ...(row.is_featured === 1 ? { featured: true } : {}),
    ...(row.trending_rank != null ? { trendingRank: row.trending_rank } : {}),
    ...(row.sponsored === 1 ? { sponsored: true } : {}),
    image,
    content,
    sources,
    ...(tutorial ? { tutorial } : {}),
    ...(row.seo_title || row.seo_description
      ? {
          seo: {
            ...(row.seo_title ? { title: row.seo_title } : {}),
            ...(row.seo_description ? { description: row.seo_description } : {}),
          },
        }
      : {}),
    ...(row.affiliate_disclosed === 1 ? { affiliate: { disclosed: true } } : {}),
  };
  return article;
}

/** All published DB articles, newest first. */
export async function getDbArticles(): Promise<Article[]> {
  const db = await getDB();
  const { results } = await db
    .prepare(
      "SELECT * FROM articles WHERE status = 'published' AND published_at IS NOT NULL ORDER BY published_at DESC",
    )
    .all<ArticleRow>();
  return results.map(rowToArticle);
}

export async function getDbArticle(slug: string): Promise<Article | undefined> {
  const db = await getDB();
  const row = await db
    .prepare("SELECT * FROM articles WHERE slug = ?")
    .bind(slug)
    .first<ArticleRow>();
  return row ? rowToArticle(row) : undefined;
}

/** Counts published DB articles (used by the admin dashboard). */
export async function countDbArticles(): Promise<number> {
  const db = await getDB();
  const row = await db
    .prepare("SELECT COUNT(*) AS n FROM articles WHERE status = 'published'")
    .first<{ n: number }>();
  return row?.n ?? 0;
}
