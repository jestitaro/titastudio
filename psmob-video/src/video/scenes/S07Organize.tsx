import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, osc, pop, range } from "../../lib/motion";
import { Actor, camPath, Layer, LightStudio, Particles, POSE, QS } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { APP_H, APP_W, Device } from "../ds/Device";
import { Avatar } from "../ds/ui";
import { FONT } from "../ds/tokens";
import { listSlot, VIS, VisitasScreen } from "../screens/Field";
import { TEAM } from "../screens/data";
import { S06_END } from "./S06Reveal";

// Escena 7 — cámara que ordena la narrativa: arranca con la UI a pantalla completa (continuidad con la 6),
// zoom out para revelar más interfaz mientras el equipo se asigna, push-out hasta revelar a Caro gestionando,
// y push-in de vuelta al celular para el mapa con el recorrido del merchandiser.
const DEV = { x: 1340, y: 540, s: 0.84 }; // celular en el mundo
const CARO = { x: 470, feet: 1150, scale: 0.72 };
const Z0 = S06_END.s / DEV.s;

export const camS07 = (f: number): Cam =>
  camPath(f, [
    { f: 0, x: DEV.x, y: DEV.y, zoom: Z0 },
    { f: 34, x: DEV.x, y: DEV.y, zoom: 1.13 },
    { f: 46, x: DEV.x - 20, y: DEV.y, zoom: 1.1 },
    { f: 72, x: 1010, y: 560, zoom: 0.97 },
    { f: 84, x: 1030, y: 560, zoom: 0.98 },
    { f: 106, x: 1230, y: 540, zoom: 1.16 },
    { f: 165, x: 1260, y: 540, zoom: 1.22 },
  ]);

const START = [
  { x: 820, y: 260 },
  { x: 1870, y: 250 },
  { x: 780, y: 820 },
  { x: 1880, y: 780 },
];

export const S07Organize: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camS07(f);
  const slotWorld = (p: { x: number; y: number }) => ({ x: DEV.x + (p.x - APP_W / 2) * DEV.s, y: DEV.y + (p.y - APP_H / 2) * DEV.s });
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
      <Layer cam={cam} depth={1}>
        <div style={{ position: "absolute", left: CARO.x - 200, top: CARO.feet - 16, width: 400, height: 32, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(19,13,93,0.16), rgba(19,13,93,0))" }} />
        <Actor pose={POSE.caroCelular} x={CARO.x} feetY={CARO.feet} scale={CARO.scale} f={f} blink={{ pose: POSE.caroCelularBlink, at: [62, 128] }} />
        <Device x={DEV.x} y={DEV.y} scale={DEV.s}>
          <VisitasScreen f={f} />
        </Device>
        {/* Equipo que se magnetiza a cada PDV */}
        {TEAM.map((t, i) => {
          const appear = pop(f, i * 3, { damping: 12, stiffness: 150, mass: 0.7 });
          const k = range(f, [VIS.assign[0] + i * 6, VIS.assign[0] + i * 6 + 14], [0, 1], easeInOut);
          if (k >= 1) return null;
          const target = slotWorld(listSlot(i));
          const st = START[i];
          const x = interpolate(k, [0, 1], [st.x + osc(f, 60 + i * 7, 8, i * 20), target.x]);
          const y = interpolate(k, [0, 1], [st.y + osc(f, 50 + i * 5, 10, i * 13), target.y]) - Math.sin(k * Math.PI) * 60;
          const size = interpolate(k, [0, 1], [76, 40 * DEV.s]);
          return (
            <div key={t.initials} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${appear})` }}>
              <Avatar initials={t.initials} color={t.color} size={size} />
              <div style={{ position: "absolute", top: size + 6, left: "50%", transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 700, fontSize: 15, color: QS.dark, opacity: 1 - k * 2.5, whiteSpace: "nowrap" }}>{t.name}</div>
            </div>
          );
        })}
      </Layer>
    </AbsoluteFill>
  );
};

// Estado final (para que la escena 8 continúe el movimiento sin corte).
export const S07_CAM_END = camS07(165);
export const S07_DEV = DEV;
export const S07_CARO = CARO;
