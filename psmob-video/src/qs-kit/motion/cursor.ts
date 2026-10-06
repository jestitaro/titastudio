// Motor de cursor. Cada video define tramos, clicks y zonas de mano/I-beam; el motor
// calcula posición (con arco y frenado antes del target), hundimiento y onda de click.
import { clamp, easeCursor, easeOutCubic, lerp, progress } from "./easing";
import type { Pt } from "./viewport";

export type CursorMove = { span: readonly [number, number]; to: Pt; arc?: number };
export type CursorSpec = {
  start: Pt;
  moves: CursorMove[];
  clicks: number[];
  pointer?: [number, number][]; // tramos con mano (sobre algo clickeable)
  text?: [number, number][]; // tramos con I-beam (sobre inputs)
  fadeIn: number; // frame en que aparece
  fadeOut?: number; // frame en que termina de desaparecer
};

export type CursorState = {
  x: number;
  y: number;
  opacity: number;
  press: number; // 0..1 hundimiento del click
  ring: number; // 0..1 onda del click
  kind: "arrow" | "pointer" | "text";
};

const inAny = (f: number, ranges: [number, number][] = []) => ranges.some(([a, b]) => f >= a && f <= b);

export const makeCursor = (spec: CursorSpec) => (frame: number): CursorState => {
  let pos: Pt = spec.start;
  for (const m of spec.moves) {
    const [a, b] = m.span;
    if (frame <= a) break;
    const from = pos;
    const t = progress(frame, a, b, easeCursor);
    // Arco: desplazamiento perpendicular proporcional a la distancia.
    const dx = m.to[0] - from[0];
    const dy = m.to[1] - from[1];
    const bow = Math.sin(Math.PI * t) * (m.arc ?? 0);
    pos = [lerp(from[0], m.to[0], t) - dy * bow, lerp(from[1], m.to[1], t) + dx * bow];
    if (frame < b) break;
    pos = m.to;
  }

  let press = 0;
  let ring = 0;
  for (const c of spec.clicks) {
    if (frame >= c - 4 && frame <= c + 10) {
      press = frame < c ? progress(frame, c - 4, c, easeOutCubic) : 1 - progress(frame, c, c + 10, easeOutCubic);
    }
    if (frame >= c && frame <= c + 22) ring = clamp((frame - c) / 22);
  }

  const out = spec.fadeOut === undefined ? 0 : progress(frame, spec.fadeOut - 22, spec.fadeOut, easeOutCubic);
  return {
    x: pos[0],
    y: pos[1],
    opacity: progress(frame, spec.fadeIn, spec.fadeIn + 14, easeOutCubic) * (1 - out),
    press,
    ring,
    kind: inAny(frame, spec.pointer) ? "pointer" : inAny(frame, spec.text) ? "text" : "arrow",
  };
};
