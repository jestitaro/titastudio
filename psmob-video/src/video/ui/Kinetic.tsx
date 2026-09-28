import React from "react";
import { interpolate, spring } from "remotion";
import { QS } from "../lib/stage";
import { nunito } from "../lib/fonts";

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
}> = ({ f, text, at, out, x, y, align = "left", size = 66, dark, accent = [], eyebrow }) => {
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
        fontFamily: nunito,
      }}
    >
      {eyebrow && (
        <div style={{ overflow: "hidden", marginBottom: 12 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
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
          const o = interpolate(f, [out ?? 1e9, (out ?? 1e9) + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const po = Math.min(1, Math.max(0, o - i * 0.08));
          return (
            <div key={i} style={{ overflow: "hidden", paddingBottom: size * 0.12, marginBottom: -size * 0.12 }}>
              <div
                style={{
                  fontSize: size,
                  lineHeight: 1.08,
                  fontWeight: 800,
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
