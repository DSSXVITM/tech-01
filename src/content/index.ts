import type { Article, Category } from "./types";
import { repository } from "@/lib/db/repository";
import { getAuthor } from "./authors";
import { getCategory } from "./categories";
import { getAffiliateCatalog } from "./affiliate";
import { getDbArticles, getDbArticle } from "@/lib/db/content";

/**
 * Single access point to article content.
 *
 * All reads go through `repository` (src/lib/db/repository.ts). Phase 1 uses
 * the static implementation; Phase 2 swaps in a D1-backed one without
 * changing any page or component.
 */

const allArticles: Article[] = repository.getArticles();

export function getAllArticles(): Article[] {
  return allArticles;
}

export function getArticle(slug: string): Article | undefined {
  return allArticles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: string): Article[] {
  return allArticles
    .filter((a) => a.category === category)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

export function getLatestArticles(limit?: number): Article[] {
  const sorted = [...allArticles].sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getFeaturedArticle(): Article | undefined {
  return allArticles.find((a) => a.featured) ?? getLatestArticles(1)[0];
}

export function getTrendingArticles(): Article[] {
  return [...allArticles]
    .filter((a) => a.trendingRank != null)
    .sort((a, b) => (a.trendingRank ?? 99) - (b.trendingRank ?? 99))
    .slice(0, 10);
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const pool = article.related
    ?.map((slug) => getArticle(slug))
    .filter((a): a is Article => Boolean(a));
  const explicit = pool ?? [];
  const byCategory = getArticlesByCategory(article.category).filter(
    (a) => a.slug !== article.slug && !explicit.some((e) => e.slug === a.slug),
  );
  return [...explicit, ...byCategory].slice(0, limit);
}

/** Search index: lightweight title/slug/tag list used by the search dialog. */
export function getSearchIndex() {
  return allArticles.map((a) => ({
    slug: a.slug,
    title: a.title,
    category: a.category,
    excerpt: a.excerpt,
  }));
}

/** Article routes for static generation ([category]/[slug]). */
export function getAllArticleSlugs(): string[] {
  return allArticles.map((a) => a.slug);
}

export function getCategoriesWithArticles() {
  return repository
    .getCategories()
    .filter((c) => allArticles.some((a) => a.category === c.slug));
}

export function getCategories() {
  return repository.getCategories();
}

export function getAuthorBySlug(slug: string) {
  return getAuthor(slug);
}

export function getAuthors() {
  return repository.getAuthors();
}

export function getCategoryBySlugSafe(slug: string) {
  return getCategory(slug);
}

export { getAffiliateCatalog };

/* ------------------------------------------------------------------ *
 * DB-merged accessors (Phase 2 CMS)
 *
 * Static content stays the source of truth; admin-created articles from
 * the D1 `articles` table are merged on top (same slug → static wins).
 * Pages that must reflect CMS posts use these async helpers.
 * ------------------------------------------------------------------ */

async function siteArticles(): Promise<Article[]> {
  const [dbArticles, staticAll] = await Promise.all([getDbArticles(), Promise.resolve(allArticles)]);
  const staticSlugs = new Set(staticAll.map((a) => a.slug));
  return [...staticAll, ...dbArticles.filter((a) => !staticSlugs.has(a.slug))];
}

export async function getSiteArticles(): Promise<Article[]> {
  return siteArticles();
}

export async function getSiteLatest(limit?: number): Promise<Article[]> {
  const sorted = [...(await siteArticles())].sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export async function getSiteArticlesByCategory(category: string): Promise<Article[]> {
  return (await siteArticles())
    .filter((a) => a.category === category)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

export async function getSiteFeatured(): Promise<Article | undefined> {
  const articles = await siteArticles();
  return articles.find((a) => a.featured) ?? [...articles].sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
  )[0];
}

export async function getSiteTrending(): Promise<Article[]> {
  return (await siteArticles())
    .filter((a) => a.trendingRank != null)
    .sort((a, b) => (a.trendingRank ?? 99) - (b.trendingRank ?? 99))
    .slice(0, 10);
}

export async function getSiteArticle(slug: string): Promise<Article | undefined> {
  return getArticle(slug) ?? (await getDbArticle(slug)) ?? undefined;
}

export async function getSiteBreaking(): Promise<Article | undefined> {
  const articles = await siteArticles();
  return (
    articles
      .filter((a) => a.status === "breaking")
      .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))[0] ??
    [...articles].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))[0]
  );
}

export async function getSiteCategoriesWithArticles(): Promise<Category[]> {
  const articles = await siteArticles();
  return repository
    .getCategories()
    .filter((c) => articles.some((a) => a.category === c.slug));
}
