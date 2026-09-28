import { Easing, interpolate, spring, SpringConfig } from "remotion";

export const FPS = 30;

// Entrada con anticipación y overshoot leve.
export const POP: Partial<SpringConfig> = { damping: 11, stiffness: 140, mass: 0.8 };
// Asentamiento suave, sin rebote visible.
export const SETTLE: Partial<SpringConfig> = { damping: 20, stiffness: 90 };

export const pop = (frame: number, start: number, config = POP) =>
  spring({ frame: frame - start, fps: FPS, config });

export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

export const range = (
  frame: number,
  [a, b]: [number, number],
  [from, to]: [number, number],
  easing: (t: number) => number = easeInOut,
) =>
  interpolate(frame, [a, b], [from, to], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Vida mínima: oscilación periódica en frames.
export const osc = (frame: number, period: number, amp = 1, phase = 0) =>
  Math.sin(((frame + phase) / period) * Math.PI * 2) * amp;

// Parpadeo natural: devuelve 0 (abierto) a 1 (cerrado).
export const blink = (frame: number, every = 96, offset = 0) => {
  const t = (frame + offset) % every;
  if (t > 5) return 0;
  return t <= 2 ? t / 2 : (5 - t) / 3;
};

// Anticipación: pequeño retroceso antes de un movimiento hacia `to`.
export const anticipate = (frame: number, start: number, dur: number, from: number, to: number) => {
  const back = from - (to - from) * 0.12;
  if (frame < start) return from;
  const mid = start + dur * 0.3;
  if (frame < mid) return range(frame, [start, mid], [from, back], easeInOut);
  return from + (to - from) * pop(frame, mid) + (back - from) * (1 - pop(frame, mid));
};
