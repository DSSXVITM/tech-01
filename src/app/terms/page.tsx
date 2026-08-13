import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that govern use of AI Tech.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <StaticPage title="Terms of Use" kicker="The fine print">
      <h2>Content</h2>
      <p>
        All content on AI Tech is provided for informational purposes. We work hard to be accurate,
        but technology changes fast and articles may not always reflect the latest state of a
        product or service. Verify critical details before relying on them.
      </p>
      <h2>Fair use</h2>
      <p>
        You may share and quote our articles with attribution. Republishing full articles without
        permission is not allowed.
      </p>
      <h2>Affiliate & sponsored content</h2>
      <p>
        Some links in comparison and review articles are affiliate links, and some articles are
        sponsored. Both are always disclosed. These relationships never alter our recommendations.
      </p>
      <h2>Free tools</h2>
      <p>
        Tools are provided "as is" without warranty. They run in your browser and cannot access
        your data — but double-check anything that matters before relying on it.
      </p>
    </StaticPage>
  );
}
