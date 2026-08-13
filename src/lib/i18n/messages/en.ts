/**
 * English dictionary (the only shipped locale at launch).
 *
 * Naming convention: flat keys, grouped by feature prefix (nav., article.,
 * tools., ui., home.). Add translations by creating `messages/<locale>.ts`
 * with the same shape.
 */
export const messages = {
  "meta.title": "TechHow — Computer tutorials you can actually follow",
  "meta.description":
    "Step-by-step computer tutorials — Windows, macOS, hardware, software, security, coding and AI. Plain-English guides you can actually follow.",

  "nav.latest": "All Tutorials",
  "nav.trending": "Most Popular",
  "nav.ai": "AI & Automation",
  "nav.windows": "Windows",
  "nav.macos": "macOS",
  "nav.hardware": "Hardware",
  "nav.software": "Software",
  "nav.internet": "Internet",
  "nav.security": "Security",
  "nav.coding": "Coding",
  "nav.search": "Search",
  "nav.language": "Language",
  "nav.login": "Login",
  "nav.register": "Register",
  "nav.menu": "Menu",
  "nav.close": "Close",

  "ui.live": "Live",
  "ui.breaking": "Breaking",
  "ui.updated": "Updated {time} ago",
  "ui.trending": "Trending",
  "ui.readMore": "Read more",
  "ui.readingTime": "{min} min read",
  "ui.share": "Share",
  "ui.sources": "Sources",
  "ui.related": "Related articles",
  "ui.published": "Published",
  "ui.lastUpdated": "Last updated",
  "ui.by": "By",
  "ui.adLabel": "Advertisement",
  "ui.sponsored": "Sponsored",
  "ui.affiliateDisclosure":
    "This article contains affiliate links. If you buy through them, TechHow may earn a commission at no extra cost to you. We only recommend tools we have actually tested.",

  "home.trendingNow": "Most read right now",
  "home.latest": "Latest Tutorials",
  "home.latestSub": "New guides, every week.",
  "home.categoryPrefix": "More from",
  "home.newsletterTitle": "The How-To Digest",
  "home.newsletterSub":
    "One new how-to every week — the guide you actually needed, no fluff.",
  "home.newsletterCta": "Subscribe",
  "home.newsletterPlaceholder": "you@example.com",
  "home.newsletterPrivacy": "No spam. Unsubscribe anytime.",
  "home.newsletterSuccess": "You're on the list. Check your inbox for a confirmation.",

  "article.heroLive": "Live coverage",
  "article.comparisonVerdict": "Our verdict",
  "article.comparisonTableTitle": "Side-by-side comparison",
  "article.updatedTime": "Updated {time} ago",

  "category.emptyTitle": "Tutorials coming soon",
  "category.emptyBody":
    "This section is ramping up. In the meantime, browse Windows and Software where the guides are already live.",
  "category.browse": "Browse live sections",
  "category.allArticles": "All tutorials",

  "author.moreBy": "More by {name}",

  "tools.title": "Free Tools",
  "tools.sub": "Fast, client-side utilities. Your text never leaves your browser.",
  "tools.wordCounter": "Word Counter",
  "tools.characterCounter": "Character Counter",
  "tools.metaGenerator": "Meta Description Generator",
  "tools.reset": "Reset",
  "tools.copy": "Copy",
  "tools.copied": "Copied!",
  "tools.words": "Words",
  "tools.characters": "Characters",
  "tools.charactersNoSpaces": "Characters (no spaces)",
  "tools.sentences": "Sentences",
  "tools.paragraphs": "Paragraphs",
  "tools.readingTime": "Reading time",
  "tools.speakingTime": "Speaking time",
  "tools.keywordDensity": "Keyword density",
  "tools.metaHint":
    "Paste your draft copy below and generate a search-ready meta description. Keep it under 160 characters.",
  "tools.metaPrompt": "Write a meta description…",
  "tools.metaGenerate": "Generate",
  "tools.metaLengthOk": "Looks good — {length}/160 characters.",
  "tools.metaLengthWarn": "Over the 160-character limit by {overflow}.",

  "newsletter.blockTitle": "Get the Digest in your inbox",
  "newsletter.blockSub": "One new how-to every week. Free, one email, no noise.",
  "newsletter.placeholder": "you@example.com",
  "newsletter.cta": "Subscribe",

  "footer.tagline": "Computer tutorials you can actually follow.",
  "footer.sections": "Sections",
  "footer.tools": "Tools",
  "footer.legal": "Legal",
  "footer.about": "About",
  "footer.contact": "Contact",
  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms of Use",
  "footer.affiliate": "Affiliate Disclosure",
  "footer.rights": "All rights reserved.",
  "footer.madeBy": "Every step tested.",
} as const;

export type Dictionary = typeof messages;
