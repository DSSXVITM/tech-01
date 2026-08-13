import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuthorBySlug, getAllArticles, getAuthors } from "@/content";
import { siteConfig } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Avatar } from "@/components/avatar";
import { ArticleCard } from "@/components/article-card";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAuthors().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return {};
  return {
    title: `${author.name} — ${author.role}`,
    description: author.bio,
    alternates: { canonical: `/author/${author.slug}` },
    openGraph: {
      type: "profile",
      url: `${siteConfig.url}/author/${author.slug}`,
      title: author.name,
      description: author.bio,
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const articles = getAllArticles().filter((a) => a.author === author.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    url: `${siteConfig.url}/author/${author.slug}`,
    worksFor: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs crumbs={[{ label: "Authors", href: "/news" }, { label: author.name }]} />

      <header className="flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6 sm:p-10 md:flex-row md:items-start">
        <Avatar seed={author.avatarKey} name={author.name} size={96} />
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-bold leading-tight text-fg sm:text-5xl">
            {author.name}
          </h1>
          <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.12em] text-signal-ink">
            {author.role}
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">{author.bio}</p>
          {author.email && (
            <a
              href={`mailto:${author.email}`}
              className="mt-4 inline-block font-mono text-[12px] text-signal-ink hover:underline"
            >
              {author.email}
            </a>
          )}
        </div>
        <p className="flex-none font-mono text-[11px] text-muted md:ml-auto">
          {articles.length} articles on the feed
        </p>
      </header>

      <section className="mt-10">
        <h2 className="mb-5 font-display text-2xl font-bold leading-tight text-fg">
          More by {author.name.split(" ")[0]}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
