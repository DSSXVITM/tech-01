import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getAllArticles, getCategories } from "@/content";

const STATIC_ROUTES = [
  { path: "/", priority: 1 },
  { path: "/tutorials", priority: 0.9 },
  { path: "/trending", priority: 0.9 },
  { path: "/tools", priority: 0.8 },
  { path: "/tools/word-counter", priority: 0.8 },
  { path: "/tools/character-counter", priority: 0.8 },
  { path: "/tools/meta-description-generator", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${siteConfig.url}${r.path === "/" ? "" : r.path}`,
    lastModified: now,
    changeFrequency: r.path === "/" ? "hourly" : "weekly",
    priority: r.priority,
  }));

  const categoryEntries: MetadataRoute.Sitemap = getCategories().map((c) => ({
    url: `${siteConfig.url}/${c.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const articleEntries: MetadataRoute.Sitemap = getAllArticles().map((a) => ({
    url: `${siteConfig.url}/${a.category}/${a.slug}`,
    lastModified: a.updatedAt ? new Date(a.updatedAt) : new Date(a.publishedAt),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticEntries, ...categoryEntries, ...articleEntries];
}
