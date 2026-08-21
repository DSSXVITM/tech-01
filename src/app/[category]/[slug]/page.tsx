import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getArticle,
  getAuthorBySlug,
  getCategoryBySlugSafe,
  getRelatedArticles,
  getAffiliateCatalog,
} from "@/content";
import { getDbArticle } from "@/lib/db/content";
import { siteConfig } from "@/lib/site";
import { formatDate, formatDateTime, readingMinutes } from "@/lib/format";
import { CoverArt } from "@/components/cover-art";
import { StatusTag, getStatusTag } from "@/components/status-tag";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArticleRenderer } from "@/components/article-renderer";
import { TutorialHeader } from "@/components/tutorial-header";
import { ShareButtons } from "@/components/share-buttons";
import { ComparisonTable } from "@/components/comparison-table";
import { ArticleCard } from "@/components/article-card";
import { Avatar } from "@/components/avatar";
import { AdSlot } from "@/components/ad-slot";
import { Newsletter } from "@/components/newsletter";
import { CircuitDivider } from "@/components/circuit-divider";
import { CommentsSection } from "@/components/comments-section";
import { SaveButton } from "@/components/save-button";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug) ?? (await getDbArticle(slug));
  if (!article) return {};
  const category = getCategoryBySlugSafe(article.category);
  const canonical = `${siteConfig.url}/${article.category}/${article.slug}`;
  return {
    title: article.seo?.title ?? article.title,
    description: article.seo?.description ?? article.excerpt,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: article.seo?.title ?? article.title,
      description: article.seo?.description ?? article.excerpt,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      authors: [getAuthorBySlug(article.author)?.name ?? "AI Tech Desk"],
      section: category?.name ?? "AI",
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.seo?.title ?? article.title,
      description: article.seo?.description ?? article.excerpt,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { category: categorySlug, slug } = await params;
  const article = getArticle(slug) ?? (await getDbArticle(slug));
  if (!article || article.category !== categorySlug) notFound();

  const author = getAuthorBySlug(article.author);
  const category = getCategoryBySlugSafe(article.category);
  const tag = getStatusTag(article);
  const related = getRelatedArticles(article);
  const products = getAffiliateCatalog(article.affiliate?.catalog);
  const url = `${siteConfig.url}/${article.category}/${article.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seo?.description ?? article.excerpt,
    image: `${siteConfig.url}/${article.category}/${article.slug}/opengraph-image`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: { "@type": "Person", name: author?.name ?? "AI Tech Desk", url: `${siteConfig.url}/author/${article.author}` },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/opengraph-image` },
    },
    mainEntityOfPage: url,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: category?.name ?? "AI", item: `${siteConfig.url}/${category?.slug ?? "ai"}` },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ],
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="mx-auto max-w-[1440px] px-4 pt-8">
        <Breadcrumbs
          crumbs={[
            { label: category?.name ?? "AI", href: `/${category?.slug ?? "ai"}` },
            { label: article.title },
          ]}
        />

        {/* Hero */}
        <header className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            {tag && <StatusTag tag={tag} size="lg" />}
            {category && (
              <Link
                href={`/${category.slug}`}
                className="rounded-full border border-line px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted transition-colors hover:text-fg"
              >
                {category.name}
              </Link>
            )}
            {article.sponsored && (
              <span className="rounded border border-amber/50 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-amber">
                Sponsored
              </span>
            )}
          </div>

          <h1 className="mt-4 font-display text-4xl font-bold leading-[0.98] text-fg sm:text-6xl">
            {article.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{article.excerpt}</p>

          {/* Byline */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
            <div className="flex items-center gap-3">
              {author && (
                <>
                  <Link href={`/author/${author.slug}`} aria-label={author.name}>
                    <Avatar seed={author.avatarKey} name={author.name} size={44} />
                  </Link>
                  <div>
                    <Link
                      href={`/author/${author.slug}`}
                      className="block text-sm font-semibold text-fg hover:text-signal-ink"
                    >
                      {author.name}
                    </Link>
                    <p className="font-mono text-[11px] text-muted">{author.role}</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-muted">
              <span>
                <span className="text-signal-ink">Published</span> {formatDate(article.publishedAt)}
              </span>
              {article.updatedAt && (
                <span>
                  <span className="text-amber">Updated</span> {formatDate(article.updatedAt)}
                </span>
              )}
              <span>· {readingMinutes(article.content)} min read</span>
            </div>
          </div>
        </header>

        {/* Featured image */}
        <div className="relative mx-auto mt-8 max-w-4xl overflow-hidden rounded-2xl border border-line">
          <CoverArt image={article.image} seed={article.slug} className="aspect-[16/8] w-full" />
          {article.image.credit && (
            <span className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-1 font-mono text-[10px] text-white/70">
              {article.image.credit}
            </span>
          )}
        </div>
      </div>

      {/* Body + sidebar */}
      <div className="mx-auto mt-10 max-w-[1440px] px-4">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="mx-auto w-full max-w-[720px]">
            {article.sponsored && (
              <div className="mb-6 rounded-lg border border-amber/40 bg-amber-soft px-4 py-3">
                <p className="font-mono text-[11px] text-fg">
                  <span className="font-bold text-amber">Sponsored</span> — this article was produced
                  in partnership with an advertiser. Views remain independent.
                </p>
              </div>
            )}

            {article.affiliate?.disclosed && (
              <div className="mb-6 rounded-lg border border-line bg-surface px-4 py-3">
                <p className="font-mono text-[11px] leading-relaxed text-muted">
                  <span className="font-bold text-signal-ink">Affiliate disclosure:</span> this article
                  contains affiliate links. {siteConfig.name} may earn a commission at no extra cost to you if
                  you buy through them. We only recommend tools we have actually tested.
                </p>
              </div>
            )}

            <TutorialHeader article={article} />

            <ArticleRenderer article={article} />

            {products.length > 0 && (
              <>
                <ComparisonTable products={products} />
                <p className="mt-4 font-mono text-[11px] leading-relaxed text-muted">
                  Comparisons are based on our own testing and criteria. Affiliate links are marked
                  and may earn {siteConfig.name} a commission — see our{" "}
                  <Link href="/affiliate-disclosure" className="text-signal-ink hover:underline">
                    affiliate disclosure
                  </Link>
                  .
                </p>
              </>
            )}

            {/* Share */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <ShareButtons title={article.title} url={url} />
              <div className="flex flex-wrap items-center gap-2">
                <SaveButton slug={article.slug} />
                {article.tags.map((tagName) => (
                  <Link
                    key={tagName}
                    href={`/${article.category}`}
                    className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted transition-colors hover:text-fg"
                  >
                    #{tagName}
                  </Link>
                ))}
              </div>
            </div>

            <AdSlot slot="article-bottom" />
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <AdSlot slot="article-sidebar" height="h-[250px]" />
              <div className="rounded-xl border border-line bg-surface p-5">
                <h3 className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-ink">
                  The How-To Digest
                </h3>
                <p className="mb-3 text-[13px] leading-relaxed text-muted">
                  New tutorials every week. Free, one email.
                </p>
                <Newsletter compact />
              </div>
            </div>
          </aside>
        </div>
      </div>

      <CommentsSection articleSlug={article.slug} />

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto mt-14 max-w-[1440px] px-4">
          <CircuitDivider className="mb-8" />
          <h2 className="mb-5 font-display text-2xl font-bold leading-tight text-fg sm:text-3xl">
            Related articles
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}

      <p className="mx-auto mt-12 max-w-[1440px] px-4 text-right font-mono text-[10px] text-muted">
        Last verified: {formatDateTime(article.updatedAt ?? article.publishedAt)}
      </p>
    </article>
  );
}
