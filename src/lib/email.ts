import { siteConfig } from "@/lib/site";

const RESEND_API = "https://api.resend.com/emails";

/** Base URL used in verification links. Override with APP_URL when needed. */
function getAppUrl(): string {
  const raw = (process.env.APP_URL || siteConfig.url || "").replace(/\/+$/, "");
  return raw || "http://localhost:3000";
}

export function buildVerifyUrl(token: string): string {
  return `${getAppUrl()}/api/auth/verify-email?token=${encodeURIComponent(token)}`;
}

export interface EmailResult {
  sent: boolean;
  verifyUrl?: string;
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
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "AI Tech <no-reply@ai-tech.fit>";

  if (!apiKey) {
    console.warn(
      `[email] RESEND_API_KEY not set — verification link for ${opts.to}:\n${verifyUrl}`,
    );
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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
