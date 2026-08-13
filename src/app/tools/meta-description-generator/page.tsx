import type { Metadata } from "next";
import { MetaDescriptionGenerator } from "@/components/tools/meta-description-generator";

export const metadata: Metadata = {
  title: "Meta Description Generator",
  description:
    "Generate SEO-ready meta descriptions under 160 characters from your article copy. Free, instant and client-side.",
  alternates: { canonical: "/tools/meta-description-generator" },
};

export default function MetaDescriptionGeneratorPage() {
  return <MetaDescriptionGenerator />;
}
