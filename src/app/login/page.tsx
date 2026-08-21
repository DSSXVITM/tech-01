import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { GoogleLoginButton } from "@/components/auth/google-button";
import { getGoogleClientId } from "@/lib/db/google";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to AI Tech for saved articles, reading history and more.",
  alternates: { canonical: "/login" },
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const googleClientId = await getGoogleClientId();
  const sp = await searchParams;
  const googleError = typeof sp.google === "string" ? sp.google : null;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-2xl border border-line bg-surface p-8">
        <p className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-ink">
          Members
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight text-fg">
          Login
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Save articles, keep reading history and manage your newsletter.
        </p>

        <div className="mt-6">
          <GoogleLoginButton clientId={googleClientId} />
        </div>

        {googleError && (
          <p className="mt-4 rounded-md border border-danger/40 bg-danger/10 px-3 py-2 font-mono text-[12px] text-danger">
            {googleError === "not_configured" && "Google sign-in is not configured."}
            {googleError === "failed" && "Google verification failed. Please try again."}
            {googleError === "banned" && "This account has been suspended."}
            {!["not_configured", "failed", "banned"].includes(googleError) && "Google sign-in failed. Please try again."}
          </p>
        )}

        <div className="my-5 flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 bg-line" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">or</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <LoginForm />

        <p className="mt-6 border-t border-line pt-4 text-center font-mono text-[11px] text-muted">
          No account yet?{" "}
          <Link href="/register" className="text-signal-ink hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
