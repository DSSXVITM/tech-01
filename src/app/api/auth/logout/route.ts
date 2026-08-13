import { NextResponse } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/db/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const acceptsHtml = (request.headers.get("accept") ?? "").includes("text/html");
  const res = acceptsHtml
    ? NextResponse.redirect(new URL("/login", request.url), 303)
    : NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return res;
}
