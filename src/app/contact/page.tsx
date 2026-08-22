import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the AI Tech team — corrections, requests and partnerships.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <StaticPage title="Contact" kicker="Get in touch">
      <p>
        We read everything. For press tips, corrections, or to pitch a story, email the desk at{" "}
        <a href="mailto:support@ai-tech.fit">support@ai-tech.fit</a>.
      </p>
      <h2>Partnerships & advertising</h2>
      <p>
        Sponsorships, affiliate programs and newsletter placements:{" "}
        <a href="mailto:support@ai-tech.fit">support@ai-tech.fit</a>.
      </p>
      <h2>Corrections</h2>
      <p>
        Spot an error? Tell us and we'll fix it fast. Please include a link to the article and the
        correct information if you have it: <a href="mailto:support@ai-tech.fit">support@ai-tech.fit</a>.
      </p>
    </StaticPage>
  );
}
