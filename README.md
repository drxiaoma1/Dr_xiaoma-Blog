# 个人博客（Eng_Demo）— Dr_xiaoma's Blog

浅色系、编辑杂志体风格的 Astro 静态博客。作者：**马铭康（化名 Dr_xiaoma）**。主页展示个人信息，博客区发布 Markdown 文章并支持全文搜索，标签页归档全部文章关键词。

## 快速开始

```bash
# 1. 准备环境（若尚未安装 Node.js）
#    已通过 nvm 安装 Node 20 + pnpm 9

# 2. 安装依赖并启动
pnpm install
pnpm dev            # http://localhost:4321
```

## 写一篇文章

1. 复制模板：

   ```bash
   cp src/content/blog/_template.md src/content/blog/<slug>.md
   ```

2. 修改 frontmatter 与正文，把 `draft` 改为 `false`
3. **标签**：`tags: [...]` 字段是任意字符串数组，可自由命名（中英符号都可）。同名标签会在 `/tags` 页累计计数。
4. 本地 `pnpm dev` 检查样式，`git commit && git push` → Actions 自动部署

## 切换头像

直接用新图片覆盖 `public/avatars/current.png`（推荐 512×512，圆形露出主体），然后 `git commit && git push` 即生效。

## 部署

详见 [DEPLOY.md](DEPLOY.md)。

## 目录速览

- [CLAUDE.md](CLAUDE.md) — 项目规范与资源路径
- `src/pages/` — 路由
- `src/content/blog/` — 文章源
- `src/data/profile.ts` — 个人信息
- `src/components/` — 复用组件
