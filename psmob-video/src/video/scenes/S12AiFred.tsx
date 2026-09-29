import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, osc, pop, range } from "../../lib/motion";
import { Actor, camPath, H, Layer, POSE, posePoint, project, W } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { Device } from "../ds/Device";
import { Chip } from "../ds/ui";
import { C, FONT, R, S, SH, T } from "../ds/tokens";
import { Icon, IconName } from "../ui/icons";
import { FACINGS, Gondola } from "../ui/Gondola";
import { ScanScreen } from "../screens/Scan";

// Escena 12 — AiFred. Travelling: la cámara acompaña a Nico, que camina hacia la izquierda (hacia donde
// mira) por la góndola. Se frena, escanea los productos que tiene delante (realidad aumentada) y su
// celular crece hacia su izquierda con el reconocimiento. La cámara se acerca despacio; Nico siempre
// encuadrado con la cabeza dentro del cuadro.
const T0 = { walk: [0, 112] as [number, number], ar: [124, 170] as [number, number], born: [176, 210] as [number, number], scan: 204 };
export const NICO12 = { feet: 1080, scale: 0.66 };
const NICO_SX = 1320; // posición en pantalla mientras camina (espacio libre adelante, a su izquierda)
export const DEPTH_N = 1.1;
const PAN: [number, number] = [4150, 3100];
const Z_WALK = 0.95;

