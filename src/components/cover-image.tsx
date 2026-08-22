"use client";

import { useState } from "react";

const REPO = "DSSXVITM/tech-01";
const BRANCH = "main";

function sourcesFor(slug: string): string[] {
  const path = `/images/articles/${slug}.svg`;
  return [
    // 1) Same-origin: works if the deployed Worker serves the bundled JPGs.
    path,
    // 2) External CDN fallbacks served from the public GitHub repo.
    `https://raw.githubusercontent.com/${REPO}/${BRANCH}/public${path}`,
    `https://cdn.jsdelivr.net/gh/${REPO}@${BRANCH}${path}`,
  ];
}

/**
 * Renders a cover image by trying several CDNs in order. If one fails to load
 * in the visitor's network, the next candidate is attempted. This keeps covers
 * visible even when a specific CDN is blocked or slow in a given region.
 */
export function CoverImage({
  slug,
  alt,
  className,
}: {
  slug: string;
  alt: string;
  className?: string;
}) {
  const sources = sourcesFor(slug);
  const [index, setIndex] = useState(0);

  if (index >= sources.length) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={sources[index]}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      style={{ objectFit: "cover", width: "100%", height: "100%" }}
      onError={() => setIndex((i) => i + 1)}
    />
  );
}
