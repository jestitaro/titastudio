import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, osc, pop, range } from "../../lib/motion";
import { Actor, Layer, LightStudio, Particles, POSE, QS } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { APP_H, APP_W, Device } from "../ds/Device";
import { Avatar } from "../ds/ui";
import { FONT } from "../ds/tokens";
import { listSlot, VIS, VisitasScreen } from "../screens/Field";
import { TEAM } from "../screens/data";
import { S06_END } from "./S06Reveal";

// Escena 7 — una sola experiencia: el equipo se asigna a cada PDV (avatares magnetizados), aparece Caro
// gestionando desde su celular, y la app pasa al mapa con el recorrido de UN merchandiser por calles.
export const S07_END = { x: 1180, y: 540, s: 1 };
const CARO = { x: 560, feet: 1150, scale: 0.72 };

// Recorrido del celular: centro → derecha (entra Caro) → centro-derecha (mapa).
const phoneAt = (f: number) => {
  const a = range(f, [42, 60], [0, 1], easeInOut);
  const b = range(f, [84, 100], [0, 1], easeInOut);
  return {
    x: interpolate(a, [0, 1], [S06_END.x, 1340]) + b * (S07_END.x - 1340),
    y: 540,
    s: interpolate(a, [0, 1], [S06_END.s, 0.84]) + b * (S07_END.s - 0.84),
  };
};

const START = [
  { x: 380, y: 250 },
  { x: 1560, y: 230 },
  { x: 330, y: 760 },
  { x: 1600, y: 720 },
];

export const S07Organize: React.FC = () => {
  const f = useCurrentFrame();
  const ph = phoneAt(f);
  const caroIn = range(f, [44, 64], [0, 1], easeInOut);
  const cam: Cam = { x: 960 - (1 - caroIn) * 60, y: 540, zoom: 1 };
  const toScreen = (p: { x: number; y: number }) => ({ x: ph.x + (p.x - APP_W / 2) * ph.s, y: ph.y + (p.y - APP_H / 2) * ph.s });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightStudio f={f + 120} />
      <Layer cam={cam} depth={0.4}>
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {["M-40 900 H300 V600 H700 V300 H1200 V120 H1980", "M-40 980 H500 V820 H1100 V700 H1980"].map((d, i) => (
            <path key={i} d={d} fill="none" stroke={i ? QS.violet : "#1D4ED8"} strokeWidth={4} strokeLinejoin="round" pathLength={1} strokeDasharray={`${range(f, [VIS.route[0], VIS.route[1]], [0, 1])} 1`} opacity={0.14} />
          ))}
        </svg>
        <Particles f={f} n={30} seed="s07" color={QS.indigo} speed={0.3} size={[2, 5]} opacity={0.3} />
      </Layer>
      {/* Caro gestionando desde su celular */}
      {caroIn > 0 && (
        <Layer cam={cam} depth={1}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - caroIn) * -700}px)` }}>
            <div style={{ position: "absolute", left: CARO.x - 200, top: CARO.feet - 16, width: 400, height: 32, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(19,13,93,0.16), rgba(19,13,93,0))" }} />
            <Actor pose={POSE.caroCelular} x={CARO.x} feetY={CARO.feet} scale={CARO.scale} f={f} blink={{ pose: POSE.caroCelularBlink, at: [74, 128] }} />
          </div>
        </Layer>
      )}
      <Device x={ph.x} y={ph.y} scale={ph.s}>
        <VisitasScreen f={f} />
      </Device>
      {/* Equipo que se magnetiza a cada PDV */}
      {TEAM.map((t, i) => {
        const appear = pop(f, i * 3, { damping: 12, stiffness: 150, mass: 0.7 });
        const k = range(f, [VIS.assign[0] + i * 6, VIS.assign[0] + i * 6 + 14], [0, 1], easeInOut);
        if (k >= 1) return null;
        const target = toScreen(listSlot(i));
        const st = START[i];
        const fx = st.x + osc(f, 60 + i * 7, 10, i * 20);
        const fy = st.y + osc(f, 50 + i * 5, 12, i * 13);
        const x = interpolate(k, [0, 1], [fx, target.x]);
        const y = interpolate(k, [0, 1], [fy, target.y]) - Math.sin(k * Math.PI) * 70;
        const size = interpolate(k, [0, 1], [96, 40 * ph.s]);
        return (
          <div key={t.initials} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${appear})` }}>
            <Avatar initials={t.initials} color={t.color} size={size} />
            <div style={{ position: "absolute", top: size + 6, left: "50%", transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 700, fontSize: 18, color: QS.dark, opacity: 1 - k * 2.5, whiteSpace: "nowrap" }}>{t.name}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
