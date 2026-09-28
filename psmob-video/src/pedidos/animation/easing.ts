// Helpers de motion. Todo es función pura: mismo input → mismo output.
// Nada de estado acumulado: cualquier frame se puede calcular aislado.

export type Ease = (t: number) => number;

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const linear: Ease = (t) => t;
export const smoothstep: Ease = (t) => t * t * (3 - 2 * t);
export const easeOutCubic: Ease = (t) => 1 - Math.pow(1 - t, 3);
export const easeInCubic: Ease = (t) => t * t * t;
export const easeInOutCubic: Ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeInOutQuart: Ease = (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);
export const easeOutQuart: Ease = (t) => 1 - Math.pow(1 - t, 4);

// cubic-bezier(x1, y1, x2, y2) resuelto por Newton + bisección (igual que CSS).
export const cubicBezier = (x1: number, y1: number, x2: number, y2: number): Ease => {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const err = sx(t) - x;
      const d = dx(t);
      if (Math.abs(err) < 1e-6) return sy(t);
      if (Math.abs(d) < 1e-6) break;
      t -= err / d;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    for (let i = 0; i < 24; i++) {
      const v = sx(t);
      if (Math.abs(v - x) < 1e-6) break;
      if (v < x) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return sy(t);
  };
};

// Curva de producto: arranque firme, llegada larga (Linear/Stripe).
export const easeProduct = cubicBezier(0.22, 1, 0.36, 1);
// Desplazamiento de cursor: acelera rápido y frena mucho antes del target.
export const easeCursor = cubicBezier(0.3, 0.05, 0.12, 1);
// Cámara: simétrica y lenta en ambos extremos.
export const easeCamera = cubicBezier(0.65, 0, 0.3, 1);

// Progreso 0→1 entre dos frames, con easing opcional.
export const progress = (frame: number, start: number, end: number, ease: Ease = linear) =>
  ease(clamp((frame - start) / Math.max(1, end - start)));

// Interpola un valor entre dos frames.
export const tween = (frame: number, start: number, end: number, from: number, to: number, ease: Ease = easeInOutCubic) =>
  lerp(from, to, progress(frame, start, end, ease));

// Sube en [a,b], se mantiene y baja en [c,d]. Útil para highlights temporales.
export const pulse = (frame: number, a: number, b: number, c: number, d: number, ease: Ease = easeInOutCubic) =>
  frame < c ? progress(frame, a, b, ease) : 1 - progress(frame, c, d, ease);

// Resorte críticamente amortiguado resuelto en forma cerrada (sin integrar).
// 0 → 1 empezando en `start`; `stiffness` en 1/frames.
export const springAt = (frame: number, start: number, stiffness = 0.16, damping = 0.72) => {
  const t = frame - start;
  if (t <= 0) return 0;
  const w = stiffness;
  const z = damping;
  if (z >= 1) return 1 - Math.exp(-w * t) * (1 + w * t);
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
};

// Pulsación de botón: 1 → .96 → 1 alrededor del click.
export const pressScale = (frame: number, click: number, depth = 0.04) => {
  if (frame < click - 5 || frame > click + 16) return 1;
  if (frame < click) return 1 - depth * progress(frame, click - 5, click, easeOutCubic);
  return 1 - depth * (1 - progress(frame, click, click + 16, easeOutCubic));
};

// Keyframes numéricos genéricos: [[frame, value], ...] con easing por tramo.
export const keyframes = (frame: number, keys: readonly (readonly [number, number])[], ease: Ease = easeInOutCubic) => {
  if (frame <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [f1, v1] = keys[i];
    const [f0, v0] = keys[i - 1];
    if (frame <= f1) return lerp(v0, v1, progress(frame, f0, f1, ease));
  }
  return keys[keys.length - 1][1];
};
