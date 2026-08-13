import { ImageResponse } from "next/og";

/**
 * Shared OG card — dark broadcast-style default with circuit traces.
 * Used by the root opengraph-image and per-article OG images.
 */
export function buildOgCard({
  title,
  eyebrow,
}: {
  title: string;
  eyebrow: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#12131C",
          color: "#F2F3F7",
          fontFamily: "sans-serif",
          padding: 72,
          position: "relative",
        }}
      >
        {/* accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, backgroundColor: "#3B5BFF" }} />
        {/* circuit traces */}
        <svg viewBox="0 0 1200 630" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <g stroke="#3B5BFF" strokeOpacity="0.2" strokeWidth="2" fill="none">
            <path d="M90 520 H420 V400 H660" />
            <path d="M1080 120 H860 V260 H700" />
            <path d="M300 90 H560 V210 H740" />
            <path d="M980 520 H760 V420 H600" />
          </g>
          <g fill="#3B5BFF" fillOpacity="0.5">
            <circle cx="90" cy="520" r="6" />
            <circle cx="660" cy="400" r="6" />
            <circle cx="1080" cy="120" r="6" />
            <circle cx="700" cy="260" r="6" />
            <circle cx="740" cy="210" r="6" />
            <circle cx="600" cy="420" r="6" />
          </g>
        </svg>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "auto" }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: "#FFB020" }} />
          <div style={{ fontSize: 26, letterSpacing: 10, color: "#8891A6", textTransform: "uppercase" }}>
            AI TECH
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1000 }}>
          <div style={{ fontSize: 30, letterSpacing: 8, color: "#3B5BFF", textTransform: "uppercase" }}>
            {eyebrow}
          </div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, textTransform: "uppercase" }}>
            {title}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 48 }}>
          <div style={{ fontSize: 24, color: "#8891A6" }}>Computer tutorials you can actually follow</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
