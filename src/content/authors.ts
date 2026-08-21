import type { Author } from "./types";

export const authors: Author[] = [
  {
    slug: "ai-tech-desk",
    name: "AI Tech Desk",
    role: "Editorial team",
    bio: "The AI Tech editorial team writes the how-to guides, testing every step on a clean machine before anything goes live.",
    avatarKey: "ai-tech",
    email: "desk@ai-tech.fit",
  },
];

const bySlug = new Map(authors.map((a) => [a.slug, a]));

export function getAuthor(slug: string): Author | undefined {
  return bySlug.get(slug);
}
