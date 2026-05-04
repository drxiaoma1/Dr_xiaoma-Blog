# 个人静态博客 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `Eng_Demo/` 根目录初始化基于 Astro 的个人静态博客，含主页/博客/搜索/头像工具/部署文档/GH Actions 工作流。

**Architecture:** Astro 5 静态站点；Tailwind CSS 样式；Content Collections 管理 Markdown 文章；Pagefind 构建期生成搜索索引；Canvas 实现头像圆形切割；GitHub Actions 自动部署到 GitHub Pages。

**Tech Stack:** Astro 5, TypeScript, Tailwind CSS 3, Pagefind, pnpm, GitHub Actions

---

## 文件结构总览

```
Eng_Demo/
├── package.json / tsconfig.json / astro.config.mjs / tailwind.config.mjs
├── .gitignore
├── CLAUDE.md / README.md / DEPLOY.md
├── .github/workflows/deploy.yml
├── public/
│   ├── favicon.svg
│   └── avatars/current.png
├── src/
│   ├── styles/globals.css
│   ├── layouts/BaseLayout.astro
│   ├── components/{LoadingBar,Nav,Footer,Hero,InfoSection,ArticleCard,SearchBox,AvatarCropper}.astro
│   ├── content/{config.ts, blog/_template.md, blog/hello-world.md}
│   ├── data/profile.ts
│   └── pages/{index,avatar,404,blog/index,blog/[...slug]}.astro
└── docs/superpowers/{specs,plans}/...
```

每个文件单一职责。组件之间通过 props 解耦，数据集中在 `src/data/profile.ts` 与 `src/content/blog/`。

---

## Task 1: 项目初始化与依赖

**Files:**
- Create: `Eng_Demo/package.json`
- Create: `Eng_Demo/tsconfig.json`
- Create: `Eng_Demo/astro.config.mjs`
- Create: `Eng_Demo/tailwind.config.mjs`
- Create: `Eng_Demo/postcss.config.cjs`
- Create: `Eng_Demo/src/styles/globals.css`
- Create: `Eng_Demo/.gitignore`

- [ ] **Step 1: 写 `package.json`**

```json
{
  "name": "eng-demo-blog",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && pagefind --site dist",
    "preview": "astro preview",
    "astro": "astro",
    "typecheck": "astro check"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/tailwind": "^5.1.4",
    "@astrojs/check": "^0.9.4",
    "@astrojs/sitemap": "^3.2.1",
    "tailwindcss": "^3.4.17",
    "rehype-slug": "^6.0.0",
    "rehype-autolink-headings": "^7.1.0",
    "typescript": "^5.7.2"
  },
  "devDependencies": {
    "pagefind": "^1.2.0"
  },
  "packageManager": "pnpm@9.0.0"
}
```

- [ ] **Step 2: 写 `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "~/*": ["src/*"] }
  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 3: 写 `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// 部署到 GitHub Pages 时按需修改 site / base
export default defineConfig({
  site: 'https://example.github.io',
  base: '/',
  integrations: [tailwind({ applyBaseStyles: false }), sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-light', wrap: true },
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'append' }]],
  },
});
```

- [ ] **Step 4: 写 `tailwind.config.mjs` 与 `postcss.config.cjs`**

`tailwind.config.mjs`:
```js
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0f172a', soft: '#334155', mute: '#64748b' },
        paper: { DEFAULT: '#f8fafc', card: '#ffffff', edge: '#e2e8f0' },
        accent: { DEFAULT: '#2563eb', soft: '#dbeafe' },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        serif: ['Georgia', 'Source Han Serif SC', 'serif'],
      },
      maxWidth: { prose: '46rem' },
    },
  },
  plugins: [],
};
```

`postcss.config.cjs`:
```js
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

- [ ] **Step 5: 写 `src/styles/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { scroll-behavior: smooth; }
  body { @apply bg-paper text-ink font-sans antialiased; }
  a { @apply text-accent hover:underline; }
  h1,h2,h3,h4 { @apply font-semibold tracking-tight; }
}

@layer components {
  .container-prose { @apply mx-auto px-6 max-w-prose; }
  .container-wide  { @apply mx-auto px-6 max-w-5xl; }
  .card { @apply bg-paper-card border border-paper-edge rounded-2xl p-6 shadow-sm; }
  .fade-in { animation: fadeIn .5s ease-out both; }
  @keyframes fadeIn { from { opacity:0; transform: translateY(8px);} to { opacity:1; transform:none;} }
}
```

- [ ] **Step 6: 写 `.gitignore`**

```
node_modules
dist
.astro
.env
.env.*
.DS_Store
pnpm-debug.log*
```

- [ ] **Step 7: 安装依赖并初始化 git**

Run:
```bash
cd /home/mamingkang/Eng_Demo
pnpm install
git init
git add -A
git commit -m "chore: initial project scaffold (astro + tailwind)"
```
Expected: 依赖安装成功；git 仓库初始化；首次提交成功。

---

