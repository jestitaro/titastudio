import React from "react";
import { brand, ink, LINE_W } from "../design/illustration";

// Objetos del caos dibujados con la gramática pana: planos flat, grises claros,
// violeta de acento y línea fina #263238 para detalle interno.

export const ThoughtCloud: React.FC<{ papers: number }> = ({ papers }) => (
  <svg viewBox="-200 -120 400 240" width="100%" height="100%" style={{ overflow: "visible" }}>
    <g fill={ink.grey100}>
      <circle cx={-110} cy={20} r={62} />
      <circle cx={-40} cy={-40} r={78} />
      <circle cx={50} cy={-46} r={72} />
      <circle cx={120} cy={16} r={60} />
      <rect x={-150} y={10} width={300} height={78} rx={39} />
    </g>
    <circle cx={-60} cy={118} r={16} fill={ink.grey100} />
    <circle cx={-86} cy={148} r={9} fill={ink.grey100} />
    {[0, 1, 2].slice(0, papers).map((i) => (
      <g key={i} transform={`translate(${-56 + i * 46},${-18 + i * 6}) rotate(${-10 + i * 9})`}>
        <rect x={-38} y={-52} width={76} height={98} rx={4} fill={ink.white} />
        <rect x={-38} y={-52} width={76} height={98} rx={4} fill="none" stroke={ink.line} strokeWidth={LINE_W * 0.6} />
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            <path
              d={`M-26,${-32 + r * 22} l5,5 l9,-10`}
              stroke={ink.purple}
              strokeWidth={LINE_W * 1.2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x={-4} y={-32 + r * 22} width={30 - (r % 2) * 10} height={5} rx={2.5} fill={ink.grey300} />
          </g>
        ))}
      </g>
    ))}
  </svg>
);

// Despertador con campanas: la aguja gira acelerada y las campanas vibran.
export const AlarmClock: React.FC<{ minuteDeg: number; ring: number }> = ({ minuteDeg, ring }) => (
  <svg viewBox="-100 -110 200 220" width="100%" height="100%" style={{ overflow: "visible" }}>
    <g transform={`rotate(${ring * -8},-50,-70)`}>
      <path d="M-86,-52 A40,40 0 0 1 -30,-96 Z" fill={ink.purple} />
      <rect x={-64} y={-86} width={10} height={20} rx={3} fill={ink.line} transform="rotate(-45,-59,-76)" />
    </g>
    <g transform={`rotate(${ring * 8},50,-70)`}>
      <path d="M86,-52 A40,40 0 0 0 30,-96 Z" fill={ink.purple} />
      <rect x={54} y={-86} width={10} height={20} rx={3} fill={ink.line} transform="rotate(45,59,-76)" />
    </g>
    <path d="M-48,70 L-62,96 M48,70 L62,96" stroke={ink.line} strokeWidth={LINE_W * 3} strokeLinecap="round" />
    <circle r={82} fill={ink.purple} />
    <circle r={68} fill={ink.grey100} />
    {Array.from({ length: 12 }).map((_, i) => (
      <rect
        key={i}
        x={-2}
        y={-62}
        width={4}
        height={i % 3 === 0 ? 12 : 7}
        rx={2}
        fill={ink.line}
        transform={`rotate(${i * 30})`}
      />
    ))}
    <rect x={-3.5} y={-34} width={7} height={38} rx={3.5} fill={ink.line} transform={`rotate(${minuteDeg / 12})`} />
    <rect x={-2.5} y={-52} width={5} height={56} rx={2.5} fill={ink.purple} transform={`rotate(${minuteDeg})`} />
    <circle r={7} fill={ink.line} />
  </svg>
);

export const WarningSign: React.FC = () => (
  <svg viewBox="-70 -64 140 124" width="100%" height="100%" style={{ overflow: "visible" }}>
    <path
      d="M-8,-52 Q0,-64 8,-52 L62,40 Q68,54 52,54 L-52,54 Q-68,54 -62,40 Z"
      fill="#FF9800"
    />
    <rect x={-7} y={-26} width={14} height={50} rx={7} fill={ink.white} />
    <circle cx={0} cy={38} r={8} fill={ink.white} />
  </svg>
);

export const Bolt: React.FC = () => (
  <svg viewBox="-30 -50 60 100" width="100%" height="100%" style={{ overflow: "visible" }}>
    <path d="M6,-48 L-22,6 L-2,6 L-10,48 L24,-10 L4,-10 L14,-48 Z" fill={ink.skinShade} />
  </svg>
);

// Trazo de remolino dibujado progresivamente (dashoffset).
export const Swirl: React.FC<{ progress: number; d: string; width?: number }> = ({ progress, d, width = 4 }) => (
  <path
    d={d}
    pathLength={1}
    strokeDasharray="1 1"
    strokeDashoffset={1 - progress}
    stroke="rgba(255,255,255,0.4)"
    strokeWidth={width}
    strokeLinecap="round"
    fill="none"
  />
);

// Oficina en silueta translúcida (tratamiento de escenas.zip / Escena-2).
export const OfficeBackdrop: React.FC = () => {
  const tone = "rgba(126,87,194,0.34)";
  const toneSoft = "rgba(126,87,194,0.2)";
  return (
    <svg viewBox="0 0 1920 1080" width="100%" height="100%">
      {/* cuadro izquierdo */}
      <rect x={170} y={260} width={200} height={250} fill={toneSoft} />
      <rect x={196} y={286} width={148} height={198} fill="none" stroke={tone} strokeWidth={10} />
      <path d="M240,330 L310,385 L240,440 Z" fill={tone} />
      {/* estantería derecha */}
      <g fill={tone}>
        <rect x={1540} y={120} width={16} height={900} />
        <rect x={1840} y={120} width={16} height={900} />
        <rect x={1540} y={380} width={316} height={14} />
        <rect x={1540} y={640} width={316} height={14} />
        <rect x={1540} y={900} width={316} height={14} />
        <rect x={1600} y={250} width={34} height={130} />
        <rect x={1640} y={270} width={30} height={110} />
        <rect x={1700} y={236} width={24} height={144} transform="rotate(12,1712,380)" />
        <rect x={1620} y={590} width={150} height={24} />
        <rect x={1640} y={566} width={120} height={24} />
      </g>
      <path d="M1560,400 L1836,630 M1836,400 L1560,630" stroke={toneSoft} strokeWidth={10} />
      {/* piso */}
      <rect x={0} y={1000} width={1920} height={80} fill={brand.night} opacity={0.5} />
    </svg>
  );
};
