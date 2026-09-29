import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { easeInOut, osc, pop, range } from "../../lib/motion";
import { BEATS_S01 } from "../timing";
import { Actor, camPath, Layer, Particles, POSE, QS } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { FONT } from "../ds/tokens";
import { Device } from "../ds/Device";
import { TasksScreen } from "../screens/Field";
import { Icon, IconName } from "../ui/icons";

// Escenas 1–4. Caro entra caminando (hacia donde mira), se frena y mira su celular: a su derecha aparece
// la pantalla con todo lo que tiene que hacer. Se agobia; Equipo, PDV y Datos orbitan a la altura del torso.
// Una sola cámara: plano entero que se acerca lento hasta un plano americano (la cabeza siempre en cuadro).
const B = BEATS_S01;
const FEET = 1010;
const SCALE = 0.62;
const CARO_X = 700;
const ORBIT = { cx: CARO_X + 10, cy: 520, rx: 400, ry: 70, tilt: -5 };
const PHONE = { x: 1270, y: 520, s: 0.55 };

const walkX = (f: number) => interpolate(f, [0, B.stop], [180, CARO_X], { easing: (t) => 1 - Math.pow(1 - t, 2.2), extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const cam = (f: number): Cam =>
  camPath(f, [
    { f: 0, x: 900, y: 540, zoom: 1 },
    { f: B.stress, x: 960, y: 530, zoom: 1.06 },
    { f: B.drop, x: 900, y: 520, zoom: 1.16 },
    { f: 330, x: 900, y: 600, zoom: 1.18 },
  ]);

const omega = (f: number) => 0.012 + range(f, [B.pdv, B.pdv + 30], [0, 0.006]) + range(f, [B.process, B.process + 30], [0, 0.008]);
const THETA: number[] = (() => {
  const a = [0];
  for (let i = 1; i <= 400; i++) a.push(a[i - 1] + (i >= B.team ? omega(i) : 0));
  return a;
})();
const theta = (f: number) => THETA[Math.max(0, Math.min(400, Math.floor(f)))];
const orbitPos = (angle: number) => {
  const t = (ORBIT.tilt * Math.PI) / 180;
  const ex = Math.cos(angle) * ORBIT.rx;
  const ey = Math.sin(angle) * ORBIT.ry;
  return { x: ORBIT.cx + ex * Math.cos(t) - ey * Math.sin(t), y: ORBIT.cy + ex * Math.sin(t) + ey * Math.cos(t), front: Math.sin(angle) };
};

// Caída lenta al final (continúa en la escena 5, donde aterrizan sobre el escritorio).
const fall = (f: number, i: number) => {
  const t = Math.max(0, f - B.drop - i * 2);
  return { dy: 0.9 * t * t, rot: t * (i % 2 ? 0.9 : -1.1) };
};

const mood = (f: number) => range(f, [B.phone + 20, B.stress + 30], [0, 1], easeInOut);

type OrbitItem = { key: string; label: string; icons: IconName[]; at: number; phase: number; tint: string };
const ITEMS: OrbitItem[] = [
  { key: "team", label: "Equipo", icons: ["users"], at: B.team, phase: Math.PI * 0.15, tint: "#463DE1" },
  { key: "pdv", label: "Puntos de venta", icons: ["pin", "checklist"], at: B.pdv, phase: Math.PI * 0.15 + (Math.PI * 2) / 3, tint: "#1D4ED8" },
  { key: "data", label: "Datos", icons: ["gear", "dashboard"], at: B.process, phase: Math.PI * 0.15 + (Math.PI * 4) / 3, tint: "#7025E0" },
];

export const Tile: React.FC<{ label: string; icons: IconName[]; tint: string; scale?: number; dark?: boolean }> = ({ label, icons, tint, scale = 1, dark = true }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transform: `scale(${scale})` }}>
    <div style={{ width: 92, height: 92, borderRadius: 24, background: "#FFFFFF", boxShadow: "0 18px 40px rgba(5,3,31,0.35)", display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
      {icons.map((ic) => (
        <Icon key={ic} name={ic} size={icons.length > 1 ? 36 : 46} color={tint} sw={1.7} />
      ))}
    </div>
    {label && <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: dark ? "#FFFFFF" : QS.dark, whiteSpace: "nowrap" }}>{label}</div>}
  </div>
);

// Pocas notificaciones, a media altura y dentro del cuadro.
const NOTIFS = Array.from({ length: 6 }).map((_, i) => {
  const side = i % 2 === 0 ? -1 : 1;
  return { x: CARO_X + side * (470 + random(`nx${i}`) * 120), y: 380 + random(`ny${i}`) * 360, at: B.process + 6 + i * 7, icon: (["alert", "form", "clock", "bell", "chat", "pin"] as IconName[])[i], w: 150 };
});