## Task 2: 基础布局 + 加载伪进度条

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/LoadingBar.astro`
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`
- Create: `src/pages/index.astro`（占位）

- [ ] **Step 1: `src/components/LoadingBar.astro`**

```astro
---
// 顶部 2px 伪进度条 + 内容淡入
---
<div id="lb" class="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none">
  <div id="lb-bar" class="h-full bg-accent w-0 transition-[width] duration-300 ease-out"></div>
</div>
<script is:inline>
(() => {
  const bar = document.getElementById('lb-bar');
  const wrap = document.getElementById('lb');
  if (!bar || !wrap) return;
  let p = 0;
  const tick = () => { p = Math.min(70, p + Math.random() * 18); bar.style.width = p + '%'; };
  const t1 = setTimeout(tick, 30);
  const t2 = setTimeout(tick, 180);
  const finish = () => {
    clearTimeout(t1); clearTimeout(t2);
    bar.style.width = '100%';
    setTimeout(() => { wrap.style.opacity = '0'; }, 180);
    setTimeout(() => { wrap.style.display = 'none'; }, 450);
    document.body.classList.add('page-ready');
  };
  if (document.readyState === 'complete') finish();
  else window.addEventListener('load', finish, { once: true });
})();
</script>
<style>
  body:not(.page-ready) main { opacity: 0; transform: translateY(8px); }
  main { transition: opacity .35s ease-out, transform .35s ease-out; }
  #lb { transition: opacity .25s ease-out; }
</style>
```

- [ ] **Step 2: `src/components/Nav.astro`**

```astro
---
const links = [
  { href: '/', label: '主页' },
  { href: '/blog', label: '博客' },
];
const path = Astro.url.pathname;
---
<header class="sticky top-0 z-40 backdrop-blur bg-paper/70 border-b border-paper-edge">
  <nav class="container-wide flex items-center justify-between h-14">
    <a href="/" class="font-semibold tracking-tight no-underline text-ink">个人博客</a>
    <ul class="flex gap-6 text-sm">
      {links.map(l => (
        <li><a href={l.href} class={`no-underline ${path.startsWith(l.href) && l.href !== '/' || path === l.href ? 'text-accent' : 'text-ink-soft hover:text-ink'}`}>{l.label}</a></li>
      ))}
    </ul>
  </nav>
</header>
```

- [ ] **Step 3: `src/components/Footer.astro`**

```astro
---
const year = new Date().getFullYear();
---
<footer class="border-t border-paper-edge mt-16">
  <div class="container-wide py-8 text-sm text-ink-mute flex justify-between">
    <span>© {year} 个人博客</span>
    <span>Powered by Astro</span>
  </div>
</footer>
```

- [ ] **Step 4: `src/layouts/BaseLayout.astro`**

```astro
---
import '~/styles/globals.css';
import LoadingBar from '~/components/LoadingBar.astro';
import Nav from '~/components/Nav.astro';
import Footer from '~/components/Footer.astro';

interface Props { title?: string; description?: string }
const { title = '个人博客', description = '一个浅色系现代简约博客' } = Astro.props;
---
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
  </head>
  <body>
    <LoadingBar />
    <Nav />
    <main class="fade-in">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 5: 临时 `src/pages/index.astro`**

```astro
---
import BaseLayout from '~/layouts/BaseLayout.astro';
---
<BaseLayout title="主页">
  <section class="container-wide py-16">
    <h1 class="text-3xl">骨架就绪</h1>
    <p class="text-ink-soft mt-2">下一步：填充主页内容。</p>
  </section>
</BaseLayout>
```

- [ ] **Step 6: 验证并提交**

Run:
```bash
pnpm dev
```
Expected: `http://localhost:4321` 顶部细线进度条出现并自然消失；正文淡入。Ctrl+C 退出。

```bash
git add -A
git commit -m "feat: base layout, loading bar and shell pages"
```

---

## Task 3: 个人主页（Hero + InfoSection）

**Files:**
- Create: `src/data/profile.ts`
- Create: `src/components/Hero.astro`
- Create: `src/components/InfoSection.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: `src/data/profile.ts`**

```ts
export interface Education { school: string; degree: string; period: string; detail?: string }
export interface Project   { name: string; description: string; period?: string; link?: string }
export interface Contact   { type: string; value: string; link?: string }

export const profile = {
  name: '你的名字',
  bio: '一句话介绍自己。',
  avatar: '/avatars/current.png',
  education: [] as Education[],
  projects:  [] as Project[],
  hobbies:   [] as string[],
  contacts:  [] as Contact[],
};
```

- [ ] **Step 2: `src/components/Hero.astro`**

```astro
---
import { profile } from '~/data/profile';
---
<section class="container-wide pt-16 pb-10 flex flex-col md:flex-row items-center md:items-end gap-8">
  <img
    src={profile.avatar}
    alt={profile.name}
    width="144" height="144"
    class="w-36 h-36 rounded-full object-cover border border-paper-edge shadow-sm bg-paper-card"
    onerror="this.src='/favicon.svg'"
  />
  <div class="text-center md:text-left">
    <h1 class="text-4xl font-semibold tracking-tight">{profile.name}</h1>
    <p class="mt-3 text-ink-soft text-lg">{profile.bio}</p>
  </div>
