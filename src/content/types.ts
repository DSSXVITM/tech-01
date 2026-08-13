/**
 * Content model for articles.
 *
 * Phase 1 ships articles as typed TypeScript data (`src/content/articles/`).
 * The model mirrors how a Phase 2 CMS/admin panel would store content as
 * block-based rows, so swapping the source (DB + API) does not change any
 * template. `getAllArticles()` in `src/content/index.ts` is the single
 * access point to replace.
 */

export type CategorySlug =
  | "windows"
  | "macos"
  | "hardware"
  | "software"
  | "internet"
  | "security"
  | "coding"
  | "ai";

/** How-to tutorials carry a difficulty level so readers can pick their entry point. */
export type Difficulty = "beginner" | "intermediate" | "advanced";

export type ArticleStatus = "live" | "breaking" | "updated" | "trending";

/** Status tags carry real recency information, not decoration. */
export type StatusTag =
  | { kind: "live"; label: string }
  | { kind: "breaking"; label: string }
  | { kind: "updated"; minutesAgo: number }
  | { kind: "trending"; label: string };

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | {
      type: "callout";
      tone: "info" | "warn" | "success";
      title?: string;
      text: string;
    }
  | { type: "table"; columns: string[]; rows: string[][] }
  /** Preformatted code/terminal snippet. Rendered with a copy button. */
  | { type: "code"; lang?: string; text: string }
  /** Full comparison row used inside the "best of" template. */
  | {
      type: "product";
      name: string;
      tagline: string;
      rating: number; // 0–5
      price: string;
      pros: string[];
      cons: string[];
      bestFor: string;
      /** Human-readable label; href resolved from affiliate catalog. */
      affiliateLabel?: string;
      affiliateKey?: string;
      /** Direct tracked URL (replaces catalog lookup when provided). */
      affiliateHref?: string;
    }
  | {
      type: "affiliateCta";
      text: string;
      href: string;
      label: string;
    };

export interface ArticleSource {
  label: string;
  url: string;
}

export interface ArticleImage {
  /** Deterministic cover key (category slug, or a custom theme). */
  cover: CategorySlug | "generic" | "live";
  alt: string;
  credit?: string;
  /**
   * Bundled static cover file (e.g. /images/articles/<slug>.svg). When set,
   * CoverArt renders the file instead of the generated fallback art.
   */
  src?: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: CategorySlug;
  tags: string[];
  author: string; // author slug
  publishedAt: string; // ISO date
  updatedAt?: string; // ISO date — drives "● UPDATED" tags
  status?: ArticleStatus;
  /** Top-of-page hero story. Exactly one per homepage. */
  featured?: boolean;
  /** Shown in the homepage "Trending now" ticker. */
  trendingRank?: number;
  image: ArticleImage;
  seo?: { title?: string; description?: string };
  sponsored?: boolean;
  affiliate?: {
    disclosed?: boolean;
    /** When set, an affiliate product catalog table is rendered. */
    catalog?: string;
  };
  related?: string[];
  sources: ArticleSource[];
  content: ContentBlock[];
  /** Tutorial metadata rendered as a header block on the article page. */
  tutorial?: {
    difficulty: Difficulty;
    timeMinutes: number;
    /** Things the reader should already have/known before starting. */
    prerequisites: string[];
    /** "What you'll learn" — rendered as a checklist. */
    learn: string[];
  };
}

export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  avatarKey: string;
  email?: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  short: string;
  description: string;
  /** Subcategories / topic chips shown on the category page header. */
  topics: string[];
  color: string;
}

/** Affiliate catalog: name → product rows for `affiliate.catalog` keys. */
export interface AffiliateProduct {
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
