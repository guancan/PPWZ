import type { Metadata } from "next";
import { getAllPrompts, getPromptBySlug } from "@/lib/db";
import { getDictionary, getLocalizedText, type Locale } from "@/lib/i18n";

export function getPromptStaticParams() {
  return getAllPrompts().map((prompt) => ({ slug: prompt.slug }));
}

export function buildPromptMetadata(locale: Locale, slug: string): Metadata {
  const prompt = getPromptBySlug(slug);
  const dict = getDictionary(locale);
  if (!prompt) {
    return { title: dict.prompt.notFoundTitle };
  }

  const title = getLocalizedText(prompt.title, locale, dict.card.untitled);
  const description =
    getLocalizedText(prompt.description, locale, "") ||
    prompt.content.slice(0, 160).trim();
  const ogImage = prompt.preview_images?.[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: ogImage ? [ogImage] : [],
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}
