import type { Article, Author, Category } from "@/content/types";
import { tutorialArticles } from "@/content/articles/tutorials";
import { libraryArticles } from "@/content/articles/library";
import { authors as authorSeed } from "@/content/authors";
import { categories as categorySeed } from "@/content/categories";
import { affiliateCatalogs } from "@/content/affiliate";

/**
 * Content repository — the Phase 2 swap point.
 *
 * Phase 1 ships a static implementation backed by typed data files in
 * `src/content/`. Phase 2 replaces `repository` with a D1-backed
 * implementation (same interface, rows from `db/schema.sql`) so articles can
 * be managed from the admin panel without touching any template or page.
 */
export interface ContentRepository {
  getArticles(): Article[];
  getAuthors(): Author[];
  getCategories(): Category[];
  getAffiliateProducts(catalog?: string): AffiliateProductData[];
}

export interface AffiliateProductData {
  name: string;
  tagline: string;
  rating: number;
  price: string;
  bestFor: string;
  pros: string[];
  cons: string[];
  url: string;
  badge?: string;
}

export class StaticContentRepository implements ContentRepository {
  private readonly articles: Article[];
  private readonly authors: Author[];
  private readonly categories: Category[];

  constructor() {
    this.articles = [...tutorialArticles, ...libraryArticles];
    this.authors = authorSeed;
    this.categories = categorySeed;
  }

  getArticles(): Article[] {
    return this.articles;
  }

  getAuthors(): Author[] {
    return this.authors;
  }

  getCategories(): Category[] {
    return this.categories;
  }

  getAffiliateProducts(catalog?: string): AffiliateProductData[] {
    if (!catalog) return [];
    return affiliateCatalogs[catalog] ?? [];
  }
}

/**
 * The active repository. Phase 2: replace with:
 *   export const repository: ContentRepository = new D1ContentRepository(env);
 */
export const repository: ContentRepository = new StaticContentRepository();
