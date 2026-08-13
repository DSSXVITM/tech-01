import type { Metadata } from "next";
import Link from "next/link";
import { ArticleForm } from "@/components/admin/article-form";

export const metadata: Metadata = {
  title: "New Article — AI Tech Admin",
};

export default function AdminNewArticlePage() {
  return (
    <div>
      <header className="mb-6">
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Editorial</p>
        <h2 className="mt-1 font-display text-3xl font-bold leading-tight text-fg">
          New article
        </h2>
        <p className="mt-2 text-sm text-muted">
          Published instantly — shows as BREAKING on the homepage and in the top strip.
        </p>
      </header>

      <div className="rounded-lg border border-line bg-surface p-6">
        <ArticleForm />
      </div>

      <p className="mt-4">
        <Link href="/admin/articles" className="font-display text-[12px] uppercase tracking-[0.1em] text-muted hover:text-fg">
          ← Back to articles
        </Link>
      </p>
    </div>
  );
}
