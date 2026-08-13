import { NAV_CATEGORIES } from "@/lib/site";
import { getCategories, getSearchIndex } from "@/content";
import { Logo } from "./logo";
import { CategoryNav } from "./category-nav";
import { AccountMenu } from "./account-menu";
import { SearchDialog } from "./search-dialog";
import { SearchTrigger } from "./search-trigger";
import { LanguageSelector } from "./language-selector";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";

const UTILITY_LINKS = [
  { href: "/tutorials", label: "All Tutorials" },
  { href: "/trending", label: "Most Popular" },
  { href: "/news", label: "News" },
];

export function Header() {
  const searchIndex = getSearchIndex();
  const categoryColors = new Map(getCategories().map((c) => [c.slug, c.color]));
  const categoryItems = NAV_CATEGORIES.map((c) => ({
    href: `/${c.slug}`,
    label: c.label,
    color: categoryColors.get(c.slug),
  }));

  return (
    <header className="sticky top-0 z-40">
      {/* Main bar */}
      <div className="border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4">
          <Logo />

          <div className="hidden min-w-0 flex-1 md:flex">
            <CategoryNav items={categoryItems} utilities={UTILITY_LINKS} moreAfter="/internet" />
          </div>

          <div className="flex flex-none items-center gap-2">
            <SearchTrigger />

            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>

            <AccountMenu />

            <div className="xl:hidden">
              <MobileNav />
            </div>
          </div>
        </div>
      </div>

      {/* Floating search dialog (lazy, no-op when closed) */}
      <SearchDialog index={searchIndex} />
    </header>
  );
}
