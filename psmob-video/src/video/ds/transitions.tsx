import React from "react";
import { interpolate } from "remotion";
import { APP_H, APP_W } from "./Device";

// Transiciones de pantalla dentro del celular (nada sale por los costados):
// - Expand: "container transform". La pantalla nueva nace del elemento tocado y crece hasta ocupar todo;
//   la anterior retrocede apenas (escala + velo).
// - Reveal: revelado circular desde un botón (p. ej. el toggle lista/mapa).
// - Through: "fade through". La saliente se desvanece y achica; la entrante aparece creciendo un poco.
type Rect = { x: number; y: number; w: number; h: number; r?: number };
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (t: number) => Math.min(1, Math.max(0, t));
const layer: React.CSSProperties = { position: "absolute", inset: 0, overflow: "hidden" };

const Out: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => (
  <div style={{ ...layer, transform: `scale(${1 - 0.05 * p})`, transformOrigin: "50% 40%" }}>
    {children}
    <div style={{ position: "absolute", inset: 0, background: "#0B1026", opacity: 0.28 * p }} />
  </div>
);

export const Expand: React.FC<{ p: number; from: Rect; h?: number; a: React.ReactNode; b: React.ReactNode }> = ({ p: p0, from, h = APP_H, a, b }) => {
  const p = ease(clamp(p0));
  if (p <= 0) return <div style={layer}>{a}</div>;
  if (p >= 1) return <div style={layer}>{b}</div>;
  const top = interpolate(p, [0, 1], [from.y, 0]);
  const left = interpolate(p, [0, 1], [from.x, 0]);
  const right = interpolate(p, [0, 1], [APP_W - from.x - from.w, 0]);
  const bottom = interpolate(p, [0, 1], [h - from.y - from.h, 0]);
  const r = interpolate(p, [0, 1], [from.r ?? 16, 0]);
  return (
    <div style={layer}>
      <Out p={p}>{a}</Out>
      <div style={{ ...layer, clipPath: `inset(${top}px ${right}px ${bottom}px ${left}px round ${r}px)` }}>
        <div style={{ ...layer, opacity: clamp(p * 2.2) }}>{b}</div>
      </div>
    </div>
  );
};

export const Reveal: React.FC<{ p: number; at: { x: number; y: number }; a: React.ReactNode; b: React.ReactNode }> = ({ p: p0, at, a, b }) => {
  const p = ease(clamp(p0));
  if (p <= 0) return <div style={layer}>{a}</div>;
  if (p >= 1) return <div style={layer}>{b}</div>;
  return (
    <div style={layer}>
      <Out p={p}>{a}</Out>
      <div style={{ ...layer, clipPath: `circle(${p * 1000}px at ${at.x}px ${at.y}px)` }}>{b}</div>
    </div>
  );
};

export const Through: React.FC<{ p: number; a: React.ReactNode; b: React.ReactNode }> = ({ p: p0, a, b }) => {
  const p = clamp(p0);
  if (p <= 0) return <div style={layer}>{a}</div>;
  if (p >= 1) return <div style={layer}>{b}</div>;
  const po = ease(clamp(p / 0.4));
  const pi = ease(clamp((p - 0.3) / 0.7));
  return (
    <div style={layer}>
      {po < 1 && <div style={{ ...layer, opacity: 1 - po, transform: `scale(${1 - 0.04 * po})` }}>{a}</div>}
      {pi > 0 && <div style={{ ...layer, opacity: pi, transform: `scale(${0.94 + 0.06 * pi})` }}>{b}</div>}
    </div>
  );
};
