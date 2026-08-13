import Link from "next/link";
import type { Article } from "@/content/types";
import { CodeBlock } from "./code-block";

/**
 * Renders article content blocks to markup.
 *
 * Inline links in paragraphs use markdown-style `[label](url)` syntax —
 * resolved here, so CMS authors can write internal links without HTML.
 */

function renderInline(text: string, key: number): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const href = m[2];
    const internal = href.startsWith("/");
    parts.push(
      internal ? (
        <Link key={`${key}-${i}`} href={href}>
          {m[1]}
        </Link>
      ) : (
        <a key={`${key}-${i}`} href={href} target="_blank" rel="noopener noreferrer">
          {m[1]}
        </a>
      ),
    );
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className="text-sm" style={{ color: n <= value ? "var(--amber)" : "var(--line)" }}>
          ★
        </span>
      ))}
    </span>
  );
}

const CALLOUT_TONES = {
  info: { border: "var(--signal)", bg: "var(--signal-soft)", label: "INFO" },
  warn: { border: "var(--amber)", bg: "var(--amber-soft)", label: "WATCH" },
  success: { border: "#2FBF8F", bg: "rgba(47,191,143,0.12)", label: "GOOD TO KNOW" },
};

export function ArticleRenderer({ article }: { article: Article }) {
  return (
    <div className="prose-article">
      {article.content.map((block, i) => {
        switch (block.type) {
          case "p":
            return <p key={i}>{renderInline(block.text, i)}</p>;
          case "h2":
            return <h2 key={i}>{renderInline(block.text, i)}</h2>;
          case "h3":
            return <h3 key={i}>{renderInline(block.text, i)}</h3>;
          case "quote":
            return (
              <blockquote key={i}>
                {renderInline(block.text, i)}
                {block.cite && <cite className="mt-2 block font-mono text-xs not-italic text-muted">— {block.cite}</cite>}
              </blockquote>
            );
          case "list": {
            const items = block.items.map((item, j) => <li key={j}>{renderInline(item, j)}</li>);
            return block.ordered ? <ol key={i}>{items}</ol> : <ul key={i}>{items}</ul>;
          }
          case "callout": {
            const tone = CALLOUT_TONES[block.tone];
            return (
              <div
                key={i}
                className="my-6 rounded-lg border-l-2 px-4 py-3.5"
                style={{ borderColor: tone.border, background: tone.bg }}
              >
                <p
                  className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em]"
                  style={{ color: tone.border }}
                >
                  {tone.label}
                  {block.title ? ` · ${block.title}` : ""}
                </p>
                <p className="text-sm leading-relaxed text-fg">{renderInline(block.text, i)}</p>
              </div>
            );
          }
          case "code":
            return <CodeBlock key={i} lang={block.lang} text={block.text} />;
          case "table":
            return (
              <div key={i} className="my-6 overflow-x-auto rounded-lg border border-line">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-line bg-surface-2">
                      {block.columns.map((c, j) => (
                        <th
                          key={j}
                          className="px-3.5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-signal-ink"
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j} className="border-b border-line last:border-0">
                        {row.map((cell, k) => (
                          <td key={k} className={`px-3.5 py-2.5 ${k === 0 ? "font-medium text-fg" : "text-muted"}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "product":
            return (
              <div
                key={i}
                className="my-5 flex flex-col gap-3 rounded-lg border border-line bg-surface p-4 sm:flex-row sm:items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-lg font-bold uppercase text-fg">{block.name}</h4>
                    <Rating value={block.rating} />
                  </div>
                  <p className="mt-0.5 text-[13px] text-muted">{block.tagline}</p>
                </div>
                <div className="flex flex-none items-center gap-3">
                  <span className="font-mono text-[12px] font-semibold text-fg">{block.price}</span>
                  {block.affiliateHref && (
                    <a
                      href={block.affiliateHref}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="rounded-md bg-signal px-3.5 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-white"
                    >
                      {block.affiliateLabel ?? "Visit site"}
                    </a>
                  )}
                </div>
              </div>
            );
          case "affiliateCta":
            return (
              <div key={i} className="my-6 rounded-lg border border-signal/30 bg-signal-soft p-4 text-center">
                <p className="mb-3 text-sm text-fg">{block.text}</p>
                <a
                  href={block.href}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-block rounded-md bg-signal px-5 py-2.5 font-mono text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90"
                >
                  {block.label}
                </a>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
