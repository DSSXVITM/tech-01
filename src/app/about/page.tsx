import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";

export const metadata: Metadata = {
  title: "About",
  description: "What AI Tech is, how we write tutorials and the standards behind every guide.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <StaticPage title="About AI Tech" kicker="Who we are">
      <p>
        AI Tech is a how-to site for everyday computer problems. Windows, macOS, hardware,
        software, internet, security, coding and AI — written in plain English, tested on a
        clean machine, and updated when the steps change.
      </p>
      <h2>How we write</h2>
      <p>
        Every guide starts with a real problem someone asked us to solve. We reproduce it, work
        through the fix, and write the steps so a beginner can follow them the first time. Where
        a guide has multiple routes, we pick the safest and tell you why.
      </p>
      <h2>How we make money</h2>
      <ul>
        <li>Affiliate links in product picks — always disclosed, never behind the verdict.</li>
        <li>Sponsored articles — produced in partnership, always labeled.</li>
        <li>Newsletter and (coming later) premium tool tiers.</li>
      </ul>
      <p>
        None of it changes a recommendation. We only recommend software and hardware we have
        actually installed and used.
      </p>
      <h2>Corrections</h2>
      <p>
        Guides age — operating systems change. When a reader spots a step that no longer works,
        we test it and update the guide, marking the change. Corrections are welcome:{" "}
        <a href="mailto:support@ai-tech.fit">support@ai-tech.fit</a>.
      </p>
    </StaticPage>
  );
}
