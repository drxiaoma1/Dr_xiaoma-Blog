# 个人静态博客 设计规范

日期：2026-05-04
状态：已批准方案，进入实施

## 1. 概述

构建浅色系、现代简约风格的个人静态博客，使用 Astro 构建，部署到 GitHub Pages。支持 Markdown 文章发布、全文检索、可切换头像，以及页面加载伪进度条动效。

## 2. 目标 / 非目标

**目标**
- 个人主页：教育 / 项目 / 爱好 / 联系方式 + 可切换头像
- 文章发布：作者写 Markdown，访客浏览与分享，不可修改
- 全文检索：按关键词搜索文章内容
- 加载伪进度条：页面进入时自然过渡
- GitHub Pages 一键部署

**非目标**
- 后端 / 数据库 / 评论
- 深色模式（需求明确浅色系）
- 登录 / 注册 / 多作者
- 多语言（默认中文）

## 3. 技术决策

| 项 | 选择 | 说明 |
|---|---|---|
| 框架 | Astro 5 + TypeScript | 静态产物、原生 MD、组件化 |
| 样式 | Tailwind CSS | 浅色主题、快速实现现代简约风 |
| 内容 | Astro Content Collections | 类型安全的 frontmatter |
| 搜索 | Pagefind | 构建期索引、客户端静态加载 |
| 部署 | GitHub Actions + `withastro/action@v3` | 推送到 main 自动部署 |
| 包管理 | pnpm | 性能与一致性 |

## 4. 目录结构（资源路径骨架）

```
Eng_Demo/
├── CLAUDE.md                          # 项目规范
├── README.md                          # 快速开始
├── DEPLOY.md                          # 部署与维护指南
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
├── .github/workflows/deploy.yml       # 自动部署
├── public/
│   ├── avatars/current.png            # 当前头像（作者替换）
│   └── favicon.svg
├── src/
│   ├── layouts/BaseLayout.astro
│   ├── components/
│   │   ├── LoadingBar.astro           # 顶部伪进度条
│   │   ├── Nav.astro / Footer.astro
│   │   ├── Hero.astro
│   │   ├── InfoSection.astro          # 教育/项目/爱好/联系方式 分区
│   │   ├── ArticleCard.astro
│   │   ├── SearchBox.astro            # Pagefind 客户端
│   │   └── AvatarCropper.astro        # Canvas 圆形切割
│   ├── content/
│   │   ├── config.ts                  # Collection schema
│   │   └── blog/*.md                  # 文章
│   ├── data/profile.ts                # 个人信息（留空占位）
│   ├── pages/
│   │   ├── index.astro                # /
│   │   ├── blog/index.astro           # /blog
│   │   ├── blog/[...slug].astro       # /blog/<slug>
│   │   ├── avatar.astro               # /avatar
│   │   └── 404.astro
│   └── styles/globals.css
└── documents/task.md
```

## 5. 路由

| 路径 | 说明 |
|---|---|
| `/` | 个人主页 |
| `/blog` | 文章列表 + 搜索 |
| `/blog/<slug>` | 文章详情 |
| `/avatar` | 头像切割工具（供作者使用） |
| 404 | 友好兜底 |

## 6. 关键组件

### 6.1 LoadingBar
- 顶部固定 2px 细线，主色渐进填充
- 启动：`load` 0% → 300ms 内冲至 70% → `DOMContentLoaded` / `astro:page-load` 后冲至 100% → 200ms 淡出
- 伴随内容淡入：`opacity 0 → 1`、`translateY 8px → 0`，300ms `ease-out`
- 纯原生 JS，不引 `nprogress`

### 6.2 Hero（主页）
- 圆形头像（来自 `public/avatars/current.png`）+ 姓名 + 一句话简介
- 响应式：移动端头像上姓名下

### 6.3 InfoSection（主页）
- 四块网格：教育经历、项目经历、个人爱好、联系方式
- 数据来自 `src/data/profile.ts`，内容留空占位结构

