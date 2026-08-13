import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { GoogleLoginButton } from "@/components/auth/google-button";
import { getGoogleClientId } from "@/lib/db/google";

export const metadata: Metadata = {
  title: "Register",
  description: "Create an AI Tech account.",
  alternates: { canonical: "/register" },
  robots: { index: false },
};

export default async function RegisterPage() {
  const googleClientId = await getGoogleClientId();

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-2xl border border-line bg-surface p-8">
        <p className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-ink">
          Members
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight text-fg">
          Register
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          One account for saved articles, reading history and newsletter preferences.
        </p>

        <div className="mt-6">
          <GoogleLoginButton clientId={googleClientId} />
        </div>

        <div className="my-5 flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 bg-line" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">or</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <RegisterForm />

        <p className="mt-6 border-t border-line pt-4 text-center font-mono text-[11px] text-muted">
          Already registered?{" "}
          <Link href="/login" className="text-signal-ink hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
