import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, osc, pop, range } from "../../lib/motion";
import { Actor, camPath, Contact, Floor, Layer, LightStudio, Particles, POSE, QS } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { APP_H, APP_W, Device } from "../ds/Device";
import { Avatar } from "../ds/ui";
import { FONT } from "../ds/tokens";
import { listSlot, VIS, VisitasScreen } from "../screens/Field";
import { TEAM } from "../screens/data";
import { S06_UI_END } from "./S06Reveal";
import { CARO_W, DEV7, FLOOR_Y } from "./world";

// Escena 7 — arranca con la UI donde terminó la 6 y la cámara se aleja despacio hasta revelar a Caro de
// cuerpo entero (con piso y sombra) y su celular a su derecha, en una sola composición. El equipo se asigna a cada PDV; luego la app
// pasa al mapa con el recorrido de un merchandiser mientras la cámara se acerca apenas.
const TS = 0.82; // ritmo de la UI
const Z0 = S06_UI_END.w / (APP_W * DEV7.s);
export const camS07 = (f: number): Cam =>
  camPath(f, [
    { f: 0, x: DEV7.x - (S06_UI_END.x - 960) / Z0, y: DEV7.y - (S06_UI_END.y - 540) / Z0, zoom: Z0 },
    { f: 90, x: 830, y: 540, zoom: 1.0 },
    { f: 195, x: 850, y: 535, zoom: 1.05 },
  ]);

const START = [
  { x: 1400, y: 260 },
  { x: 1580, y: 420 },
  { x: 1420, y: 600 },
  { x: 1590, y: 760 },
];

export const S07Organize: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camS07(f);
  const vf = f * TS;
  const slotWorld = (p: { x: number; y: number }) => ({ x: DEV7.x + (p.x - APP_W / 2) * DEV7.s, y: DEV7.y + (p.y - APP_H / 2) * DEV7.s });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightStudio f={f + 150} />
      <Layer cam={cam} depth={0.4}>
        <Particles f={f} n={30} seed="s07" color={QS.indigo} speed={0.25} size={[2, 5]} opacity={0.3} />
      </Layer>
      <Layer cam={cam} depth={1}>
        <Floor y={FLOOR_Y} />
        <Contact x={CARO_W.x} y={CARO_W.feet} />
        <Actor pose={POSE.caroCelular} x={CARO_W.x} feetY={CARO_W.feet} scale={CARO_W.scale} f={f} blink={{ pose: POSE.caroCelularBlink, at: [96, 170] }} />
        <Device x={DEV7.x} y={DEV7.y} scale={DEV7.s}>
          <VisitasScreen f={vf} />
        </Device>
        {TEAM.map((t, i) => {
          const at = VIS.assign[0] / TS + i * 9;
          const appear = pop(f, 4 + i * 5, { damping: 16, stiffness: 100 });
          const k = range(f, [at, at + 22], [0, 1], easeInOut);
          if (k >= 1) return null;
          const target = slotWorld(listSlot(i));
          const st = START[i];
          const x = interpolate(k, [0, 1], [st.x + osc(f, 80 + i * 7, 8, i * 20), target.x]);
          const y = interpolate(k, [0, 1], [st.y + osc(f, 70 + i * 5, 10, i * 13), target.y]) - Math.sin(k * Math.PI) * 50;
          const size = interpolate(k, [0, 1], [72, 40 * DEV7.s]);
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

export const S07_CAM_END = camS07(195);
export const S07_VF_END = 195 * TS;
