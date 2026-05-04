# CLAUDE.md — Eng_Demo 项目规范

> 浅色系编辑体（Editorial）风格的个人静态博客，作者：**马铭康（化名 Dr_xiaoma）**。基于 Astro 构建，部署至 GitHub Pages。

## 1. 技术栈

| 项 | 选择 |
|---|---|
| 框架 | Astro 5 + TypeScript (strict) |
| 样式 | Tailwind CSS 3 + `@tailwindcss/typography` |
| 内容 | Astro Content Collections（Zod schema） |
| 搜索 | Pagefind 1（构建期生成 `dist/pagefind/`） |
| 字体 | Fraunces (display/serif) + Public Sans (UI) + JetBrains Mono |
| 部署 | GitHub Actions → GitHub Pages |
| 包管理 | pnpm 9 |

## 2. 设计约束

- **主题：浅色系**（象牙色纸面 `#f4efe6`，墨色 `#1a1714`，铁锈红强调 `#7a2e1e`）
- **不要**引入深色模式或切换按钮
- **不要**替换为蓝紫色系等通用模板配色
- 标题与正文使用 Fraunces 斜体/opsz 变体；UI 用 Public Sans
- 保持编辑杂志式的留白、细分隔线、罗马数字/小序号等装饰细节
- 所有中文内容优先，英文作为辅助装饰
- **品牌身份**：左上角站点名 / 页脚署名 / 联系方式 / 社交链接均使用化名 **Dr_xiaoma**；只有主页 Hero 中央的大字使用真名 **马铭康**

## 3. 资源路径约定

| 路径 | 用途 |
|---|---|
| `src/pages/` | 路由（文件 = URL） |
| `src/layouts/BaseLayout.astro` | 全站布局（head / Nav / LoadingBar / Footer） |
| `src/components/` | 复用组件（Hero / InfoSection / ArticleCard / SearchBox 等） |
| `src/content/blog/*.md` | 博客文章源（**作者唯一可写入口**） |
| `src/content/blog/_template.md` | 文章模板（复制此文件开始新文章） |
| `src/content/config.ts` | Collection schema |
| `src/data/profile.ts` | 个人资料（教育 / 项目 / 爱好 / 联系方式 / tagline） |
| `src/styles/globals.css` | 全局样式 + Fraunces / Public Sans 字体加载 |
| `src/utils/url.ts` | base 路径工具（部署到子路径时统一处理） |
| `public/avatars/current.png` | 当前头像（作者直接覆盖此文件以更换） |
| `public/avatars/current.svg` | 头像加载失败时的兜底 |
| `public/favicon.svg` | 站点图标 |
| `.github/workflows/deploy.yml` | 自动部署工作流 |
| `documents/task.md` | 原始任务需求 |
| `docs/superpowers/specs/` | 设计规范文档 |
| `docs/superpowers/plans/` | 实施计划文档 |

## 4. 路由

| 路径 | 页面 |
|---|---|
| `/` | 个人主页（Hero + 自上而下的四块资料：教育 / 项目 / 爱好 / 联系方式） |
| `/blog` | 文章列表 + 搜索框 |
| `/blog/<slug>` | 文章详情 + TOC + 分享 |
| `/tags` | 全部标签及其出现次数（按计数倒序） |
| `/404` | 未找到兜底 |

## 5. 编辑约束

- 新增文章：复制 `src/content/blog/_template.md`，文件名即 slug；`draft: true` 的文章不进入生产构建与标签统计
- 文章 frontmatter 的 `tags` 是任意字符串数组，可自定义命名；同名标签会在 `/tags` 页累计
- 修改个人信息：只改 `src/data/profile.ts` 的字段（不要改 interface），`name` 用真名、其它出现化名的位置请保持 `Dr_xiaoma`
- 更换头像：直接用新图片覆盖 `public/avatars/current.png` 后提交
- 改主色：`tailwind.config.mjs` 的 `colors.accent`
- 改字体：`tailwind.config.mjs` 的 `fontFamily` + `src/styles/globals.css` 顶部的 `@import url`
- **不要**直接修改 `dist/` 与 `.astro/`（自动生成）
- **不要**修改 `src/pages/blog/[...slug].astro` 里 `data-pagefind-body` / `data-pagefind-meta` 的属性，否则搜索索引会失效

## 6. 命令

| 命令 | 说明 |
|---|---|
| `pnpm install` | 安装依赖 |
| `pnpm dev` | 本地开发服务器（搜索不可用，其它功能正常） |
| `pnpm build` | 生产构建（`astro build && pagefind --site dist`） |
| `pnpm preview` | 预览 `dist/`（搜索可用） |
| `pnpm typecheck` | Astro + TypeScript 严格检查 |

## 7. 环境

- Node.js 20+（已使用 nvm 安装）
- pnpm 9（通过 `corepack enable` 激活）
- 推荐 VS Code + Astro 扩展

## 8. 相关文档

- 部署与维护：[DEPLOY.md](DEPLOY.md)
- 设计规范：[docs/superpowers/specs/2026-05-04-personal-blog-design.md](docs/superpowers/specs/2026-05-04-personal-blog-design.md)
- 实施计划：[docs/superpowers/plans/2026-05-04-personal-blog-implementation.md](docs/superpowers/plans/2026-05-04-personal-blog-implementation.md)
- 原始需求：[documents/task.md](documents/task.md)
