
# PPWZ.AI 提示词聚合站 - 产品需求文档 (PRD) v2.1

## 1. 项目概况与核心策略

* **产品定位：** 面向全球创作者的高质量 AIGC 提示词搜索引擎与聚合库。
* **数据规模：** 初始阶段约 8,000 - 20,000 条提示词（属于轻量级数据，技术方案优先考虑低成本与高并发）。
* **核心目标：**
    1. **极致 SEO：** 通过服务端渲染 HTML 确保 Google 100% 收录详情页和聚合页。
    2. **社交传播：** 确保链接分享到 Twitter/微信/Discord 时能抓取到完整的预览卡片 (OG Meta)。
    3. **极速体验：** 利用 CDN 缓存机制，实现详情页“秒开”。

---

## 2. 技术架构决策 (Technical Stack)

* **框架：** **Next.js (App Router)**
* **数据库 & Auth：** **Supabase** (PostgreSQL)
* **部署平台：** Vercel (Edge Network)
* **渲染策略 (混合模式)：**
    * **ISR (增量静态再生):** 核心页面（首页、分类聚合、专题、详情），确保极速加载与 SEO。配置 `revalidate` 实现自动更新。
    * **CSR (客户端渲染):** 动态搜索页 (`/search`)。
    * **React Server Components:** 充分利用 App Router 的 RSC 能力，减少客户端 JS。

* **多语言方案:**
    - 默认英文，路由(`ppwz.ai/...`)
    - 子路径路由 (`ppwz.ai/zh/...`)

---

## 3. 站点地图与 URL 结构 (Site Map)

采用 **“金字塔型”** 路由架构，平衡 SEO 覆盖与运营灵活性。

| 层级 | 页面类型 | 路由规则 (Pattern) | 渲染模式 | SEO 策略 |
| --- | --- | --- | --- | --- |
| **L1** | **首页** | `/`, `/zh` | **ISR/SSG** | 核心入口，高频更新。 |
| **L2** | **固定分类** (Category Hub) | `/[category]` <br> *例: `/midjourney`* | **ISR/SSG** | **SEO 主骨架**。承载大类通用流量。 |
| **L2.5** | **精选专题** (Curated Topic) | `/topic/[slug]` <br> *例: `/topic/logo-design`* | **ISR/SSG** | **高价值 SEO 落地页**。<br>后台配置规则(如 "Tag:Logo + Model:MJ")，系统生成静态页。针对性覆盖头部/中长尾搜索词。 |
| **L3** | **详情页** (Detail) | `/prompt/[slug]` | **ISR/SSG** | **SEO 长尾流量**。配置完整 OG Meta。 |
| **L4** | **动态筛选** (Dynamic Filter) | `/[category]?tag=...` | **CSR/SSR** | **不直接收录** (Canonical -> Hub 或 Topic)。<br>满足用户自由组合筛选需求，防止产生 SEO 垃圾页。 |
| **Aux** | **搜索页** | `/search?q=...` | **CSR** | **Noindex**。防止爬虫陷阱。 |

### 关键策略说明

#### 1. 分类聚合策略 (Hubs vs. Topics vs. Filters)
*   **Layer 1 (Hubs):** 物理存在的顶级分类页面，作为网站骨架。
*   **Layer 2 (Topics):** **运营驱动的 SEO 武器**。
    *   通过后台 "Topic Manager" 创建，将特定的筛选组合（如 `Category=Gaming` + `Style=Pixel Art`）“固化”为永久静态 URL (`/topic/pixel-art-games`)。
    *   每个 Topic 拥有独立的 H1、Title 和 SEO 描述。
*   **Layer 3 (Filters):** 自由的参数组合，仅作为查询功能，不作为 SEO 入口，避免稀释权重。

#### 2. 深层分页策略 (Pure HTML Pagination)
*   **路由:** `/[category]/[page]` (如 `/coding/2`，Next.js App Router: `app/[category]/[page]/page.tsx`)
*   **目的:** 解决爬虫无法执行“无限滚动”或 JS 点击的问题，确保数据库深处的冷门内容能被 100% 抓取。
*   **实现:** 在“无限滚动”列表底部保留标准的纯 HTML 分页链接 (`<a href="/coding/2">2</a>`)，供爬虫爬行；用户端可视觉隐藏或保留作为辅助导航。

---

## 4. 详细功能需求 (Front-end)

### 4.1. 首页 (Home Page) - 流量入口 (NEW)

* **Hero 区域:**
    * **视觉:** 带有低消耗的 **Web GL/CSS 粒子效果** 或 **动态霓虹几何体**，营造科技感与高级感。避免因为特效导致 Mobile 端卡顿 (Perf < 100ms TBT)。
    * **功能:** 核心搜索框 (Search Bar) 居中，引导用户直接输入。
* **导航入口:**
    * **主分类卡片:** 视觉显著的入口 (Midjourney, Stable Diffusion, DALL-E, Video)。
    * **热门专题 (Trending Topics):** 展示高点击率的 SEO 专题链接 (e.g., "Ghibli Style", "Cyberpunk", "Logo Design")。