</section>
```

- [ ] **Step 3: `src/components/InfoSection.astro`**

```astro
---
interface Props { title: string; empty?: string }
const { title, empty = '暂未填写' } = Astro.props;
---
<section class="card">
  <h2 class="text-lg font-semibold mb-3">{title}</h2>
  <div class="text-ink-soft text-sm leading-relaxed">
    <slot>
      <p class="text-ink-mute">{empty}</p>
    </slot>
  </div>
</section>
```

- [ ] **Step 4: 重写 `src/pages/index.astro`**

```astro
---
import BaseLayout from '~/layouts/BaseLayout.astro';
import Hero from '~/components/Hero.astro';
import InfoSection from '~/components/InfoSection.astro';
import { profile } from '~/data/profile';
---
<BaseLayout title={profile.name || '主页'} description={profile.bio}>
  <Hero />
  <section class="container-wide pb-16 grid gap-6 md:grid-cols-2">
    <InfoSection title="教育经历">
      {profile.education.length === 0 ? null : (
        <ul class="space-y-3">
          {profile.education.map(e => (
            <li>
              <div class="font-medium text-ink">{e.school} · {e.degree}</div>
              <div class="text-ink-mute text-xs">{e.period}</div>
              {e.detail && <p class="mt-1">{e.detail}</p>}
            </li>
          ))}
        </ul>
      )}
    </InfoSection>

    <InfoSection title="项目经历">
      {profile.projects.length === 0 ? null : (
        <ul class="space-y-3">
          {profile.projects.map(p => (
            <li>
              <div class="font-medium text-ink">
                {p.link ? <a href={p.link} target="_blank" rel="noopener">{p.name}</a> : p.name}
              </div>
              {p.period && <div class="text-ink-mute text-xs">{p.period}</div>}
              <p class="mt-1">{p.description}</p>
            </li>
          ))}
        </ul>
      )}
    </InfoSection>

    <InfoSection title="个人爱好">
      {profile.hobbies.length === 0 ? null : (
        <ul class="flex flex-wrap gap-2">
          {profile.hobbies.map(h => <li class="px-3 py-1 rounded-full bg-accent-soft text-accent text-xs">{h}</li>)}
        </ul>
      )}
    </InfoSection>

    <InfoSection title="联系方式">
      {profile.contacts.length === 0 ? null : (
        <ul class="space-y-2">
          {profile.contacts.map(c => (
            <li class="flex justify-between">
              <span class="text-ink-mute">{c.type}</span>
              {c.link
                ? <a href={c.link}>{c.value}</a>
                : <span>{c.value}</span>}
            </li>
          ))}
        </ul>
      )}
    </InfoSection>
  </section>
</BaseLayout>
```

- [ ] **Step 5: 验证并提交**

Run: `pnpm dev` → 访问 `/`，验证四块卡片网格显示"暂未填写"占位、Hero 头像位置正确。

```bash
git add -A
git commit -m "feat: home page hero and info sections"
```

---

## Task 4: 文章 Content Collection + 列表页

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/blog/_template.md`
- Create: `src/content/blog/hello-world.md`
- Create: `src/components/ArticleCard.astro`
- Create: `src/pages/blog/index.astro`

- [ ] **Step 1: `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: `src/content/blog/_template.md`**

```md
---
title: 文章标题
date: 2026-05-04
summary: 一段简短的摘要，用于在列表中展示。
tags: [示例]
draft: true
---

正文从这里开始。

## 二级标题

支持 **加粗**、*斜体*、`代码`、列表与代码块。
```

- [ ] **Step 3: `src/content/blog/hello-world.md`**

```md
---
title: Hello, World
date: 2026-05-04
summary: 第一篇示例文章，展示这个博客的基本能力。
tags: [示例, 入门]
draft: false
---

## 欢迎

这是一篇示例文章。你可以删除它，或者复制 `_template.md` 来开始你自己的写作。

## 写作约定

