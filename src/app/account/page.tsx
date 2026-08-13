import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/db/auth";
import { getSavedArticleSlugs } from "@/lib/db/saved";
import { getSiteArticle } from "@/content";
import type { Article } from "@/content/types";
import { SavedArticles } from "@/components/saved-articles";
import { ProfilePicture } from "@/components/profile-picture";
import { Avatar } from "@/components/avatar";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

const ROLE_LABEL: Record<string, string> = {
  reader: "Reader",
  author: "Author",
  editor: "Editor",
  admin: "Administrator",
};

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/account");

  const joined = "Member of AI Tech";

  return (
    <div className="mx-auto max-w-[720px] px-4 pt-8">
      <Breadcrumbs crumbs={[{ label: "My Account" }]} />
      <header className="mb-8">
        <p className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-ink">
          Members
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight text-fg sm:text-5xl">
          My Account
        </h1>
      </header>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        <div className="flex items-center gap-4 border-b border-line bg-surface-2 px-6 py-5">
          <Avatar seed={session.id} name={session.name} size={48} src={session.avatar} />
          <div className="min-w-0">
            <h2 className="truncate font-display text-xl font-bold text-fg">{session.name}</h2>
            <p className="truncate font-mono text-[12px] text-muted">{session.email}</p>
          </div>
          <span className="ml-auto flex-none rounded-full border border-signal/30 bg-signal-soft px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-signal-ink">
            {ROLE_LABEL[session.role] ?? session.role}
          </span>
        </div>

        <div className="px-6 py-6">
          <ProfilePicture name={session.name} initialAvatar={session.avatar} />
        </div>

        <div className="grid gap-4 px-6 py-6 sm:grid-cols-2">
          <div className="rounded-lg border border-line bg-bg/40 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Account</p>
            <p className="mt-2 text-sm leading-relaxed text-fg">{joined}. Save guides and keep your reading history here.</p>
            <p className="mt-3 font-mono text-[11px] text-muted">
              Member ID · <span className="text-fg">{session.id.slice(0, 8)}</span>
            </p>
          </div>

          <div className="rounded-lg border border-line bg-bg/40 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Useful links</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li>
                <Link href="/" className="text-signal-ink hover:underline">
                  Browse tutorials →
                </Link>
              </li>
              <li>
                <Link href="/trending" className="text-signal-ink hover:underline">
                  Most popular →
                </Link>
              </li>
              {session.role === "admin" && (
                <li>
                  <Link href="/admin" className="text-signal-ink hover:underline">
                    Admin dashboard →
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line px-6 py-4">
          <p className="font-mono text-[11px] text-muted">Signed in on this device</p>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="rounded-md border border-line px-4 py-2 font-mono text-[12px] font-semibold uppercase tracking-[0.1em] text-muted transition-colors hover:border-danger/40 hover:text-danger"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      <SavedArticlesSection userId={session.id} />
    </div>
  );
}

async function SavedArticlesSection({ userId }: { userId: string }) {
  const slugs = await getSavedArticleSlugs(userId);
  const articles = (
    await Promise.all(slugs.map((slug) => getSiteArticle(slug)))
  ).filter((a) => a != null) as Article[];

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold leading-tight text-fg">
            Saved articles
          </h2>
          <p className="mt-1 text-sm text-muted">
            Tutorials you bookmarked — build your reading list.
          </p>
        </div>
        <span className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted">
          {articles.length} saved
        </span>
      </div>
      <SavedArticles articles={articles} />
    </section>
  );
}
