import Link from "next/link";
import { HeroParticles } from "@/components/hero-particles";
import { PromptCard } from "@/components/prompt-card";
import { SearchBar } from "@/components/search-bar";
import { getCategories, getLatestPrompts } from "@/lib/db";
import {
  getDictionary,
  getLocalizedText,
  type Locale,
  withLocalePath,
} from "@/lib/i18n";

type HomePageProps = {
  locale: Locale;
};

export function HomePage({ locale }: HomePageProps) {
  const dict = getDictionary(locale);
  const categories = getCategories();
  const latestPrompts = getLatestPrompts(8);
  const searchPath = withLocalePath(locale, "/search");

  return (
    <div className="min-h-screen text-foreground">
      <section className="relative overflow-hidden border-b border-white/5">
        <HeroParticles />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-1 text-primary/80">
              PPWZ.AI
            </span>
            <div className="flex items-center gap-3">
              <Link
                href={withLocalePath("en", "/")}
                className={`transition ${
                  locale === "en" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                EN
              </Link>
              <span className="text-white/20">/</span>
              <Link
                href={withLocalePath("zh", "/")}
                className={`transition ${
                  locale === "zh" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                中文
              </Link>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-12">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                {dict.home.headline}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                {dict.home.subhead}
              </p>
              <div className="mt-10">
                <SearchBar
                  placeholder={dict.search.placeholder}
                  buttonLabel={dict.search.button}
                  searchPath={searchPath}
                />
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {dict.home.quickFilters.map((filter) => (
                  <span
                    key={filter}
                    className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"
                  >
                    {filter}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: dict.home.stats.curated, value: "8k+" },
                { label: dict.home.stats.creators, value: "240+" },
                { label: dict.home.stats.weekly, value: "150+" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass-panel rounded-2xl px-6 py-5"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary/70">
              {dict.home.categoriesLabel}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">
              {dict.home.categoriesTitle}
            </h2>
          </div>
          <Link
            href={searchPath}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80 transition hover:text-primary"
          >
            {dict.common.exploreAll}
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={withLocalePath(locale, `/${category.slug}`)}
              className="group"
            >
              <div className="glass-panel h-full rounded-2xl p-6 transition hover:border-primary/40">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {dict.common.category}
                </p>
                <h3 className="mt-4 text-2xl font-semibold text-foreground">
                  {getLocalizedText(category.name, locale, category.slug)}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {dict.home.categoryDescription}
                </p>
                <span className="mt-6 inline-flex text-xs uppercase tracking-[0.3em] text-primary/80">
                  {dict.home.categoryCta}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-6">
        <div className="glass-panel rounded-3xl px-6 py-10 sm:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-primary/70">
            {dict.home.trendingLabel}
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {dict.home.trendingTopics.map((topic) => (
              <Link
                key={topic.slug}
                href={withLocalePath(locale, `/topic/${topic.slug}`)}
                className="group"
              >
                <div className="rounded-2xl border border-white/5 bg-black/30 px-5 py-6 transition hover:border-primary/40">
                  <h3 className="text-xl font-semibold text-foreground">
                    {topic.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {topic.description}
                  </p>
                  <span className="mt-4 inline-flex text-xs uppercase tracking-[0.3em] text-primary/80">
                    {dict.home.trendingCta}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary/70">
              {dict.home.latestLabel}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">
              {dict.home.latestTitle}
            </h2>
          </div>
          <Link
            href={searchPath}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80 transition hover:text-primary"
          >
            {dict.common.browseAll}
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              locale={locale}
              labels={{
                ...dict.card,
                copiesSuffix: dict.common.copiesSuffix,
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