const panX = (f: number) => interpolate(f, T0.walk, PAN, { easing: (t) => (t < 0.8 ? t / 0.8 * 0.9 : 0.9 + (1 - Math.pow(1 - (t - 0.8) / 0.2, 2)) * 0.1), extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const s12Cam = (f: number): Cam => {
  if (f <= T0.walk[1]) return { x: panX(f), y: 520, zoom: Z_WALK };
  return camPath(f, [
    { f: T0.walk[1], x: PAN[1], y: 520, zoom: Z_WALK },
    { f: 150, x: PAN[1], y: 515, zoom: Z_WALK },
    { f: 270, x: PAN[1] - 40, y: 470, zoom: 1.1 },
  ]);
};

// Nico queda fijo en NICO_SX mientras camina; al frenar, su posición en el mundo se congela.
const nicoX = (f: number) => {
  const fr = Math.min(f, T0.walk[1]);
  const { z, fx } = project({ x: panX(fr), y: 520, zoom: Z_WALK }, DEPTH_N);
  return fx + (NICO_SX - W / 2) / z;
};
export const NICO12_X = nicoX(T0.walk[1]);
export const phone12 = (() => {
  const p = posePoint(POSE.nicoCelular, NICO12.scale, { x: 275, y: 460 });
  return { x: NICO12_X + p.x, y: NICO12.feet + p.y };
})();
// Celular en el plano de Nico, a su izquierda.
export const DEV12 = (() => {
  const c = s12Cam(T0.born[1]);
  const { z, fx, fy } = project(c, DEPTH_N);
  return { x: fx + (760 - W / 2) / z, y: fy + (520 - H / 2) / z, s: 0.8 / z };
})();

const ArOverlay: React.FC<{ f: number }> = ({ f }) => {
  const near = FACINGS.filter((p) => p.x > 2380 && p.x < 2980 && p.level < 3);
  const sweep = range(f, [T0.ar[0], T0.ar[1]], [0, 1], easeInOut);
  const sx = interpolate(sweep, [0, 1], [2980, 2380]);
  const o = 1 - range(f, [T0.born[0] + 10, T0.born[1] + 10], [0, 1]);
  if (f < T0.ar[0] || o <= 0) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", left: sx - 4, top: 110, width: 6, height: 760, borderRadius: 3, background: "#B79CFF", boxShadow: "0 0 30px 8px rgba(112,37,224,0.35)", opacity: sweep < 1 ? 1 : 0 }} />
      {near.map((p) => {
        if (sx > p.x) return null;
        const at = T0.ar[0] + ((2980 - p.x) / 600) * (T0.ar[1] - T0.ar[0]);
        const k = pop(f, at, { damping: 16, stiffness: 120 });
        const bad = p.kind !== "ok";
        const col = bad ? C.error : C.violet;
        return (
          <div key={`${p.level}-${Math.round(p.x)}`} style={{ position: "absolute", left: p.x - p.w / 2 - 3, top: p.base - p.h - 3, width: p.w + 6, height: p.h + 3, border: `3px solid ${col}`, borderRadius: 8, opacity: k, background: bad ? "rgba(220,38,38,0.14)" : "rgba(112,37,224,0.06)" }}>
            {bad && (
              <div style={{ position: "absolute", left: "50%", top: -30, transform: "translateX(-50%)", whiteSpace: "nowrap" }}>
                <Chip tone="error" solid icon={p.kind === "gap" ? "alert" : "x"}>
                  {p.kind === "gap" ? "Faltante" : "Fuera de posición"}
                </Chip>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Mundo de la escena (se reutiliza en la 13 con la cámara que continúa).
export const S12World: React.FC<{ f: number; cam: Cam; device?: React.ReactNode; deviceState?: { x: number; y: number; s: number; o: number } }> = ({ f, cam: c, device, deviceState }) => {
  const walking = f < T0.walk[1];
  const nx = walking ? nicoX(f) : NICO12_X;
  return (
    <>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #EEF0FA 0%, #E2E6F4 60%, #D3D9EC 100%)" }} />
      <Layer cam={c} depth={0.35} blur={3}>
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: -600 + i * 520, top: -20, width: 280, height: 24, borderRadius: 12, background: "#FFFFFF", boxShadow: "0 0 60px 20px rgba(255,255,255,0.9)" }} />
        ))}
      </Layer>
      <Layer cam={c} depth={1} blur={range(c.zoom, [1.0, 1.1], [0, 2], (t) => t)}>
        <Gondola from={c.x - 1500} to={c.x + 1500} />
        <ArOverlay f={f} />
        <div style={{ position: "absolute", left: -400, top: 1100, width: 7000, height: 600, background: "linear-gradient(180deg, #CBD2E6, #BAC2DA)" }} />
      </Layer>
      <Layer cam={c} depth={DEPTH_N}>
        <div style={{ position: "absolute", left: nx - 210, top: NICO12.feet - 22, width: 420, height: 44, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(19,13,93,0.22), rgba(19,13,93,0))" }} />
        {walking ? (
          <Actor pose={POSE.nicoCaminando} x={nx} feetY={NICO12.feet} scale={NICO12.scale * 1.05} f={f} walk={{ poses: [POSE.nicoCaminando], period: 10, bob: 7 }} />
        ) : (
          <Actor pose={POSE.nicoCelular} x={nx} feetY={NICO12.feet} scale={NICO12.scale} f={f} blink={{ pose: POSE.nicoCelularBlink, at: [140, 236] }} />
        )}
        {device && deviceState && deviceState.o > 0.001 && (
          <Device x={deviceState.x} y={deviceState.y} scale={deviceState.s} opacity={deviceState.o}>
            {device}
          </Device>
        )}
      </Layer>
      {/* Cabeceras de góndola en primer plano (cruzan cámara durante el travelling) */}
      <Layer cam={c} depth={1.6} blur={10}>
        {[5600, 6600].map((x) => (
          <div key={x} style={{ position: "absolute", left: x, top: 80, width: 200, height: 1400, borderRadius: 26, background: "linear-gradient(180deg, #1D4ED8 0 90px, #E7EBF4 90px)", opacity: 0.9 }} />
        ))}
      </Layer>
    </>
  );
};

const Insight: React.FC<{ f: number; at: number; icon: IconName; title: string; value: string; tone: string; y: number }> = ({ f, at, icon, title, value, tone, y }) => {
  const p = pop(f, at, { damping: 16, stiffness: 110 });
  if (p <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 250, top: y + osc(f, 90, 4), transform: `translate(-50%, -50%) scale(${p})`, background: C.surface, borderRadius: R.card, padding: `${S.md}px ${S.lg}px`, display: "flex", alignItems: "center", gap: S.md, boxShadow: SH.float, fontFamily: FONT, width: 300 }}>
      <div style={{ width: 44, height: 44, borderRadius: R.sm, background: `${tone}1F`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={26} color={tone} />
      </div>
      <div>
        <div style={{ ...T.caption, fontSize: 15, color: C.text2 }}>{title}</div>
        <div style={{ ...T.kpi, fontSize: 24, color: C.text }}>{value}</div>
      </div>
    </div>
  );
};

export const S12AiFred: React.FC = () => {
  const f = useCurrentFrame();
  const c = s12Cam(f);
  const born = range(f, T0.born, [0, 1], easeInOut);
  const dev = { x: interpolate(born, [0, 1], [phone12.x, DEV12.x]), y: interpolate(born, [0, 1], [phone12.y, DEV12.y]), s: interpolate(born, [0, 1], [0.03, DEV12.s]), o: Math.min(1, born * 4) };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <S12World f={f} cam={c} device={<ScanScreen f={(f - T0.scan) * 0.8} />} deviceState={dev} />
      {f >= T0.ar[0] && (
        <div style={{ position: "absolute", left: 100, top: 90, transform: `scale(${pop(f, T0.ar[0], { damping: 16, stiffness: 110 }) * (1 - range(f, [T0.born[0], T0.born[0] + 16], [0, 1]))})`, transformOrigin: "0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: S.sm, background: C.dark, color: "#fff", padding: `${S.md}px ${S.xl}px`, borderRadius: R.pill, fontFamily: FONT, fontSize: 24, fontWeight: 700, boxShadow: SH.float }}>
            <Icon name="sparkle" size={28} color="#B79CFF" /> AiFred escaneando góndola
          </div>
        </div>
      )}
      <Insight f={f} at={226} icon="dollar" title="Precios validados" value="46 / 48" tone={C.success} y={330} />
      <Insight f={f} at={236} icon="grid" title="Planograma" value="92% OK" tone={C.violet} y={520} />
      <Insight f={f} at={246} icon="alert" title="Faltantes" value="2 productos" tone={C.error} y={710} />
    </AbsoluteFill>
  );
};
