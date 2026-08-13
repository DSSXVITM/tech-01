import { getArticle, getCategoryBySlugSafe } from "@/content";
import { buildOgCard } from "@/lib/og";

export const size = { width: 1200, height: 630 };

export default async function ArticleOgImage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return null;
  const category = getCategoryBySlugSafe(article.category);

  return buildOgCard({
    eyebrow: `${category?.name ?? "AI"} · ${new Date(article.publishedAt).toLocaleDateString("en", { month: "long", day: "numeric" })}`,
    title: article.title.slice(0, 60),
  });
}
