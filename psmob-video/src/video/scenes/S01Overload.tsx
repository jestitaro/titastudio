import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { easeInOut, easeOut, osc, pop, range } from "../../lib/motion";
import { BEATS_S01 } from "../timing";
import { Actor, Layer, Particles, POSE, QS, shake } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { FONT } from "../ds/tokens";
import { Device } from "../ds/Device";
import { TasksScreen } from "../screens/Field";
import { Icon, IconName } from "../ui/icons";

// Escenas 1–4. Caro entra caminando (calma, fondo claro), mira el celular y ve todo lo que tiene que hacer;
// las tareas saltan del teléfono, se agobia (caro-estres) y la órbita suma Equipo → PDV → Datos.
// El fondo acompaña el humor: lila claro → violeta profundo.
const B = BEATS_S01;
const WALK: [number, number] = [0, 50];
const STRESS = 112;
const FEET = 1040;
const SCALE = 0.66;
const CARO_X = 900;
const HEAD = { x: CARO_X + 12, y: 175 };
const ORBIT = { cx: CARO_X + 10, cy: 330, rx: 420, ry: 90, tilt: -7 };
const PHONE = { x: 1320, y: 470, s: 0.5 };

const omega = (f: number) => 0.018 + range(f, [B.pdv, B.pdv + 20], [0, 0.014]) + range(f, [B.process, B.process + 25], [0, 0.02]) + range(f, [B.drop - 10, B.drop + 8], [0, 0.03]);
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

