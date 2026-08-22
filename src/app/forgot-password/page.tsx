import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-2xl border border-line bg-surface p-8">
        <p className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-ink">
          Members
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight text-fg">Reset password</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Enter your account email and we&apos;ll send you a link to choose a new password.
        </p>

        <ForgotPasswordForm />
      </div>
    </div>
  );
}
