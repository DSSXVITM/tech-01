import type { Metadata } from "next";
import { CharacterCounter } from "@/components/tools/character-counter";

export const metadata: Metadata = {
  title: "Character Counter",
  description:
    "Free character and word counter with and without spaces. Perfect for social posts, titles and meta fields. Runs entirely in your browser.",
  alternates: { canonical: "/tools/character-counter" },
};

export default function CharacterCounterPage() {
  return <CharacterCounter />;
}
