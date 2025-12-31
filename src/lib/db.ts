// Types matching our PRD database schema
export interface Author {
    id: string;
    slug: string;
    name: string;
    avatar_url?: string;
    homepage_url?: string;
}

export interface Category {
    id: string;
    slug: string;
    name: { en: string; zh?: string };
    seo_config?: {
        en?: { title?: string; description?: string; h1?: string };
        zh?: { title?: string; description?: string; h1?: string };
    };
    sort_order: number;
}

export interface Tag {
    id: string;
    slug: string;
    name: { en: string; zh?: string };
    type: "style" | "element" | "scene" | "campaign";
}

export interface Prompt {
    id: string;
    slug: string;
    title: { en: string; zh?: string };
    description?: { en?: string; zh?: string };
    content: string;
    model_type: string;
    parameters?: Record<string, unknown>;
    preview_images: string[];
    tags?: string[];
    status: "draft" | "published" | "archived";
    published_at?: string;
    copy_count: number;
    category_id?: string;
    author_id?: string;
    created_at: string;
}

// Transformed mock data from pixshop_all_prompts.json
import rawData from "@/data/mock-prompts.json";

const mockCategories: Category[] = [
    { id: "cat-1", slug: "video", name: { en: "Video", zh: "视频" }, sort_order: 1 },
    { id: "cat-2", slug: "photography", name: { en: "Photography", zh: "摄像" }, sort_order: 2 },
    { id: "cat-3", slug: "social-media", name: { en: "Social Media", zh: "社媒" }, sort_order: 3 },
    { id: "cat-4", slug: "design", name: { en: "Design", zh: "设计" }, sort_order: 4 },
    { id: "cat-5", slug: "writing", name: { en: "Writing", zh: "写作" }, sort_order: 5 },
];

const mockAuthors: Author[] = [
    { id: "author-1", slug: "pixshop", name: "PixShop Team", homepage_url: "https://pixshop.app" },
    { id: "author-2", slug: "community", name: "Community", homepage_url: undefined },
];

// Transform raw JSON to our schema
function transformPrompts(): Prompt[] {
    return (rawData as Array<Record<string, unknown>>).slice(0, 100).map((item, index) => {
        const categoryName = (item.category as { name?: string })?.name;
        const categoryMap: Record<string, string> = {
            "摄像": "cat-2",
            "社媒": "cat-3",
            "设计": "cat-4",
            "写作": "cat-5",
        };

        return {
            id: `prompt-${index + 1}`,
            slug: `prompt-${index + 1}-${(item.title as string || "untitled").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30)}`,
            title: { en: (item.title as string) || "Untitled Prompt" },
            description: { en: ((item.prompt as string) || "").slice(0, 160) },
            content: (item.prompt as string) || "",
            model_type: (item.model as string) || "unknown",
            parameters: {},
            preview_images: (item.preview_images as string[]) || [],
            tags: Array.isArray(item.tags) ? (item.tags as string[]) : [],
            status: "published" as const,
            published_at: new Date().toISOString(),
            copy_count: Math.floor(Math.random() * 500),
            category_id: categoryName ? categoryMap[categoryName] || "cat-1" : "cat-1",
            author_id: "author-1",
            created_at: new Date().toISOString(),
        };
    });
}

let cachedPrompts: Prompt[] | null = null;

function getPrompts(): Prompt[] {
    if (!cachedPrompts) {
        cachedPrompts = transformPrompts();
    }
    return cachedPrompts;
}

// Query helpers
export function getAllPrompts(): Prompt[] {
    return getPrompts();
}

export function getCategories(): Category[] {
    return mockCategories;
}

export function getLatestPrompts(limit = 12): Prompt[] {
    return getPrompts()
        .filter((p) => p.status === "published")
        .slice(0, limit);
}

export function getPromptsByCategory(categorySlug: string, limit = 20): Prompt[] {
    const category = mockCategories.find((c) => c.slug === categorySlug);
    if (!category) return [];
    return getPrompts()
        .filter((p) => p.category_id === category.id && p.status === "published")
        .slice(0, limit);
}

export function getPromptBySlug(slug: string): Prompt | undefined {
    return getPrompts().find((p) => p.slug === slug);
}

export function getAuthorById(id: string): Author | undefined {
    return mockAuthors.find((a) => a.id === id);
}
