import type { Category, CategorySlug } from "@/content/types";
import { getArticlesByCategory } from "@/content";
import { ArticleCard } from "./article-card";
import { CircuitDivider } from "./circuit-divider";

/** Homepage category preview row — three cards under a section header. */
export function CategoryPreview({ category }: { category: Category }) {
  const articles = getArticlesByCategory(category.slug as CategorySlug).slice(0, 3);
  if (articles.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-4">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p
            className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: category.color }}
          >
            {category.short}
          </p>
          <h2 className="font-display text-2xl font-bold leading-tight text-fg sm:text-3xl">
            {category.name}
          </h2>
        </div>
        <a
          href={`/${category.slug}`}
          className="flex-none font-mono text-[11px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-fg"
        >
          View section →
        </a>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
      <CircuitDivider className="mt-10" />
    </section>
  );
}
