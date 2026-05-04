export interface Education { school: string; degree: string; period: string; detail?: string }
export interface Project   { name: string; description: string; period?: string; link?: string }
export interface Contact   { type: string; value: string; link?: string }

export const profile = {
  name: '马铭康',
  handle: 'Dr_xiaoma',
  location: '上海 · 中国',
  bio: '在这里写一句关于自己的简介——职业、热爱的事、正在探索的方向。',
  tagline: 'Dr_xiaoma · 写作 · 工程 · 漫游',
  avatar: '/avatars/current.png',
  avatarFallback: '/avatars/current.svg',
  education: [] as Education[],
  projects:  [] as Project[],
  hobbies:   [] as string[],
  contacts:  [] as Contact[],
};
