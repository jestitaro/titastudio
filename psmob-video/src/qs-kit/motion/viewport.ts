// Viewport lógico compartido por todos los videos QuartzSales: la UI se diseña en
// 1600×900 y se escala ×1,2 a 1920×1080. Cursor y cámara trabajan en estas coordenadas.

export const VIEW = { w: 1600, h: 900, scale: 1.2 };

// Layout de Apollo: sidebar + topbar.
export const SHELL = { sidebarW: 208, topbarH: 64 };

export type Rect = { x: number; y: number; w: number; h: number };
export type Pt = [number, number];

export const center = (r: Rect): Pt => [r.x + r.w / 2, r.y + r.h / 2];
export const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  w: a.w + (b.w - a.w) * t,
  h: a.h + (b.h - a.h) * t,
});