- 使用 frontmatter 配置元数据
- `draft: true` 不会在生产构建中出现
- 标签会被用于未来的归类
```

- [ ] **Step 4: `src/components/ArticleCard.astro`**

```astro
---
interface Props {
  href: string; title: string; date: Date; summary: string; tags: string[];
}
const { href, title, date, summary, tags } = Astro.props;
const dateStr = date.toISOString().slice(0, 10);
---
<a href={href} class="card block no-underline hover:shadow-md transition-shadow">
  <div class="flex items-baseline justify-between gap-4">
    <h3 class="text-ink text-lg font-semibold">{title}</h3>
    <time class="text-ink-mute text-xs whitespace-nowrap">{dateStr}</time>
  </div>
  <p class="text-ink-soft text-sm mt-2">{summary}</p>
  {tags.length > 0 && (
    <ul class="flex flex-wrap gap-2 mt-3">
      {tags.map(t => <li class="text-xs px-2 py-0.5 rounded-full bg-accent-soft text-accent">#{t}</li>)}
    </ul>
  )}
</a>
```

- [ ] **Step 5: `src/pages/blog/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '~/layouts/BaseLayout.astro';
import ArticleCard from '~/components/ArticleCard.astro';

const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---
<BaseLayout title="博客" description="文章列表">
  <section class="container-wide py-12">
    <header class="flex items-end justify-between mb-8">
      <div>
        <h1 class="text-3xl">博客</h1>
        <p class="text-ink-soft mt-1">共 {posts.length} 篇文章</p>
      </div>
      <div id="search-mount" class="w-full max-w-xs"></div>
    </header>

    <ul class="grid gap-4">
      {posts.map(p => (
        <li>
          <ArticleCard
            href={`/blog/${p.slug}`}
            title={p.data.title}
            date={p.data.date}
            summary={p.data.summary}
            tags={p.data.tags}
          />
        </li>
      ))}
    </ul>
  </section>
</BaseLayout>
```

- [ ] **Step 6: 验证并提交**

Run: `pnpm dev` → 访问 `/blog`，应看到 1 张 hello-world 卡片。

```bash
git add -A
git commit -m "feat: blog content collection and list page"
```

---

## Task 5: 文章详情页 + TOC + 分享

**Files:**
- Create: `src/pages/blog/[...slug].astro`

- [ ] **Step 1: `src/pages/blog/[...slug].astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '~/layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map(p => ({ params: { slug: p.slug }, props: { post: p } }));
}

const { post } = Astro.props;
const { Content, headings } = await post.render();
const dateStr = post.data.date.toISOString().slice(0, 10);
const toc = headings.filter(h => h.depth === 2 || h.depth === 3);
---
<BaseLayout title={post.data.title} description={post.data.summary}>
  <article class="container-prose py-12">
    <header class="mb-8">
      <h1 class="text-3xl">{post.data.title}</h1>
      <div class="mt-2 text-sm text-ink-mute flex gap-3">
        <time>{dateStr}</time>
        {post.data.tags.length > 0 && <span>· {post.data.tags.map(t => `#${t}`).join(' ')}</span>}
      </div>
    </header>

    {toc.length > 0 && (
      <nav class="card mb-8" aria-label="目录">
        <p class="text-xs uppercase tracking-wide text-ink-mute mb-2">目录</p>
        <ul class="text-sm space-y-1">
          {toc.map(h => (
            <li class={h.depth === 3 ? 'pl-4' : ''}>
              <a href={`#${h.slug}`} class="no-underline text-ink-soft hover:text-accent">{h.text}</a>
            </li>
          ))}
        </ul>
      </nav>
    )}

    <div class="prose prose-slate max-w-none
                prose-headings:scroll-mt-20
                prose-a:text-accent
                prose-pre:bg-slate-50 prose-pre:border prose-pre:border-paper-edge">
      <Content />
    </div>

    <footer class="mt-12 pt-6 border-t border-paper-edge flex items-center gap-3">
      <button id="share-copy" class="px-3 py-1.5 rounded-lg border border-paper-edge text-sm hover:bg-paper-card">复制链接</button>
      <button id="share-native" class="px-3 py-1.5 rounded-lg border border-paper-edge text-sm hover:bg-paper-card hidden">分享</button>
      <span id="share-tip" class="text-xs text-ink-mute"></span>
    </footer>
  </article>

  <script is:inline>
    (() => {
      const tip = document.getElementById('share-tip');
      const copy = document.getElementById('share-copy');
      const nat = document.getElementById('share-native');
      const url = location.href;
      copy?.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(url); tip.textContent = '链接已复制'; }
        catch { tip.textContent = '复制失败，请手动复制'; }
        setTimeout(() => tip.textContent = '', 2000);
      });
      if (navigator.share) {
        nat.classList.remove('hidden');
        nat.addEventListener('click', () => navigator.share({ url, title: document.title }).catch(() => {}));
      }
    })();
  </script>
</BaseLayout>
```

- [ ] **Step 2: 加 `@tailwindcss/typography` 支持 prose 类（可选但推荐）**

Run:
```bash
pnpm add -D @tailwindcss/typography
```

修改 `tailwind.config.mjs`，在 `plugins` 中添加：
```js
import typography from '@tailwindcss/typography';
// ...
plugins: [typography],
```

- [ ] **Step 3: 验证并提交**

Run: `pnpm dev` → 访问 `/blog/hello-world`，看到 TOC、分享按钮、Markdown 渲染正确。

```bash
git add -A
git commit -m "feat: article detail page with toc and share"
```

---

## Task 6: 搜索（Pagefind 集成）

**Files:**
- Create: `src/components/SearchBox.astro`
- Modify: `src/pages/blog/index.astro`（注入 SearchBox 到 `#search-mount` 区域）
- Modify: `package.json` build script（已含 `pagefind --site dist`）

