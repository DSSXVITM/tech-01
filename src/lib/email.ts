import { siteConfig } from "@/lib/site";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const RESEND_API = "https://api.resend.com/emails";

/** Reads an env var from `process.env` (local/dev) or the Cloudflare binding. */
function envVar(name: string): string | undefined {
  if (typeof process !== "undefined" && process.env?.[name]) return process.env[name];
  try {
    const env = getCloudflareContext().env as unknown as Record<string, unknown>;
    const v = env[name];
    if (typeof v === "string" && v) return v;
  } catch {
    /* not on Cloudflare */
  }
  return undefined;
}

/** Base URL used in links. Override with APP_URL when needed. */
function getAppUrl(): string {
  const raw = (envVar("APP_URL") || siteConfig.url || "").replace(/\/+$/, "");
  return raw || "http://localhost:3000";
}

export function buildVerifyUrl(token: string): string {
  return `${getAppUrl()}/api/auth/verify-email?token=${encodeURIComponent(token)}`;
}

export function buildResetUrl(token: string): string {
  return `${getAppUrl()}/reset-password?token=${encodeURIComponent(token)}`;
}

export interface EmailResult {
  sent: boolean;
  verifyUrl?: string;
  resetUrl?: string;
  error?: string;
}

/**
 * Sends a confirmation email via Resend (https://resend.com).
 *
 * Requires RESEND_API_KEY. When it is missing (e.g. local dev) the verify
 * link is logged to the server console instead, so registration still works
 * and the flow can be tested without an external account.
 */
export async function sendVerificationEmail(opts: {
  to: string;
  token: string;
  name?: string;
}): Promise<EmailResult> {
  const verifyUrl = buildVerifyUrl(opts.token);
  const apiKey = envVar("RESEND_API_KEY");
  const from = envVar("EMAIL_FROM") || "AI Tech <no-reply@ai-tech.fit>";

  if (!apiKey) {
    console.warn(`[email] RESEND_API_KEY not set — verification link for ${opts.to}:\n${verifyUrl}`);
    return { sent: false, verifyUrl };
  }

  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [opts.to],
        subject: "Confirm your AI Tech account",
        html: verificationHtml(opts.name, verifyUrl),
        text: verificationText(opts.name, verifyUrl),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[email] Resend responded ${res.status}: ${detail}`);
      console.warn(`[email] Fallback verification link for ${opts.to}:\n${verifyUrl}`);
      return { sent: false, error: `Resend ${res.status}`, verifyUrl };
    }
    return { sent: true, verifyUrl };
  } catch (err) {
    console.error("[email] Failed to send verification email:", err);
    return { sent: false, error: String(err), verifyUrl };
  }
}

export async function sendPasswordResetEmail(opts: {
  to: string;
  token: string;
  name?: string;
}): Promise<EmailResult> {
  const resetUrl = buildResetUrl(opts.token);
  const apiKey = envVar("RESEND_API_KEY");
  const from = envVar("EMAIL_FROM") || "AI Tech <no-reply@ai-tech.fit>";

  if (!apiKey) {
    console.warn(`[email] RESEND_API_KEY not set — password reset link for ${opts.to}:\n${resetUrl}`);
    return { sent: false, resetUrl };
  }

  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [opts.to],
        subject: "Reset your AI Tech password",
        html: resetHtml(opts.name, resetUrl),
        text: resetText(opts.name, resetUrl),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[email] Resend responded ${res.status}: ${detail}`);
      console.warn(`[email] Fallback reset link for ${opts.to}:\n${resetUrl}`);
      return { sent: false, error: `Resend ${res.status}`, resetUrl };
    }
    return { sent: true, resetUrl };
  } catch (err) {
    console.error("[email] Failed to send password reset email:", err);
    return { sent: false, error: String(err), resetUrl };
  }
}

function verificationHtml(name: string | undefined, url: string): string {
  const greet = name ? `Hi ${escapeHtml(name)},` : "Hi,";
  return `<!doctype html>
<html lang="en">
<body style="margin:0;background:#0f1117;padding:24px;font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#e7e9ee">
  <div style="max-width:480px;margin:0 auto;background:#171a22;border:1px solid #262b36;border-radius:16px;padding:32px">
    <p style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#7c8aa5;margin:0">AI Tech</p>
    <h1 style="font-size:22px;margin:12px 0 16px;color:#fff">Confirm your email</h1>
    <p style="line-height:1.6;color:#c7ccd6;margin:0 0 24px">${greet}<br/>Thanks for creating an AI Tech account. Click the button below to activate it. The link expires in 24 hours.</p>
    <a href="${url}" style="display:inline-block;background:#6d5efc;color:#fff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:10px">Verify my account</a>
    <p style="line-height:1.6;color:#7c8aa5;font-size:13px;margin:24px 0 0">If the button doesn't work, paste this link into your browser:<br/><span style="color:#9aa6bd">${url}</span></p>
  </div>
</body>
</html>`;
}

function verificationText(name: string | undefined, url: string): string {
  const greet = name ? `Hi ${name},` : "Hi,";
  return `${greet}\n\nThanks for creating an AI Tech account. Confirm your email by opening this link (expires in 24 hours):\n\n${url}\n`;
}

function resetHtml(name: string | undefined, url: string): string {
  const greet = name ? `Hi ${escapeHtml(name)},` : "Hi,";
  return `<!doctype html>
<html lang="en">
<body style="margin:0;background:#0f1117;padding:24px;font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#e7e9ee">
  <div style="max-width:480px;margin:0 auto;background:#171a22;border:1px solid #262b36;border-radius:16px;padding:32px">
    <p style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#7c8aa5;margin:0">AI Tech</p>
    <h1 style="font-size:22px;margin:12px 0 16px;color:#fff">Reset your password</h1>
    <p style="line-height:1.6;color:#c7ccd6;margin:0 0 24px">${greet}<br/>We received a request to reset your password. Click the button below to choose a new one. The link expires in 1 hour. If you didn't request this, you can ignore the email.</p>
    <a href="${url}" style="display:inline-block;background:#6d5efc;color:#fff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:10px">Choose new password</a>
    <p style="line-height:1.6;color:#7c8aa5;font-size:13px;margin:24px 0 0">If the button doesn't work, paste this link into your browser:<br/><span style="color:#9aa6bd">${url}</span></p>
  </div>
</body>
</html>`;
}

function resetText(name: string | undefined, url: string): string {
  const greet = name ? `Hi ${name},` : "Hi,";
  return `${greet}\n\nWe received a request to reset your password. Choose a new password by opening this link (expires in 1 hour):\n\n${url}\n\nIf you didn't request this, you can ignore the email.\n`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
