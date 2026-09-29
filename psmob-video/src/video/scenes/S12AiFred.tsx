import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, osc, pop, range } from "../../lib/motion";
import { Actor, camPath, camRange, H, Layer, POSE, posePoint, project, throughBlur, W } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { Device } from "../ds/Device";
import { Chip } from "../ds/ui";
import { C, FONT, R, S, SH, T } from "../ds/tokens";
import { Icon, IconName } from "../ui/icons";
import { FACINGS, Gondola } from "../ui/Gondola";
import { ScanScreen } from "../screens/Scan";

// Escena 12 — AiFred. Travelling: la cámara acompaña a Nico caminando por la góndola (parallax en planos
// y cabeceras que cruzan cámara). Nico se frena y escanea (AR sobre los productos), zoom fuerte a su
// celular: el celular vectorial nace derecho sobre el suyo y muestra el reconocimiento.
const T0 = { walk: [0, 96] as [number, number], ar: [100, 140] as [number, number], zoom: [138, 170] as [number, number], scan: 172, context: [204, 232] as [number, number] };
const NICO_SCALE = 0.7;
const NICO_FEET = 1150;
const NICO_SX = 720; // posición en pantalla mientras camina
const DEPTH_N = 1.1;
export const S12_PHONE = { x: 1400, y: 540, s: 0.92 };

const panEase = (t: number) => (t < 0.85 ? (t / 0.85) * 0.92 : 0.92 + (1 - Math.pow(1 - (t - 0.85) / 0.15, 2)) * 0.08);
const camPan = (f: number) => interpolate(panEase(range(f, T0.walk, [0, 1], (t) => t)), [0, 1], [1450, 2640]);
// Zoom del tramo de caminata: arranca cerrado sobre la góndola (continúa el zoom-through) y abre.
const walkZoom = (f: number) => camRange(f, [0, 26], [1.7, 0.92]);

// Nico se calcula para quedar en NICO_SX mientras camina; se congela al frenar.
const nicoWorldX = (f: number) => {
  const fr = Math.min(f, T0.walk[1]);
  const c: Cam = { x: camPan(fr), y: 540, zoom: walkZoom(fr) };
  const { z, fx } = project(c, DEPTH_N);
  return fx + (NICO_SX - W / 2) / z;
};
const NICO_X = (f: number) => nicoWorldX(f);
const phoneWorld = (f: number) => {
  const p = posePoint(POSE.nicoCelular, NICO_SCALE, { x: 275, y: 460 });
  return { x: NICO_X(f) + p.x, y: NICO_FEET + p.y };
};

// Cámara: travelling → frena → zoom al celular → zoom out leve al contexto → arranca el push-in de la 13.
const PH = phoneWorld(T0.zoom[0]);
const ZOOM_TARGET = { x: 960 + (PH.x - 960) / DEPTH_N + 70, y: 540 + (PH.y - 540) / DEPTH_N + 40, zoom: 2.3 };
export const s12Cam = (f: number): Cam => {
  if (f < T0.zoom[0]) return { x: camPan(f), y: 540, zoom: walkZoom(f) };
  const base = { f: T0.zoom[0], x: camPan(T0.zoom[0]), y: 540, zoom: walkZoom(T0.zoom[0]) };
  return camPath(f, [
    base,
    { f: T0.zoom[1], ...ZOOM_TARGET },
    { f: T0.context[0], ...ZOOM_TARGET },
    { f: T0.context[1], x: ZOOM_TARGET.x + 60, y: 560, zoom: 1.4 },
    { f: 240, x: ZOOM_TARGET.x + 80, y: 555, zoom: 1.46 },
  ]);
};

// Celular en el mundo (plano de Nico): calculado para quedar en S12_PHONE al terminar el zoom.
export const DEV_WORLD = (() => {
  const c = s12Cam(T0.zoom[1]);
  const { z, fx, fy } = project(c, DEPTH_N);
  return { x: fx + (S12_PHONE.x - W / 2) / z, y: fy + (S12_PHONE.y - H / 2) / z, s: S12_PHONE.s / z };
})();

