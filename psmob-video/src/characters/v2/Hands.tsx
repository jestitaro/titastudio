import React from "react";
import { angleDeg, Pt, sub } from "./geometry";
import { Palette, Variant } from "./types";

// Manos diseñadas por gesto. Espacio local: muñeca en (0,0), dedos hacia −y.
// Proporción: largo total ≈ 0,45 de la altura de cabeza. Pulgar con volumen propio,
// separación de dedos en tono de piel oscuro; en B se suman nudillos y pliegue del pulgar.

const Finger: React.FC<{ a: Pt; b: Pt; w: number; fill: string }> = ({ a, b, w, fill }) => (
  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={fill} strokeWidth={w} strokeLinecap="round" />
);

// Dorso de la mano abierto (ej. apoyada en la frente). Pulgar a la izquierda local.
const OpenBack: React.FC<{ pal: Palette; variant: Variant }> = ({ pal, variant }) => (
  <g>
    <path d="M-22,4 C-27,-16 -30,-38 -28,-58 C-20,-64 18,-66 28,-60 C31,-40 28,-16 20,4 Z" fill={pal.skin} />
    <Finger a={{ x: -20, y: -56 }} b={{ x: -27, y: -100 }} w={15} fill={pal.skin} />
    <Finger a={{ x: -6, y: -60 }} b={{ x: -7, y: -110 }} w={15.5} fill={pal.skin} />
    <Finger a={{ x: 8, y: -60 }} b={{ x: 11, y: -106 }} w={15} fill={pal.skin} />
    <Finger a={{ x: 20, y: -55 }} b={{ x: 28, y: -90 }} w={13} fill={pal.skin} />
    <path d="M-24,-14 C-36,-24 -46,-38 -50,-52 C-52,-60 -44,-64 -38,-58 C-32,-48 -24,-38 -16,-32 Z" fill={pal.skin} />
    <g stroke={pal.skinLine} strokeWidth={2.6} strokeLinecap="round" fill="none">
      <path d="M-13,-62 L-15,-84" />
      <path d="M1,-63 L2,-86" />
      <path d="M15,-60 L19,-80" />
      {variant === "B" && (
        <>
          <path d="M-24,-58 Q-19,-62 -14,-58 M-12,-62 Q-6,-66 0,-62 M3,-62 Q9,-65 15,-61 M16,-58 Q21,-60 25,-56" />
          <path d="M-30,-30 Q-26,-36 -20,-36" />
        </>
      )}
    </g>
  </g>
);

// Mano relajada colgando, vista lateral con dedos apenas curvados.
const Relaxed: React.FC<{ pal: Palette; variant: Variant }> = ({ pal, variant }) => (
  <g>
    <path d="M-20,2 C-24,-20 -24,-44 -20,-62 C-16,-82 -8,-100 4,-104 C14,-106 22,-96 24,-82 C26,-64 26,-40 22,-18 L18,2 Z" fill={pal.skin} />
    <path d="M-18,-26 C-30,-34 -36,-50 -32,-64 C-30,-70 -22,-70 -20,-62 C-18,-52 -16,-44 -12,-38 Z" fill={pal.skin} />
    <g stroke={pal.skinLine} strokeWidth={2.6} strokeLinecap="round" fill="none">
      <path d="M2,-100 C3,-92 4,-86 4,-80" />
      <path d="M12,-98 C14,-90 15,-84 15,-78" />
      <path d="M20,-90 C21,-84 22,-80 22,-76" />
      {variant === "B" && <path d="M-20,-40 Q-15,-46 -9,-45" />}
    </g>
  </g>
);

export const Hand: React.FC<{
  kind: "openBack" | "relaxed";
  at: Pt;
  from: Pt; // codo: define la dirección del antebrazo
  pal: Palette;
  variant: Variant;
  flip?: boolean;
  rotate?: number;
  scale?: number;
}> = ({ kind, at, from, pal, variant, flip = false, rotate = 0, scale = 1 }) => {
  const dir = angleDeg(sub(at, from)) + 90 + rotate;
  return (
    <g transform={`translate(${at.x},${at.y}) rotate(${dir}) scale(${(flip ? -scale : scale) * 1.12},${scale * 1.12})`}>
      {kind === "openBack" ? <OpenBack pal={pal} variant={variant} /> : <Relaxed pal={pal} variant={variant} />}
    </g>
  );
};

// Celular sostenido: dorso del teléfono hacia cámara + dedos que lo envuelven.
export const Phone: React.FC<{ c: Pt; rot: number; w?: number; h?: number; glow?: number; children?: React.ReactNode }> = ({
  c,
  rot,
  w = 72,
  h = 136,
  glow = 0,
  children,
}) => (
  <g transform={`translate(${c.x},${c.y}) rotate(${rot})`}>
    {glow > 0 && <rect x={-w / 2 - 10} y={-h / 2 - 10} width={w + 20} height={h + 20} rx={22} fill="#3C9FF1" opacity={0.25 * glow} />}
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill="#263238" />
    <rect x={-w / 2 + 5} y={-h / 2 + 5} width={w - 10} height={h - 10} rx={9} fill="#37474F" />
    <circle cx={-w / 2 + 16} cy={-h / 2 + 16} r={6} fill="#263238" />
    <circle cx={-w / 2 + 16} cy={-h / 2 + 16} r={2.5} fill="#455A64" />
    {children}
  </g>
);

// Mano que sostiene el celular desde un costado: talón de la palma fuera del borde,
// dedos afinados que envuelven el dorso y se acortan hacia el meñique. side: −1 izq, 1 der.
export const WrapFingers: React.FC<{ side: -1 | 1; y0: number; w: number; pal: Palette; variant: Variant; count?: number }> = ({
  side,
  y0,
  w,
  pal,
  variant,
  count = 4,
}) => {
  const edge = (w / 2) * side;
  const lens = [26, 29, 26, 20].slice(0, count);
  return (
    <g>
      <path
        d={`M${edge - 4 * side},${y0 - 12} C${edge + 26 * side},${y0 - 6} ${edge + 30 * side},${y0 + 54} ${edge + 4 * side},${y0 + 70} L${edge - 6 * side},${y0 + 62} Z`}
        fill={pal.skin}
      />
      {lens.map((l, i) => {
        const y = y0 + i * 14;
        const x0 = edge + 4 * side;
        const x1 = edge - l * side;
        return (
          <path
            key={i}
            d={`M${x0},${y - 6} L${x1 + 6 * side},${y - 5} Q${x1 - 1 * side},${y} ${x1 + 6 * side},${y + 6} L${x0},${y + 7} Z`}
            fill={pal.skin}
          />
        );
      })}
      <g stroke={pal.skinLine} strokeWidth={2.2} strokeLinecap="round">
        {lens.slice(1).map((l, i) => {
          const y = y0 + (i + 1) * 14 - 7;
          return <line key={i} x1={edge - 2 * side} y1={y} x2={edge - (l - 8) * side} y2={y + 1} />;
        })}
        {variant === "B" && <path d={`M${edge + 14 * side},${y0 + 8} Q${edge + 20 * side},${y0 + 24} ${edge + 16 * side},${y0 + 40}`} fill="none" />}
      </g>
    </g>
  );
};
