import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "How affiliate links work on AI Tech and how we stay independent.",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <StaticPage title="Affiliate Disclosure" kicker="Transparency">
      <p>
        AI Tech is supported by readers and by affiliate partnerships. When you buy a product
        through an affiliate link on this site, we may earn a commission — at no extra cost to you.
      </p>
      <h2>How it works</h2>
      <ul>
        <li>Affiliate links appear only in product picks and "best of" guides.</li>
        <li>Every article with affiliate links carries a disclosure banner above the content.</li>
        <li>Recommendations are based on what we actually installed and used — never on commission rates.</li>
        <li>Products we haven't tested are not recommended, period.</li>
      </ul>
      <h2>How we choose what to recommend</h2>
      <p>
        We select products based on reader relevance and our own testing needs, not on who offers a
        partnership. A vendor buying an affiliate placement does not buy a recommendation.
      </p>
      <h2>Questions</h2>
      <p>
        If a link's origin isn't clear, email <a href="mailto:support@ai-tech.fit">support@ai-tech.fit</a>{" "}
        and we'll clarify.
      </p>
    </StaticPage>
  );
}
