import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How AI Tech handles your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <StaticPage title="Privacy Policy" kicker="Your data">
      <h2>What we collect</h2>
      <ul>
        <li><strong>Usage analytics</strong> — anonymous pageviews and referrers, used to improve coverage.</li>
        <li><strong>Newsletter email</strong> — only if you subscribe, used to send the newsletter.</li>
        <li><strong>Accounts</strong> — email, name and saved-articles data once account features launch.</li>
      </ul>
      <h2>What we never do</h2>
      <ul>
        <li>We never sell personal data.</li>
        <li>We never use your newsletter signup for anything other than the newsletter.</li>
        <li>Free tools run 100% client-side — your text never leaves your browser.</li>
      </ul>
      <h2>Cookies & advertising</h2>
      <p>
        We use minimal, functional cookies for theme preference and (later) authentication. Third-party
        ad and analytics networks may set their own cookies when we enable them; those are governed by
        their policies.
      </p>
      <h2>Contact</h2>
      <p>
        Privacy questions: <a href="mailto:privacy@aitech.example">privacy@aitech.example</a>.
      </p>
    </StaticPage>
  );
}
