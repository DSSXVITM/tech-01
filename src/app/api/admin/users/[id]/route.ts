import { NextResponse } from "next/server";
import { hashPassword, requireAdmin, type UserRole } from "@/lib/db/auth";
import { getDB } from "@/lib/db/client";

export const dynamic = "force-dynamic";

const ROLES: UserRole[] = ["reader", "author", "editor", "admin"];

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status });
}

/**
 * Admin user management: ban/unban, role changes and password resets.
 * Only `admin` can call this (enforced by `requireAdmin`).
 */
export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return json({ error: "Unauthorized." }, 401);

  const url = new URL(request.url);
  const id = url.pathname.split("/").filter(Boolean).at(-1) ?? "";

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const action = body.action;

  const db = await getDB();
  const target = await db
    .prepare("SELECT id, name, email, role, banned_at FROM users WHERE id = ?")
    .bind(id)
    .first<{ id: string; name: string; email: string; role: UserRole; banned_at: string | null }>();
  if (!target) return json({ error: "User not found." }, 404);

  if (action === "ban") {
    if (target.id === admin.id) return json({ error: "You cannot ban your own account." }, 422);
    const now = new Date().toISOString();
    await db.prepare("UPDATE users SET banned_at = ?, updated_at = ? WHERE id = ?").bind(now, now, id).run();
    return json({ ok: true, user: { ...target, banned_at: now } });
  }

  if (action === "unban") {
    await db.prepare("UPDATE users SET banned_at = NULL, updated_at = ? WHERE id = ?").bind(new Date().toISOString(), id).run();
    return json({ ok: true, user: { ...target, banned_at: null } });
  }

  if (action === "role") {
    const role = body.role;
    if (!ROLES.includes(role as UserRole)) return json({ error: "Invalid role." }, 422);
    if (target.id === admin.id && (role as UserRole) !== "admin") {
      return json({ error: "You cannot demote your own account." }, 422);
    }
    await db.prepare("UPDATE users SET role = ?, updated_at = ? WHERE id = ?").bind(role, new Date().toISOString(), id).run();
    return json({ ok: true, user: { ...target, role } });
  }

  if (action === "password") {
    const password = typeof body.password === "string" ? body.password : "";
    if (password.length < 8) return json({ error: "Password must be at least 8 characters." }, 422);
    const hash = await hashPassword(password);
    await db.prepare("UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?").bind(hash, new Date().toISOString(), id).run();
    return json({ ok: true });
  }

  return json({ error: "Unknown action." }, 422);
}
