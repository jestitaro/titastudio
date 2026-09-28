import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { easeInOut, osc, pop, range } from "../../lib/motion";
import { BEATS_S01 } from "../timing";
import { Char, DarkSpace, Layer, Particles, POSE, QS, shake } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { nunito } from "../lib/fonts";
import { Icon, IconName } from "../ui/icons";

// Escenas 1–4: Caro sobrecargada. Micro-íconos de tareas alrededor de la cabeza y una órbita
// que suma Equipo → PDV → Datos y acelera. Cierra con todo cayendo hacia el escritorio (escena 5).
const B = BEATS_S01;
const sine = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);

const CARO = { x: 960, feet: 1690, scale: 1.05 };
const HEAD = { x: 982, y: 275 };
const ORBIT = { cx: 975, cy: 395, rx: 600, ry: 135, tilt: -7 };

// Velocidad angular por frame (rad), acelera en cada beat. Se integra numéricamente: determinista.
const omega = (f: number) =>
  0.016 + range(f, [B.pdv, B.pdv + 20], [0, 0.014]) + range(f, [B.process, B.process + 25], [0, 0.02]) + range(f, [B.drop - 10, B.drop + 8], [0, 0.03]);
const THETA: number[] = (() => {
  const a = [0];
  for (let i = 1; i <= 400; i++) a.push(a[i - 1] + omega(i));
  return a;
})();
const theta = (f: number) => THETA[Math.max(0, Math.min(400, Math.floor(f)))];

const orbitPos = (angle: number, rx = ORBIT.rx, ry = ORBIT.ry) => {
  const t = (ORBIT.tilt * Math.PI) / 180;
  const ex = Math.cos(angle) * rx;
  const ey = Math.sin(angle) * ry;
  return {
    x: ORBIT.cx + ex * Math.cos(t) - ey * Math.sin(t),
    y: ORBIT.cy + ex * Math.sin(t) + ey * Math.cos(t),
    front: Math.sin(angle), // >0 delante de Caro
  };
};

const camAt = (f: number): Cam => {
  const k = sine(range(f, [0, B.drop], [0, 1], (t) => t));
  const s = shake(f, range(f, [B.process, B.process + 30], [0, 2.4]) * (1 - range(f, [B.drop, B.drop + 10], [0, 1])));
  const drop = range(f, [B.drop - 4, 300], [0, 1], easeInOut);
  return {
    x: 960 + s.x,
    y: interpolate(k, [0, 1], [560, 470]) + drop * 160 + s.y,
    zoom: interpolate(k, [0, 1], [1, 1.17]) + drop * 0.05,
  };
};

// Caída final (match con las tarjetas que aterrizan en el escritorio).
const fall = (f: number, i: number) => {
  const t = Math.max(0, f - B.drop - (i % 4));
  return { dy: 2.2 * t * t, rot: t * (i % 2 ? 2.2 : -2.6) };
};

// ——— Micro-íconos: tareas que rondan la cabeza ———
const MICRO: { icon: IconName; a: number; r: number; at: number; tint: string }[] = [
  { icon: "bell", a: -150, r: 250, at: 18, tint: "#FFD27A" },
  { icon: "clock", a: -110, r: 235, at: 30, tint: "#FFFFFF" },
  { icon: "calendar", a: -62, r: 250, at: 42, tint: "#FFFFFF" },
  { icon: "alert", a: -25, r: 270, at: 54, tint: "#FF8A80" },
  { icon: "chat", a: -185, r: 280, at: 64, tint: "#FFFFFF" },
  { icon: "form", a: 12, r: 300, at: 76, tint: "#FFFFFF" },
  { icon: "dollar", a: -205, r: 320, at: 88, tint: "#FFD27A" },
];

