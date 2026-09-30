import React from "react";
import { AbsoluteFill, interpolate, random } from "remotion";
import { useSceneFrame } from "../lib/sceneClock";
import { easeInOut, osc, range } from "../../lib/motion";
import { Actor, Layer, Particles, POSE, QS } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { C as DC, FONT } from "../ds/tokens";
import { ar } from "../screens/data";
import { Icon, IconName } from "../ui/icons";

// Escena 5 — continúa la caída de la 1: Caro cae desde arriba junto con los papeles y aterriza detrás del
// escritorio (que queda en primer plano). Después, progresión lenta: sentada y preocupada, el reloj y el
// costo avanzan, los papeles se acumulan, se hace de noche; una pila de papeles cruza cámara y la
// encontramos dormida. Foco: tiempo + costo + agotamiento. Sin íconos.
const DUR = 255;
const DESK_Y = 700;
const LAND = 22;
const SLEEP = 190;
const CARO = { x: 960, feet: 1075, scale: 0.6 };
const FALL_V0 = 56; // velocidad con la que Caro sale de cuadro en la escena 1

const cam = (f: number): Cam => ({
  x: 960,
  y: range(f, [0, LAND + 6], [470, 540], easeInOut) - range(f, [40, DUR], [0, 30], easeInOut),
  zoom: range(f, [40, DUR], [1.0, 1.1], easeInOut),
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
    <div style={{ position: "absolute", left: 250, top: 250, width: 480, height: 330 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: "#0F0B45", padding: 12, boxShadow: "0 30px 60px rgba(0,0,0,0.4)" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 8, background: "#EEF0FA", overflow: "hidden", fontFamily: FONT, padding: 12 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1, background: "#FFF", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontSize: 16, color: DC.text2 }}>Horas invertidas</div>
              <div style={{ fontSize: 34, fontWeight: 700, color: QS.dark }}>{hours} h</div>
            </div>
            <div style={{ flex: 1.3, background: "#FFF", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontSize: 16, color: DC.text2 }}>Costo operativo</div>
              <div style={{ fontSize: 34, fontWeight: 700, color: DC.error }}>$ {ar(cost, 0)}</div>
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
      
    </div>
  );
};

const Plant: React.FC<{ f: number }> = ({ f }) => (
  <svg width={180} height={250} viewBox="0 0 190 260" style={{ position: "absolute", left: 1500, top: DESK_Y - 244 }}>
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

type Paper = { x: number; y: number; rot: number; at: number; kind: "paper" | "sticky"; icon?: IconName; fall?: boolean };
// Papeles que caen con Caro + pilas que crecen despacio sobre el escritorio.
const PAPERS: Paper[] = [
  ...[520, 700, 1230, 1400].map((x, i): Paper => ({ x, y: DESK_Y + 4 - (i % 2) * 6, rot: (i % 2 ? 7 : -6), at: 0, kind: "paper", icon: (["form", "alert", "clock", "checklist"] as IconName[])[i], fall: true })),
  ...Array.from({ length: 27 }).map((_, i): Paper => {
    const pile = i % 3;
    const px = [560, 700, 1300][pile];
    const level = Math.floor(i / 3) + 1;
    return { x: px + (random(`px${i}`) - 0.5) * 50, y: DESK_Y + 4 - level * 13, rot: (random(`pr${i}`) - 0.5) * 14, at: 40 + i * 5.2, kind: i % 5 === 4 ? "sticky" : "paper", icon: (["form", "alert", "clock", "checklist", "chat"] as IconName[])[i % 5] };
  }),
];

const PaperCard: React.FC<{ p: Paper }> = ({ p }) =>
  p.kind === "sticky" ? (
    <div style={{ width: 100, height: 60, background: "#FFD86B", borderRadius: 6, boxShadow: "0 6px 12px rgba(0,0,0,0.25)", padding: 10 }}>
      <div style={{ height: 7, width: "80%", background: "#E0AE2E", borderRadius: 3, marginBottom: 8 }} />
      <div style={{ height: 7, width: "60%", background: "#E0AE2E", borderRadius: 3 }} />
    </div>
  ) : (
    <div style={{ width: 190, height: 44, background: "#FFFFFF", borderRadius: 8, boxShadow: "0 6px 14px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", gap: 10, padding: "0 12px" }}>
      <Icon name={p.icon ?? "form"} size={20} color={p.icon === "alert" ? "#DC2626" : "#463DE1"} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 6, width: "85%", background: "#CFD4E6", borderRadius: 3, marginBottom: 6 }} />
        <div style={{ height: 5, width: "55%", background: "#E3E6F2", borderRadius: 3 }} />
      </div>
    </div>
  );

// Altura (pies del ancla) de la pose de caída en función del frame.
const fallFeet = (f: number) => -520 + FALL_V0 * f + 0.5 * f * f;