- [ ] **Step 1: `src/components/SearchBox.astro`**

```astro
---
// 在生产构建后由 pagefind 生成 /pagefind/pagefind.js
---
<div class="relative">
  <input id="q" type="search" placeholder="搜索文章…"
         class="w-full px-3 py-2 rounded-lg border border-paper-edge bg-paper-card text-sm outline-none focus:border-accent" />
  <ul id="results" class="hidden absolute top-full left-0 right-0 mt-2 bg-paper-card border border-paper-edge rounded-xl shadow-lg max-h-80 overflow-auto z-30"></ul>
</div>
<script is:inline>
(async () => {
  const input = document.getElementById('q');
  const list  = document.getElementById('results');
  if (!input || !list) return;

  let pf = null;
  const ensure = async () => {
    if (pf) return pf;
    try { pf = await import('/pagefind/pagefind.js'); await pf.options({ baseUrl: '/' }); }
    catch (e) { console.warn('Pagefind 仅在构建产物中可用：', e); }
    return pf;
  };

  const render = (items) => {
    if (!items.length) { list.innerHTML = '<li class="px-3 py-2 text-sm text-ink-mute">无结果</li>'; }
    else list.innerHTML = items.map(d => `
      <li><a class="block px-3 py-2 hover:bg-paper text-sm no-underline" href="${d.url}">
        <div class="font-medium text-ink">${d.meta?.title ?? d.url}</div>
        <div class="text-ink-mute text-xs mt-0.5">${d.excerpt}</div>
      </a></li>`).join('');
    list.classList.remove('hidden');
  };

  let timer;
  input.addEventListener('input', async () => {
    clearTimeout(timer);
    const q = input.value.trim();
    if (!q) { list.classList.add('hidden'); list.innerHTML=''; return; }
    timer = setTimeout(async () => {
      const lib = await ensure();
      if (!lib) { list.innerHTML = '<li class="px-3 py-2 text-xs text-ink-mute">本地预览下搜索不可用，请运行 pnpm build && pnpm preview 验证</li>'; list.classList.remove('hidden'); return; }
      const search = await lib.search(q);
      const items = await Promise.all(search.results.slice(0, 8).map(r => r.data()));
      render(items);
    }, 120);
  });

  document.addEventListener('click', e => {
    if (!list.contains(e.target) && e.target !== input) list.classList.add('hidden');
  });
})();
</script>
```

- [ ] **Step 2: 修改 `src/pages/blog/index.astro` 引入 SearchBox**

在文件 import 块加入：
```astro
import SearchBox from '~/components/SearchBox.astro';
```

将 `<div id="search-mount" class="w-full max-w-xs"></div>` 替换为：
```astro
<div class="w-full max-w-xs"><SearchBox /></div>
```

- [ ] **Step 3: 给 article body 标记 pagefind 索引区**

修改 `src/pages/blog/[...slug].astro`，把 `<article ...>` 改为：
```astro
<article class="container-prose py-12" data-pagefind-body>
```
并在 header 内的 `<h1>` 上加 `data-pagefind-meta="title"`：
```astro
<h1 class="text-3xl" data-pagefind-meta="title">{post.data.title}</h1>
```

- [ ] **Step 4: 构建验证**

Run:
```bash
pnpm build
pnpm preview
```
打开 `http://localhost:4321/blog`，输入"hello"应能搜出文章；命令行确认 `dist/pagefind/` 目录已生成。

- [ ] **Step 5: 提交**

```bash
git add -A
git commit -m "feat: pagefind search on blog list"
```

---

## Task 7: 头像切割工具页

**Files:**
- Create: `src/components/AvatarCropper.astro`
- Create: `src/pages/avatar.astro`
- Create: `public/avatars/current.png`（占位，由后续步骤生成）

- [ ] **Step 1: `src/components/AvatarCropper.astro`**

