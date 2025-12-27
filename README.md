# 个人博客（Next.js App Router + Git/Markdown + Supabase）

一个可长期维护、可上线的个人博客系统：

- **内容**：仅来自仓库内 `content/` 的 Markdown（Git 管理）。
- **互动**：Supabase（Postgres + Auth）提供评论/点赞/收藏；前端不直连 Supabase，统一走 Next Route Handlers（BFF）。
- **体验**：暖纸张编辑部风格（Tailwind v4 + shadcn/ui）+ 全站动效系统（Framer Motion）。
- **SEO**：完整输出 `metadata/OG/JSON-LD/sitemap/rss/robots`。

> 项目使用 pnpm；`pnpm build` 会额外生成离线搜索索引（`public/search-index.json`）。

---

## 1. 功能概览

### 1.1 信息架构（主要页面）

- `/`：首页（最新文章 + 入口）
- `/posts`：文章列表（筛选/排序/分页）
- `/posts/[slug]`：文章详情（Markdown + TOC + 代码高亮 + 复制 + 互动区）
- `/categories`、`/categories/[slug]`
- `/tags`、`/tags/[slug]`
- `/search`：离线索引搜索（noindex）
- `/about`
- `/me`：我的收藏/点赞/评论（需登录，noindex）
- `/login`、`/register`、`/forgot-password`、`/reset-password`（noindex）
- `/admin/comments`：评论审核后台（密钥 Gate，noindex）
- `/share/posts/[slug]`：分享工作台（海报生成，noindex）

### 1.2 互动能力（Supabase）

- **评论**：任何人可提交，默认 `pending`；前台只展示 `approved`
- **点赞**：匿名/登录均可（去重）
- **收藏**：必须登录（只读写自己的）

### 1.3 海报/分享

- **文章 OG 图**：`/og/posts/[slug]`（用于分享预览）
- **分享海报 API**：`/api/poster/posts/[slug]?...`（ImageResponse 服务端生成 PNG）
- **分享工作台**：`/share/posts/[slug]`（选择样式、预览、下载）

---

## 2. 技术栈

- Next.js 16（App Router, RSC）
- TypeScript
- Tailwind CSS v4 + shadcn/ui
- Framer Motion（全站动效 tokens）
- Markdown：`react-markdown` + `remark/rehype` + Shiki（高亮）
- Supabase：Auth + Postgres（通过 BFF/Route Handlers 访问）

---

## 3. 目录结构（关键）

```
app/                      # App Router 页面与路由（含 API Routes）
components/               # UI、编辑部组件、动效组件
content/
  posts/                  # 文章 Markdown（Git 内容源）
  pages/                  # 页面 Markdown（例如 about）
lib/
  content/                # 内容索引、frontmatter schema、读取工具
  markdown/               # Markdown 渲染管线（TOC/高亮/插件）
  poster/                 # 海报系统（tokens/styles/render/font）
  seo/                    # SEO helpers（metadata/og/jsonld）
public/
  fonts/                  # 海报/OG 用字体（ImageResponse 读取）
  sequence/               # 序列帧资源（/about 等）
  search-index.json       # 离线搜索索引（build 时生成）
scripts/
  build-search-index.mjs  # 构建离线搜索索引
```

---

## 4. 本地开发

### 4.1 安装与启动

```bash
pnpm install
pnpm dev
```

默认地址：`http://localhost:3000`

### 4.2 生产构建

```bash
pnpm build
pnpm start
```

说明：
- `pnpm build` 会执行 `next build`，并在最后生成离线搜索索引：`public/search-index.json`

---

## 5. 环境变量（必配）

将以下变量写入 `.env`（本地）或 Vercel Project Settings（生产）。

### 5.1 站点基础信息（SEO/OG/RSS 必需）

- `NEXT_PUBLIC_SITE_URL`：站点线上 URL（例如 `https://example.com`，用于 canonical/sitemap/rss）
- `NEXT_PUBLIC_AUTHOR_NAME`：作者名（用于默认站名、海报署名等）
- `NEXT_PUBLIC_SITE_NAME`（可选）：站点名；不填则默认 `${NEXT_PUBLIC_AUTHOR_NAME}的博客`

### 5.2 Supabase（Auth + DB）

> 本项目使用 Supabase **Publishable key（sb_publishable_...）** 作为客户端公开 key；服务端写入使用 secret key，严禁暴露到客户端。

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`：以 `sb_publishable_` 开头（可公开）
- `SUPABASE_SECRET_KEY`：以 `sb_secret_` 开头（仅服务端，切勿下发到浏览器）

### 5.3 管理后台 Gate（最低限度访问控制）

- `ADMIN_SECRET`：访问 `/admin/comments` 的密钥

---

## 6. 内容系统（Git/Markdown）

### 6.1 内容目录约定

```
content/
  posts/
    2025-12-26-csr.md
  pages/
    about.md
```

### 6.2 文章 frontmatter schema（必须）

> 日期格式：`YYYY-MM-DD`（例如 `2025-12-26`）

```yaml
---
title: "标题"
date: "2025-12-26"
slug: "csr"
excerpt: "摘要（推荐）"
category: "Tech"
tags:
  - nextjs
  - seo
