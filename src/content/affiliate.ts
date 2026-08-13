import type { AffiliateProduct } from "./types";

/**
 * Affiliate catalogs.
 *
 * Products are keyed by `article.affiliate.catalog`. The comparison template
 * reads rows from here and renders them with a full disclosure.
 *
 * IMPORTANT: `url` values point at the vendor homepage. Before going live,
 * replace them with your own tracked affiliate links (Amazon, CJ, Impact,
 * etc.). Every affiliate URL must carry your publisher ref for revenue to
 * be attributed.
 */

export const affiliateCatalogs: Record<string, AffiliateProduct[]> = {
  "ai-video-generators": [
    {
      name: "Runway Gen-4",
      tagline: "The strongest text-to-video quality and the best director controls.",
      rating: 4.8,
      price: "From $12/mo",
      bestFor: "Professional filmmaking & control",
      pros: ["Best-in-class temporal consistency", "Fine-grained camera + motion controls", "Commercially-safe outputs"],
      cons: ["Steep learning curve", "Credits burn fast at 4K"],
      url: "https://runwayml.com",
      badge: "Editor's Choice",
    },
    {
      name: "Kling 2.1",
      tagline: "Fast renders, aggressive pricing and surprisingly good physics.",
      rating: 4.5,
      price: "From $8/mo",
      bestFor: "Fast iteration on a budget",
      pros: ["Very fast generation", "Great value credits", "Strong motion physics"],
      cons: ["Fewer fine controls", "Upscaling costs extra"],
      url: "https://klingai.com",
    },
    {
      name: "Pika 2.0",
      tagline: "The easiest on-ramp for beginners who want clip-level output fast.",
      rating: 4.3,
      price: "From $10/mo",
      bestFor: "Beginners & social clips",
      pros: ["Gentle learning curve", "Great templates", "Web-first editor"],
      cons: ["Less control over lighting", "Shorter max clips"],
      url: "https://pika.art",
    },
    {
      name: "Luma Dream Machine",
      tagline: "Best raw realism out of the box, with extendable shot length.",
      rating: 4.4,
      price: "From $15/mo",
      bestFor: "Realistic footage & extensions",
      pros: ["Stunning photorealism", "Shot extension", "Solid API access"],
      cons: ["Iteration can be slow", "Premium pricing"],
      url: "https://lumalabs.ai",
    },
    {
      name: "Sora 2",
      tagline: "The easiest tool to prompt — and the strongest at natural language.",
      rating: 4.6,
      price: "From $20/mo (Pro)",
      bestFor: "Natural-language video & remixing",
      pros: ["Best prompt understanding", "Remix + storyboard tools", "Tight ChatGPT integration"],
      cons: ["Expensive entry tier", "Waitlist in some regions"],
      url: "https://openai.com/sora",
    },
  ],

  "seo-tools": [
    {
      name: "Ahrefs",
      tagline: "The most complete SEO suite — keyword, backlink and content data.",
      rating: 4.9,
      price: "From $99/mo",
      bestFor: "Full-site SEO & backlinks",
      pros: ["Best backlink database", "Huge keyword index", "Site audit + rank tracking"],
      cons: ["Pricey for small sites", "Steep learning curve"],
      url: "https://ahrefs.com",
      badge: "Editor's Choice",
    },
    {
      name: "Semrush",
      tagline: "The all-in-one that pairs SEO with content, ads and social.",
      rating: 4.7,
      price: "From $139/mo",
      bestFor: "Content + SEO + ads in one tool",
      pros: ["Content marketing suite", "Competitor analysis", "Position tracking"],
      cons: ["Can feel bloated", "Premium price"],
      url: "https://semrush.com",
    },
    {
      name: "Moz Pro",
      tagline: "Accessible suite for growing sites and agencies on a budget.",
      rating: 4.4,
      price: "From $49/mo",
      bestFor: "Agencies & small teams",
      pros: ["Lower entry price", "Clean, simple UI", "Good rank tracking"],
      cons: ["Smaller link database", "Fewer AI features"],
      url: "https://moz.com",
    },
    {
      name: "Surfer SEO",
      tagline: "On-page optimization that reads like a checklist — and works.",
      rating: 4.5,
      price: "From $79/mo",
      bestFor: "On-page optimization & content",
      pros: ["Clear content scoring", "SERP analysis", "AI outline generation"],
      cons: ["Weaker keyword research", "Needs a companion tool"],
      url: "https://surferseo.com",
    },
    {
      name: "Screaming Frog",
      tagline: "The crawler every technical SEO person keeps open all day.",
      rating: 4.6,
      price: "Free up to 500 URLs",
      bestFor: "Technical crawls & audits",
      pros: ["Free tier", "Deep technical checks", "One-off payment Pro"],
      cons: ["Not a full suite", "Desktop app only"],
      url: "https://screamingfrog.co.uk",
    },
  ],
};

export function getAffiliateCatalog(key?: string): AffiliateProduct[] {
  if (!key) return [];
  return affiliateCatalogs[key] ?? [];
}
