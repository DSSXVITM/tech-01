import type { Article, Difficulty } from "@/content/types";

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const DIFFICULTY_BAR: Record<Difficulty, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  beginner: "var(--signal)",
  intermediate: "var(--amber)",
  advanced: "var(--danger)",
};

/** Tutorial meta block — badges, prerequisites and "what you'll learn". */
export function TutorialHeader({ article }: { article: Article }) {
  const meta = article.tutorial;
  if (!meta) return null;

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex flex-wrap items-center gap-3 border-b border-line bg-surface-2 px-5 py-3">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.12em]"
          style={{ color: DIFFICULTY_COLOR[meta.difficulty], background: "var(--bg)" }}
        >
          {DIFFICULTY_LABEL[meta.difficulty]}
          <span className="flex items-center gap-1" aria-hidden="true">
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className="h-1.5 w-3 rounded-full"
                style={{
                  background: n <= DIFFICULTY_BAR[meta.difficulty] ? DIFFICULTY_COLOR[meta.difficulty] : "var(--line)",
                }}
              />
            ))}
          </span>
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
          {meta.timeMinutes} min
        </span>
        {article.updatedAt && (
          <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
            Updated {new Date(article.updatedAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        )}
      </div>

      <div className="grid gap-6 px-5 py-5 md:grid-cols-2">
        {meta.prerequisites.length > 0 && (
          <div>
            <h3 className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-signal-ink">
              What you'll need
            </h3>
            <ul className="space-y-1.5">
              {meta.prerequisites.map((p) => (
                <li key={p} className="flex items-start gap-2 text-[13px] leading-relaxed text-muted">
                  <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-sm bg-signal" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}
        {meta.learn.length > 0 && (
          <div>
            <h3 className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-signal-ink">
              What you'll learn
            </h3>
            <ul className="space-y-1.5">
              {meta.learn.map((l) => (
                <li key={l} className="flex items-start gap-2 text-[13px] leading-relaxed text-muted">
                  <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-sm bg-amber" aria-hidden="true" />
                  {l}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
