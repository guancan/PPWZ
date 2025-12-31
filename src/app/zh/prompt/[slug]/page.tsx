import type { Metadata } from "next";
import { PromptDetailPage } from "@/components/prompt-detail-page";
import { buildPromptMetadata, getPromptStaticParams } from "@/lib/prompt-page";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPromptStaticParams();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildPromptMetadata("zh", slug);
}

export default async function PromptDetailRouteZh({ params }: PageProps) {
  const { slug } = await params;
  return <PromptDetailPage locale="zh" slug={slug} />;
}