```astro
---
// 客户端 Canvas 圆形切割：上传 → 拖动/缩放 → 导出 PNG
---
<div class="card">
  <div class="flex flex-col md:flex-row gap-8 items-start">
    <div class="flex-1 w-full">
      <label class="block text-sm text-ink-soft mb-2">选择图片</label>
      <input id="ac-file" type="file" accept="image/*" class="block text-sm" />

      <div class="mt-4 relative bg-paper border border-paper-edge rounded-xl overflow-hidden" style="aspect-ratio:1/1">
        <canvas id="ac-canvas" class="w-full h-full block"></canvas>
        <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div class="rounded-full border-2 border-accent/70" style="width:80%; aspect-ratio:1/1;"></div>
        </div>
      </div>

      <div class="mt-4 flex items-center gap-3">
        <label class="text-xs text-ink-mute">缩放</label>
        <input id="ac-zoom" type="range" min="0.2" max="3" step="0.01" value="1" class="flex-1" />
      </div>
      <p class="text-xs text-ink-mute mt-2">拖动图片调整位置；圆圈区域即裁切结果。</p>
    </div>

    <div class="md:w-56 w-full">
      <p class="text-sm text-ink-soft mb-2">预览</p>
      <img id="ac-preview" alt="preview" class="w-40 h-40 rounded-full object-cover border border-paper-edge bg-paper" />
      <button id="ac-download" class="mt-4 w-full px-3 py-2 rounded-lg bg-accent text-white text-sm disabled:opacity-50" disabled>下载 current.png</button>
      <p class="text-xs text-ink-mute mt-3 leading-relaxed">
        下载后将文件覆盖到仓库的 <code>public/avatars/current.png</code>，提交并推送即生效。
      </p>
    </div>
  </div>
</div>

<script is:inline>
(() => {
  const canvas = document.getElementById('ac-canvas');
  const ctx = canvas.getContext('2d');
  const file = document.getElementById('ac-file');
  const zoom = document.getElementById('ac-zoom');
  const preview = document.getElementById('ac-preview');
  const dl = document.getElementById('ac-download');

  const SIZE = 512;
  canvas.width = SIZE; canvas.height = SIZE;

  let img = null, scale = 1, ox = 0, oy = 0;
  let dragging = false, lastX = 0, lastY = 0;

  const draw = () => {
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, SIZE, SIZE);
    if (!img) return;
    const w = img.width * scale, h = img.height * scale;
    ctx.drawImage(img, ox, oy, w, h);
    updatePreview();
  };

  const updatePreview = () => {
    if (!img) return;
    const out = document.createElement('canvas');
    out.width = SIZE; out.height = SIZE;
    const oc = out.getContext('2d');
    oc.beginPath();
    oc.arc(SIZE/2, SIZE/2, SIZE * 0.4, 0, Math.PI * 2);
    oc.closePath(); oc.clip();
    oc.drawImage(canvas, 0, 0);
    preview.src = out.toDataURL('image/png');
    dl.disabled = false;
    dl.dataset.url = preview.src;
  };

  file.addEventListener('change', () => {
    const f = file.files?.[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    const i = new Image();
    i.onload = () => {
      img = i;
      const fit = Math.max(SIZE / i.width, SIZE / i.height);
      scale = fit; zoom.value = String(fit);
      ox = (SIZE - i.width * scale) / 2;
      oy = (SIZE - i.height * scale) / 2;
      draw();
      URL.revokeObjectURL(url);
    };
    i.src = url;
  });

  zoom.addEventListener('input', () => {
    if (!img) return;
    const cx = SIZE / 2, cy = SIZE / 2;
    const px = (cx - ox) / scale, py = (cy - oy) / scale;
    scale = parseFloat(zoom.value);
    ox = cx - px * scale; oy = cy - py * scale;
    draw();
  });

  canvas.addEventListener('mousedown', e => { dragging = true; lastX = e.offsetX; lastY = e.offsetY; });
  window.addEventListener('mouseup', () => dragging = false);
  canvas.addEventListener('mousemove', e => {
    if (!dragging || !img) return;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
    ox += (e.movementX) * sx; oy += (e.movementY) * sy;
    draw();
  });
  // touch
  canvas.addEventListener('touchstart', e => {
    if (!e.touches[0]) return;
    dragging = true; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
  }, { passive: true });
  canvas.addEventListener('touchmove', e => {
    if (!dragging || !img || !e.touches[0]) return;
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
    ox += (t.clientX - lastX) * sx; oy += (t.clientY - lastY) * sy;
    lastX = t.clientX; lastY = t.clientY;
    draw();
  }, { passive: true });
  canvas.addEventListener('touchend', () => dragging = false);

  dl.addEventListener('click', () => {
    if (!dl.dataset.url) return;
    const a = document.createElement('a');
    a.href = dl.dataset.url; a.download = 'current.png';
    document.body.appendChild(a); a.click(); a.remove();
  });

  draw();
})();
</script>
```

- [ ] **Step 2: `src/pages/avatar.astro`**

```astro
---
import BaseLayout from '~/layouts/BaseLayout.astro';
import AvatarCropper from '~/components/AvatarCropper.astro';
---
<BaseLayout title="头像工具" description="上传并裁切圆形头像">
  <section class="container-wide py-12">
    <header class="mb-6">
      <h1 class="text-3xl">头像工具</h1>
      <p class="text-ink-soft mt-2">上传图片，圆形预览满意后下载，覆盖 <code>public/avatars/current.png</code> 并提交即可生效。</p>
    </header>
    <AvatarCropper />
  </section>
</BaseLayout>
```

- [ ] **Step 3: 生成默认占位头像**

