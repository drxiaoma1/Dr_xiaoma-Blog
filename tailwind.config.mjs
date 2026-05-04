import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink:    { DEFAULT: '#1a1714', soft: '#3d3835', mute: '#807872' },
        paper:  { DEFAULT: '#f4efe6', card: '#fbf8f1', edge: '#e7dfd1' },
        accent: { DEFAULT: '#7a2e1e', soft: '#f0d9cf', deep: '#5c1f12' },
      },
      fontFamily: {
        display: ['Fraunces', 'Source Han Serif SC', 'Songti SC', 'serif'],
        serif:   ['Fraunces', 'Source Han Serif SC', 'Songti SC', 'Georgia', 'serif'],
        sans:    ['"Public Sans"', '-apple-system', 'BlinkMacSystemFont', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: { prose: '42rem', wide: '64rem' },
      letterSpacing: { tightest: '-0.04em' },
    },
  },
  plugins: [typography],
};