* **交互工具:**
    * **基础过滤器/排序:** 位于列表上方，支持按 "最新/最热" 排序，支持 "模型/场景" 快速筛选。

### 4.2. 提示词详情页 (Detail Page) - 核心

* **渲染逻辑 (SSG/ISR):**
    * 优先构建静态 HTML，结合 ISR 实现增量更新。
    * **首次访问/过期后访问：** 服务端查 Supabase -> 生成 HTML -> 返回并存入 CDN。
    * **后续访问：** 直接命中 CDN 缓存。

* **元数据 (Metadata):**
    * 服务端生成完整 `<title>`, `<meta description>`, `<meta property="og:image">`。
    * `og:image` 动态生成或取首图。

* **页面内容:**
    * **H1:** SEO 优化的标题。
    * **Prompt Code Block:** 交互式代码块（Copy 按钮）。
    * **参数解析:** 可视化展示 Midjourney/Stable Diffusion 参数。
    * **关联推荐:** 静态生成的“相关推荐”链接，增强站内权重传递。

### 4.3. 动态搜索页 (Search Page)

* **渲染逻辑 (SSR/CSR):**
    * URL 参数驱动：`/search?q=keyword`。
    * 客户端 Hydration 后请求搜索 API。

* **SEO 设置:**
    * `<meta name="robots" content="noindex, follow" />`。

### 4.4. 分类/聚合页 (Hub Page)

* **分页机制 (Hybrid):**
    * **用户端:** 支持“加载更多”或“无限滚动”体验。
    * **爬虫端:** 保留底部分页器 HTML 结构 (`href="/category/2"`)，确保爬虫通路畅通。
* **内容策略:**
    * 顶部可配置 SEO 文案 (Title + Description)。
    * 支持 Topic 快捷入口导航。

---

## 5. UI/UX 设计规范 (Design Aesthetics) (NEW)

* **视觉风格:** **Premium & Tech-noir (高级感/科技黑色电影)**
* **品牌色:**
    * **主色:** **墨绿色 (Deep Forest Green)**。用于背景基调或深层容器，营造沉稳氛围。
    * **强调色:** 荧光绿/青色 (Neon Green/Cyan) 的微光，用于按钮、高亮状态。
* **质感 (Texture):**
    * **光晕 (Glow):** 元素边缘带有低调的呼吸光晕，而非生硬的投影。
    * **噪点 (Noise):** 背景叠加轻微的胶片噪点 (Film Grain) 纹理，增加“实物感”和“纸质感”，避免纯数字化的冰冷。
* **排版 (Typography):**
    * **标题/装饰字:** 选用带有一丝 **"艺术/手写 (Artistic/Script)"** 气息的衬线或手写体 (如 *Playfair Display* 或 *Caveat* 的变体) 作为 H1/H2，打破科技产品的僵硬感。
    * **正文/代码:** 保持极致易读的无衬线字体 (Inter/Geist Mono)。

---

## 6. 后台管理与数据供给 (Admin Dashboard)

面向内部运营，部署在 `/admin` (需鉴权)。

### 6.1. 批量导入 (Batch Import)

* **目标:** 快速填充 2W 条数据。
* **功能流程:**
    1. **上传:** 拖拽 CSV / JSON 文件。
    2. **映射 (Mapping):** 手动指定 JSON 字段对应数据库字段 (Title, Content, Model, Tags)。
    3. **清洗 (Cleaning):**
        * 前台表格预览数据。
        * **Slug 自动生成:** 此时前端根据 Title 自动生成 Slug (如 `My Title` -> `my-title`)，并检测冲突。
        * **批量打标:** 勾选 50 条 -> “批量添加标签：Stable Diffusion”。
    4. **入库:** 调用 Supabase 批量插入接口。

### 6.2. 专题管理 (Curated Topics)

* **功能:** 将“高频搜索词”固化为“专题页”。
* **操作:** 新建专题 -> 输入 URL Slug (`logo-design`) -> 输入 SEO 标题/描述 -> **关联筛选规则** (如 Tag=Logo & Model=MJ)。
* **价值:** 替代动态搜索页，承接 SEO 流量。

---

## 7. 数据结构 (Database Schema)

基于 **Supabase (PostgreSQL)**，针对 2W+ 数据量设计。核心原则：
1.  **运营友好:** 增加状态流转与定时发布字段。
2.  **国际化 (I18n):** 使用 `JSONB` 存储多语言文本，保持 Schema 扁平。
3.  **分类严谨:** 区分“结构化目录(Category)”与“灵活标签(Tags)”。
4.  **关系设计:** Prompt 与 Category 是 **一对多**（单一归属，通过外键 `category_id`），与 Tags 是 **多对多**（灵活筛选，通过关联表 `prompt_tags`）。

