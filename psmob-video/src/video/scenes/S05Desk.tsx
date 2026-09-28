import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { easeInOut, easeOut, osc, pop, range } from "../../lib/motion";
import { Layer, Particles, QS } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { roboto } from "../lib/fonts";
import { ar } from "../data";
import { Icon, IconName } from "../ui/icons";
import { Tile } from "./S01Overload";

// Escena 5 — pausa narrativa sin personaje: el tiempo pasa (ventana día→noche, reloj, reloj de arena),
// las tareas se apilan sobre el escritorio y el costo sube. Leve oscurecimiento progresivo.
const DESK_Y = 760;
const DUR = 150;

const cam = (f: number): Cam => ({
  x: 960 + range(f, [0, DUR], [-20, 20]),
  y: range(f, [0, 30], [420, 520], easeOut) + range(f, [30, DUR], [0, 10]),
  zoom: range(f, [0, DUR], [1.08, 1.16], (t) => t),
});

// Ciclo del cielo: 0 día → 0.5 atardecer → 1 noche (dos ciclos para que se lea la repetición).
const skyT = (f: number) => {
  const c = range(f, [8, DUR - 6], [0, 1.6], (t) => t);
  return c <= 1 ? c : 2 - c + 0; // ida (día→noche) y vuelta parcial (amanecer)
};
const mix = (a: string, b: string, t: number) => `color-mix(in srgb, ${b} ${Math.round(t * 100)}%, ${a})`;

