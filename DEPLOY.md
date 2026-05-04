# 部署与维护指南

本指南覆盖：首次部署到 GitHub Pages、日常写文章、切换头像、自定义域名、常见问题。

---

## 一、首次部署到 GitHub Pages

### 1. 推送到 GitHub

```bash
cd Eng_Demo
git init
git add -A
git commit -m "chore: initial blog"
# 在 GitHub 新建一个空仓库（不要勾选 README/License）
git remote add origin git@github.com:<your-name>/<repo-name>.git
git branch -M main
git push -u origin main
```

### 2. 修改 `astro.config.mjs`

打开根目录的 `astro.config.mjs`，修改 `site` 和 `base`：

- **仓库名是 `<your-name>.github.io`**（用户主页）：
  ```js
  site: 'https://<your-name>.github.io',
  base: '/',
  ```

- **仓库名是任意其它名称如 `blog`**（项目页）：
  ```js
  site: 'https://<your-name>.github.io',
  base: '/blog/',
  ```

> 项目内所有链接已经通过 `src/utils/url.ts` 统一处理 base，只需在此一处修改即可。

### 3. 开启 GitHub Pages

仓库页面：**Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。

### 4. 触发首次部署

```bash
git add astro.config.mjs
git commit -m "chore: configure deployment"
git push
```

Actions 自动跑 `.github/workflows/deploy.yml`。绿色勾 ✓ 后访问你的站点：

- 用户主页：`https://<your-name>.github.io/`
- 项目页：`https://<your-name>.github.io/<repo-name>/`

---

## 二、自定义域名（可选）

1. 在 `public/` 目录新建 `CNAME` 文件，内容一行写域名：

   ```
   blog.example.com
   ```

2. DNS 服务商配置 CNAME 记录指向 `<your-name>.github.io`
3. 仓库 **Settings → Pages → Custom domain** 填入域名并勾选 **Enforce HTTPS**
4. 把 `astro.config.mjs` 的 `site` 改为自定义域名，`base` 改为 `'/'`，提交

---

## 三、写新文章

1. 复制模板：

   ```bash
   cp src/content/blog/_template.md src/content/blog/my-first-post.md
   ```

2. 编辑 frontmatter：

   ```yaml
   ---
   title: 我的第一篇文章
   date: 2026-05-10
   summary: 一段显示在列表中的摘要（30~60 字左右最佳）
   tags: [随笔, 旅行]
   draft: false
   ---
   ```

3. **标签自定义**：`tags: [...]` 是任意字符串数组，写什么都可以。同名标签会在 `/tags` 页自动累计计数；草稿（`draft: true`）的标签不参与统计。
4. 正文使用标准 Markdown；支持代码块、引用、标题、列表、图片、链接等
5. 图片放到 `public/images/<post-slug>/` 下，Markdown 里用 `![alt](/images/<post-slug>/xxx.jpg)` 引用
6. 本地预览：

   ```bash
   pnpm dev
   ```

   打开 `http://localhost:4321/blog/my-first-post` 检查样式
7. 提交并推送：

   ```bash
   git add src/content/blog/my-first-post.md
   git commit -m "post: my first post"
   git push
   ```

   几分钟后自动部署完成

### 关于 draft

文章 frontmatter 里 `draft: true` 会被构建跳过，不出现在列表和详情页。写到一半可以先 commit 占位。

---

## 四、切换头像

1. 准备一张正方形的图片（推荐 512×512，主体居中；任何主流位图格式即可）
2. 用本地图片处理工具裁出圆形外接的方形并保存为 `current.png`
3. 用新文件覆盖仓库里的 `public/avatars/current.png`：

   ```bash
   mv ~/Downloads/current.png public/avatars/current.png
   ```

4. 提交并推送：

   ```bash
   git add public/avatars/current.png
   git commit -m "chore: update avatar"
   git push
   ```

> 站点会自动把 PNG 用 CSS 渲染成圆形，所以图片本身只需是正方形即可。

### 首次还没有 current.png 时

仓库里默认是 `current.svg` 兜底图。第一次提交 `current.png` 后，前端会自动优先使用 PNG。

---

## 五、修改个人信息

打开 `src/data/profile.ts`，填写对应字段：

```ts
export const profile = {
  name: '张三',
  handle: 'zhangsan',
  location: '上海 · 中国',
  bio: '……',
  tagline: 'Writer · Engineer · Wanderer',
  // ...
  education: [
    { school: '某大学', degree: '计算机 · 学士', period: '2018 — 2022', detail: '...' },
  ],
  projects: [
    { name: '项目 A', description: '...', period: '2024', link: 'https://...' },
  ],
  hobbies: ['阅读', '骑行', '胶片摄影'],
  contacts: [
    { type: 'Email', value: 'me@example.com', link: 'mailto:me@example.com' },
    { type: 'GitHub', value: '@zhangsan', link: 'https://github.com/zhangsan' },
  ],
};
```

空数组会自动显示"暂未填写"占位。

---

## 六、常见问题

| 现象 | 排查 |
|---|---|
| Actions 构建失败 `ERR_PNPM_OUTDATED_LOCKFILE` | 本地重跑 `pnpm install` 后再提交 `pnpm-lock.yaml` |
| 页面样式丢失或链接 404 | 检查 `astro.config.mjs` 的 `base` 是否与仓库名匹配（项目页需 `/<repo-name>/`） |
| 本地搜索框提示"索引尚未生成" | 这是正常的，`pnpm dev` 下没有 Pagefind；用 `pnpm build && pnpm preview` 验证 |
| 加了文章列表不显示 | 检查 frontmatter 是否正确、`draft` 是否为 `false`、日期格式是否 `YYYY-MM-DD` |
| 头像切换后没变 | 清缓存或硬刷新（Ctrl+Shift+R），或确认 `public/avatars/current.png` 确实已被覆盖并 push |
| Actions 日志里 Node 版本不对 | workflow 固定 Node 20，不需改；若本地用的是其他版本可能 lockfile 格式略有差异 |

---

## 七、命令速查

| 命令 | 说明 |
|---|---|
| `pnpm dev` | 本地开发 |
| `pnpm build` | 生产构建 + Pagefind 索引 |
| `pnpm preview` | 本机预览构建产物 |
| `pnpm typecheck` | TypeScript 与 Astro 类型检查 |

---

## 八、删除一篇文章

直接删除 `src/content/blog/<slug>.md`，提交推送即可。如果不想删只是暂时隐藏，把 frontmatter 的 `draft` 改成 `true`。
