import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { LogoMark } from "./logo";

const TOOL_LINKS = [
  { href: "/tools/word-counter", label: "Word Counter" },
  { href: "/tools/character-counter", label: "Character Counter" },
  { href: "/tools/meta-description-generator", label: "Meta Description Generator" },
];

const EXPLORE_LINKS = [
  { href: "/tutorials", label: "All Tutorials" },
  { href: "/trending", label: "Most Popular" },
  { href: "/news", label: "News" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
      {children}
    </h2>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-line bg-surface/40">
      <div className="circuit-trace pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1440px] px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5" aria-label="AI Tech — home">
              <LogoMark className="h-9 w-9" />
              <span className="font-display text-2xl font-bold tracking-tight text-fg">
                AI<span className="text-signal">Tech</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Computer tutorials you can actually follow — Windows, macOS, hardware,
              software, security, coding and AI, in plain English.
            </p>
            <p className="font-mono text-[11px] text-muted/70">● NEW WEEKLY · {siteConfig.url}</p>
          </div>

          <nav aria-label="Explore">
            <SectionHeading>Explore</SectionHeading>
            <ul className="space-y-2.5">
              {EXPLORE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted transition-colors hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <SectionHeading>Tools</SectionHeading>
            <ul className="space-y-2.5">
              {TOOL_LINKS.map((t) => (
                <li key={t.href}>
                  <Link href={t.href} className="text-sm text-muted transition-colors hover:text-fg">
                    {t.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/tools" className="text-sm text-signal-ink hover:text-signal">
                  All tools →
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Company">
            <SectionHeading>Company</SectionHeading>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted transition-colors hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] text-muted">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="font-mono text-[11px] text-muted">Every step tested. ●</p>
        </div>
      </div>
    </footer>
  );
}
