import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { W, H } from "../lib/stage";

// Wipe geométrico con triángulos redondeados (eco del isotipo QuartzSales).
// Cubre en diagonal (abajo-izq → arriba-der) y descubre en el mismo sentido.
const SIDE = 150;
const TH = (SIDE * Math.sqrt(3)) / 2;
const COLS = Math.ceil(W / (SIDE / 2)) + 3;
const ROWS = Math.ceil(H / TH) + 2;

const lerpColor = (t: number) => {
  // #3C9FF1 → #463DE1 → #7025E0
  const a = [60, 159, 241];
  const b = [70, 61, 225];
  const c = [112, 37, 224];
  const [p, q, k] = t < 0.5 ? [a, b, t * 2] : [b, c, (t - 0.5) * 2];
  return `rgb(${p.map((v, i) => Math.round(v + (q[i] - v) * k)).join(",")})`;
};

export const TriangleWipe: React.FC<{ cover: number }> = ({ cover }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const tris: React.ReactNode[] = [];
  const span = 10; // frames de retardo entre la primera y la última diagonal
  for (let r = -1; r < ROWS; r++) {
    for (let c = -2; c < COLS; c++) {
      const up = (r + c) % 2 === 0;
      const cx = c * (SIDE / 2);
      const cy = r * TH + TH / 2;
      const d = (cx / W) * 0.6 + (1 - cy / H) * 0.4; // 0 abajo-izq, 1 arriba-der
      const delay = d * span;
      const sIn = interpolate(f, [delay, delay + cover - span + 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const sOut = interpolate(f, [cover + delay, cover + delay + (durationInFrames - cover - span)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const s = (sIn * (1 - sOut)) * 1.08;
      if (s <= 0.001) continue;
      const pts = up
        ? `${cx},${cy - TH / 2} ${cx + SIDE / 2},${cy + TH / 2} ${cx - SIDE / 2},${cy + TH / 2}`
        : `${cx},${cy + TH / 2} ${cx + SIDE / 2},${cy - TH / 2} ${cx - SIDE / 2},${cy - TH / 2}`;
      tris.push(
        <polygon
          key={`${r}-${c}`}
          points={pts}
          fill={lerpColor(Math.min(1, Math.max(0, d)))}
          stroke={lerpColor(Math.min(1, Math.max(0, d)))}
          strokeWidth={1.5}
          strokeLinejoin="round"
          transform={`translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`}
        />,
      );
    }
  }
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        {tris}
      </svg>
    </AbsoluteFill>
  );
};