const cam = (f: number): Cam => {
  // Sigue la caminata, frena con ella y empuja lento hacia plano medio.
  const walkX = interpolate(f, WALK, [420, CARO_X], { easing: easeOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const push = range(f, [WALK[1] - 10, STRESS], [0, 1], easeInOut);
  const push2 = range(f, [STRESS, B.drop], [0, 1], (t) => t);
  const drop = range(f, [B.drop - 4, 300], [0, 1], easeInOut);
  const s = shake(f, range(f, [B.process, B.process + 30], [0, 2]) * (1 - drop));
  return {
    x: interpolate(push, [0, 1], [walkX + 60, 1010]) + s.x,
    y: interpolate(push, [0, 1], [540, 420]) - push2 * 20 + drop * 150 + s.y,
    zoom: interpolate(push, [0, 1], [1, 1.45]) + push2 * 0.12 + drop * 0.05,
  };
};

const fall = (f: number, i: number) => {
  const t = Math.max(0, f - B.drop - (i % 4));
  return { dy: 2.2 * t * t, rot: t * (i % 2 ? 2.2 : -2.6) };
};

// Paleta de fondo según el humor.
const mood = (f: number) => range(f, [58, STRESS + 20], [0, 1], easeInOut);
const Backdrop: React.FC<{ f: number; cam: Cam }> = ({ f, cam: c }) => {
  const m = mood(f);
  return (
    <>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #FFFFFF, #EEE9FF)" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 80% at 50% 45%, rgba(${Math.round(interpolate(m, [0, 1], [112, 170]))},40,${Math.round(interpolate(m, [0, 1], [224, 190]))},0.4), rgba(0,0,0,0) 70%), linear-gradient(180deg, #1A1270 0%, ${QS.dark} 45%, ${QS.darker} 100%)`, opacity: m }} />
      <Layer cam={c} depth={0.25}>
        <Particles f={f} n={110} seed="s01a" speed={0.6 + m * 3} size={[1.2, 3]} color={m > 0.5 ? "#FFFFFF" : "#7C5CFC"} opacity={0.35 + m * 0.45} />
      </Layer>
    </>
  );
};

type OrbitItem = { key: string; label: string; icons: IconName[]; at: number; phase: number; tint: string };
const ITEMS: OrbitItem[] = [
  { key: "team", label: "Equipo", icons: ["users"], at: B.team, phase: Math.PI * 0.1, tint: "#463DE1" },
  { key: "pdv", label: "Puntos de venta", icons: ["pin", "checklist"], at: B.pdv, phase: Math.PI * 0.1 + (Math.PI * 2) / 3, tint: "#1D4ED8" },
  { key: "data", label: "Datos", icons: ["gear", "dashboard"], at: B.process, phase: Math.PI * 0.1 + (Math.PI * 4) / 3, tint: "#7025E0" },
];

export const Tile: React.FC<{ label: string; icons: IconName[]; tint: string; scale?: number }> = ({ label, icons, tint, scale = 1 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transform: `scale(${scale})` }}>
    <div style={{ width: 92, height: 92, borderRadius: 24, background: "#FFFFFF", boxShadow: "0 18px 40px rgba(5,3,31,0.45)", display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
      {icons.map((ic) => (
        <Icon key={ic} name={ic} size={icons.length > 1 ? 36 : 46} color={tint} sw={1.7} />
      ))}
    </div>
    {label && <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 17, color: "#FFFFFF", whiteSpace: "nowrap", textShadow: "0 2px 10px rgba(0,0,0,0.45)" }}>{label}</div>}
  </div>
);

// Tareas que salen del teléfono (mismas que la pantalla) y quedan rondando la cabeza.
const POPS: { icon: IconName; tint: string; a: number; r: number }[] = [
  { icon: "pin", tint: "#1D4ED8", a: -150, r: 200 },
  { icon: "form", tint: "#D97706", a: -110, r: 185 },
  { icon: "alert", tint: "#DC2626", a: -62, r: 200 },
  { icon: "route", tint: "#7025E0", a: -25, r: 215 },
  { icon: "dollar", tint: "#D97706", a: -190, r: 225 },
];

const NOTIFS = Array.from({ length: 10 }).map((_, i) => {
  const side = i % 2 === 0 ? -1 : 1;
  return { x: CARO_X + side * (330 + random(`nx${i}`) * 170), y: 140 + random(`ny${i}`) * 520, at: B.process + 2 + i * 4, icon: (["alert", "form", "clock", "bell", "chat"] as IconName[])[i % 5], w: 110 + random(`nw${i}`) * 50 };
});

export const S01Overload: React.FC = () => {
  const f = useCurrentFrame();
  const c = cam(f);
  const walking = f < WALK[1];
  const stress = f >= STRESS;
  const walkX = interpolate(f, WALK, [260, CARO_X], { easing: easeOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phoneIn = pop(f, 60, { damping: 14, stiffness: 120 }) * (1 - range(f, [STRESS - 4, STRESS + 6], [0, 1], easeInOut));
  const innerOrbit = range(f, [B.team, B.team + 30], [0, 1], easeInOut);
  const items = ITEMS.map((it, idx) => {
    const ang = theta(f) + it.phase;
    const o = orbitPos(ang);
    const p = it.key === "team" ? range(f, [it.at, it.at + 30], [0, 1], easeInOut) : pop(f, it.at, { damping: 10, stiffness: 150, mass: 0.7 });
    const fromX = it.key === "team" ? -300 : o.x;
    const x = it.key === "team" ? interpolate(p, [0, 1], [fromX, o.x]) : o.x;
    const y = (it.key === "team" ? interpolate(p, [0, 1], [ORBIT.cy + 200, o.y]) : o.y) + fall(f, idx).dy;
    const s = interpolate(o.front, [-1, 1], [0.72, 1.08]) * (it.key === "team" ? 1 : p);
    return { it, x, y, s, front: o.front, op: f < it.at ? 0 : interpolate(o.front, [-1, 1], [0.55, 1]) * Math.min(1, p * 2), rot: fall(f, idx).rot };
  });
  const renderItem = (x: (typeof items)[number]) =>
    x.op > 0 ? (
      <div key={x.it.key} style={{ position: "absolute", left: x.x, top: x.y, transform: `translate(-50%, -50%) rotate(${x.rot}deg)`, opacity: x.op, filter: x.front < -0.3 ? "blur(2px)" : undefined }}>
        <Tile label={x.it.label} icons={x.it.icons} tint={x.it.tint} scale={x.s} />
      </div>
    ) : null;
  const pose = walking ? POSE.caroCaminandoA : stress ? POSE.caroEstres : POSE.caroCelular;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Backdrop f={f} cam={c} />
      <Layer cam={c} depth={1}>
        {stress && items.filter((x) => x.front < 0).map(renderItem)}
        <div style={{ position: "absolute", left: (walking ? walkX : CARO_X) - 150, top: FEET - 12, width: 300, height: 24, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(19,13,93,0.12), rgba(19,13,93,0))", opacity: 1 - mood(f) }} />
        <Actor
          pose={pose}
          x={walking ? walkX : CARO_X}
          feetY={FEET}
          scale={SCALE}
          f={f}
          walk={walking ? { poses: [POSE.caroCaminandoA, POSE.caroCaminandoB], period: 7, bob: 7 } : undefined}
          blink={!stress ? { pose: POSE.caroCelularBlink, at: [68, 96] } : undefined}
        />
        {stress && items.filter((x) => x.front >= 0).map(renderItem)}
        {/* Tareas que brotan del celular y rondan la cabeza (halo que nunca cruza la cara) */}
        {POPS.map((m, i) => {
          const at = 64 + i * 8;
          const p = pop(f, at, { damping: 11, stiffness: 160, mass: 0.6 });
          if (p <= 0.01) return null;
          const a = (m.a * Math.PI) / 180;
          const sx = HEAD.x + Math.cos(a) * m.r + osc(f, 40 + i * 3, 5, i * 9);
          const sy = HEAD.y + 30 + Math.sin(a) * m.r * 0.7 + osc(f, 33 + i * 4, 6, i * 13);
          const oa = a + theta(f) * 1.5;
          const ox = HEAD.x + Math.cos(oa) * 250;
          const oy = HEAD.y - 110 + Math.sin(oa) * 50;
          const fromPhone = 1 - range(f, [at, at + 14], [0, 1], easeOut);
          const x = interpolate(innerOrbit, [0, 1], [sx, ox]) + fromPhone * (PHONE.x - 150 - sx) * 0.6;
          const y = interpolate(innerOrbit, [0, 1], [sy, oy]) + fromPhone * (PHONE.y - sy) * 0.6 + fall(f, i + 3).dy;
          const dark = mood(f) > 0.5;
          return (
            <div key={m.icon} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${p}) rotate(${fall(f, i).rot}deg)` }}>
              <div style={{ position: "relative", width: 52, height: 52, borderRadius: 26, background: dark ? "rgba(255,255,255,0.12)" : "#FFFFFF", border: `1.5px solid ${dark ? "rgba(255,255,255,0.3)" : "#E2E8F0"}`, boxShadow: "0 8px 20px rgba(19,13,93,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={m.icon} size={26} color={dark ? "#fff" : m.tint} />
                <div style={{ position: "absolute", top: 0, right: 0, width: 12, height: 12, borderRadius: 6, background: "#DC2626", boxShadow: "0 0 0 2px #fff" }} />
              </div>
            </div>
          );
        })}
      </Layer>

      {/* Notificaciones que saturan los bordes (plano intermedio) */}
      <Layer cam={c} depth={1.2}>
        {NOTIFS.map((n, i) => {
          const p = pop(f, n.at, { damping: 12, stiffness: 170, mass: 0.6 });
          if (p <= 0.01) return null;
          const fl = fall(f, i);
          return (
            <div key={i} style={{ position: "absolute", left: n.x, top: n.y + osc(f, 50, 5, i * 11) + fl.dy, width: n.w, transform: `translate(-50%, -50%) scale(${p}) rotate(${fl.rot + (i % 3) - 1}deg)`, display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 12, background: "rgba(255,255,255,0.94)", boxShadow: "0 10px 26px rgba(0,0,0,0.35)" }}>
              <Icon name={n.icon} size={20} color={i % 3 === 0 ? "#DC2626" : "#463DE1"} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ height: 6, width: "85%", borderRadius: 3, background: "#CFD4E6" }} />
                <div style={{ height: 5, width: "55%", borderRadius: 3, background: "#E3E6F2" }} />
              </div>
            </div>
          );
        })}
      </Layer>

      {/* Celular: lo que Caro está viendo (frontal y derecho) */}
      {phoneIn > 0.01 && (
        <Layer cam={c} depth={1.08}>
          <Device x={PHONE.x} y={PHONE.y} scale={PHONE.s * phoneIn}>
            <TasksScreen f={f - 60} />
          </Device>
        </Layer>
      )}
      <Layer cam={c} depth={1.8} blur={5}>
        <Particles f={f} n={10} seed="s01c" speed={2 + mood(f) * 6} size={[10, 20]} color="#9C7BFF" opacity={0.3} />
      </Layer>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(5,3,31,0.75) 100%)", opacity: mood(f) * (0.7 + range(f, [STRESS, B.drop], [0, 0.3])) }} />
    </AbsoluteFill>
  );
};
