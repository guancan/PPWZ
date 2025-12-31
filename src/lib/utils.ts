import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function extractPromptParameters(content: string): Record<string, string> {
    const params: Record<string, string> = {};
    if (!content) {
        return params;
    }

    const segments = content.split("--").slice(1);
    for (const segment of segments) {
        const trimmed = segment.trim();
        if (!trimmed) {
            continue;
        }
        const parts = trimmed.split(/\s+/);
        const key = parts.shift();
        if (!key) {
            continue;
        }
        const value = parts.join(" ").trim();
        params[key] = value || "true";
    }

    return params;
}
