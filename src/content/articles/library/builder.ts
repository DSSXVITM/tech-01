import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Article, CategorySlug, ContentBlock, Difficulty } from "../../types";
import { coverCredits } from "./credits";

const COVER_DIR = join(process.cwd(), "public", "images", "articles");
function coverSrc(slug: string): string | undefined {
  if (existsSync(join(COVER_DIR, `${slug}.jpg`))) return `/images/articles/${slug}.jpg`;
  if (existsSync(join(COVER_DIR, `${slug}.svg`))) return `/images/articles/${slug}.svg`;
  return undefined;
}

/**
 * Library articles — a large static corpus (~56 per category, medium length).
 *
 * Each category file (`seeds/*.ts`) exports compact seeds (title, excerpt,
 * tags, intro, steps, tip). This builder expands them into full Article
 * objects matching the shape used by tutorials.ts, so no template changes are
 * needed.
 */

export interface ArticleSeed {
  title: string;
  excerpt: string;
  tags: string[];
  intro: string;
  steps: string[];
  tip: string;
  difficulty: Difficulty;
  timeMinutes: number;
}

const AUTHORS: Record<CategorySlug, string> = {
  windows: "ai-tech-desk",
  macos: "ai-tech-desk",
  hardware: "ai-tech-desk",
  software: "ai-tech-desk",
  internet: "ai-tech-desk",
  security: "ai-tech-desk",
  coding: "ai-tech-desk",
  ai: "ai-tech-desk",
};

const STATUSES: Article["status"][] = ["live", "live", "live", "trending", "live", "updated", "live"];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function pick<T>(arr: T[], key: string): T {
  return arr[hashStr(key) % arr.length];
}

function buildBlocks(seed: ArticleSeed): ContentBlock[] {
  const cat = seed.tags[0] ?? "windows";
  const tag0 = seed.tags[1] ?? seed.tags[0] ?? "settings";
  const key = seed.title;
  const blocks: ContentBlock[] = [];

  // Intro — two paragraphs so the page opens with substance.
  blocks.push({ type: "p", text: seed.intro });
  blocks.push({
    type: "p",
    text: pick(
      [
        `On ${cap(cat)}, "${seed.title}" is the kind of task that pays off the first time you need it. A few minutes now saves the panic later.`,
        `${cap(cat)} makes this straightforward once you know where the settings live. This guide keeps it to the steps that actually matter.`,
        `Most ${cat} problems like this come down to a handful of settings. We walk through them in order so nothing is left to guesswork.`,
      ],
      key,
    ),
  });

  // Before you begin
  blocks.push({ type: "h2", text: "Before you begin" });
  blocks.push({
    type: "list",
    items: [
      `A ${cat} device with the latest updates installed`,
      `Your account details handy — you may need to sign in again`,
      `About ${seed.timeMinutes} minutes of quiet time, no reboot required unless we say so`,
      `Anything related to ${tag0} already set up and working`,
    ],
  });

  // How it works
  blocks.push({ type: "h2", text: "How it works" });
  blocks.push({
    type: "p",
    text: `At its core, ${seed.title.toLowerCase()} is about telling ${cat} to do one specific thing and confirming it stuck. The steps below break that into pieces small enough to undo if something feels wrong, so you can experiment without fear.`,
  });
  blocks.push({
    type: "callout",
    tone: "info",
    title: "Why bother",
    text: `Learning this once means the next time ${tag0} acts up, you fix it in minutes instead of scrolling through forums.`,
  });

  // Step-by-step
  blocks.push({ type: "h2", text: "Step-by-step" });
  blocks.push({ type: "list", ordered: true, items: seed.steps });
  blocks.push({ type: "callout", tone: "success", title: "Pro tip", text: seed.tip });

  // Tips for a smoother result
  blocks.push({ type: "h2", text: "Tips for a smoother result" });
  blocks.push({
    type: "list",
    items: [
      `If you do this often, bookmark the settings page so the next attempt is one click shorter.`,
      `Take a screenshot before you change anything — it's the fastest way to revert a step you didn't mean to take.`,
      `When ${tag0} is involved, go slow and verify each change before moving on to the next one.`,
      `Keep this tab open on a second screen (or print the steps) so you never lose your place mid-task.`,
    ],
  });

  // Common mistakes
  blocks.push({ type: "h2", text: "Common mistakes to avoid" });
  blocks.push({
    type: "list",
    items: [
      `Skipping the sign-in step — many settings hide behind an account you forgot to open.`,
      `Changing too many things at once — you won't know which one fixed (or broke) it.`,
      `Closing the window before the change saves — some ${cat} dialogs need an explicit confirm button.`,
    ],
  });

  // Troubleshooting
  blocks.push({ type: "h2", text: "Troubleshooting" });
  blocks.push({
    type: "list",
    items: [
      `If nothing happens, close and reopen the app — a stale session is the usual culprit.`,
      `Still stuck? Note the exact wording of any error and search it together with the step number above.`,
      `As a last resort, undo your most recent change and run the steps again from the top.`,
    ],
  });

  // At a glance summary table
  blocks.push({ type: "h2", text: "At a glance" });
  blocks.push({
    type: "table",
    columns: ["Detail", "Value"],
    rows: [
      ["Difficulty", cap(seed.difficulty)],
      ["Time needed", `${seed.timeMinutes} min`],
      ["Category", cap(cat)],
    ],
  });

  // Bottom line
  blocks.push({ type: "h2", text: "Bottom line" });
  blocks.push({
    type: "p",
    text: `That's everything. ${seed.title} is less about technical skill and more about following a known order — do it once and it becomes muscle memory. Keep this page bookmarked, and the next time ${tag0} gives you trouble you'll be done before it ever turned into a real problem.`,
  });

  return blocks;
}

export function buildLibraryArticle(
  category: CategorySlug,
  seed: ArticleSeed,
  index: number,
): Article {
  const slug = slugify(seed.title);
  const dayOffset = index % 60;
  const publishedAt = new Date(Date.UTC(2026, 5, 1) - dayOffset * 26 * 3600 * 1000).toISOString();
  return {
    slug,
    title: seed.title,
    excerpt: seed.excerpt,
    category,
    tags: seed.tags,
    author: AUTHORS[category],
    publishedAt,
    ...(index % 9 === 0 ? { updatedAt: new Date(Date.UTC(2026, 7, 20) - dayOffset * 3600 * 1000).toISOString() } : {}),
    status: STATUSES[index % STATUSES.length],
    ...(index % 14 === 0 ? { trendingRank: (index % 8) + 1 } : {}),
    image: {
      src: coverSrc(slug),
      cover: category,
      alt: seed.title,
      ...(coverCredits[slug] ? { credit: coverCredits[slug] } : {}),
    },
    seo: {
      title: seed.title,
      description: seed.excerpt,
    },
    sources: [],
    tutorial: {
      difficulty: seed.difficulty,
      timeMinutes: seed.timeMinutes,
      prerequisites: ["A computer with internet access", "About 5–15 minutes"],
      learn: [
        `Follow the steps to ${seed.title.toLowerCase()} without help`,
        "Understand the settings and options involved",
        "Troubleshoot common problems on your own",
      ],
    },
    content: buildBlocks(seed),
  };
}

export function buildLibrary(category: CategorySlug, seeds: ArticleSeed[]): Article[] {
  return seeds.map((seed, i) => buildLibraryArticle(category, seed, i));
}
