import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, osc, pop, range } from "../../lib/motion";
import { BEATS_S01 } from "../timing";
import { Actor, camPath, Contact, DotStudio, Layer, POSE, WALK_CARO } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { C, FONT, R, SH } from "../ds/tokens";
import { Icon, IconName } from "../ui/icons";

// Escenas 1–4. Estudio claro del primer video (puntos + círculos suaves). Caro entra caminando desde fuera
// de cuadro y se detiene exactamente en el centro. Mira su celular (sin mostrar la pantalla) y, de a una,
// aparecen las cosas que tiene que hacer: Equipo, PDV, Checklist, Análisis y la alerta de visita vencida.
// Una sola cámara: push-in lento. Al final todo cae y Caro cae con ello (la cámara baja con ella).
const B = BEATS_S01;
export const S01_FEET = 940;
export const S01_SCALE = 0.56;
const CX = 960;

const walkX = (f: number) => interpolate(f, [0, B.stop], [-360, CX], { easing: (t) => 1 - Math.pow(1 - t, 1.6), extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// Gravedad de la caída (continúa en la escena 5 con la misma velocidad).
export const FALL_G = 1.0;
const fallY = (f: number, at: number) => {
  const t = Math.max(0, f - at);
  return -Math.sin(Math.min(1, t / 8) * Math.PI) * (t < 8 ? 26 : 0) + (t > 8 ? 0.5 * FALL_G * (t - 8) * (t - 8) : 0);
};

const cam = (f: number): Cam => {
  // Caminata en plano medio (cintura para arriba) con la cámara acompañándola: las piernas quedan fuera
  // de cuadro. Cuando se frena, la cámara abre a cuerpo entero con los pies apoyados.
  if (f <= B.stop) return { x: Math.max(260, walkX(f) + 110), y: 300, zoom: 1.8 };
  const base = camPath(f, [
    { f: B.stop, x: CX + 110, y: 300, zoom: 1.8 },
    { f: B.open, x: CX, y: 530, zoom: 1.02 },
    { f: B.drop, x: CX, y: 510, zoom: 1.12 },
  ]);
  // Tilt hacia abajo siguiendo la caída.
  const t = Math.max(0, f - B.drop - 10);
  return { ...base, y: base.y + 0.5 * 0.4 * t * t, zoom: base.zoom - range(f, [B.drop + 10, 360], [0, 0.1], easeInOut) };
};

type Item = { key: string; label: string; icon: IconName; tint: string; x: number; y: number; at: number };
const ITEMS: Item[] = [
  { key: "team", label: "Equipo", icon: "users", tint: C.primary, x: 620, y: 330, at: B.team },
  { key: "pdv", label: "Puntos de venta", icon: "pin", tint: C.violet, x: 1310, y: 300, at: B.pdv },
  { key: "check", label: "Checklist", icon: "checklist", tint: C.primary, x: 1330, y: 610, at: B.check },
  { key: "data", label: "Análisis", icon: "chart", tint: C.violet, x: 600, y: 640, at: B.data },
];

// Tarjeta de un solo ícono (estilo del primer video).
const IconTile: React.FC<{ icon: IconName; tint: string; label: string }> = ({ icon, tint, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
    <div style={{ width: 96, height: 96, borderRadius: 28, background: C.surface, boxShadow: SH.float, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name={icon} size={48} color={tint} sw={1.8} />
    </div>
    <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 20, color: C.dark, whiteSpace: "nowrap" }}>{label}</div>
  </div>
);

// Alerta como la del primer video: visita vencida con badge rojo.
const AlertCard: React.FC = () => (
  <div style={{ position: "relative", width: 330, display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: C.surface, borderRadius: R.card, boxShadow: SH.float, fontFamily: FONT }}>
    <div style={{ width: 46, height: 46, borderRadius: 12, background: C.errorSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon name="alert" size={26} color={C.error} />
    </div>
    <div>
      <div style={{ fontSize: 19, fontWeight: 600, color: C.text, whiteSpace: "nowrap" }}>Visita vencida</div>
      <div style={{ fontSize: 15, color: C.text2, whiteSpace: "nowrap", marginTop: 2 }}>SUPERMERCADO DÍA</div>
    </div>
    <div style={{ position: "absolute", top: -10, right: -10, minWidth: 30, height: 30, padding: "0 8px", borderRadius: 15, background: C.error, color: "#fff", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 3px #fff" }}>3</div>
  </div>
);

export const S01Overload: React.FC = () => {
  const f = useCurrentFrame();
  const c = cam(f);
  const walking = f < B.stop;
  const falling = f >= B.drop + 6;
  const stress = f >= B.stress;
  const x = walking ? walkX(f) : CX;
  const pose = falling ? POSE.caroCaida : stress ? POSE.caroEstres : POSE.caroCelular;
  const caroY = S01_FEET + (falling ? fallY(f, B.drop + 6) : 0);
  const warm = range(f, [B.stress, B.drop], [0, 1], easeInOut);
  const floorO = 1 - range(f, [B.drop + 10, B.drop + 30], [0, 1]);
  const renderFloat = (key: string, px: number, py: number, at: number, i: number, node: React.ReactNode) => {
    const p = pop(f, at, { damping: 15, stiffness: 110 });
    if (p <= 0.01) return null;
    const fy = fallY(f, B.drop + i * 3);
    const rot = Math.max(0, f - B.drop - i * 3) * (i % 2 ? 0.8 : -0.9);
    return (
      <div key={key} style={{ position: "absolute", left: px, top: py + osc(f, 90, 6, i * 17) + fy, transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * Math.min(p, 1.15)}) rotate(${rot}deg)`, opacity: Math.min(1, p * 1.6) }}>
        {node}
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <DotStudio f={f} cam={c} />
      {/* Tensión: leve tinte cálido en los bordes, sin oscurecer el estudio */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(220,38,38,0.12) 100%)", opacity: warm }} />
      <Layer cam={c} depth={1}>
        {/* Debajo del estudio: el mundo se oscurece hacia el escritorio (la cámara baja con la caída) */}
        <div style={{ position: "absolute", left: -1500, top: 1020, width: 5000, height: 2400, background: "linear-gradient(180deg, rgba(238,241,250,0) 0px, #3A2FA0 420px, #221A78 900px)" }} />
        <div style={{ opacity: floorO }}>
          <Contact x={x} y={S01_FEET} w={320} />
        </div>
        <Actor pose={pose} x={x} feetY={caroY} scale={S01_SCALE} f={f} walk={walking ? WALK_CARO : undefined} blink={!stress ? { pose: POSE.caroCelularBlink, at: [96, 126] } : undefined} />
        {ITEMS.map((it, i) => renderFloat(it.key, it.x, it.y, it.at, i, <IconTile icon={it.icon} tint={it.tint} label={it.label} />))}
        {renderFloat("alert", 1330, 820, B.alert, 4, <AlertCard />)}
      </Layer>
    </AbsoluteFill>
  );
};
