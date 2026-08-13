import type { Metadata } from "next";
import { getDB } from "@/lib/db/client";
import { getSession } from "@/lib/db/auth";
import { Avatar } from "@/components/avatar";
import { UserActions } from "@/components/admin/user-actions";
import type { UserRole } from "@/lib/db/auth";

export const metadata: Metadata = {
  title: "Users — AI Tech Admin",
};

export const dynamic = "force-dynamic";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  banned_at: string | null;
  created_at: string;
  avatar_data: string | null;
}

export default async function AdminUsersPage() {
  const db = await getDB();
  const admin = await getSession();
  const { results: users } = await db
    .prepare(
      "SELECT id, name, email, role, banned_at, created_at, avatar_data FROM users ORDER BY created_at DESC",
    )
    .all<UserRow>();

  return (
    <div>
      <header className="mb-6">
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Access</p>
        <h2 className="mt-1 font-display text-3xl font-bold leading-tight text-fg">
          Users
        </h2>
        <p className="mt-2 text-sm text-muted">
          {users.length} account{users.length === 1 ? "" : "s"} in the database.
        </p>
      </header>

      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-2 font-display text-[10px] uppercase tracking-[0.12em] text-muted">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-right">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar seed={u.email} name={u.name} size={36} src={u.avatar_data} />
                    <span className="font-medium text-fg">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-display text-[12px] text-muted">{u.email}</td>
                <td className="px-4 py-3 font-display text-[12px] uppercase text-signal-ink">{u.role}</td>
                <td className="px-4 py-3 font-display text-[12px] text-muted">
                  {new Date(u.created_at).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" })}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="rounded-full border border-line px-2.5 py-0.5 font-display text-[10px] uppercase tracking-wider text-muted">
                    {u.banned_at ? "banned" : "active"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <UserActions
                    userId={u.id}
                    currentRole={u.role}
                    banned={Boolean(u.banned_at)}
                    isSelf={admin?.id === u.id}
                  />
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center font-display text-[12px] text-muted">
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
