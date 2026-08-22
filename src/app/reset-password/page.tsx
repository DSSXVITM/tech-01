import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Set new password",
  robots: { index: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : "";

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-2xl border border-line bg-surface p-8">
        <p className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-ink">
          Members
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight text-fg">New password</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Choose a new password for your account.
        </p>

        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
