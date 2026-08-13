import type { Category, CategorySlug } from "./types";

export const categories: Category[] = [
  {
    slug: "windows",
    name: "Windows",
    short: "Windows",
    description:
      "Set up, customize and troubleshoot Windows — from first login to power-user shortcuts, drivers and recovery.",
    topics: ["Setup", "Settings", "Shortcuts", "Drivers", "Troubleshooting", "Upgrades"],
    color: "#3B5BFF",
  },
  {
    slug: "macos",
    name: "macOS",
    short: "macOS",
    description:
      "Master your Mac — file management, Spotlight, Terminal basics, backups with Time Machine and everyday macOS workflows.",
    topics: ["Finder", "Terminal", "Time Machine", "Shortcuts", "Settings", "Backup"],
    color: "#5B8DEF",
  },
  {
    slug: "hardware",
    name: "Hardware",
    short: "Hardware",
    description:
      "Build, upgrade and fix PCs — picking parts, installing components, cooling, peripherals and getting the most from your hardware.",
    topics: ["PC Builds", "Upgrades", "RAM", "Storage", "Cooling", "Peripherals"],
    color: "#FF7A59",
  },
  {
    slug: "software",
    name: "Software",
    short: "Software",
    description:
      "Everyday apps, installs and workflows — installing and removing programs, browsers, backups, PDFs, email and the tools that save you time.",
    topics: ["Apps", "Installation", "Browsers", "Productivity", "Backup", "Automation"],
    color: "#7C5CFF",
  },
  {
    slug: "internet",
    name: "Internet",
    short: "Internet",
    description:
      "Wi-Fi, routers and home networking made simple — faster connections, better range, and fixing dropped signals step by step.",
    topics: ["Wi-Fi", "Routers", "Networking", "Speed", "DNS", "Troubleshooting"],
    color: "#3BB4FF",
  },
  {
    slug: "security",
    name: "Security",
    short: "Security",
    description:
      "Lock down your accounts and devices — passwords, two-factor authentication, phishing, privacy settings and safe browsing habits.",
    topics: ["Passwords", "2FA", "Phishing", "Privacy", "Antivirus", "Secure Browsing"],
    color: "#2FBF8F",
  },
  {
    slug: "coding",
    name: "Coding",
    short: "Coding",
    description:
      "Learn to code from the ground up — Python, HTML, Git, scripts and small projects that actually do something useful.",
    topics: ["Python", "HTML/CSS", "Git", "Scripts", "Terminal", "Projects"],
    color: "#FFB020",
  },
  {
    slug: "ai",
    name: "AI & Automation",
    short: "AI",
    description:
      "Use AI tools safely and productively — writing prompts, automating repetitive tasks and knowing when an AI tool is the right tool.",
    topics: ["ChatGPT", "Prompts", "AI Tools", "Automation", "Ethics", "Productivity"],
    color: "#FF5CA8",
  },
];

const bySlug = new Map<CategorySlug, Category>(categories.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category | undefined {
  return bySlug.get(slug as CategorySlug);
}

export function getCategoryBySlug(slug: CategorySlug): Category {
  const c = bySlug.get(slug);
  if (!c) throw new Error(`Unknown category: ${slug}`);
  return c;
}
