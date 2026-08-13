import type { Author } from "./types";

export const authors: Author[] = [
  {
    slug: "maya-kovac",
    name: "Maya Kovac",
    role: "Editor, Windows & Hardware",
    bio: "Maya has set up, fixed and rebuilt more PCs than she can count. She writes the Windows and hardware guides in plain English — no jargon, no skipped steps.",
    avatarKey: "mk",
    email: "maya@techhow.example",
  },
  {
    slug: "daniel-reyes",
    name: "Daniel Reyes",
    role: "Editor, Software & Coding",
    bio: "Daniel teaches software and coding to non-programmers. He writes the app guides and beginner coding tutorials, always testing every step on a clean machine.",
    avatarKey: "dr",
    email: "daniel@techhow.example",
  },
  {
    slug: "sofia-ivanova",
    name: "Sofia Ivanova",
    role: "Editor, Security & Privacy",
    bio: "Sofia explains account security, passwords and privacy settings without the fearmongering. Former security researcher, now a very picky password manager user.",
    avatarKey: "si",
    email: "sofia@techhow.example",
  },
];

const bySlug = new Map(authors.map((a) => [a.slug, a]));

export function getAuthor(slug: string): Author | undefined {
  return bySlug.get(slug);
}
