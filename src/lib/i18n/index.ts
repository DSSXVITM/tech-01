/**
 * i18n architecture.
 *
 * Launch policy (see project brief, Phase 4): English only at launch.
 * The routing + dictionary architecture supports up to 10 locales, but we
 * ship exactly one dictionary. New locales are added incrementally by
 * dropping a `messages/<locale>.ts` file and adding the locale to
 * `siteConfig.i18n.enabled` — no placeholder translations are generated.
 *
 * Locale strategy for the routes:
 *   - Launch: locale lives at the root ("/", "/ai/..."), i18n.enabled = ["en"].
 *   - Phase 4: prefix routes with the locale ("/de/ai/...") and keep the
 *     default locale at the root via <Link locale>. Nothing in the content
 *     layer changes — dictionaries are additive.
 */

export const locales = ["en", "de", "fr", "es", "it", "pt", "nl", "pl", "tr"] as const;
export type Locale = (typeof locales)[number];
export type { messages as enDictionary } from "./messages/en";

const dictionaries: Partial<Record<Locale, () => Promise<typeof import("./messages/en").messages>>> = {
  en: () => import("./messages/en").then((m) => m.messages),
};

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/**
 * Load the dictionary for a locale. Locales without a shipped translation
 * resolve to English (so navigation never breaks) but are not advertised
 * in the selector until enabled in `siteConfig.i18n.enabled`.
 */
export async function getDictionary(locale: Locale) {
  const load = dictionaries[locale] ?? dictionaries.en;
  const dict = await load!();
  return { dict, locale };
}
