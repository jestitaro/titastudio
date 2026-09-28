import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { easeInOut, osc, pop, range } from "../../lib/motion";
import { Layer, LightStudio, Particles, QS } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { TEAM } from "../data";
import { nunito } from "../lib/fonts";
import { Icon } from "../ui/icons";
import { Phone, SCREEN_H, SCREEN_W } from "../ui/Phone";
import { Avatar, ORG, OrganizeScreen, orgScroll, slotArrive, teamSlot } from "../ui/screens/Organize";

// Escena 7 — una sola experiencia de UI. El equipo (avatares flotando) se magnetiza hacia sus slots
// dentro de la app; después la ruta se abre y las rutas se despliegan. Fondo con rutas en eco.
export const S07_PHONE = { x: 960, y: 540 };

const phoneScale = (f: number) => 1 + range(f, [ORG.expand[0], 165], [0, 0.06], easeInOut);
const cam: Cam = { x: 960, y: 540, zoom: 1 };

// Posición inicial de cada avatar alrededor del celular.
const START = [
  { x: 360, y: 250 },
  { x: 1540, y: 230 },
  { x: 300, y: 720 },
  { x: 1620, y: 640 },
  { x: 560, y: 900 },
];

const toPhone = (f: number, local: { x: number; y: number }) => {
  const s = phoneScale(f);
  return { x: S07_PHONE.x + (local.x - SCREEN_W / 2) * s, y: S07_PHONE.y + (local.y - SCREEN_H / 2) * s, s };
};

export const S07Organize: React.FC = () => {
  const f = useCurrentFrame();
  const s = phoneScale(f);
  const routeBg = range(f, [ORG.routes[0], ORG.routes[1]], [0, 1], easeInOut);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightStudio f={f + 120} />
      {/* Eco de ruteo en el fondo: rutas punteadas que se despliegan con las de la app */}
      <Layer cam={cam} depth={0.4}>
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {[
            { d: "M-40 900 C 300 700, 420 380, 760 300 S 1300 120, 1980 180", c: "#1976D2" },
            { d: "M-40 980 C 420 900, 700 760, 1100 820 S 1600 900, 1980 700", c: "#7C5CFC" },
            { d: "M-40 120 C 380 220, 520 520, 900 560 S 1500 460, 1980 520", c: "#2E7D32" },
          ].map((r, i) => (
            <path key={i} d={r.d} fill="none" stroke={r.c} strokeWidth={4} strokeLinecap="round" pathLength={1000} strokeDasharray={`${1000 * routeBg} 1000`} opacity={0.2} />
          ))}
        </svg>
        <Particles f={f} n={36} seed="s07" color={QS.indigo} speed={0.3} size={[2, 5]} opacity={0.3} />
      </Layer>

      <Phone x={S07_PHONE.x} y={S07_PHONE.y} scale={s}>
        <OrganizeScreen f={f} />
      </Phone>

      {/* Avatares del equipo: flotan y se magnetizan a sus slots dentro de la app */}
      {TEAM.map((t, i) => {
        const appear = pop(f, 2 + i * 4, { damping: 12, stiffness: 150, mass: 0.7 });
        const k = slotArrive(f, i);
        if (k >= 1) return null;
        const target = toPhone(f, { ...teamSlot(i, orgScroll(f)) });
        const st = START[i];
        const fx = st.x + osc(f, 60 + i * 7, 10, i * 20);
        const fy = st.y + osc(f, 50 + i * 5, 12, i * 13);
        // Curva de atracción: leve arco hacia el celular
        const bend = Math.sin(k * Math.PI) * 80 * (i % 2 ? 1 : -1);
        const x = interpolate(k, [0, 1], [fx, target.x]);
        const y = interpolate(k, [0, 1], [fy, target.y]) + bend;
        const size = interpolate(k, [0, 1], [104, 54 * target.s]);
        const labelO = 1 - range(k, [0, 0.4], [0, 1], (v) => v);
        return (
          <div key={t.initials} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${appear})` }}>
            {k > 0.05 && (
              <div
                style={{
                  position: "absolute",
                  left: size / 2 - 3,
                  top: size / 2 - 3,
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  boxShadow: `0 0 0 ${10 * k}px ${t.color}22`,
                }}
              />
            )}
            <Avatar t={t} size={size} />
            <div
              style={{
                position: "absolute",
                top: size + 8,
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: nunito,
                fontWeight: 800,
                fontSize: 20,
                color: QS.dark,
                opacity: labelO,
                whiteSpace: "nowrap",
              }}
            >
              {t.name}
            </div>
          </div>
        );
      })}

      {/* Pines que se magnetizan hacia el mapa cuando se abre la ruta */}
      {Array.from({ length: 6 }).map((_, i) => {
        const at = ORG.expand[0] - 20 + i * 2;
        const p = pop(f, at - 16, { damping: 12, stiffness: 140 });
        const k = range(f, [at, at + 22], [0, 1], easeInOut);
        if (k >= 1 || p <= 0.01) return null;
        const side = i % 2 ? 1 : -1;
        const sx = 960 + side * (520 + random(`pinx${i}`) * 260);
        const sy = 160 + random(`piny${i}`) * 760;
        const tgt = toPhone(f, { x: 60 + random(`pt${i}`) * 280, y: 300 + random(`pty${i}`) * 400 });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: interpolate(k, [0, 1], [sx, tgt.x]),
              top: interpolate(k, [0, 1], [sy, tgt.y]) - Math.sin(k * Math.PI) * 60,
              transform: `translate(-50%, -50%) scale(${p * interpolate(k, [0, 1], [1, 0.4])})`,
            }}
          >
            <div style={{ width: 70, height: 70, borderRadius: 22, background: "#fff", boxShadow: "0 14px 30px rgba(19,13,93,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="pin" size={38} color={["#1976D2", "#7C5CFC", "#2E7D32"][i % 3]} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
