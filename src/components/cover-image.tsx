"use client";

import { useState } from "react";

const REPO = "DSSXVITM/tech-01";
const BRANCH = "main";

function sourcesFor(slug: string): string[] {
  const path = `/images/articles/${slug}.jpg`;
  return [
    `https://cdn.jsdelivr.net/gh/${REPO}@${BRANCH}${path}`,
    `https://raw.githubusercontent.com/${REPO}/${BRANCH}/public${path}`,
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
