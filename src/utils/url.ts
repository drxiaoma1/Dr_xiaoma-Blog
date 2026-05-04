export const base = import.meta.env.BASE_URL;
export const url = (path: string) =>
  (base + String(path).replace(/^\//, '')).replace(/\/{2,}/g, '/');
