export interface Education { school: string; degree: string; period: string; detail?: string }
export interface Project   { name: string; description: string; period?: string; link?: string }
export interface Contact   { type: string; value: string; link?: string }

export const profile = {
  name: '马铭康',
  handle: 'Dr_xiaoma',
  location: '上海 · 中国',
  bio: '热衷于游戏艺术的SJTU理工男，研究方向为CV & AI Agent，沾点二次元',
  tagline: 'Dr_xiaoma · 写作 · 工程 · 漫游',
  avatar: '/avatars/current.png',
  avatarFallback: '/avatars/current.svg',
  education: [
    {
      school: '上海交通大学',
      degree: '智能感知工程',
      period: '2022 - 2026',
      detail: '自动化与感知学院 · 本科生 · 大三'
    }
  ] as Education[],
  projects: [
    {
      name: 'Efficient 3D Human Mesh Recovery via Shortcut Score-Guided Diffusion',
      description: '独立一作，PRCV 在投',
      period: '2025'
    },
    {
      name: 'IB-Mixer: Information Bottleneck Guided Model Composition for Text-Driven Human Interaction Motion Generation',
      description: '独立一作，ACM MM 2026 在投',
      period: '2025 - 2026'
    }
  ] as Project[],
  hobbies: ['电子游戏爱好者', '独立游戏鉴赏家', '总之就是除了上课科研社交就泡在steam里'] as string[],
  contacts: [] as Contact[],
};