```sql
-- 1. 作者表 (Authors)
-- 存储提示词作者信息，支持未来的作者聚合页
create table authors (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,                -- URL 友好标识 (e.g. 'john-doe')
  name text not null,                       -- 作者名称
  avatar_url text,                          -- 头像 URL
  bio text,                                 -- 简介
  homepage_url text,                        -- 个人主页/Twitter/作品集链接
  created_at timestamptz default now()
);

-- 2. 核心提示词表 (Prompts)
create table prompts (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,                -- URL 唯一标识 (e.g. 'cyberpunk-city')
  
  -- 多语言内容 (I18n JSONB: {"en": "...", "zh": "..."})
  title jsonb not null,                     
  description jsonb,                        -- SEO Meta Description
  instruction_text jsonb,                   -- 补充说明/教程文本

  -- 核心数据
  content text not null,                    -- 原始复刻的英文提示词 (通常不翻译)
  model_type text not null,                 -- enum: 'midjourney', 'stable-diffusion', 'dall-e'
  parameters jsonb,                         -- 解析后的参数: {"ar": "16:9", "v": "6.0"}
  preview_images text[],                    -- 图片 CDN URL 数组
  
  -- 运营与状态
  status text default 'draft',              -- enum: 'draft', 'published', 'archived'
  published_at timestamptz,                 -- 预定发布时间/上架时间 (排序依据)
  reviewer_id uuid,                         -- 审核人 ID
  copy_count int default 0,                 
  
  -- 关联
  category_id uuid references categories(id), -- 必须从属于一个主分类
  author_id uuid references authors(id),    -- 作者 (可选，支持匿名或平台原创)
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. 结构化分类表 (Categories) - 对应 L2 目录 (Hubs)
-- 数据源: 此表为 Hub 页面 (/[category]) 提供数据
create table categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name jsonb not null,                      -- {"en": "Midjourney", "zh": "Midjourney"}
  seo_config jsonb,                         -- {"en": {"title": "...", "description": "...", "h1": "..."}, "zh": {...}}
  sort_order int default 0
);

-- 4. 灵活标签表 (Tags) - 对应筛选维度 (Filters)
-- 用于多维筛选，如 风格、元素、用途、运营活动
create table tags (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name jsonb not null,                      -- {"en": "Retro", "zh": "复古"}
  type text not null,                       -- enum: 'style', 'element', 'scene', 'campaign'
  seo_config jsonb,                         -- (可选) 如果未来需要 Tag 独立落地页 (如 /style/retro)
  icon_url text                             -- 标签小图标 (可选)
);

-- 关联: Prompt <-> Tags
create table prompt_tags (
  prompt_id uuid references prompts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (prompt_id, tag_id)
);

-- 5. 专题表 (Topics) - 对应 L2.5 落地页
-- 数据源: 此表为 Topic 页面 (/topic/[slug]) 提供数据
create table topics (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,                -- e.g. 'logo-design-ideas'
  title jsonb not null,                     -- 专题页 H1 (多语言)
  description jsonb,                        -- 专题页 SEO 导语
  seo_config jsonb,                         -- 更精细的 SEO 控制: {"en": {"meta_title": "...", "meta_desc": "..."}}
  cover_image text,                         
  filter_rules jsonb,                       -- 自动聚合规则: {"tag_slugs": ["logo"], "model": "midjourney"}
  manual_prompt_ids uuid[]                  -- (可选) 手动人工置顶的 Prompt ID
);

-- 6. 全站配置表 (Site Settings)
-- 数据源: 首页 SEO、默认 OG 图、全局配置
create table site_settings (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,                 -- e.g. 'homepage_seo', 'default_og_image'
  value jsonb not null,                     -- {"en": {"title": "...", "description": "..."}}
  updated_at timestamptz default now()
);
-- 示例数据:
-- key='homepage_seo', value={"en": {"title": "PPWZ.AI - Best AI Prompts", "description": "..."}}
-- key='default_og_image', value={"url": "https://cdn.../default-og.png"}
```

**SEO 字段使用说明：**
- **首页：** 从 `site_settings` 表读取 `key='homepage_seo'` 的配置
- **详情页：** 使用 `prompts.title` (jsonb) 作为 H1 和 Meta Title，`prompts.description` (jsonb) 作为 Meta Description，`prompts.preview_images[0]` 作为 OG Image
- **Hub/Topic 页：** 从各自表的 `seo_config` 字段读取

---

## 8. 执行 Roadmap (MVP)

1. **Day 1-2: 基础设施**
    * 搭建 **Next.js (App Router) + Supabase** 脚手架。
    * 配置 `/admin` 路由和简单的登录鉴权。
    * **开发“批量导入”功能** (这是数据团队开始工作的依赖)。

2. **Day 3-5: 核心页面 (SSG/ISR)**
    * 开发详情页 `app/prompt/[slug]/page.tsx`。
    * 开发聚合列表页 `app/[category]/[page]/page.tsx` (含分页逻辑)。
    * 开发首页 (动态 Hero + 入口) 及专题页。

3. **Day 6: 搜索与 SEO**
    * 开发搜索页 (CSR + Noindex)。
    * 生成 `sitemap.xml`。

4. **Day 7: 验收**
    * 视觉验收 (粒子特效性能、设计还原)。
    * SEO 验收 (GSC 测试)。

---

这份文档已更新首页功能需求及“墨绿+质感”设计规范。