Run:
```bash
mkdir -p /home/mamingkang/Eng_Demo/public/avatars
node -e "const fs=require('fs');const{createCanvas}=(()=>{try{return require('canvas')}catch{return null}})()||{};if(!createCanvas){const svg='<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"512\" height=\"512\"><rect width=\"100%\" height=\"100%\" fill=\"#dbeafe\"/><circle cx=\"256\" cy=\"200\" r=\"80\" fill=\"#2563eb\"/><rect x=\"120\" y=\"320\" width=\"272\" height=\"140\" rx=\"70\" fill=\"#2563eb\"/></svg>';fs.writeFileSync('/home/mamingkang/Eng_Demo/public/avatars/current.svg',svg);console.log('SVG fallback written');}else{const c=createCanvas(512,512);const x=c.getContext('2d');x.fillStyle='#dbeafe';x.fillRect(0,0,512,512);x.fillStyle='#2563eb';x.beginPath();x.arc(256,200,80,0,Math.PI*2);x.fill();x.fillRect(120,320,272,140);fs.writeFileSync('/home/mamingkang/Eng_Demo/public/avatars/current.png',c.toBuffer('image/png'));}"
```

如果未生成 PNG（无 `canvas` 依赖），将 `src/data/profile.ts` 中 `avatar` 改为 `'/avatars/current.svg'` 即可；建议工具页使用后下载真正 PNG 覆盖。

- [ ] **Step 4: 验证并提交**

Run: `pnpm dev` → 访问 `/avatar`，上传任意 JPG/PNG，能拖动缩放，下载得到 512×512 圆形 PNG。

```bash
git add -A
git commit -m "feat: avatar cropper page with canvas circular crop"
```

---

## Task 8: 404 页面与图标

**Files:**
- Create: `src/pages/404.astro`
- Create: `public/favicon.svg`

- [ ] **Step 1: `src/pages/404.astro`**

```astro
---
import BaseLayout from '~/layouts/BaseLayout.astro';
---
<BaseLayout title="未找到">
  <section class="container-wide py-24 text-center">
    <p class="text-6xl font-semibold text-accent">404</p>
    <h1 class="mt-4 text-2xl">页面没找到</h1>
    <p class="mt-2 text-ink-soft">链接可能已经失效，或者你拼错了地址。</p>
    <a href="/" class="inline-block mt-6 px-4 py-2 rounded-lg border border-paper-edge no-underline">回到主页</a>
  </section>
</BaseLayout>
```

- [ ] **Step 2: `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#2563eb"/>
  <path d="M9 22 L16 9 L23 22 Z" fill="#fff"/>
</svg>
```

- [ ] **Step 3: 验证并提交**

Run: 访问 `/不存在` 检查 404；favicon 在浏览器 tab 显示。

```bash
git add -A
git commit -m "feat: 404 page and favicon"
```

---

## Task 9: 文档（CLAUDE.md / README.md / DEPLOY.md）

**Files:**
- Create: `CLAUDE.md`
- Create: `README.md`
- Create: `DEPLOY.md`

- [ ] **Step 1: `CLAUDE.md`** —— 项目规范与资源路径