export const S01Overload: React.FC = () => {
  const f = useCurrentFrame();
  const c = cam(f);
  const m = mood(f);
  const walking = f < B.stop;
  const stress = f >= B.stress;
  const phoneIn = pop(f, B.phone, { damping: 18, stiffness: 90 }) * (1 - range(f, [B.stress - 10, B.stress + 10], [0, 1], easeInOut));
  const items = ITEMS.map((it, idx) => {
    const o = orbitPos(theta(f) + it.phase);
    const p = pop(f, it.at, { damping: 16, stiffness: 90 });
    const fl = fall(f, idx);
    return { it, x: o.x, y: o.y + fl.dy, s: interpolate(o.front, [-1, 1], [0.78, 1.05]) * p, front: o.front, op: f < it.at ? 0 : interpolate(o.front, [-1, 1], [0.6, 1]) * Math.min(1, p * 1.5), rot: fl.rot };
  });
  const renderItem = (x: (typeof items)[number]) =>
    x.op > 0 ? (
      <div key={x.it.key} style={{ position: "absolute", left: x.x, top: x.y, transform: `translate(-50%, -50%) rotate(${x.rot}deg)`, opacity: x.op }}>
        <Tile label={x.it.label} icons={x.it.icons} tint={x.it.tint} scale={x.s} />
      </div>
    ) : null;
  const pose = walking ? POSE.caroCaminandoA : stress ? POSE.caroEstres : POSE.caroCelular;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #FFFFFF, #EEE9FF)" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 80% at 45% 50%, rgba(150,40,200,0.35), rgba(0,0,0,0) 70%), linear-gradient(180deg, #1A1270 0%, ${QS.dark} 50%, ${QS.darker} 100%)`, opacity: m }} />
      <Layer cam={c} depth={0.3}>
        <Particles f={f} n={80} seed="s01a" speed={0.4 + m * 0.8} size={[1.2, 3]} color={m > 0.5 ? "#FFFFFF" : "#7C5CFC"} opacity={0.3 + m * 0.35} />
      </Layer>
      <Layer cam={c} depth={1}>
        <div style={{ position: "absolute", left: (walking ? walkX(f) : CARO_X) - 150, top: FEET - 12, width: 300, height: 24, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(19,13,93,0.12), rgba(19,13,93,0))", opacity: 1 - m }} />
        {stress && items.filter((x) => x.front < 0).map(renderItem)}
        <Actor
          pose={pose}
          x={walking ? walkX(f) : CARO_X}
          feetY={FEET}
          scale={SCALE}
          f={f}
          walk={walking ? { poses: [POSE.caroCaminandoA, POSE.caroCaminandoB], period: 9, bob: 6 } : undefined}
          blink={!stress ? { pose: POSE.caroCelularBlink, at: [96, 132] } : undefined}
        />
        {stress && items.filter((x) => x.front >= 0).map(renderItem)}
        {/* Lo que Caro está viendo: su celular, a su derecha (hacia donde mira) */}
        {phoneIn > 0.01 && (
          <Device x={PHONE.x} y={PHONE.y} scale={PHONE.s * phoneIn}>
            <TasksScreen f={(f - B.phone) * 0.8} />
          </Device>
        )}
      </Layer>
      <Layer cam={c} depth={1.15}>
        {NOTIFS.map((n, i) => {
          const p = pop(f, n.at, { damping: 16, stiffness: 110 });
          if (p <= 0.01) return null;
          const fl = fall(f, i + 3);
          return (
            <div key={i} style={{ position: "absolute", left: n.x, top: n.y + osc(f, 80, 5, i * 11) + fl.dy, width: n.w, transform: `translate(-50%, -50%) scale(${p}) rotate(${fl.rot}deg)`, display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 12, background: "rgba(255,255,255,0.94)", boxShadow: "0 10px 26px rgba(0,0,0,0.3)" }}>
              <Icon name={n.icon} size={20} color={i % 3 === 0 ? "#DC2626" : "#463DE1"} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ height: 6, width: "85%", borderRadius: 3, background: "#CFD4E6" }} />
                <div style={{ height: 5, width: "55%", borderRadius: 3, background: "#E3E6F2" }} />
              </div>
            </div>
          );
        })}
      </Layer>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(5,3,31,0.6) 100%)", opacity: m }} />
    </AbsoluteFill>
  );
};