const Glass: React.FC<{ icon: IconName; tint: string; size?: number; badge?: boolean }> = ({ icon, tint, size = 66, badge }) => (
  <div
    style={{
      position: "relative",
      width: size,
      height: size,
      borderRadius: size / 2,
      background: "rgba(255,255,255,0.10)",
      border: "1.5px solid rgba(255,255,255,0.28)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.25), inset 0 0 18px rgba(255,255,255,0.06)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Icon name={icon} size={size * 0.5} color={tint} />
    {badge && <div style={{ position: "absolute", top: 2, right: 2, width: 14, height: 14, borderRadius: 7, background: "#F44336", boxShadow: "0 0 0 3px rgba(19,13,93,0.9)" }} />}
  </div>
);

// ——— Tiles grandes de la órbita ———
type OrbitItem = { key: string; label: string; icons: IconName[]; at: number; phase: number; tint: string };
const ITEMS: OrbitItem[] = [
  { key: "team", label: "Equipo", icons: ["users"], at: B.team, phase: Math.PI * 0.05, tint: "#463DE1" },
  { key: "pdv", label: "Puntos de venta", icons: ["pin", "checklist"], at: B.pdv, phase: Math.PI * 0.05 + (Math.PI * 2) / 3, tint: "#1976D2" },
  { key: "data", label: "Datos", icons: ["gear", "dashboard"], at: B.process, phase: Math.PI * 0.05 + (Math.PI * 4) / 3, tint: "#7025E0" },
];

export const Tile: React.FC<{ label: string; icons: IconName[]; tint: string; scale?: number }> = ({ label, icons, tint, scale = 1 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, transform: `scale(${scale})` }}>
    <div
      style={{
        width: 128,
        height: 128,
        borderRadius: 34,
        background: "#FFFFFF",
        boxShadow: "0 24px 50px rgba(5,3,31,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
      }}
    >
      {icons.map((ic) => (
        <Icon key={ic} name={ic} size={icons.length > 1 ? 50 : 64} color={tint} sw={1.7} />
      ))}
    </div>
    <div style={{ fontFamily: nunito, fontWeight: 800, fontSize: 24, color: "#FFFFFF", letterSpacing: 0.3, whiteSpace: "nowrap", textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
      {label}
    </div>
  </div>
);

const itemState = (f: number, it: OrbitItem, idx: number) => {
  const ang = theta(f) + it.phase;
  const o = orbitPos(ang);
  const depthScale = interpolate(o.front, [-1, 1], [0.78, 1.14]);
  let x = o.x;
  let y = o.y;
  let s = depthScale;
  let op = interpolate(o.front, [-1, 1], [0.55, 1]);
  const lf = f - it.at;
  if (it.key === "team") {
    // Entra desde el lateral por un motion path y se engancha a la órbita.
    const k = range(f, [it.at, it.at + 34], [0, 1], easeInOut);
    const t = k;
    const p0 = { x: -260, y: 700 };
    const c = { x: 250, y: 90 };
    const bx = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * c.x + t * t * o.x;
    const by = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * c.y + t * t * o.y;
    x = bx;
    y = by;
    s = interpolate(k, [0, 1], [1.3, depthScale]);
    op = interpolate(k, [0, 0.3, 1], [0, 1, op]);
  } else {
    const p = pop(f, it.at, { damping: 10, stiffness: 150, mass: 0.7 });
    s = depthScale * p;
    op = op * Math.min(1, p * 2);
  }
  if (lf < 0) op = 0;
  const fl = fall(f, idx);
  return { x, y: y + fl.dy, s, op, rot: fl.rot, front: o.front };
};

// Mini-notificaciones que saturan los bordes a partir del beat de procesamiento.
const NOTIFS = Array.from({ length: 12 }).map((_, i) => {
  const side = i % 2 === 0 ? -1 : 1;
  return {
    x: 960 + side * (560 + random(`nx${i}`) * 300),
    y: 140 + random(`ny${i}`) * 700,
    at: B.process + 4 + i * 4,
    icon: (["alert", "form", "clock", "bell", "chat", "pin"] as IconName[])[i % 6],
    w: 150 + random(`nw${i}`) * 70,
  };
});

export const S01Overload: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt(f);
  const load = range(f, [0, B.drop], [0, 1], (t) => t);
  const glow = `rgba(${Math.round(interpolate(load, [0, 1], [112, 190]))},${Math.round(interpolate(load, [0, 1], [37, 40]))},${Math.round(
    interpolate(load, [0, 1], [224, 170]),
  )},${interpolate(load, [0, 1], [0.32, 0.45])})`;
  const innerOrbit = range(f, [B.team, B.team + 30], [0, 1], easeInOut);

  const items = ITEMS.map((it, i) => ({ it, st: itemState(f, it, i) }));
  const renderItem = ({ it, st }: (typeof items)[number]) =>
    st.op > 0 ? (
      <div
        key={it.key}
        style={{
          position: "absolute",
          left: st.x,
          top: st.y,
          transform: `translate(-50%, -50%) rotate(${st.rot}deg)`,
          opacity: st.op,
          filter: st.front < -0.2 ? `blur(${interpolate(st.front, [-1, -0.2], [2.5, 0])}px)` : undefined,
        }}
      >
        <Tile label={it.label} icons={it.icons} tint={it.tint} scale={st.s} />
      </div>
    ) : null;

  // Estela de la órbita (elipse fina) para leer la trayectoria.
  const ringO = range(f, [B.team + 10, B.team + 40], [0, 1]) * (1 - range(f, [B.drop, B.drop + 8], [0, 1]));

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <DarkSpace glow={glow} />
      <Layer cam={cam} depth={0.25}>
        <Particles f={f} n={110} seed="s01a" speed={1 + load * 3} size={[1.2, 3]} opacity={0.8} />
      </Layer>
      <Layer cam={cam} depth={0.6}>
        <Particles f={f} n={40} seed="s01b" speed={1.5 + load * 4} size={[2, 5]} color="#B79CFF" opacity={0.7} />
      </Layer>

      <Layer cam={cam} depth={1}>
        {/* Anillo de órbita, mitad trasera */}
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
          <ellipse
            cx={ORBIT.cx}
            cy={ORBIT.cy}
            rx={ORBIT.rx}
            ry={ORBIT.ry}
            transform={`rotate(${ORBIT.tilt} ${ORBIT.cx} ${ORBIT.cy})`}
            fill="none"
            stroke="rgba(183,156,255,0.35)"
            strokeWidth={2}
            strokeDasharray="6 10"
            strokeDashoffset={-f * 2}
            opacity={ringO}
          />
        </svg>
        {items.filter((x) => x.st.front < 0).map(renderItem)}
        <Char pose={POSE.caroEstres} x={CARO.x} feetY={CARO.feet} scale={CARO.scale} />
        {items.filter((x) => x.st.front >= 0).map(renderItem)}

        {/* Micro-íconos: primero flotan cerca de la cabeza, luego entran en una órbita interna */}
        {MICRO.map((m, i) => {
          const p = pop(f, m.at, { damping: 11, stiffness: 160, mass: 0.6 });
          if (p <= 0.001) return null;
          const a = (m.a * Math.PI) / 180;
          const sx = HEAD.x + Math.cos(a) * m.r + osc(f, 40 + i * 3, 5, i * 9);
          const sy = HEAD.y + Math.sin(a) * m.r * 0.72 + osc(f, 33 + i * 4, 6, i * 13);
          const oa = a + theta(f) * 1.6;
          // Halo por encima de la cabeza: nunca cruza la cara.
          const ox = HEAD.x + Math.cos(oa) * 330;
          const oy = HEAD.y - 175 + Math.sin(oa) * 70;
          const front = Math.sin(oa);
          const x = interpolate(innerOrbit, [0, 1], [sx, ox]);
          const y = interpolate(innerOrbit, [0, 1], [sy, oy]) + fall(f, i + 3).dy;
          const behind = innerOrbit > 0.5 && front < 0;
          return (
            <div
              key={m.icon}
              style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `translate(-50%, -50%) scale(${p * (innerOrbit > 0 ? interpolate(front, [-1, 1], [0.8, 1.05]) : 1)}) rotate(${fall(f, i).rot}deg)`,
                opacity: behind ? 0.45 : 1,
              }}
            >
              <Glass icon={m.icon} tint={m.tint} badge={i % 3 === 0} />
            </div>
          );
        })}
      </Layer>

      {/* Saturación: notificaciones en los bordes (plano intermedio con parallax propio) */}
      <Layer cam={cam} depth={1.25}>
        {NOTIFS.map((n, i) => {
          const p = pop(f, n.at, { damping: 12, stiffness: 170, mass: 0.6 });
          if (p <= 0.001) return null;
          const fl = fall(f, i);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: n.x,
                top: n.y + osc(f, 50, 6, i * 11) + fl.dy,
                width: n.w,
                transform: `translate(-50%, -50%) scale(${p}) rotate(${fl.rot + (i % 3) - 1}deg)`,
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.92)",
                boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
              }}
            >
              <Icon name={n.icon} size={26} color={i % 3 === 0 ? "#E53935" : QS.indigo} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ height: 8, width: "85%", borderRadius: 4, background: "#CFD4E6" }} />
                <div style={{ height: 7, width: "55%", borderRadius: 4, background: "#E3E6F2" }} />
              </div>
              <div style={{ width: 12, height: 12, borderRadius: 6, background: "#F44336" }} />
            </div>
          );
        })}
      </Layer>

      {/* Foreground: partículas grandes desenfocadas que cruzan cámara */}
      <Layer cam={cam} depth={1.8} blur={5}>
        <Particles f={f} n={10} seed="s01c" speed={3 + load * 6} size={[10, 22]} color="#9C7BFF" opacity={0.35} />
      </Layer>

      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(5,3,31,0.75) 100%)",
          opacity: 0.6 + load * 0.4,
        }}
      />
    </AbsoluteFill>
  );
};