cover: "/content-assets/posts/csr/cover.jpg" # 可选：支持本地仓库路径
# draft: true                                # 可选：true 则不发布
---
```

规则：
- `draft: true` 的文章不进入列表/搜索/sitemap/rss
- `slug` 用于路由 `/posts/[slug]`（建议小写 + `-`）

---

## 7. 本地图片与资源（全部走仓库路径）

### 7.1 推荐做法：将图片放在 `content/` 下并通过 `content-assets` 提供

本项目提供了静态资源路由：

- 路由：`/content-assets/[...path]`
- 真实文件根目录：`content/`
- 仅允许图片扩展名：`png/jpg/jpeg/webp/gif/svg/avif`

示例（把图片放进仓库）：

```
content/
  posts/
    csr/
      cover.jpg
```

在 Markdown 或 frontmatter 中引用：

- `![封面](/content-assets/posts/csr/cover.jpg)`
- `cover: "/content-assets/posts/csr/cover.jpg"`

### 7.2 也可用 `public/`（适合通用静态资源）

例如 `public/images/posts/...`，引用方式为 `![alt](/images/posts/...)`。

---

## 8. 互动系统（Supabase）与 BFF 边界

### 8.1 数据流（强约束）

浏览器 **只请求 Next API**，不直连 Supabase：

```
Browser -> /api/* (Next Route Handlers) -> Supabase
```

对应 API（部分）：

- `POST /api/comments`：提交评论（默认 pending）
- `POST /api/likes`：点赞/取消点赞
- `POST /api/favorites`：收藏/取消收藏（需登录）
- `GET /api/engagement?postSlug=...`：获取互动信息（计数 + viewer 状态）

### 8.2 评论展示规则

- 前台只读取 `approved` 状态的评论
- 未审核评论不会在文章页出现

---

## 9. 评论审核后台（/admin/comments）

### 9.1 访问方式（Admin Secret Gate）

首次访问：

- 打开：`/admin/comments?key=ADMIN_SECRET`
- 服务器会通过 `/api/admin/gate` 写入 HttpOnly cookie（后续无需再带 key）

清理密钥（换管理员或失效处理）：
- 删除浏览器对应 cookie，或更换 `ADMIN_SECRET` 后重新进入

### 9.2 审核能力

- 默认队列：`pending`
- 支持：搜索/筛选/分页、批量通过/隐藏、快捷键工作流

相关 API：
- `GET /api/admin/comments`
- `POST /api/admin/comments/batch`

---

## 10. 搜索（离线索引）

- 索引文件：`public/search-index.json`
- 生成脚本：`scripts/build-search-index.mjs`
- 生成时机：`pnpm build` 自动生成

页面：
- `/search`（为了避免重复内容与低质量索引页影响，已设置 `noindex`）

---

## 11. SEO

输出路由：
- `/sitemap.xml`
- `/robots.txt`
- `/rss.xml`

文章页：
- 动态 `generateMetadata`
- OG 图：`/og/posts/[slug]`
- JSON-LD：文章页注入 `application/ld+json`

索引策略（避免工具页污染 SEO）：
- `/admin/*`、`/share/*`、`/login`、`/register`、`/me`、`/search` 等均 `noindex`，并在 `robots.txt` 中禁止抓取

---

## 12. 分享海报（Share Studio）

### 12.1 入口

文章页提供入口按钮跳转：

- `/share/posts/[slug]?style=paper-editorial&ratio=landscape`

### 12.2 海报 API

- 路由：`/api/poster/posts/[slug]`
- 查询参数：
  - `style`：海报样式 id
  - `ratio`：目前仅 `landscape`
  - `size=thumb`：缩略图（用于样式画廊，降低 ImageResponse 渲染成本）

---

## 13. 常用脚本

```bash
pnpm dev                     # 本地开发
pnpm build                   # 生产构建（含搜索索引生成）
pnpm start                   # 本地运行生产构建
pnpm lint                    # ESLint
pnpm run build:search-index  # 单独生成搜索索引
```

---

## 14. 部署（Vercel + Supabase）

### 14.1 Vercel

1) 新建项目并连接该仓库  
2) 环境变量按「5. 环境变量」配置（Production + Preview 建议都配）  
3) Build Command 使用默认（`pnpm build`）  

### 14.2 Supabase

1) 创建项目（Postgres + Auth）  
2) 在数据库中建立互动表（comments/likes/favorites）与策略（RLS）  
3) 在 Vercel 中配置 key：
   - 浏览器侧使用 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - 服务端写入使用 `SUPABASE_SECRET_KEY`

---

## 15. 常见问题（Troubleshooting）

### 15.1 sitemap/robots/rss 为空或报错

确认已配置：
- `NEXT_PUBLIC_SITE_URL`

### 15.2 海报/OG 图片生成失败或无封面图

- `cover` 必须是可访问的 URL：
  - 以 `/content-assets/...`（本地仓库图片）或 `/images/...`（public）开头的路径
  - 或者绝对 URL（http/https）

### 15.3 评论提交成功但前台不显示

- 评论默认是 `pending`，需要在 `/admin/comments` 审核为 `approved` 才会展示。

---

## 16. 安全注意（最低限度但不裸奔）

- `SUPABASE_SECRET_KEY` 只允许在服务端使用，禁止在任何客户端代码中引用。
- `/content-assets` 已限制扩展名白名单，仅允许图片类型，避免意外暴露非图片资源。
- 工具页（admin/share/auth/me/search）默认 `noindex`，避免被搜索引擎收录。
