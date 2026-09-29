import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { easeInOut, osc, pop, range } from "../../lib/motion";
import { Actor, Layer, Particles, POSE, QS } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { C as DC, FONT } from "../ds/tokens";
import { ar } from "../screens/data";
import { Icon, IconName } from "../ui/icons";
import { Tile } from "./S01Overload";

// Escena 5 — el tiempo pasa: Caro sentada y preocupada frente al escritorio, el reloj corre, los papeles
// se apilan, la ventana pasa de día a noche; una pila de papeles cruza cámara y la encontramos dormida.
// Agotamiento operativo, no tristeza.
const DUR = 165;
const DESK_Y = 660;
const SLEEP = 104;
const CARO = { x: 960, feet: 1075, scale: 0.6 };

const cam = (f: number): Cam => ({
  x: 960 + range(f, [0, DUR], [-30, 30]),
  y: range(f, [0, 40], [440, 520], easeInOut) + range(f, [40, DUR], [0, 10]),
  zoom: range(f, [0, DUR], [1.02, 1.12], (t) => t),
});

const mix = (a: string, b: string, t: number) => `color-mix(in srgb, ${b} ${Math.round(Math.min(1, Math.max(0, t)) * 100)}%, ${a})`;

const Window: React.FC<{ f: number }> = ({ f }) => {
  const t = range(f, [6, DUR - 10], [0, 1], (x) => x);
  const top = t < 0.5 ? mix("#7EC3FF", "#FF9E7A", t * 2) : mix("#FF9E7A", "#141250", (t - 0.5) * 2);
  const bottom = t < 0.5 ? mix("#CFE8FF", "#FFD2A8", t * 2) : mix("#FFD2A8", "#2A1F7A", (t - 0.5) * 2);
  const sunY = interpolate(t, [0, 0.6], [60, 300], { extrapolateRight: "clamp" });
  const moonO = range(t, [0.62, 0.85], [0, 1], (x) => x);
  return (
    <div style={{ position: "absolute", left: 1290, top: 120, width: 400, height: 320, borderRadius: 18, overflow: "hidden", border: "14px solid #2E2690" }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${top}, ${bottom})` }} />
      <div style={{ position: "absolute", left: 240, top: sunY, width: 66, height: 66, borderRadius: 33, background: "#FFE08A", boxShadow: "0 0 50px #FFD166" }} />
      <div style={{ position: "absolute", left: 70, top: 56, width: 50, height: 50, borderRadius: 25, background: "#F4F1FF", opacity: moonO, boxShadow: "0 0 30px rgba(244,241,255,0.7)" }} />
      <div style={{ position: "absolute", left: 85, top: 48, width: 46, height: 46, borderRadius: 23, background: bottom, opacity: moonO }} />
      <div style={{ position: "absolute", inset: 0, opacity: moonO }}>
        <Particles f={f} n={24} seed="win" area={{ x: 0, y: 0, w: 380, h: 180 }} speed={0} size={[1.5, 3]} />
      </div>
      {[0, 70, 140, 220, 290].map((x, i) => (
        <div key={x} style={{ position: "absolute", left: x, bottom: 0, width: 60, height: 90 + (i % 3) * 40, background: mix("#5B6BC9", "#15124A", t) }} />
      ))}
      <div style={{ position: "absolute", left: 186, top: 0, width: 14, height: "100%", background: "#2E2690" }} />
    </div>
  );
};

const WallClock: React.FC<{ f: number }> = ({ f }) => (
  <svg width={160} height={160} viewBox="0 0 100 100" style={{ position: "absolute", left: 230, top: 130 }}>
    <circle cx="50" cy="50" r="46" fill="#F4F1FF" stroke="#2E2690" strokeWidth="6" />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <line key={i} x1={50 + Math.sin(a) * 34} y1={50 - Math.cos(a) * 34} x2={50 + Math.sin(a) * 39} y2={50 - Math.cos(a) * 39} stroke={QS.dark} strokeWidth={i % 3 ? 1.5 : 3} strokeLinecap="round" />;
    })}
    <line x1="50" y1="50" x2="50" y2="27" stroke={QS.dark} strokeWidth="4.5" strokeLinecap="round" transform={`rotate(${f * 2.4 + 40} 50 50)`} />
    <line x1="50" y1="50" x2="50" y2="16" stroke="#E53935" strokeWidth="3" strokeLinecap="round" transform={`rotate(${f * 28} 50 50)`} />
    <circle cx="50" cy="50" r="4" fill="#E53935" />
  </svg>
);

const Monitor: React.FC<{ f: number }> = ({ f }) => {
  const hours = Math.floor(range(f, [6, DUR - 6], [36, 212], (t) => t * t));
  const cost = range(f, [6, DUR - 6], [240000, 1864300], (t) => t * t);
  const rows = Math.min(8, Math.floor(range(f, [0, DUR - 20], [2, 8.99], (t) => t)));
  return (
    <div style={{ position: "absolute", left: 560, top: 250, width: 480, height: 330 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: "#0F0B45", padding: 12, boxShadow: "0 30px 60px rgba(0,0,0,0.4)" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 8, background: "#EEF0FA", overflow: "hidden", fontFamily: FONT, padding: 12 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1, background: "#FFF", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontSize: 12, color: DC.text2 }}>Horas invertidas</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: QS.dark }}>{hours} h</div>
            </div>
            <div style={{ flex: 1.3, background: "#FFF", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontSize: 12, color: DC.text2 }}>Costo operativo</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: DC.error }}>$ {ar(cost, 0)}</div>
            </div>
          </div>
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              {[40, 22, 18, 20].map((w, j) => (
                <div key={j} style={{ width: `${w}%`, height: 13, borderRadius: 3, background: j === 3 && i % 3 === 1 ? "#FECACA" : "#D5D9EA" }} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 210, top: 330, width: 60, height: 80, background: "#1B1566" }} />
    </div>
  );
};

const Plant: React.FC<{ f: number }> = ({ f }) => (
  <svg width={180} height={250} viewBox="0 0 190 260" style={{ position: "absolute", left: 1560, top: DESK_Y - 244 }}>
    <g transform={`rotate(${osc(f, 120, 1.5)} 95 190)`}>
      {[
        [-40, 60, "#3E8E7E"],
        [30, 50, "#4FA88F"],
        [-10, 20, "#5BBE9C"],
        [60, 110, "#3E8E7E"],
        [-70, 120, "#4FA88F"],
      ].map(([dx, top, c], i) => (
        <path key={i} d={`M95 190 C ${95 + Number(dx) * 0.2} ${Number(top) + 60}, ${95 + Number(dx)} ${Number(top) + 20}, ${95 + Number(dx)} ${top} C ${95 + Number(dx) * 1.4} ${Number(top) + 50}, ${95 + Number(dx) * 0.4} 150, 95 190Z`} fill={String(c)} />
      ))}
    </g>
    <path d="M55 180h80l-10 78H65Z" fill="#7C5CFC" />
    <rect x="48" y="172" width="94" height="16" rx="6" fill="#9B82FF" />
  </svg>
);

type Paper = { x: number; y: number; rot: number; at: number; kind: "tile" | "paper" | "sticky"; icon?: IconName; tile?: number };
const TILES = [
  { icons: ["users"] as IconName[], tint: "#463DE1" },
  { icons: ["pin", "checklist"] as IconName[], tint: "#1D4ED8" },
];
const PAPERS: Paper[] = [
  { x: 420, y: DESK_Y - 40, rot: -8, at: 0, kind: "tile", tile: 0 },
  { x: 1440, y: DESK_Y - 40, rot: 6, at: 4, kind: "tile", tile: 1 },
  ...Array.from({ length: 24 }).map((_, i): Paper => {
    const pile = i % 3;
    const px = [330, 560, 1380][pile];
    const level = Math.floor(i / 3);
    return { x: px + (random(`px${i}`) - 0.5) * 60, y: DESK_Y - 8 - level * 15, rot: (random(`pr${i}`) - 0.5) * 16, at: 12 + i * 3.4, kind: i % 5 === 4 ? "sticky" : "paper", icon: (["form", "alert", "clock", "checklist", "chat"] as IconName[])[i % 5] };
  }),
];

const PaperCard: React.FC<{ p: Paper }> = ({ p }) =>
  p.kind === "sticky" ? (
    <div style={{ width: 100, height: 90, background: "#FFD86B", borderRadius: 6, boxShadow: "0 8px 16px rgba(0,0,0,0.25)", padding: 12 }}>
      <div style={{ height: 7, width: "80%", background: "#E0AE2E", borderRadius: 3, marginBottom: 8 }} />
      <div style={{ height: 7, width: "60%", background: "#E0AE2E", borderRadius: 3 }} />
    </div>
  ) : (
    <div style={{ width: 190, height: 56, background: "#FFFFFF", borderRadius: 10, boxShadow: "0 8px 18px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", gap: 10, padding: "0 12px" }}>
      <Icon name={p.icon ?? "form"} size={24} color={p.icon === "alert" ? "#DC2626" : "#463DE1"} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 7, width: "85%", background: "#CFD4E6", borderRadius: 3, marginBottom: 7 }} />
        <div style={{ height: 6, width: "55%", background: "#E3E6F2", borderRadius: 3 }} />
      </div>
      <div style={{ width: 11, height: 11, borderRadius: 6, background: "#DC2626" }} />
    </div>
  );

export const S05Desk: React.FC = () => {
  const f = useCurrentFrame();
  const c = cam(f);
  const asleep = f >= SLEEP;
  const dim = range(f, [30, DUR], [0, 0.4], easeInOut);
  // Pila de papeles que cruza cámara (oculta el cambio de pose).
  const wipe = range(f, [SLEEP - 12, SLEEP + 12], [0, 1], easeInOut);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: QS.darker }}>
      <Layer cam={c} depth={0.5}>
        <div style={{ position: "absolute", left: -600, top: -400, width: 3100, height: 1700, background: "linear-gradient(180deg, #221A78 0%, #1A1466 60%, #130D5D 100%)" }} />
        <WallClock f={f} />
        <Window f={f} />
        <div style={{ position: "absolute", left: 440, top: 190, width: 200, height: 14, borderRadius: 7, background: "#2E2690" }} />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ position: "absolute", left: 450 + i * 42, top: 110, width: 34, height: 80, borderRadius: 4, background: ["#7C5CFC", "#3C9FF1", "#463DE1", "#9B82FF"][i], transform: `rotate(${i === 3 ? 12 : 0}deg)`, transformOrigin: "bottom left" }} />
        ))}
      </Layer>
      <Layer cam={c} depth={0.85}>
        <Monitor f={f} />
        <div style={{ position: "absolute", left: -400, top: DESK_Y, width: 2800, height: 36, background: "#3A2FA0", borderRadius: 6 }} />
        <div style={{ position: "absolute", left: -400, top: DESK_Y + 36, width: 2800, height: 700, background: "linear-gradient(180deg, #241C80, #140F5A)" }} />
        <Plant f={f} />
        {PAPERS.map((p, i) => {
          if (f < p.at) return null;
          const land = range(f, [p.at, p.at + (p.kind === "tile" ? 14 : 10)], [0, 1], (t) => t * t);
          const bounce = p.kind === "tile" ? pop(f, p.at + 14, { damping: 9, stiffness: 220, mass: 0.5 }) : 1;
          const y = interpolate(land, [0, 1], [p.kind === "tile" ? -500 : -150, p.y]) - (1 - bounce) * 6;
          return (
            <div key={i} style={{ position: "absolute", left: p.x, top: y, transform: `translate(-50%, -100%) rotate(${p.rot * land + (1 - land) * (i % 2 ? 20 : -20)}deg) scale(${p.kind === "tile" ? 0.75 : 1})`, transformOrigin: "50% 100%" }}>
              {p.kind === "tile" ? <Tile label="" icons={TILES[p.tile!].icons} tint={TILES[p.tile!].tint} /> : <PaperCard p={p} />}
            </div>
          );
        })}
      </Layer>
      <Layer cam={c} depth={1}>
        <div style={{ position: "absolute", left: CARO.x - 230, top: CARO.feet - 20, width: 460, height: 40, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,0.45), rgba(0,0,0,0))" }} />
        <Actor pose={asleep ? POSE.caroDurmiendo : POSE.caroSentada} x={CARO.x} feetY={CARO.feet} scale={CARO.scale} f={f} />
        {/* "Z" del sueño, chicas y suaves */}
        {asleep &&
          [0, 1, 2].map((i) => {
            const t = ((f - SLEEP - i * 12) % 40) / 40;
            if (f - SLEEP - i * 12 < 0) return null;
            return (
              <div key={i} style={{ position: "absolute", left: CARO.x + 120 + t * 60, top: 250 - t * 110, fontFamily: FONT, fontWeight: 700, fontSize: 30 + i * 6, color: "#C9B8FF", opacity: Math.sin(t * Math.PI) }}>
                z
              </div>
            );
          })}
      </Layer>
      {/* Pila de papeles en primer plano que cruza cámara */}
      {wipe > 0 && wipe < 1 && (
        <div style={{ position: "absolute", left: interpolate(wipe, [0, 1], [-900, 2100]), top: -80, width: 900, height: 1300, transform: "rotate(-6deg)", filter: "blur(6px)" }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 60 + (i % 2) * 40, top: 80 + i * 160, width: 780, height: 150, borderRadius: 18, background: i % 3 === 2 ? "#FFD86B" : "#F4F1FF", boxShadow: "0 20px 40px rgba(0,0,0,0.35)" }} />
          ))}
        </div>
      )}
      <Layer cam={c} depth={1.5} blur={3}>
        <Particles f={f} n={14} seed="s05" speed={0.5} size={[4, 9]} color="#B79CFF" opacity={0.3} />
      </Layer>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(5,3,31,0.9) 100%)", opacity: 0.5 + dim }} />
    </AbsoluteFill>
  );
};