const ArOverlay: React.FC<{ f: number }> = ({ f }) => {
  const near = FACINGS.filter((p) => p.x > 2330 && p.x < 2960 && p.level < 3);
  const sweep = range(f, [T0.ar[0], T0.ar[0] + 34], [0, 1], easeInOut);
  const sx = interpolate(sweep, [0, 1], [2960, 2330]);
  const o = 1 - range(f, [T0.zoom[0] + 10, T0.zoom[0] + 22], [0, 1]);
  const ph = phoneWorld(f);
  if (f < T0.ar[0]) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
        <defs>
          <linearGradient id="beam" x1="1" x2="0" y1="0" y2="0">
            <stop offset="0" stopColor="#7025E0" stopOpacity="0.4" />
            <stop offset="1" stopColor="#7025E0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`${ph.x - 30},${ph.y} ${sx},120 ${sx - 120},120 ${sx - 120},860 ${sx},860`} fill="url(#beam)" />
        <line x1={sx} x2={sx} y1={110} y2={870} stroke="#B79CFF" strokeWidth={4} />
      </svg>
      {near.map((p) => {
        if (sx > p.x) return null;
        const at = T0.ar[0] + ((2960 - p.x) / 630) * 34;
        const k = pop(f, at, { damping: 12, stiffness: 190, mass: 0.6 });
        const bad = p.kind !== "ok";
        const col = bad ? C.error : C.violet;
        return (
          <div key={`${p.level}-${Math.round(p.x)}`} style={{ position: "absolute", left: p.x - p.w / 2 - 3, top: p.base - p.h - 3, width: p.w + 6, height: p.h + 3, border: `3px solid ${col}`, borderRadius: 8, transform: `scale(${0.85 + 0.15 * k})`, opacity: k, background: bad ? "rgba(220,38,38,0.14)" : "rgba(112,37,224,0.06)" }}>
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

// Mundo (se exporta para que la escena 13 herede el mismo fondo).
export const S12World: React.FC<{ f: number; cam?: Cam; device?: React.ReactNode; deviceState?: { x: number; y: number; s: number; o: number } }> = ({ f, cam: camO, device, deviceState }) => {
  const c = camO ?? s12Cam(f);
  const z = Math.min(1, Math.max(0, (c.zoom - 1) / 1.3));
  const walking = f < T0.walk[1];
  return (
    <>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #EEF0FA 0%, #E2E6F4 60%, #D3D9EC 100%)" }} />
      <Layer cam={c} depth={0.35} blur={3 + z * 6}>
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: -600 + i * 520, top: -20, width: 280, height: 24, borderRadius: 12, background: "#FFFFFF", boxShadow: "0 0 60px 20px rgba(255,255,255,0.9)" }} />
        ))}
      </Layer>
      <Layer cam={c} depth={1} blur={z * 7}>
        <Gondola from={camPan(f) - 1400} to={camPan(f) + 1400} />
        <ArOverlay f={f} />
        <div style={{ position: "absolute", left: -400, top: 1100, width: 6400, height: 600, background: "linear-gradient(180deg, #CBD2E6, #BAC2DA)" }} />
      </Layer>
      <Layer cam={c} depth={DEPTH_N} blur={z * 3}>
        <div style={{ position: "absolute", left: NICO_X(f) - 210, top: NICO_FEET - 22, width: 420, height: 44, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(19,13,93,0.25), rgba(19,13,93,0))" }} />
        <Actor
          pose={walking ? POSE.nicoCaminando : POSE.nicoCelular}
          x={NICO_X(f)}
          feetY={NICO_FEET}
          scale={NICO_SCALE}
          f={f}
          walk={walking ? { poses: [POSE.nicoCaminando], period: 9, bob: 9 } : undefined}
          blink={walking ? undefined : { pose: POSE.nicoCelularBlink, at: [118, 200] }}
        />
      </Layer>
      {/* El celular vive en el plano de Nico pero siempre nítido (es el protagonista) */}
      {device && deviceState && deviceState.o > 0.001 && (
        <Layer cam={c} depth={DEPTH_N}>
          <Device x={deviceState.x} y={deviceState.y} scale={deviceState.s} opacity={deviceState.o}>
            {device}
          </Device>
        </Layer>
      )}
      {/* Cabeceras de góndola que cruzan cámara */}
      <Layer cam={c} depth={1.7} blur={10}>
        {[1500, 2900].map((x) => (
          <div key={x} style={{ position: "absolute", left: x, top: 80, width: 200, height: 1400, borderRadius: 26, background: "linear-gradient(180deg, #1D4ED8 0 90px, #E7EBF4 90px)", opacity: 0.92 }} />
        ))}
      </Layer>
    </>
  );
};

const Insight: React.FC<{ f: number; at: number; icon: IconName; title: string; value: string; tone: string; y: number }> = ({ f, at, icon, title, value, tone, y }) => {
  const p = pop(f, at, { damping: 12, stiffness: 150 }) * (1 - range(f, [232, 240], [0, 1], easeInOut));
  if (p <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 330, top: y + osc(f, 70, 5), transform: `translate(-50%, -50%) scale(${p})`, background: C.surface, borderRadius: R.card, padding: `${S.md}px ${S.lg}px`, display: "flex", alignItems: "center", gap: S.md, boxShadow: SH.float, fontFamily: FONT, width: 300 }}>
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
  const born = range(f, [T0.zoom[0] + 6, T0.zoom[1] + 2], [0, 1], easeInOut);
  const ph = phoneWorld(f);
  const dev = { x: interpolate(born, [0, 1], [ph.x, DEV_WORLD.x]), y: interpolate(born, [0, 1], [ph.y, DEV_WORLD.y]), s: interpolate(born, [0, 1], [0.03, DEV_WORLD.s]), o: Math.min(1, born * 6) };
  const blur = throughBlur(f, 240, 0, 10, 12);
  return (
    <AbsoluteFill style={{ overflow: "hidden", filter: blur > 0 ? `blur(${blur}px)` : undefined }}>
      <S12World f={f} cam={c} device={<ScanScreen f={f - T0.scan} />} deviceState={dev} />
      {f >= T0.ar[0] && f < T0.zoom[0] + 14 && (
        <div style={{ position: "absolute", left: 100, top: 90, transform: `scale(${pop(f, T0.ar[0])})`, transformOrigin: "0 0", opacity: 1 - range(f, [T0.zoom[0], T0.zoom[0] + 12], [0, 1]) }}>
          <div style={{ display: "flex", alignItems: "center", gap: S.sm, background: C.dark, color: "#fff", padding: `${S.md}px ${S.xl}px`, borderRadius: R.pill, fontFamily: FONT, fontSize: 24, fontWeight: 700, boxShadow: SH.float }}>
            <Icon name="sparkle" size={28} color="#B79CFF" /> AiFred escaneando góndola
          </div>
        </div>
      )}
      <Insight f={f} at={190} icon="dollar" title="Precios validados" value="46 / 48" tone={C.success} y={300} />
      <Insight f={f} at={196} icon="grid" title="Planograma" value="92% OK" tone={C.violet} y={520} />
      <Insight f={f} at={202} icon="alert" title="Faltantes" value="2 productos" tone={C.error} y={740} />
    </AbsoluteFill>
  );
};
