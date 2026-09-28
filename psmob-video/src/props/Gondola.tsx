import React from "react";
import { ink, LINE_W } from "../design/illustration";
import { roboto } from "../design/fonts";

// Supermercado en tres planos. Paleta lavanda de escenas.zip (Escena-3/Escena-4)
// con productos flat en gramática pana (planos + línea fina #263238).

export const aisle = {
  wall: "#B7A7EC",
  wallDeep: "#9C89E0",
  back: "#8C78D8",
  shelf: "#6F5BC9",
  shelfEdge: "#5A46B4",
  rail: "#F5F5F5",
  floor: "#7F6AD0",
  ghost: "rgba(255,255,255,0.16)",
} as const;

export type ProductKind = "powder" | "wash" | "ketchup" | "mayo";

export const PRODUCT_SIZE: Record<ProductKind, { w: number; h: number }> = {
  powder: { w: 104, h: 150 },
  wash: { w: 86, h: 168 },
  ketchup: { w: 62, h: 140 },
  mayo: { w: 70, h: 120 },
};

// Producto con origen en su base centrada.
export const Product: React.FC<{ kind: ProductKind; x: number; y: number }> = ({ kind, x, y }) => {
  const { w, h } = PRODUCT_SIZE[kind];
  return (
    <g transform={`translate(${x - w / 2},${y - h})`}>
      {kind === "powder" && (
        <>
          <rect width={w} height={h} rx={4} fill={ink.grey100} />
          <rect width={w} height={30} rx={4} fill="#3C9FF1" />
          <circle cx={w / 2} cy={84} r={30} fill="#3C9FF1" opacity={0.85} />
          <rect x={14} y={40} width={w - 28} height={16} rx={3} fill="#1976D2" />
          <text x={w / 2} y={52} textAnchor="middle" fontFamily={roboto} fontWeight={700} fontSize={12} fill="#FFFFFF">
            POWDER
          </text>
          <rect width={w} height={h} rx={4} fill="none" stroke={ink.line} strokeWidth={LINE_W * 0.6} />
        </>
      )}
      {kind === "wash" && (
        <>
          <rect x={w / 2 - 14} y={0} width={28} height={20} rx={4} fill={ink.skinShade} />
          <path
            d={`M${w / 2 - 20},20 L${w / 2 + 20},20 C${w},34 ${w},46 ${w},64 L${w},${h - 8} Q${w},${h} ${w - 8},${h} L8,${h} Q0,${h} 0,${h - 8} L0,64 C0,46 0,34 ${w / 2 - 20},20 Z`}
            fill={ink.purple}
          />
          <ellipse cx={w / 2} cy={104} rx={w / 2 - 10} ry={30} fill={ink.white} />
          <text x={w / 2} y={100} textAnchor="middle" fontFamily={roboto} fontWeight={700} fontSize={12} fill={ink.purple}>
            ULTRA
          </text>
          <text x={w / 2} y={114} textAnchor="middle" fontFamily={roboto} fontWeight={700} fontSize={12} fill={ink.purple}>
            WASH
          </text>
          <path d={`M10,70 L10,${h - 16}`} stroke={ink.white} strokeWidth={5} strokeLinecap="round" opacity={0.35} />
        </>
      )}
      {kind === "ketchup" && (
        <>
          <rect x={w / 2 - 12} y={0} width={24} height={22} rx={5} fill={ink.white} />
          <path
            d={`M${w / 2 - 14},22 L${w / 2 + 14},22 C${w},40 ${w},60 ${w},80 L${w},${h - 8} Q${w},${h} ${w - 8},${h} L8,${h} Q0,${h} 0,${h - 8} L0,80 C0,60 0,40 ${w / 2 - 14},22 Z`}
            fill="#F4511E"
          />
          <rect x={6} y={78} width={w - 12} height={34} rx={4} fill={ink.white} />
          <circle cx={w / 2} cy={95} r={10} fill="#F4511E" />
        </>
      )}
      {kind === "mayo" && (
        <>
          <rect x={4} y={0} width={w - 8} height={20} rx={4} fill="#3C9FF1" />
          <rect x={0} y={18} width={w} height={h - 18} rx={10} fill="#FFE08A" />
          <rect x={6} y={50} width={w - 12} height={40} rx={4} fill={ink.white} />
          <path d={`M14,70 L${w - 14},70`} stroke="#F4511E" strokeWidth={6} strokeLinecap="round" />
        </>
      )}
    </g>
  );
};

export type Slot = { kind: ProductKind | null; x: number; shelf: number; price?: string };

export const SHELF_Y = [330, 560, 790, 1020];

// Góndola principal (plano medio). Ancho de mundo: 2200px.
export const Gondola: React.FC<{ slots: Slot[]; width: number }> = ({ slots, width }) => (
  <g>
    <rect x={0} y={60} width={width} height={1100} fill={aisle.back} />
    <rect x={0} y={1060} width={width} height={120} fill={aisle.shelfEdge} />
    <rect x={0} y={10} width={width} height={60} rx={6} fill={aisle.shelfEdge} />
    {[0, width / 2, width - 20].map((x) => (
      <rect key={x} x={x} y={10} width={20} height={1170} fill={aisle.shelfEdge} />
    ))}
    {slots.map((s, i) =>
      s.kind ? <Product key={i} kind={s.kind} x={s.x} y={SHELF_Y[s.shelf]} /> : null,
    )}
    {SHELF_Y.map((y) => (
      <g key={y}>
        <rect x={0} y={y} width={width} height={24} fill={aisle.shelf} />
        <rect x={0} y={y + 24} width={width} height={20} fill={aisle.rail} />
      </g>
    ))}
    {/* etiquetas de precio sobre el riel */}
    {slots.map((s, i) =>
      s.price ? (
        <g key={`p${i}`} transform={`translate(${s.x - 34},${SHELF_Y[s.shelf] + 22})`}>
          <rect width={68} height={24} rx={3} fill="#FFFFFF" stroke={ink.line} strokeWidth={1.2} />
          <text x={34} y={17} textAnchor="middle" fontFamily={roboto} fontWeight={700} fontSize={13} fill={ink.line}>
            {s.price.replace(",00", "")}
          </text>
        </g>
      ) : null,
    )}
  </g>
);

// Pasillo del fondo: siluetas translúcidas de botellas (tratamiento Escena-3).
export const BackAisle: React.FC = () => (
  <svg viewBox="0 0 2400 1080" width="100%" height="100%" preserveAspectRatio="xMinYMin slice">
    <rect width={2400} height={1080} fill={aisle.wall} />
    {[180, 400, 620, 840].map((y) => (
      <g key={y}>
        {Array.from({ length: 34 }).map((_, i) => {
          const x = 20 + i * 70;
          const h = 90 + ((i * 37) % 50);
          return (
            <path
              key={i}
              d={`M${x + 16},${y - h} h20 v18 c14,10 18,22 18,36 v${h - 58} q0,4 -4,4 h-48 q-4,0 -4,-4 v${h - 58} c0,-14 4,-26 18,-36 Z`}
              fill={aisle.ghost}
            />
          );
        })}
        <rect x={0} y={y} width={2400} height={18} fill={aisle.wallDeep} />
      </g>
    ))}
    <rect x={0} y={760} width={2400} height={320} fill={aisle.floor} />
    <rect x={0} y={760} width={2400} height={10} fill={aisle.wallDeep} />
  </svg>
);
