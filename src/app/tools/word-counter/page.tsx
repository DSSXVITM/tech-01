import type { Metadata } from "next";
import { WordCounter } from "@/components/tools/word-counter";

export const metadata: Metadata = {
  title: "Word Counter",
  description:
    "Free online word counter — words, characters, sentences, paragraphs, reading time and keyword density. 100% client-side and private.",
  alternates: { canonical: "/tools/word-counter" },
};

export default function WordCounterPage() {
  return <WordCounter />;
}
