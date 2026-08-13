import Link from "next/link";
import { getAllArticles, getAuthorBySlug, getSiteArticles } from "@/content";
import { getStatusTag, StatusTag } from "@/components/status-tag";
import { DeleteArticleButton } from "@/components/admin/delete-article";

export const metadata = {
  title: "Articles — AI Tech Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const articles = await getSiteArticles();

  return (
    <div>
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Editorial</p>
          <h2 className="mt-1 font-display text-3xl font-bold leading-tight text-fg">
            Articles
          </h2>
          <p className="mt-2 font-display text-[11px] text-muted">
            {getAllArticles().length} static · {articles.length - getAllArticles().length} CMS
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="rounded-md bg-signal px-4 py-2 font-display text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90"
        >
          + New article
        </Link>
      </header>

      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-2 font-display text-[10px] uppercase tracking-[0.12em] text-muted">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3 text-right">Views</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => {
              const author = getAuthorBySlug(a.author);
              const isCms = getAllArticles().some((s) => s.slug === a.slug) === false;
              return (
                <tr key={a.slug} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/${a.category}/${a.slug}`} className="font-medium text-fg hover:text-signal">
                      {a.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-display text-[12px] uppercase text-muted">{a.category}</td>
                  <td className="px-4 py-3 font-display text-[12px] text-muted">{author?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    {(() => {
                      const tag = getStatusTag(a);
                      return tag ? (
                        <StatusTag tag={tag} />
                      ) : (
                        <span className="font-display text-[11px] uppercase tracking-wider text-muted">published</span>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-3">
                    {isCms ? (
                      <span className="rounded border border-signal/40 bg-signal/10 px-1.5 py-0.5 font-display text-[10px] uppercase tracking-wider text-signal">
                        CMS
                      </span>
                    ) : (
                      <span className="rounded border border-line bg-surface-2 px-1.5 py-0.5 font-display text-[10px] uppercase tracking-wider text-muted">
                        static
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-display text-[12px] text-muted">—</td>
                  <td className="px-4 py-3 text-right">
                    <DeleteArticleButton slug={a.slug} disabled={!isCms} />
                  </td>
                </tr>
              );
            })}
            {articles.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center font-display text-[12px] text-muted">
                  No articles yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
