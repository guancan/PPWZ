export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "zh";
}

export function withLocalePath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale !== "zh") {
    return normalized;
  }
  if (normalized === "/") {
    return "/zh";
  }
  if (normalized === "/zh" || normalized.startsWith("/zh/")) {
    return normalized;
  }
  return `/zh${normalized}`;
}

type Dictionary = {
  common: {
    home: string;
    exploreAll: string;
    browseAll: string;
    category: string;
    model: string;
    copiesSuffix: string;
  };
  home: {
    headline: string;
    subhead: string;
    stats: {
      curated: string;
      creators: string;
      weekly: string;
    };
    categoriesLabel: string;
    categoriesTitle: string;
    categoryDescription: string;
    categoryCta: string;
    trendingLabel: string;
    trendingCta: string;
    latestLabel: string;
    latestTitle: string;
    quickFilters: string[];
    trendingTopics: Array<{
      slug: string;
      title: string;
      description: string;
    }>;
  };
  search: {
    placeholder: string;
    button: string;
  };
  card: {
    untitled: string;
    noDescription: string;
    viewCta: string;
  };
  code: {
    title: string;
    copy: string;
    copied: string;
  };
  prompt: {
    descriptionFallback: string;
    breadcrumb: string;
    curatedBy: string;
    byLabel: string;
    publishedLabel: string;
    copiesLabel: string;
    parametersLabel: string;
    parametersTitle: string;
    parametersEmpty: string;
    previewLabel: string;
    previewEmpty: string;
    metadataLabel: string;
    metadataAuthor: string;
    metadataSlug: string;
    metadataStatus: string;
    relatedLabel: string;
    relatedTitle: string;
    notFoundTitle: string;
  };
};

const dictionaries: Record<Locale, Dictionary> = {
  en: {
    common: {
      home: "Home",
      exploreAll: "Explore all",
      browseAll: "Browse all",
      category: "Category",
      model: "Model",
      copiesSuffix: "copies",
    },
    home: {
      headline:
        "Search the prompt vault built for cinematic, brand-ready storytelling.",
      subhead:
        "A curated engine of AIGC prompts, tuned for creators who need precision, speed, and shareable results across every model.",
      stats: {
        curated: "Curated prompts",
        creators: "Active creators",
        weekly: "Weekly drops",
      },
      categoriesLabel: "Categories",
      categoriesTitle: "Navigate by creative intent.",
      categoryDescription:
        "Curated prompt collections designed for fast, confident ideation.",
      categoryCta: "View prompts ->",
      trendingLabel: "Trending Topics",
      trendingCta: "Open topic ->",
      latestLabel: "Latest Drops",
      latestTitle: "Fresh prompts, ready to remix.",
      quickFilters: [
        "Midjourney",
        "Stable Diffusion",
        "DALL-E",
        "Video",
        "Photography",
        "Social Media",
      ],
      trendingTopics: [
        {
          slug: "ghibli-style",
          title: "Ghibli Dreams",
          description: "Soft light, handmade textures, wistful skies.",
        },
        {
          slug: "cyberpunk-city",
          title: "Neon Citycore",
          description: "Rain, glass, and high-contrast atmospheres.",
        },
        {
          slug: "logo-design",
          title: "Logo Design Kit",
          description: "Minimal marks with studio-grade polish.",
        },
      ],
    },
    search: {
      placeholder:
        "Search prompts... (e.g., 'cyberpunk portrait', 'logo design')",
      button: "Search",
    },
    card: {
      untitled: "Untitled Prompt",
      noDescription: "No description available yet.",
      viewCta: "View ->",
    },
    code: {
      title: "Prompt",
      copy: "Copy",
      copied: "Copied",
    },
    prompt: {
      descriptionFallback:
        "Precision-crafted prompt ready for remixing and iteration.",
      breadcrumb: "Prompt",
      curatedBy: "PPWZ Curated",
      byLabel: "By:",
      publishedLabel: "Published",
      copiesLabel: "Copies",
      parametersLabel: "Parameters",
      parametersTitle: "Structured settings.",
      parametersEmpty:
        "No parameters parsed yet. We will surface them as structured controls once connected to the model parser.",
      previewLabel: "Preview",
      previewEmpty: "Preview images incoming.",
      metadataLabel: "Metadata",
      metadataAuthor: "Author",
      metadataSlug: "Slug",
      metadataStatus: "Status",
      relatedLabel: "Related",
      relatedTitle: "Keep exploring similar prompts.",
      notFoundTitle: "Prompt not found",
    },
  },
  zh: {
    common: {
      home: "首页",
      exploreAll: "查看全部",
      browseAll: "浏览全部",
      category: "分类",
      model: "模型",
      copiesSuffix: "次复制",
    },
    home: {
      headline: "搜索为电影感、品牌级叙事打造的提示词库。",
      subhead:
        "精选 AIGC 提示词引擎，面向需要精准、快速、易分享结果的创作者与团队。",
      stats: {
        curated: "精选提示词",
        creators: "活跃创作者",
        weekly: "每周上新",
      },
      categoriesLabel: "分类",
      categoriesTitle: "按创作意图快速导航。",
      categoryDescription: "为高效灵感生成整理的提示词合集。",
      categoryCta: "查看提示词 ->",
      trendingLabel: "热门专题",
      trendingCta: "打开专题 ->",
      latestLabel: "最新上线",
      latestTitle: "新鲜提示词，随时二次创作。",
      quickFilters: [
        "Midjourney",
        "Stable Diffusion",
        "DALL-E",
        "视频",
        "摄影",
        "社媒",
      ],
      trendingTopics: [
        {
          slug: "ghibli-style",
          title: "吉卜力幻想",
          description: "柔光、手工质感、怀旧天空。",
        },
        {
          slug: "cyberpunk-city",
          title: "霓虹城市场景",
          description: "雨幕、玻璃与强对比氛围。",
        },
        {
          slug: "logo-design",
          title: "Logo 设计套件",
          description: "极简标记与工作室级质感。",
        },
      ],
    },
    search: {
      placeholder: "搜索提示词...（例如 '赛博朋克人像'、'logo 设计'）",
      button: "搜索",
    },
    card: {
      untitled: "未命名提示词",
      noDescription: "暂无描述。",
      viewCta: "查看 ->",
    },
    code: {
      title: "提示词",
      copy: "复制",
      copied: "已复制",
    },
    prompt: {
      descriptionFallback: "适合复用与迭代的精炼提示词。",
      breadcrumb: "提示词",
      curatedBy: "PPWZ 精选",
      byLabel: "作者:",
      publishedLabel: "发布时间",
      copiesLabel: "复制次数",
      parametersLabel: "参数",
      parametersTitle: "结构化设置。",
      parametersEmpty: "暂无解析参数，接入解析器后会展示结构化控制项。",
      previewLabel: "预览",
      previewEmpty: "预览图即将上线。",
      metadataLabel: "信息",
      metadataAuthor: "作者",
      metadataSlug: "Slug",
      metadataStatus: "状态",
      relatedLabel: "相关推荐",
      relatedTitle: "继续探索相似提示词。",
      notFoundTitle: "未找到提示词",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

type LocalizedText = {
  en?: string;
  zh?: string;
};

export function getLocalizedText(
  value: LocalizedText | undefined,
  locale: Locale,
  fallback = ""
): string {
  if (!value) {
    return fallback;
  }
  if (locale === "zh") {
    return value.zh || value.en || fallback;
  }
  return value.en || value.zh || fallback;
}
