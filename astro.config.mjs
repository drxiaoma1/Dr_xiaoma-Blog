import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// 部署到 GitHub Pages 时按需修改 site / base，详见 DEPLOY.md
export default defineConfig({
  site: 'https://drxiaoma1.github.io',
  base: '/Dr_xiaoma-Blog/',
  integrations: [tailwind({ applyBaseStyles: false }), sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-light', wrap: true },
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'append' }]],
  },
});
