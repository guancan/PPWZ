import Link from "next/link";
import type { Prompt } from "@/lib/db";
import { getLocalizedText, type Locale, withLocalePath } from "@/lib/i18n";

const formatModel = (value: string) =>
  value ? value.replace(/-/g, " ").toUpperCase() : "MODEL";

type PromptCardLabels = {
  untitled: string;
  noDescription: string;
  viewCta: string;
  copiesSuffix: string;
};

type PromptCardProps = {
  prompt: Prompt;
  locale: Locale;
  labels: PromptCardLabels;
};

export function PromptCard({ prompt, locale, labels }: PromptCardProps) {
  const title = getLocalizedText(prompt.title, locale, labels.untitled);
  const description = getLocalizedText(prompt.description, locale, "");
  const excerpt =
    (description || prompt.content.slice(0, 140).trim()) ||
    labels.noDescription;
  const image = prompt.preview_images?.[0];

  return (
    <Link
      href={withLocalePath(locale, `/prompt/${prompt.slug}`)}
      className="group"
    >
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-black/40 transition hover:border-primary/40">
        <div className="relative h-44 overflow-hidden">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-secondary to-muted" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <span className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/80">
            {formatModel(prompt.model_type)}
          </span>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{excerpt}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {prompt.copy_count} {labels.copiesSuffix}
            </span>
            <span className="text-primary/80">{labels.viewCta}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
