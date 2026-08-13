import { siteConfig } from "@/lib/site";

/**
 * Ad placeholder.
 *
 * Phase 3: replace the box with a real network snippet (AdSense etc.) once
 * `siteConfig.ads.clientId` is set. Until then it renders a clearly-labeled
 * spacer so layouts are honest and revenue hooks exist. Placements sit below
 * the fold and between sections — never adjacent to nav or interactive
 * elements (see the brief's monetization rules).
 */
export function AdSlot({
  slot,
  className = "",
  height = "h-[120px]",
}: {
  slot: string;
  className?: string;
  height?: string;
}) {
  const enabled = siteConfig.ads.enabled;
  return (
    <div className={`my-10 w-full ${className}`} aria-label={`Advertisement ${slot}`}>
      <div
        className={`flex w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line bg-surface/40 ${height}`}
      >
        {enabled ? (
          <span className="font-mono text-xs text-muted">Ad · {slot}</span>
        ) : (
          <>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              Advertisement
            </span>
            <span className="font-mono text-[10px] text-muted/60">
              {slot} · configure in <code>siteConfig.ads</code>
            </span>
          </>
        )}
      </div>
    </div>
  );
}