const Window: React.FC<{ f: number }> = ({ f }) => {
  const t = skyT(f);
  const top = t < 0.5 ? mix("#7EC3FF", "#FF9E7A", t * 2) : mix("#FF9E7A", "#141250", (t - 0.5) * 2);
  const bottom = t < 0.5 ? mix("#CFE8FF", "#FFD2A8", t * 2) : mix("#FFD2A8", "#2A1F7A", (t - 0.5) * 2);
  const sunY = interpolate(t, [0, 0.6], [70, 300], { extrapolateRight: "clamp" });
  const moonO = range(t, [0.6, 0.85], [0, 1], (x) => x);
  return (
    <div style={{ position: "absolute", left: 1270, top: 150, width: 420, height: 330, borderRadius: 18, overflow: "hidden", border: "14px solid #2E2690" }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${top}, ${bottom})` }} />
      <div style={{ position: "absolute", left: 250, top: sunY, width: 70, height: 70, borderRadius: 35, background: "#FFE08A", boxShadow: "0 0 50px #FFD166" }} />
      <div style={{ position: "absolute", left: 80, top: 60, width: 54, height: 54, borderRadius: 27, background: "#F4F1FF", opacity: moonO, boxShadow: "0 0 30px rgba(244,241,255,0.7)" }} />
      <div style={{ position: "absolute", left: 96, top: 52, width: 50, height: 50, borderRadius: 25, background: bottom, opacity: moonO }} />
      <div style={{ position: "absolute", inset: 0, opacity: moonO }}>
        <Particles f={f} n={26} seed="win" area={{ x: 0, y: 0, w: 400, h: 200 }} speed={0} size={[1.5, 3]} />
      </div>
      {/* Edificios en silueta */}
      {[0, 70, 140, 230, 300].map((x, i) => (
        <div key={x} style={{ position: "absolute", left: x, bottom: 0, width: 62, height: 90 + (i % 3) * 40, background: mix("#5B6BC9", "#15124A", Math.min(1, t)) }} />
      ))}
      <div style={{ position: "absolute", left: 196, top: 0, width: 14, height: "100%", background: "#2E2690" }} />
    </div>
  );
};

const WallClock: React.FC<{ f: number }> = ({ f }) => {
  const m = f * 24;
  const h = f * 2 + 40;
  return (
    <svg width={170} height={170} viewBox="0 0 100 100" style={{ position: "absolute", left: 180, top: 150 }}>
      <circle cx="50" cy="50" r="46" fill="#F4F1FF" stroke="#2E2690" strokeWidth="6" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={50 + Math.sin(a) * 34} y1={50 - Math.cos(a) * 34} x2={50 + Math.sin(a) * 39} y2={50 - Math.cos(a) * 39} stroke={QS.dark} strokeWidth={i % 3 ? 1.5 : 3} strokeLinecap="round" />;
      })}
      <line x1="50" y1="50" x2="50" y2="27" stroke={QS.dark} strokeWidth="4.5" strokeLinecap="round" transform={`rotate(${h} 50 50)`} />
      <line x1="50" y1="50" x2="50" y2="16" stroke="#E53935" strokeWidth="3" strokeLinecap="round" transform={`rotate(${m} 50 50)`} />
      <circle cx="50" cy="50" r="4" fill="#E53935" />
    </svg>
  );
};

const Hourglass: React.FC<{ f: number }> = ({ f }) => {
  const k = range(f, [0, DUR - 10], [0, 1], (t) => t);
  const topH = 44 * (1 - k);
  const botH = 44 * k;
  return (
    <svg width={110} height={170} viewBox="0 0 110 170" style={{ position: "absolute", left: 1190, top: DESK_Y - 170 }}>
      <rect x="8" y="4" width="94" height="12" rx="5" fill="#2E2690" />
      <rect x="8" y="154" width="94" height="12" rx="5" fill="#2E2690" />
      <path d="M20 16h70c0 34-26 48-30 69 4 21 30 35 30 69H20c0-34 26-48 30-69-4-21-30-35-30-69Z" fill="rgba(244,241,255,0.18)" stroke="#B79CFF" strokeWidth="3" />
      <clipPath id="hg-top">
        <path d="M20 16h70c0 34-26 48-30 69h-10c-4-21-30-35-30-69Z" />
      </clipPath>
      <clipPath id="hg-bot">
        <path d="M50 85h10c4 21 30 35 30 69H20c0-34 26-48 30-69Z" />
      </clipPath>
      <rect x="10" y={85 - topH} width="90" height={topH} fill="#FFC857" clipPath="url(#hg-top)" />
      <rect x="10" y={154 - botH} width="90" height={botH} fill="#FFC857" clipPath="url(#hg-bot)" />
      {k < 0.98 && <rect x="53.5" y="85" width="3" height={69 - botH} fill="#FFC857" opacity={0.9} />}
    </svg>
  );
};

const Plant: React.FC<{ f: number }> = ({ f }) => (
  <svg width={190} height={260} viewBox="0 0 190 260" style={{ position: "absolute", left: 1580, top: DESK_Y - 250 }}>
    <g transform={`rotate(${osc(f, 120, 1.5)} 95 190)`}>
      {[
        [95, 190, -40, 60, "#3E8E7E"],
        [95, 190, 30, 50, "#4FA88F"],
        [95, 190, -10, 20, "#5BBE9C"],
        [95, 190, 60, 110, "#3E8E7E"],
        [95, 190, -70, 120, "#4FA88F"],
      ].map(([x, y, dx, top, c], i) => (
        <path key={i} d={`M${x} ${y} C ${Number(x) + Number(dx) * 0.2} ${Number(top) + 60}, ${Number(x) + Number(dx)} ${Number(top) + 20}, ${Number(x) + Number(dx)} ${top} C ${Number(x) + Number(dx) * 1.4} ${Number(top) + 50}, ${Number(x) + Number(dx) * 0.4} ${Number(y) - 40}, ${x} ${y}Z`} fill={String(c)} />
      ))}
    </g>
    <path d="M55 180h80l-10 78H65Z" fill="#7C5CFC" />
    <rect x="48" y="172" width="94" height="16" rx="6" fill="#9B82FF" />
  </svg>
);

// Tarjetas/papeles que se acumulan. Las tres primeras son las de la órbita (match con escena 1–4).
type Paper = { x: number; y: number; rot: number; at: number; kind: "tile" | "paper" | "sticky"; icon?: IconName; tile?: number };
const TILES = [
  { label: "Equipo", icons: ["users"] as IconName[], tint: "#463DE1" },
  { label: "Puntos de venta", icons: ["pin", "checklist"] as IconName[], tint: "#1976D2" },
  { label: "Datos", icons: ["gear", "dashboard"] as IconName[], tint: "#7025E0" },
];
const PAPERS: Paper[] = [
  { x: 470, y: DESK_Y - 70, rot: -8, at: 0, kind: "tile", tile: 0 },
  { x: 960, y: DESK_Y - 40, rot: 6, at: 3, kind: "tile", tile: 1 },
  { x: 1450, y: DESK_Y - 60, rot: -4, at: 6, kind: "tile", tile: 2 },
  ...Array.from({ length: 22 }).map((_, i): Paper => {
    const pile = i % 3;
    const px = [360, 610, 1400][pile];
    const level = Math.floor(i / 3);
    return {
      x: px + (random(`px${i}`) - 0.5) * 60,
      y: DESK_Y - 12 - level * 16,
      rot: (random(`pr${i}`) - 0.5) * 16,
      at: 18 + i * 5,
      kind: i % 5 === 4 ? "sticky" : "paper",
      icon: (["form", "alert", "clock", "checklist", "chat"] as IconName[])[i % 5],
    };
  }),
];

const PaperCard: React.FC<{ p: Paper }> = ({ p }) =>
  p.kind === "sticky" ? (
    <div style={{ width: 110, height: 100, background: "#FFD86B", borderRadius: 6, boxShadow: "0 8px 16px rgba(0,0,0,0.25)", padding: 12 }}>
      <div style={{ height: 7, width: "80%", background: "#E0AE2E", borderRadius: 3, marginBottom: 8 }} />
      <div style={{ height: 7, width: "60%", background: "#E0AE2E", borderRadius: 3 }} />
    </div>
  ) : (
    <div style={{ width: 200, height: 60, background: "#FFFFFF", borderRadius: 10, boxShadow: "0 8px 18px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", gap: 10, padding: "0 12px" }}>
      <Icon name={p.icon ?? "form"} size={26} color={p.icon === "alert" ? "#E53935" : QS.indigo} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 7, width: "85%", background: "#CFD4E6", borderRadius: 3, marginBottom: 7 }} />
        <div style={{ height: 6, width: "55%", background: "#E3E6F2", borderRadius: 3 }} />
      </div>
      <div style={{ width: 11, height: 11, borderRadius: 6, background: "#F44336" }} />
    </div>
  );

const Monitor: React.FC<{ f: number }> = ({ f }) => {
  const hours = Math.floor(range(f, [10, DUR - 10], [36, 212], (t) => t * t));
  const cost = range(f, [10, DUR - 10], [240000, 1864300], (t) => t * t);
  const rows = Math.min(9, Math.floor(range(f, [0, DUR - 20], [2, 9.99], (t) => t)));
  return (
    <div style={{ position: "absolute", left: 700, top: 300, width: 520, height: 360 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "#0F0B45", padding: 14, boxShadow: "0 30px 60px rgba(0,0,0,0.4)" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 8, background: "#EEF0FA", overflow: "hidden", fontFamily: roboto, padding: 14 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1, background: "#FFF", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontSize: 12, color: "#616161" }}>Horas invertidas</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: QS.dark }}>{hours} h</div>
            </div>
            <div style={{ flex: 1.3, background: "#FFF", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontSize: 12, color: "#616161" }}>Costo operativo</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#D32F2F" }}>$ {ar(cost, 0)}</div>
            </div>
          </div>
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              {[40, 22, 18, 20].map((w, j) => (
                <div key={j} style={{ width: `${w}%`, height: 14, borderRadius: 3, background: j === 3 && i % 3 === 1 ? "#FFCDD2" : "#D5D9EA" }} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 230, top: 360, width: 60, height: 70, background: "#1B1566" }} />
      <div style={{ position: "absolute", left: 170, top: 425, width: 180, height: 16, borderRadius: 8, background: "#1B1566" }} />
    </div>
  );
};

export const S05Desk: React.FC = () => {
  const f = useCurrentFrame();
  const c = cam(f);
  const dim = range(f, [40, DUR], [0, 0.45], easeInOut);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: QS.darker }}>
      {/* Pared */}
      <Layer cam={c} depth={0.5}>
        <div style={{ position: "absolute", left: -400, top: -400, width: 2800, height: 1600, background: "linear-gradient(180deg, #221A78 0%, #1A1466 60%, #130D5D 100%)" }} />
        <WallClock f={f} />
        <Window f={f} />
        {/* Estantería con carpetas */}
        <div style={{ position: "absolute", left: 420, top: 230, width: 200, height: 14, borderRadius: 7, background: "#2E2690" }} />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ position: "absolute", left: 430 + i * 42, top: 150, width: 34, height: 80, borderRadius: 4, background: ["#7C5CFC", "#3C9FF1", "#463DE1", "#9B82FF"][i], transform: `rotate(${i === 3 ? 12 : 0}deg)`, transformOrigin: "bottom left" }} />
        ))}
      </Layer>
      {/* Escritorio + objetos */}
      <Layer cam={c} depth={1}>
        <Monitor f={f} />
        <div style={{ position: "absolute", left: -300, top: DESK_Y, width: 2600, height: 40, background: "#3A2FA0", borderRadius: 6 }} />
        <div style={{ position: "absolute", left: -300, top: DESK_Y + 40, width: 2600, height: 600, background: "linear-gradient(180deg, #241C80, #140F5A)" }} />
        <Hourglass f={f} />
        <Plant f={f} />
        {/* Teclado */}
        <div style={{ position: "absolute", left: 790, top: DESK_Y - 22, width: 340, height: 22, borderRadius: 6, background: "#2E2690" }} />
        {PAPERS.map((p, i) => {
          const land = p.kind === "tile" ? range(f, [p.at, p.at + 16], [0, 1], (t) => t * t) : range(f, [p.at, p.at + 10], [0, 1], (t) => t * t);
          if (f < p.at) return null;
          const bounce = p.kind === "tile" ? pop(f, p.at + 16, { damping: 9, stiffness: 220, mass: 0.5 }) : 1;
          const y = interpolate(land, [0, 1], [p.kind === "tile" ? -500 : -150, p.y]) - (1 - bounce) * 6;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: p.x,
                top: y,
                transform: `translate(-50%, -100%) rotate(${p.rot * land + (1 - land) * (i % 2 ? 20 : -20)}deg) scale(${p.kind === "tile" ? 0.8 : 1})`,
                transformOrigin: "50% 100%",
              }}
            >
              {p.kind === "tile" ? (
                <Tile label="" icons={TILES[p.tile!].icons} tint={TILES[p.tile!].tint} />
              ) : (
                <PaperCard p={p} />
              )}
            </div>
          );
        })}
      </Layer>
      {/* Polvo en suspensión delante */}
      <Layer cam={c} depth={1.5} blur={3}>
        <Particles f={f} n={16} seed="s05" speed={0.5} size={[4, 9]} color="#B79CFF" opacity={0.35} />
      </Layer>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 45%, rgba(0,0,0,0) 35%, rgba(5,3,31,0.9) 100%)", opacity: 0.55 + dim }} />
      <AbsoluteFill style={{ background: "#05031F", opacity: dim * 0.6 }} />
    </AbsoluteFill>
  );
};
