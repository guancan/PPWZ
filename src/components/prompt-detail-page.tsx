import Link from "next/link";
import { notFound } from "next/navigation";
import { PromptCard } from "@/components/prompt-card";
import { PromptCopyCta } from "@/components/prompt-copy-cta";
import { PromptCodeBlock } from "@/components/prompt-code-block";
import {
  getAuthorById,
  getCategories,
  getLatestPrompts,
  getPromptBySlug,
  getPromptsByCategory,
} from "@/lib/db";
import {
  getDictionary,
  getLocalizedText,
  type Locale,
  withLocalePath,
} from "@/lib/i18n";
import { extractPromptParameters } from "@/lib/utils";

type PromptDetailPageProps = {
  locale: Locale;
  slug: string;
};

export function PromptDetailPage({ locale, slug }: PromptDetailPageProps) {
  const dict = getDictionary(locale);
  const prompt = getPromptBySlug(slug);
  if (!prompt) {
    notFound();
  }

  const categories = getCategories();
  const category = categories.find((item) => item.id === prompt.category_id);
  const author = prompt.author_id ? getAuthorById(prompt.author_id) : undefined;
  const title = getLocalizedText(prompt.title, locale, dict.card.untitled);
  const description =
    getLocalizedText(prompt.description, locale, "") ||
    dict.prompt.descriptionFallback;
  const categoryLabel = category
    ? getLocalizedText(category.name, locale, category.slug)
    : dict.prompt.breadcrumb;

  const publishedAt = prompt.published_at ?? prompt.created_at;
  const publishedLabel = new Intl.DateTimeFormat(
    locale === "zh" ? "zh-CN" : "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(new Date(publishedAt));
  const publishedDisplay =
    locale === "en" ? publishedLabel.toUpperCase() : publishedLabel;

  const tagList = Array.isArray(prompt.tags)
    ? prompt.tags.filter((tag) => typeof tag === "string" && tag.trim())
    : [];

  const fallbackCopyCount = (() => {
    const publishedTime = new Date(publishedAt).getTime();
    const diffMs = Math.max(0, Date.now() - publishedTime);
    const days = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    const seed = Array.from(prompt.slug).reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );
    const multiplier = 3 + (seed % 4);
    return days * multiplier;
  })();

  const copyCount =
    typeof prompt.copy_count === "number" && prompt.copy_count > 0
      ? prompt.copy_count
      : fallbackCopyCount;

  let related = category
    ? getPromptsByCategory(category.slug, 6).filter(
        (item) => item.slug !== prompt.slug
      )
    : [];
  if (related.length === 0) {
    related = getLatestPrompts(6).filter((item) => item.slug !== prompt.slug);
  }
  related = related.slice(0, 3);

  const storedParameters = prompt.parameters ?? {};
  const hasStoredParameters =
    typeof storedParameters === "object" &&
    Object.keys(storedParameters).length > 0;
  const mergedParameters = hasStoredParameters
    ? storedParameters
    : extractPromptParameters(prompt.content);
  const parameters = Object.entries(mergedParameters);

  return (
    <div className="min-h-screen text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <nav>
            <Link
              href={withLocalePath(locale, "/")}
              className="transition hover:text-primary"
            >
              {dict.common.home}
            </Link>
            <span className="mx-2 text-white/30">/</span>
            {category ? (
              <Link
                href={withLocalePath(locale, `/${category.slug}`)}
                className="hover:text-primary"
              >
                {categoryLabel}
              </Link>
            ) : (
              <span>{categoryLabel}</span>
            )}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href={withLocalePath("en", `/prompt/${prompt.slug}`)}
              className={`transition ${
                locale === "en" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              EN
            </Link>
            <span className="text-white/20">/</span>
            <Link
              href={withLocalePath("zh", `/prompt/${prompt.slug}`)}
              className={`transition ${
                locale === "zh" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              中文
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            {title}
          </h1>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="min-w-0 space-y-8">
            <div className="glass-panel rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-primary/70">
                {dict.prompt.previewLabel}
              </p>
              <div className="mt-4 grid gap-3">
                {prompt.preview_images?.length ? (
                  <>
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={prompt.preview_images[0]}
                        alt={`${title} preview 1`}
                        loading="lazy"
                        className="h-72 w-full object-cover"
                      />
                    </div>
                    {prompt.preview_images.length > 1 && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {prompt.preview_images
                          .slice(1, 3)
                          .map((image, index) => (
                            <div
                              key={`${prompt.id}-${index + 1}`}
                              className="overflow-hidden rounded-xl border border-white/10 bg-black/40"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={image}
                                alt={`${title} preview ${index + 2}`}
                                loading="lazy"
                                className="h-44 w-full object-cover"
                              />
                            </div>
                          ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex h-60 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-sm text-muted-foreground">
                    {dict.prompt.previewEmpty}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <span className="rounded-full border border-white/10 bg-black/40 px-4 py-2">
                {dict.common.model}: {prompt.model_type.replace(/-/g, " ")}
              </span>
              {category && (
                <span className="rounded-full border border-white/10 bg-black/40 px-4 py-2">
                  {dict.common.category}: {categoryLabel}
                </span>
              )}
              {tagList.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-black/40 px-4 py-2"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div>
              <p className="mt-4 text-lg text-muted-foreground">
                {description}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="text-foreground">
                  {dict.prompt.byLabel}{" "}
                  {author?.homepage_url ? (
                    <a
                      href={author.homepage_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-foreground hover:text-primary"
                    >
                      {author.name}
                    </a>
                  ) : (
                    <span className="text-foreground">
                      {author?.name ?? dict.prompt.curatedBy}
                    </span>
                  )}
                </span>
                <span className="text-white/30">·</span>
                <span>{publishedDisplay}</span>
                <span className="text-white/30">·</span>
                <span>
                  {copyCount} {dict.prompt.copiesLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="min-w-0 space-y-6">
            <PromptCodeBlock
              content={prompt.content}
              title={dict.code.title}
              copyLabel={dict.code.copy}
              copiedLabel={dict.code.copied}
              showCopyButton={false}
            />

            {parameters.length > 0 && (
              <div className="glass-panel rounded-2xl p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-primary/70">
                  {dict.prompt.parametersLabel}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-foreground">
                  {dict.prompt.parametersTitle}
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {parameters.map(([key, value]) => (
                    <div
                      key={key}
                      className="glass-panel rounded-xl px-4 py-3"
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {key}
                      </p>
                      <p className="mt-2 text-sm text-foreground">
                        {typeof value === "string"
                          ? value
                          : JSON.stringify(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <PromptCopyCta
              content={prompt.content}
              label={dict.code.copy}
              copiedLabel={dict.code.copied}
            />
          </div>
        </div>

        <section className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary/70">
                {dict.prompt.relatedLabel}
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-foreground">
                {dict.prompt.relatedTitle}
              </h2>
            </div>
            <Link
              href={withLocalePath(locale, "/search")}
              className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80 transition hover:text-primary"
            >
              {dict.common.browseAll}
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <PromptCard
                key={item.id}
                prompt={item}
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
    </div>
  );
}
