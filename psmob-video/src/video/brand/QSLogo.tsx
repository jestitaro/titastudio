import React from "react";
import { ISO_CENTERS, ISO_GRADIENT, ISO_TRIANGLES, LOGO_VIEWBOX, WORDMARK_COLOR, WORDMARK_D, WORD_BOX } from "./logoData";

export type TriState = { tx: number; ty: number; s: number; rot: number; o: number };
export const TRI_REST: TriState = { tx: 0, ty: 0, s: 1, rot: 0, o: 1 };

// Logo oficial QuartzSales. Los triángulos del isotipo y el wordmark son los paths del SVG,
// sin cambios de forma: solo se animan transform/opacity de cada pieza.
export const QSLogo: React.FC<{
  width: number;
  tri?: (i: number, c: [number, number]) => TriState;
  word?: number; // 0..1 revelado del wordmark (máscara de izquierda a derecha)
  wordShift?: number; // desplazamiento del wordmark en unidades del viewBox
  isoOnly?: boolean;
  isoColor?: string; // color sólido (ej. blanco sobre oscuro); por defecto el gradiente oficial
  id?: string;
}> = ({ width, tri, word = 1, wordShift = 0, isoOnly, isoColor, id = "qs" }) => {
  const vb = isoOnly ? { x: 0, y: 0, w: 250, h: 248 } : { x: 0, y: 0, w: LOGO_VIEWBOX.w, h: LOGO_VIEWBOX.h };
  const height = (width * vb.h) / vb.w;
  const clipW = (WORD_BOX.x1 - WORD_BOX.x0 + 20) * word;
  return (
    <svg width={width} height={height} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`${id}-g`} x1={ISO_GRADIENT.x1} y1={ISO_GRADIENT.y1} x2={ISO_GRADIENT.x2} y2={ISO_GRADIENT.y2} gradientUnits="userSpaceOnUse">
          {ISO_GRADIENT.stops.map(([o, c]) => (
            <stop key={o} offset={o} stopColor={c} />
          ))}
        </linearGradient>
        <clipPath id={`${id}-w`}>
          <rect x={WORD_BOX.x0 - 10 - wordShift} y={0} width={clipW} height={248} />
        </clipPath>
      </defs>
      {ISO_TRIANGLES.map((d, i) => {
        const c = ISO_CENTERS[i];
        const t = tri ? tri(i, c) : TRI_REST;
        if (t.o <= 0) return null;
        return (
          <path
            key={i}
            d={d}
            fill={isoColor ?? `url(#${id}-g)`}
            opacity={Math.min(1, t.o)}
            transform={`translate(${t.tx} ${t.ty}) translate(${c[0]} ${c[1]}) rotate(${t.rot}) scale(${t.s}) translate(${-c[0]} ${-c[1]})`}
          />
        );
      })}
      {!isoOnly && word > 0 && (
        <g transform={`translate(${wordShift} 0)`} clipPath={`url(#${id}-w)`}>
          <path d={WORDMARK_D} fill={WORDMARK_COLOR} />
        </g>
      )}
    </svg>
  );
};

// Centro del isotipo en el viewBox (para componer).
export const ISO_CENTER = { x: 124, y: 124 };
