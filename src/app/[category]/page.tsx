import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlugSafe, getSiteArticlesByCategory, getCategories } from "@/content";
import { siteConfig } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArticleCard } from "@/components/article-card";
import { AdSlot } from "@/components/ad-slot";
import { Newsletter } from "@/components/newsletter";
import { CircuitDivider } from "@/components/circuit-divider";

interface Props {
  params: Promise<{ category: string }>;
}

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlugSafe(slug);
  if (!category) return {};
  return {
    title: `${category.name} News, Guides & Reviews`,
    description: category.description,
    alternates: { canonical: `/${category.slug}` },
    openGraph: {
      type: "website",
      url: `${siteConfig.url}/${category.slug}`,
      title: `${category.name} — ${siteConfig.name}`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategoryBySlugSafe(slug);
  if (!category) notFound();

  const articles = await getSiteArticlesByCategory(category.slug);
  const empty = articles.length === 0;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: category.name, item: `${siteConfig.url}/${category.slug}` },
    ],
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <Breadcrumbs crumbs={[{ label: category.name }]} />

      {/* Category header */}
      <header className="relative overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="circuit-trace pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 p-6 sm:p-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: category.color }}>
              <span className="status-dot is-trending" />
              {articles.length > 0 ? `${articles.length} articles on the feed` : "Section live"}
            </p>
            <h1 className="mt-2 font-display text-5xl font-bold leading-[0.95] text-fg sm:text-7xl">
              {category.name}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              {category.description}
            </p>
          </div>
          <div className="flex max-w-md flex-wrap gap-2">
            {category.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-line bg-bg/60 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Articles / empty state */}
      {empty ? (
        <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface/40 px-6 py-20 text-center">
          <span className="status-dot is-trending mb-4" aria-hidden="true" />
          <h2 className="font-display text-3xl font-bold leading-tight text-fg">Coverage coming soon</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
            This section is ramping up. In the meantime, the AI and Software feeds are live with
            new articles every day.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/ai" className="rounded-md bg-signal px-4 py-2.5 font-mono text-[12px] font-semibold uppercase tracking-[0.1em] text-white">
              AI
            </Link>
            <Link href="/software" className="rounded-md border border-line px-4 py-2.5 font-mono text-[12px] font-semibold uppercase tracking-[0.1em] text-fg">
              Software
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
          <AdSlot slot={`category-${category.slug}`} />
        </>
      )}

      {/* Newsletter */}
      <section className="mt-12">
        <div className="flex flex-col gap-6 rounded-2xl border border-line bg-surface p-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-md">
            <h2 className="font-display text-2xl font-bold leading-tight text-fg">
              {category.name} guides in your inbox
            </h2>
            <p className="mt-2 text-sm text-muted">New how-tos every week — free, one email.</p>
          </div>
          <div className="w-full md:max-w-sm">
            <Newsletter compact />
          </div>
        </div>
      </section>

      <CircuitDivider className="mt-12" />
    </div>
  );
}
