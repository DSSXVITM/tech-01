"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { value: "windows", label: "Windows" },
  { value: "macos", label: "macOS" },
  { value: "hardware", label: "Hardware" },
  { value: "software", label: "Software" },
  { value: "internet", label: "Internet" },
  { value: "security", label: "Security" },
  { value: "coding", label: "Coding" },
  { value: "ai", label: "AI & Automation" },
];

const DIFFICULTIES = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const inputCls =
  "w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted/60 focus:border-signal/60 focus:outline-none";
const labelCls = "mb-1.5 block font-display text-[10px] uppercase tracking-[0.14em] text-muted";

export function ArticleForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("ai");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [publish, setPublish] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [difficulty, setDifficulty] = useState("beginner");
  const [timeMinutes, setTimeMinutes] = useState("10");
  const [prerequisites, setPrerequisites] = useState("");
  const [learn, setLearn] = useState("");

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Image is too large — max ~2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      setPreview(data);
      if (!imageAlt) setImageAlt(title || file.name);
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          excerpt,
          tags,
          content,
          imageDataUrl: preview,
          imageAlt,
          publish,
          difficulty,
          timeMinutes,
          prerequisites,
          learn,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        slug?: string;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Failed to create article.");
        setSaving(false);
        return;
      }
      router.push(publish ? `/${category}/${data.slug}` : "/admin/articles");
      router.refresh();
    } catch {
      setError("Network error — please try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className={labelCls} htmlFor="art-title">Title</label>
          <input
            id="art-title"
            className={inputCls}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Anthropic Ships Claude Next"
            required
          />
        </div>

        <div>
          <label className={labelCls} htmlFor="art-category">Category</label>
          <select
            id="art-category"
            className={inputCls}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls} htmlFor="art-tags">Tags (comma separated)</label>
          <input
            id="art-tags"
            className={inputCls}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="ai, models, launch"
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelCls} htmlFor="art-excerpt">Excerpt / summary</label>
          <textarea
            id="art-excerpt"
            className={`${inputCls} resize-y`}
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="One or two sentences shown in cards and search."
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelCls} htmlFor="art-content">Body</label>
          <textarea
            id="art-content"
            className={`${inputCls} resize-y font-display text-[13px] leading-relaxed`}
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"Write the article here.\n\n## for headings, - for lists, > for quotes.\n\n``` ``` wrap code blocks with a language tag, e.g. ```javascript.\n\nSeparate paragraphs with a blank line."}
            required
          />
        </div>

        <div className="md:col-span-2">
          <p className="mb-2 font-display text-[10px] uppercase tracking-[0.14em] text-muted">
            Tutorial metadata <span className="normal-case text-muted/60">(optional — enables the how-to header)</span>
          </p>
          <div className="grid gap-4 rounded-md border border-line bg-surface p-4 md:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="art-difficulty">Difficulty</label>
              <select
                id="art-difficulty"
                className={inputCls}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="art-time">Time to complete (minutes)</label>
              <input
                id="art-time"
                type="number"
                min={1}
                className={inputCls}
                value={timeMinutes}
                onChange={(e) => setTimeMinutes(e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="art-prereq">Prerequisites — one per line</label>
              <textarea
                id="art-prereq"
                className={`${inputCls} resize-y font-display text-[13px]`}
                rows={3}
                value={prerequisites}
                onChange={(e) => setPrerequisites(e.target.value)}
                placeholder={"A Windows PC with admin rights\nAn OpenAI API key"}
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="art-learn">What you'll learn — one per line</label>
              <textarea
                id="art-learn"
                className={`${inputCls} resize-y font-display text-[13px]`}
                rows={3}
                value={learn}
                onChange={(e) => setLearn(e.target.value)}
                placeholder={"Automate Windows updates\nSchedule scripts with Task Scheduler"}
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className={labelCls}>Cover image</label>
          <div className="flex flex-wrap items-center gap-4">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={onFile}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-md border border-line bg-surface px-4 py-2 font-display text-[12px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-fg"
            >
              {preview ? "Replace image" : "Upload image"}
            </button>
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Cover preview" className="h-20 w-32 rounded-md border border-line object-cover" />
            )}
            {!preview && (
              <span className="font-display text-[11px] text-muted">
                Optional — leave empty for an auto-generated cover.
              </span>
            )}
          </div>
        </div>

        <div>
          <label className={labelCls} htmlFor="art-alt">Image alt text</label>
          <input
            id="art-alt"
            className={inputCls}
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            placeholder="Describe the image"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-md border border-line bg-surface px-4 py-3">
          <input
            type="checkbox"
            checked={publish}
            onChange={(e) => setPublish(e.target.checked)}
            className="h-4 w-4 accent-[var(--signal)]"
          />
          <span>
            <span className="block text-sm font-medium text-fg">Publish immediately</span>
            <span className="block font-display text-[11px] text-muted">
              Published articles appear live with a BREAKING tag on top.
            </span>
          </span>
        </label>
      </div>

      {error && (
        <p className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 font-display text-[12px] text-danger">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-signal px-5 py-2.5 font-display text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : publish ? "Publish article" : "Save draft"}
        </button>
        <span className="font-display text-[11px] text-muted">
          {publish ? "Status will be set to BREAKING." : "Drafts stay hidden from the site."}
        </span>
      </div>
    </form>
  );
}