### 6.4 ArticleCard / 文章列表
- 卡片：标题、日期、摘要、标签
- Content Collection 按日期倒序
- `draft: true` 不出现在生产构建

### 6.5 文章详情
- 渲染 MD（`@astrojs/markdown-remark` 默认，代码高亮用 Shiki）
- 目录（TOC）从 H2/H3 生成
- 分享按钮：复制链接 + Web Share API（若支持）

### 6.6 SearchBox
- 构建后运行 `pagefind --site dist`
- 客户端懒加载 `/pagefind/pagefind.js`
- 仅索引 `/blog/` 路径
- 中文：配置 `language: "zh"`

### 6.7 AvatarCropper（`/avatar`）
- 上传图片 → Canvas 绘制 → 圆形蒙版 → 拖动/缩放 → 导出 PNG 下载
- 页面给出"下载后覆盖 `public/avatars/current.png` 并提交"的操作指引
- 纯客户端，不写 localStorage

## 7. 数据模型

### 7.1 文章 frontmatter
```ts
// src/content/config.ts
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});
```

### 7.2 个人资料占位
```ts
// src/data/profile.ts
export const profile = {
  name: '',
  bio: '',
  avatar: '/avatars/current.png',
  education: [] as { school: string; degree: string; period: string; detail: string }[],
  projects: [] as { name: string; description: string; link?: string; period: string }[],
  hobbies: [] as string[],
  contacts: [] as { type: string; value: string; link?: string }[],
};
```

## 8. 样式

- 背景 `#f8fafc`，文字 `#0f172a`，主色 `#2563eb`（或 slate/teal 可选）
- 字体：系统栈（`-apple-system, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif`）
- 容器宽度 `max-w-3xl`（文章）/ `max-w-5xl`（列表）
- 阴影克制，圆角 `rounded-2xl`，间距充足

## 9. 构建 / 部署

- `pnpm dev` 本地预览
- `pnpm build` → `astro build` → `pagefind --site dist`
- Actions：
  - 触发：`push` 到 `main`
  - 步骤：setup node → pnpm install → build（含 pagefind）→ `actions/deploy-pages@v4`
- `astro.config.mjs` 中 `site` 与 `base`：以占位形式给出并在 DEPLOY.md 说明替换方式

## 10. 维护流程（进入 DEPLOY.md）

1. **首次**：创建仓库 → 推送 → Settings → Pages → Source: GitHub Actions
2. **新增文章**：复制 `src/content/blog/_template.md` → 改 frontmatter → 写正文 → `git commit & push`
3. **切换头像**：访问 `/avatar` 上传裁切 → 下载 PNG → 覆盖 `public/avatars/current.png` → 提交
4. **自定义域名**：仓库根增 `public/CNAME`，在 DNS 配置

## 11. 错误处理

- 404 页面友好文案与返回首页链接
- 搜索无结果空状态
- 图片 `onerror` fallback 到默认头像
- 草稿 `draft: true` 不列出

## 12. 风险与缓解

| 风险 | 缓解 |
|---|---|
| Pagefind 中文分词效果 | 配置 `language: zh`；保底可切 Fuse.js |
| GH Pages base path | 在 `astro.config.mjs` 使用 `import.meta.env.BASE_URL` 并在 DEPLOY.md 明确替换步骤 |
| 首次构建失败 | Actions workflow 打印详细日志；README 给出常见问题 |

## 13. 验收

- [ ] 本地 `pnpm dev` 四个路由均可访问
- [ ] `pnpm build` 成功并生成 Pagefind 索引
- [ ] 加载动效不引起内容跳动
- [ ] 任意浏览器可在 `/avatar` 完整走完切割流程
- [ ] DEPLOY.md 步骤可独立走通
- [ ] CLAUDE.md 明确框架与资源路径约束
