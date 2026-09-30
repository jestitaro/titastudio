import React from "react";
import { interpolate, spring } from "remotion";
import { QS } from "../lib/stage";
import { FONT } from "../ds/tokens";

// Kinetic typography moderada: palabras que entran por máscara, escalonadas; salida por máscara hacia arriba.
// `accent` = índices de palabras en violeta de marca (color sólido; el gradiente queda reservado al isotipo).
export const Kinetic: React.FC<{
  f: number;
  text: string;
  at: number;
  out?: number;
  x: number;
  y: number;
  align?: "left" | "center" | "right";
  size?: number;
  dark?: boolean;
  accent?: number[];
  eyebrow?: string;
  // Placa clara detrás del texto para leerlo sobre fondos con color (góndola, etc.).
  plate?: boolean;
}> = ({ f, text, at, out, x, y, align = "left", size = 66, dark, accent = [], eyebrow, plate }) => {
  const words = text.split(" ");
  const base = dark ? "#FFFFFF" : QS.dark;
  const accentC = dark ? "#B79CFF" : QS.violet;
  const outP = out === undefined ? 0 : interpolate(f, [out, out + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bar = spring({ frame: f - at, fps: 30, config: { damping: 20, stiffness: 120 } });
  const tx = align === "center" ? "-50%" : align === "right" ? "-100%" : "0";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${tx}, -50%)`,
        textAlign: align,
        fontFamily: FONT,
      }}
    >
      {plate && (
        <div style={{ position: "absolute", inset: "-30px -40px", zIndex: -1, borderRadius: 28, background: "rgba(255,255,255,0.94)", boxShadow: "0 2px 4px rgba(15,23,42,0.08), 0 16px 40px rgba(15,23,42,0.16)", opacity: Math.min(1, bar * 1.4) * (1 - outP), transform: `scale(${0.94 + 0.06 * Math.min(1, bar)})` }} />
      )}
      {eyebrow && (
        <div style={{ overflow: "hidden", marginBottom: 12 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 3,
              color: accentC,
              transform: `translateY(${(1 - bar) * 100 + outP * -100}%)`,
            }}
          >
            {eyebrow}
          </div>
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: `0 ${size * 0.26}px`, justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start", maxWidth: size * 9.5 }}>
        {words.map((w, i) => {
          const p = spring({ frame: f - at - i * 4, fps: 30, config: { damping: 17, stiffness: 130, mass: 0.8 } });
          // Salida escalonada: cada palabra sale completa (no queda ningún resto en pantalla).
          const po = out === undefined ? 0 : interpolate(f, [out + i * 2, out + i * 2 + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ overflow: "hidden", paddingBottom: size * 0.12, marginBottom: -size * 0.12 }}>
              <div
                style={{
                  fontSize: size,
                  lineHeight: 1.08,
                  fontWeight: 700,
                  letterSpacing: -0.5,
                  color: accent.includes(i) ? accentC : base,
                  transform: `translateY(${(1 - p) * 110 - po * 110}%)`,
                  whiteSpace: "nowrap",
                }}
              >
                {w}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          height: 6,
          width: 90 * bar * (1 - outP),
          borderRadius: 3,
          background: accentC,
          marginTop: 18,
          marginLeft: align === "center" ? "auto" : align === "right" ? "auto" : 0,
          marginRight: align === "center" ? "auto" : 0,
        }}
      />
    </div>
  );
};