export const S05Desk: React.FC = () => {
  const f = useSceneFrame();
  const c = cam(f);
  const asleep = f >= SLEEP;
  const falling = f < LAND;
  const dim = range(f, [60, DUR], [0, 0.35], easeInOut);
  const wipe = range(f, [SLEEP - 14, SLEEP + 14], [0, 1], easeInOut);
  // Aterrizaje: leve rebote de cámara y papeles que se levantan del escritorio.
  const thud = f >= LAND ? Math.exp(-(f - LAND) / 5) * Math.sin((f - LAND) * 1.6) * 6 : 0;
  const cc = { ...c, y: c.y - thud };
  const puff = range(f, [LAND - 2, LAND + 14], [0, 1]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: QS.darker }}>
      <Layer cam={cc} depth={0.5}>
        <div style={{ position: "absolute", left: -600, top: -400, width: 3100, height: 1700, background: "linear-gradient(180deg, #221A78 0%, #1A1466 60%, #130D5D 100%)" }} />
        <WallClock f={f} />
        <Window f={f} />
        <div style={{ position: "absolute", left: 1340, top: 520, width: 200, height: 14, borderRadius: 7, background: "#2E2690" }} />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ position: "absolute", left: 1350 + i * 42, top: 440, width: 34, height: 80, borderRadius: 4, background: ["#7C5CFC", "#3C9FF1", "#463DE1", "#9B82FF"][i], transform: `rotate(${i === 3 ? 12 : 0}deg)`, transformOrigin: "bottom left" }} />
        ))}
      </Layer>
      <Layer cam={cc} depth={0.8}>
        <Monitor f={f} />
      </Layer>
      <Layer cam={cc} depth={1}>
        {falling ? (
          <Actor pose={POSE.caroCaida} x={CARO.x} feetY={fallFeet(f)} scale={CARO.scale} f={f} />
        ) : (
          <Actor pose={asleep ? POSE.caroDurmiendo : POSE.caroSentada} x={CARO.x} feetY={CARO.feet} scale={CARO.scale} f={f} />
        )}
        {asleep &&
          [0, 1, 2].map((i) => {
            const t = ((f - SLEEP - i * 12) % 40) / 40;
            if (f - SLEEP - i * 12 < 0) return null;
            return (
              <div key={i} style={{ position: "absolute", left: CARO.x + 120 + t * 60, top: 300 - t * 110, fontFamily: FONT, fontWeight: 700, fontSize: 30 + i * 6, color: "#C9B8FF", opacity: Math.sin(t * Math.PI) }}>
                z
              </div>
            );
          })}
      </Layer>
      {/* Escritorio en primer plano: Caro queda detrás */}
      <Layer cam={cc} depth={1.05}>
        <div style={{ position: "absolute", left: -500, top: DESK_Y, width: 3000, height: 34, background: "#4A3FB8", borderRadius: 8 }} />
        <div style={{ position: "absolute", left: -500, top: DESK_Y + 34, width: 3000, height: 800, background: "linear-gradient(180deg, #2F2596, #19135E 60%)" }} />
        <Plant f={f} />
        {PAPERS.map((p, i) => {
          if (!p.fall && f < p.at) return null;
          const y = p.fall
            ? Math.min(p.y, -300 - i * 60 + FALL_V0 * f + 0.5 * f * f)
            : interpolate(range(f, [p.at, p.at + 10], [0, 1], (t) => t * t), [0, 1], [p.y - 160, p.y]);
          const landed = p.fall ? y >= p.y : f >= p.at + 10;
          const rot = landed ? p.rot : p.rot + (i % 2 ? 24 : -24);
          const o = p.fall ? 1 : range(f, [p.at, p.at + 3], [0, 1]);
          return (
            <div key={i} style={{ position: "absolute", left: p.x, top: y, opacity: o, transform: `translate(-50%, -100%) rotate(${rot}deg)`, transformOrigin: "50% 100%" }}>
              <PaperCard p={p} />
            </div>
          );
        })}
      </Layer>
      {/* Al aterrizar: hojas que se levantan y tapan el cambio de pose */}
      {puff > 0 && puff < 1 && (
        <Layer cam={cc} depth={1.1}>
          {Array.from({ length: 9 }).map((_, i) => {
            const a = -Math.PI / 2 + (i - 4) * 0.28;
            const d = puff * (180 + (i % 3) * 60);
            return (
              <div key={i} style={{ position: "absolute", left: CARO.x + Math.cos(a) * d * 1.4 - 70, top: DESK_Y - 40 + Math.sin(a) * d + puff * puff * 160, width: 140, height: 90, borderRadius: 8, background: i % 4 === 3 ? "#FFD86B" : "#F4F1FF", boxShadow: "0 10px 20px rgba(0,0,0,0.3)", transform: `rotate(${(i - 4) * 18 * puff}deg)`, opacity: 1 - puff * puff }} />
            );
          })}
        </Layer>
      )}
      {/* Pila de papeles en primer plano que cruza cámara (cambio a dormida) */}
      {wipe > 0 && wipe < 1 && (
        <div style={{ position: "absolute", left: interpolate(wipe, [0, 1], [-900, 2100]), top: -80, width: 900, height: 1300, transform: "rotate(-6deg)", filter: "blur(6px)" }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 60 + (i % 2) * 40, top: 80 + i * 160, width: 780, height: 150, borderRadius: 18, background: i % 3 === 2 ? "#FFD86B" : "#F4F1FF", boxShadow: "0 20px 40px rgba(0,0,0,0.35)" }} />
          ))}
        </div>
      )}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(5,3,31,0.9) 100%)", opacity: 0.45 + dim }} />
    </AbsoluteFill>
  );
};
