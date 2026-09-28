import React from "react";
import { angleDeg, Pt, sub } from "../v2/geometry";
import { Skin } from "./types";

// Manos por gesto. Espacio local: muñeca en (0,0), dedos hacia −y.
// Sin contornos: volumen con un tono de sombra y pliegues en tono profundo.

const Cap: React.FC<{ a: Pt; b: Pt; w: number; c: string }> = ({ a, b, w, c }) => (
  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={c} strokeWidth={w} strokeLinecap="round" />
);

const Relaxed: React.FC<{ s: Skin }> = ({ s }) => (
  <g>
    <path d="M-21,4 C-25,-18 -25,-44 -21,-62 C-17,-82 -8,-100 4,-104 C15,-106 23,-96 25,-82 C27,-64 27,-40 23,-18 L19,4 Z" fill={s.base} />
    <path d="M5,-104 C15,-106 23,-96 25,-82 C27,-64 27,-40 23,-18 L19,4 L10,4 C14,-30 14,-70 5,-104 Z" fill={s.shade} opacity={0.7} />
    <path d="M-19,-26 C-31,-34 -37,-50 -33,-64 C-31,-70 -23,-70 -21,-62 C-19,-52 -17,-44 -13,-38 Z" fill={s.base} />
    <g stroke={s.deep} strokeWidth={2.6} strokeLinecap="round" fill="none">
      <path d="M2,-100 C3,-92 4,-86 4,-80" />
      <path d="M12,-98 C14,-90 15,-84 15,-78" />
      <path d="M-20,-40 Q-15,-46 -9,-45" />
    </g>
  </g>
);

const Point: React.FC<{ s: Skin }> = ({ s }) => (
  <g>
    <path d="M-20,4 C-26,-14 -27,-38 -19,-52 C-12,-60 6,-62 16,-54 C27,-44 27,-18 20,4 Z" fill={s.base} />
    <Cap a={{ x: -10, y: -52 }} b={{ x: -14, y: -100 }} w={15} c={s.base} />
    <ellipse cx={17} cy={-46} rx={10} ry={9} fill={s.base} />
    <ellipse cx={20} cy={-31} rx={9.5} ry={8.5} fill={s.base} />
    <ellipse cx={19} cy={-17} rx={9} ry={8} fill={s.shade} />
    <g stroke={s.deep} strokeWidth={2.4} strokeLinecap="round" fill="none">
      <path d="M12,-38 L24,-39" />
      <path d="M13,-24 L25,-24" />
      <path d="M-4,-54 Q-9,-58 -15,-56" />
    </g>
    <Cap a={{ x: -18, y: -16 }} b={{ x: 4, y: -40 }} w={15} c={s.base} />
    <path d="M-10,-24 L0,-34" stroke={s.shade} strokeWidth={4} strokeLinecap="round" />
  </g>
);

const OnHead: React.FC<{ s: Skin }> = ({ s }) => (
  <g>
    <path d="M-22,4 C-27,-16 -30,-38 -28,-58 C-20,-64 18,-66 28,-60 C31,-40 28,-16 20,4 Z" fill={s.base} />
    <Cap a={{ x: -20, y: -56 }} b={{ x: -28, y: -98 }} w={15} c={s.base} />
    <Cap a={{ x: -6, y: -60 }} b={{ x: -8, y: -108 }} w={15.5} c={s.base} />
    <Cap a={{ x: 8, y: -60 }} b={{ x: 11, y: -104 }} w={15} c={s.base} />
    <Cap a={{ x: 20, y: -55 }} b={{ x: 28, y: -88 }} w={13} c={s.base} />
    <path d="M-24,-14 C-36,-24 -46,-38 -50,-52 C-52,-60 -44,-64 -38,-58 C-32,-48 -24,-38 -16,-32 Z" fill={s.base} />
    <path d="M6,-2 C20,-10 26,-30 28,-58 C30,-38 28,-16 20,4 Z" fill={s.shade} opacity={0.8} />
    <g stroke={s.deep} strokeWidth={2.4} strokeLinecap="round" fill="none">
      <path d="M-13,-62 L-16,-82" />
      <path d="M1,-63 L2,-86" />
      <path d="M15,-60 L19,-78" />
      <path d="M-30,-30 Q-26,-36 -20,-36" />
    </g>
  </g>
);

export const Hand: React.FC<{ kind: "relaxed" | "point" | "onHead"; at: Pt; from: Pt; s: Skin; flip?: boolean; scale?: number; rotate?: number }> = ({
  kind,
  at,
  from,
  s,
  flip = false,
  scale = 1.1,
  rotate = 0,
}) => {
  const dir = angleDeg(sub(at, from)) + 90 + rotate;
  return (
    <g transform={`translate(${at.x},${at.y}) rotate(${dir}) scale(${flip ? -scale : scale},${scale})`}>
      {kind === "relaxed" && <Relaxed s={s} />}
      {kind === "point" && <Point s={s} />}
      {kind === "onHead" && <OnHead s={s} />}
    </g>
  );
};

// Celular sostenido: la palma queda detrás del teléfono, los dedos lo envuelven por delante
// en el borde lejano y el pulgar apoya en el borde cercano.
export const HeldPhone: React.FC<{ c: Pt; rot: number; s: Skin; side: 1 | -1 }> = ({ c, rot, s, side }) => {
  const w = 74;
  const h = 140;
  const e = (w / 2) * side;
  return (
    <g transform={`translate(${c.x},${c.y}) rotate(${rot})`}>
      {/* palma detrás */}
      <path d={`M${e - 20 * side},${h / 2 - 50} C${e + 30 * side},${h / 2 - 60} ${e + 34 * side},${h / 2 + 10} ${e},${h / 2 + 22} C${-e * 0.2},${h / 2 + 30} ${-e * 0.6},${h / 2 + 10} ${-e * 0.4},${h / 2 - 16} Z`} fill={s.base} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={13} fill="#26306E" />
      <rect x={-w / 2 + 5} y={-h / 2 + 5} width={w - 10} height={h - 10} rx={10} fill="#303C86" />
      <circle cx={-w / 2 + 16} cy={-h / 2 + 16} r={4} fill="#1C2458" />
      {/* dedos que envuelven el borde */}
      {[0, 1, 2, 3].map((i) => {
        const y = -6 + i * 17;
        const l = [24, 27, 25, 19][i];
        return (
          <g key={i}>
            <line x1={e + 8 * side} y1={y} x2={e - l * side} y2={y + 3} stroke={s.base} strokeWidth={15} strokeLinecap="round" />
            {i > 0 && <line x1={e + 4 * side} y1={y - 8} x2={e - (l - 8) * side} y2={y - 6} stroke={s.deep} strokeWidth={2.2} strokeLinecap="round" />}
          </g>
        );
      })}
      {/* pulgar en el borde cercano */}
      <path d={`M${-e * 0.4},${h / 2 - 6} C${-e * 1.1},${h / 2 - 20} ${-e * 1.2},${h / 2 - 50} ${-e * 1.05},${h / 2 - 66}`} stroke={s.base} strokeWidth={16} strokeLinecap="round" fill="none" />
    </g>
  );
};
