import { NextResponse } from "next/server";
import { getGoogleClientId, getGoogleClientSecret } from "@/lib/db/google";

export const dynamic = "force-dynamic";

/**
 * Step 1 of the server-side Google OAuth2 flow.
 *
 * Redirects the user to accounts.google.com for sign-in (full page redirect —
 * no FedCM popup). After sign-in Google redirects to /api/auth/google/callback
 * with an authorization code.
 */
export async function GET(request: Request) {
  const clientId = await getGoogleClientId();
  const clientSecret = await getGoogleClientSecret();
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/login?google=not_configured", request.url));
  }

  const url = new URL(request.url);
  const returnTo = url.searchParams.get("next") || "/";
  if (!returnTo.startsWith("/")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Remember where to return after login.
  const res = NextResponse.redirect(
    new URL(
      "https://accounts.google.com/o/oauth2/v2/auth" +
        `?client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(`${url.origin}/api/auth/google/callback`)}` +
        "&response_type=code" +
        "&scope=openid email profile" +
        "&prompt=select_account" +
        `&state=${encodeURIComponent(returnTo)}`,
    ),
  );
  res.cookies.set("google_next", encodeURIComponent(returnTo), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 600,
  });
  return res;
}
