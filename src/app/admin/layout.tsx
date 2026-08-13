import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/db/auth";
import { LogoMark } from "@/components/logo";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/comments", label: "Comments" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/analytics", label: "Analytics" },
];

export const dynamic = "force-dynamic";

/**
 * Admin shell. `getSession()` runs at the server: no session → sign-in gate;
 * any role below `admin` → redirect home. Access is enforced here, at the
 * auth layer, before any admin content renders.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-amber">
          <span className="status-dot is-live" /> Access restricted
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-fg">
          Sign in required
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          The admin panel is only available to signed-in staff accounts. If you are
          an editor or admin, log in to continue.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/login?next=/admin"
            className="rounded-md bg-signal px-4 py-2.5 font-display text-[12px] font-semibold uppercase tracking-[0.1em] text-white"
          >
            Login
          </Link>
          <Link
            href="/"
            className="rounded-md border border-line px-4 py-2.5 font-display text-[12px] font-semibold uppercase tracking-[0.1em] text-fg"
          >
            Back to site
          </Link>
        </div>
      </div>
    );
  }

  if (session.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-4 py-8 md:grid-cols-[220px_1fr]">
      <aside>
        <div className="mb-6">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark className="h-8 w-8" />
            <div>
              <p className="font-display text-sm font-bold uppercase tracking-wide text-fg">AI Tech</p>
              <p className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-signal">
                Admin Panel
              </p>
            </div>
          </Link>
        </div>
        <nav className="flex flex-wrap gap-2 md:flex-col md:gap-1" aria-label="Admin">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 font-display text-[12px] uppercase tracking-[0.08em] text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 hidden rounded-lg border border-line bg-surface p-4 md:block">
          <p className="font-display text-[10px] uppercase tracking-wider text-muted">Signed in as</p>
          <p className="mt-1 text-sm font-medium text-fg">{session.name}</p>
          <p className="font-display text-[11px] text-muted">
            role: {session.role} · {session.email}
          </p>
          <form action="/api/auth/logout" method="post" className="mt-3">
            <button
              type="submit"
              className="w-full rounded-md border border-line px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-fg"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