```md
# CLAUDE.md — Eng_Demo 项目规范

> 本项目基于 Astro 的浅色系个人静态博客，部署至 GitHub Pages。

## 框架

- Astro 5 + TypeScript
- Tailwind CSS 3
- Astro Content Collections
- Pagefind (静态全文检索)
- 部署：GitHub Actions + GitHub Pages

## 资源路径约定

| 路径 | 用途 |
|---|---|
| `src/pages/` | 路由 |
| `src/layouts/BaseLayout.astro` | 全站布局 |
| `src/components/` | 复用组件 |
| `src/content/blog/*.md` | 博客文章源（**仅作者修改**） |
| `src/content/blog/_template.md` | 文章模板 |
| `src/data/profile.ts` | 个人资料数据 |
| `src/styles/globals.css` | 全局样式 |
| `public/avatars/current.png` | 当前头像（由 `/avatar` 工具页生成） |
| `public/favicon.svg` | 站点图标 |
| `.github/workflows/deploy.yml` | 自动部署工作流 |
| `documents/task.md` | 原始需求 |
| `docs/superpowers/specs/` | 设计规范 |
| `docs/superpowers/plans/` | 实施计划 |

## 编辑约束

- **不要**直接修改 `dist/` 与 `.astro/`
- 新增文章：复制 `_template.md`，文件名即 slug
- `draft: true` 不会进入生产构建
- Tailwind 配色见 `tailwind.config.mjs`，主色 `accent` (#2563eb)
- 主题为浅色系，**不要**引入深色模式

## 命令

| 命令 | 说明 |
|---|---|
| `pnpm install` | 安装依赖 |
| `pnpm dev` | 本地开发（搜索不可用） |
| `pnpm build` | 生产构建（含 Pagefind） |
| `pnpm preview` | 预览构建产物（搜索可用） |
| `pnpm typecheck` | Astro/TS 类型检查 |

## 维护参考

- 部署与维护：见 [DEPLOY.md](DEPLOY.md)
- 设计规范：见 `docs/superpowers/specs/2026-05-04-personal-blog-design.md`
```

- [ ] **Step 2: `README.md`**

```md
# 个人博客（Eng_Demo）

浅色系、现代简约的 Astro 静态博客。

## 快速开始

```bash
pnpm install
pnpm dev          # http://localhost:4321
```

## 写一篇文章

1. 复制 `src/content/blog/_template.md` 为 `src/content/blog/<slug>.md`
2. 修改 frontmatter 与正文
3. `git commit && git push` → 自动部署

## 切换头像

打开 `/avatar` → 上传图片 → 调整位置缩放 → 下载 → 覆盖 `public/avatars/current.png` → 提交。

## 部署

详见 [DEPLOY.md](DEPLOY.md)。
```

- [ ] **Step 3: `DEPLOY.md`**

```md
# 部署与维护指南

## 一、首次部署到 GitHub Pages

1. 在 GitHub 创建一个新仓库（例如 `your-name/blog`）
2. 在本地：

   ```bash
   cd Eng_Demo
   git remote add origin git@github.com:your-name/blog.git
   git branch -M main
   git push -u origin main
   ```

3. 修改 `astro.config.mjs`：

   - `site`: 改为 `https://<your-name>.github.io`
   - `base`: 若仓库名是 `<your-name>.github.io`（用户主页），保持 `'/'`；
     若仓库名是 `blog`（项目仓库），改为 `'/blog/'`

4. 仓库 Settings → Pages：
   - **Source** 选 **GitHub Actions**

5. 推送一次提交后，Actions 自动构建部署。
   完成后访问 `https://<your-name>.github.io/`（或 `/blog/`）。

## 二、自定义域名（可选）

1. 在 `public/` 下新建 `CNAME`，写入域名一行：`blog.example.com`
2. 在 DNS 服务商：CNAME 指向 `<your-name>.github.io`
3. 仓库 Settings → Pages → Custom domain 填入并启用 HTTPS

## 三、写新文章

1. 复制模板：

   ```bash
   cp src/content/blog/_template.md src/content/blog/my-post.md
   ```

2. 编辑 frontmatter（`title` / `date` / `summary` / `tags`），把 `draft` 改为 `false`
3. 写正文（Markdown，支持代码块、标题、列表等）
4. 本地预览：

   ```bash
   pnpm dev
   ```

5. 提交并推送：

   ```bash
   git add src/content/blog/my-post.md
   git commit -m "post: my-post"
   git push
   ```

   Actions 自动构建部署。

## 四、切换头像

1. 浏览器打开你网站的 `/avatar`（或本地 `pnpm dev` 后 `http://localhost:4321/avatar`）
2. 上传图片，拖动/缩放调整位置
3. 点击"下载 current.png"
4. 把下载的 `current.png` 覆盖到 `public/avatars/current.png`
5. 提交并推送：

   ```bash
   git add public/avatars/current.png
   git commit -m "chore: update avatar"
   git push
   ```

## 五、常见问题

- **Actions 失败**：查看 Actions 日志；多见原因：`pnpm-lock.yaml` 与 `package.json` 不同步 → 本地重跑 `pnpm install` 后再提交
- **路径 404**：确认 `astro.config.mjs` 的 `base` 与仓库名匹配
- **搜索不可用**：本地 `pnpm dev` 模式下没有 Pagefind 索引，使用 `pnpm build && pnpm preview` 或部署后访问
- **修改样式生效缓慢**：浏览器强制刷新（Cmd/Ctrl + Shift + R）

## 六、本地命令速查

| 命令 | 说明 |
|---|---|
| `pnpm dev` | 本地开发服务器 |
| `pnpm build` | 生产构建 |
| `pnpm preview` | 预览构建产物 |
| `pnpm typecheck` | 类型检查 |
```

- [ ] **Step 4: 验证并提交**

```bash
git add -A
git commit -m "docs: CLAUDE.md, README.md and DEPLOY.md"
```

---

## Task 10: GitHub Actions 部署工作流

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: `deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with: { version: 9 }

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - run: pnpm build

      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 本地构建一次确保 lockfile 一致**

Run:
```bash
pnpm build
```
Expected: `dist/` 与 `dist/pagefind/` 目录生成；无报错。

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "ci: deploy to github pages on push to main"
```

---

## 验收检查（运行前最终）

- [ ] `pnpm typecheck` 无错误
- [ ] `pnpm build` 成功（生成 `dist/` 与 `dist/pagefind/`）
- [ ] `pnpm preview` 下：
  - `/` 主页 hero + 四块占位卡片
  - `/blog` 文章列表 + 搜索框（搜 "hello" 命中）
  - `/blog/hello-world` 详情 + TOC + 复制链接
  - `/avatar` 上传裁切下载流程通畅
  - `/不存在` 触发 404
- [ ] 加载条进入页面时显示并平滑消失
- [ ] `CLAUDE.md` `README.md` `DEPLOY.md` `docs/superpowers/specs/` 全部就绪

---

## 自审

- [x] **Spec 覆盖**：spec 中 13 节全部对应到 Task 1-10；维护流程进 Task 9
- [x] **占位扫描**：无 TBD/TODO；所有代码段完整
- [x] **类型一致**：`profile.ts` 类型贯穿 `Hero/InfoSection/index.astro`；Content Collection schema 贯穿 list/detail 页
