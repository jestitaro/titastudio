import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, pop, range } from "../../lib/motion";
import { Actor, camPath, Contact, Layer, POSE, posePoint, WALK_NICO } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { Device } from "../ds/Device";
import { Chip } from "../ds/ui";
import { C, FONT, R, S, SH } from "../ds/tokens";
import { Icon } from "../ui/icons";
import { FACINGS, GONDOLA, Gondola, SCAN_ZONE, TAGS } from "../ui/Gondola";
import { ScanScreen } from "../screens/Scan";

// Escena 12 — AiFred. Góndola limpia; Nico entra caminando (hacia la derecha, con los fotogramas nuevos)
// sobre el piso, delante de la góndola, mientras la cámara lo acompaña con un travelling suave. Se frena,
// saca el celular (crece a su izquierda) y el reconocimiento avanza por etapas: 2–3 detecciones, más
// detecciones, precios validados y, al final, faltante y producto fuera de posición.
// Escala y horizonte: la góndola va en segundo plano (zócalo apoyado en la línea de piso) y Nico más
// adelante, con los pies sobre el piso y sombra de contacto.
export const S12_DUR = 300;
export const T0 = { walk: [0, 112] as [number, number], open: 118, born: [128, 162] as [number, number], scan: 162, det1: 172, det2: 198, prices: 224, plano: 244 };
const GS = 0.74; // escala de la góndola en el mundo
const G_FLOOR = 845; // línea de piso donde apoya la góndola
const GY = G_FLOOR - GONDOLA.bottom * GS;
const G_DEPTH = 0.9;
export const DEPTH_N = 1;
export const NICO12 = { feet: 1000, scale: 0.52 };
const WIDE = { x: 2500, y: 540, zoom: 1 };

// Nico camina de cuerpo entero por delante de la góndola (entra por la izquierda) y se frena, a la
// velocidad del ciclo de pasos para que los pies no patinen.
const NICO_STOP_X = 2990;
const WALK_V = WALK_NICO.speed * NICO12.scale;
const nicoX = (f: number) => NICO_STOP_X - WALK_V * Math.max(0, T0.walk[1] - f);

// Travelling suave: la cámara avanza más despacio que Nico, así él cruza el cuadro de izquierda a derecha
// con la góndola pasando detrás, y termina parado a la derecha.
export const s12Cam = (f: number): Cam => {
  if (f <= T0.open) return { x: interpolate(f, [0, T0.open], [1300, WIDE.x], { easing: (t) => 1 - Math.pow(1 - t, 2), extrapolateRight: "clamp" }), y: 540, zoom: 1 };
  return camPath(f, [
    { f: T0.open, ...WIDE },
    { f: S12_DUR, x: WIDE.x - 20, y: 535, zoom: 1.04 },
  ]);
};
export const NICO12_X = nicoX(T0.walk[1]);
export const phone12 = (() => {
  const p = posePoint(POSE.nicoCelular, NICO12.scale, { x: 275, y: 460 });
  return { x: NICO12_X + p.x, y: NICO12.feet + p.y };
})();
// Celular a la izquierda de Nico, en el mismo plano.
export const DEV12 = (() => {
  const c = s12Cam(T0.born[1]);
  return { x: c.x - 60, y: 520, s: 0.8 };
})();

// Góndola en coordenadas locales → capa escalada.
const GondolaSpace: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 0, top: GY, width: GONDOLA.width, height: 1200, transform: `scale(${GS})`, transformOrigin: "0 0" }}>{children}</div>
);

const inZone = FACINGS.filter((p) => p.x > SCAN_ZONE.from && p.x < SCAN_ZONE.to && p.level < 3);
const center = { x: 2400, level: 1 };
const byDist = [...inZone].sort((a, b) => Math.abs(a.x - center.x) + Math.abs(a.level - center.level) * 120 - (Math.abs(b.x - center.x) + Math.abs(b.level - center.level) * 120));
const tagsZone = TAGS.filter((t) => t.x > SCAN_ZONE.from + 40 && t.x < SCAN_ZONE.to - 40 && t.level < 3);

const ArOverlay: React.FC<{ f: number }> = ({ f }) => {
  if (f < T0.det1) return null;
  const good = byDist.filter((p) => p.kind === "ok");
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {good.map((p, i) => {
        // Primero 3 detecciones, después el resto de a poco.
        const at = i < 3 ? T0.det1 + i * 7 : T0.det2 + (i - 3) * 1.2;
        const k = pop(f, at, { damping: 16, stiffness: 120 });
        if (k <= 0.01) return null;
        return <div key={`${p.level}-${Math.round(p.x)}`} style={{ position: "absolute", left: p.x - p.w / 2 - 4, top: p.base - p.h - 4, width: p.w + 8, height: p.h + 4, border: `4px solid ${C.violet}`, borderRadius: 10, opacity: k, background: "rgba(112,37,224,0.06)", transform: `scale(${0.9 + 0.1 * k})` }} />;
      })}
      {tagsZone.map((t, i) => {
        const k = pop(f, T0.prices + i * 2, { damping: 14, stiffness: 140 });
        if (k <= 0.01) return null;
        return (
          <div key={`t${t.level}-${Math.round(t.x)}`} style={{ position: "absolute", left: t.x + 40, top: t.y - 14, width: 34, height: 34, borderRadius: 17, background: C.success, border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${k})` }}>
            <Icon name="check" size={20} color="#fff" sw={3} />
          </div>
        );
      })}
      {inZone
        .filter((p) => p.kind !== "ok")
        .map((p) => {
          const k = pop(f, T0.plano + (p.kind === "gap" ? 0 : 8), { damping: 14, stiffness: 120 });
          if (k <= 0.01) return null;
          return (
            <div key={`b${p.level}-${Math.round(p.x)}`} style={{ position: "absolute", left: p.x - p.w / 2 - 6, top: p.base - p.h - 6, width: p.w + 12, height: p.h + 8, border: `5px solid ${C.error}`, borderRadius: 10, opacity: k, background: "rgba(220,38,38,0.14)" }}>
              <div style={{ position: "absolute", left: "50%", top: -58, transform: `translateX(-50%) scale(${1.9 * k})`, transformOrigin: "50% 100%", whiteSpace: "nowrap" }}>
                <Chip tone="error" solid icon={p.kind === "gap" ? "alert" : "x"}>
                  {p.kind === "gap" ? "Faltante" : "Fuera de posición"}
                </Chip>
              </div>
            </div>
          );
        })}
    </div>
  );
};

// Mundo de la escena (se reutiliza en la 13 con la cámara que continúa).
export const S12World: React.FC<{ f: number; cam: Cam; device?: React.ReactNode; deviceState?: { x: number; y: number; s: number; o: number }; arOpacity?: number }> = ({ f, cam: c, device, deviceState, arOpacity = 1 }) => {
  const walking = f < T0.walk[1];
  const nx = walking ? nicoX(f) : NICO12_X;
  return (
    <>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #F3F5FB 0%, #E6EAF5 100%)" }} />
      <Layer cam={c} depth={0.35} blur={3}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: -600 + i * 520, top: -30, width: 280, height: 24, borderRadius: 12, background: "#FFFFFF", boxShadow: "0 0 60px 20px rgba(255,255,255,0.9)" }} />
        ))}
      </Layer>
      <Layer cam={c} depth={G_DEPTH}>
        {/* Piso: arranca en el zócalo de la góndola */}
        <div style={{ position: "absolute", left: -2000, top: G_FLOOR, width: 9000, height: 900, background: "linear-gradient(180deg, #CDD4E6 0%, #DDE2EF 45%, #E6EAF4 100%)", borderTop: "2px solid rgba(19,13,93,0.12)" }} />
        <div style={{ position: "absolute", left: -2000, top: G_FLOOR, width: 9000, height: 40, background: "linear-gradient(180deg, rgba(19,13,93,0.12), rgba(19,13,93,0))" }} />
        <GondolaSpace>
          <Gondola from={(c.x - 1600) / GS} to={(c.x + 1600) / GS} />
          <div style={{ opacity: arOpacity }}>
            <ArOverlay f={f} />
          </div>
        </GondolaSpace>
      </Layer>
      <Layer cam={c} depth={DEPTH_N}>
        <Contact x={nx} y={NICO12.feet} w={280} />
        {walking ? (
          <Actor pose={POSE.nicoPaso1} x={nx} feetY={NICO12.feet} scale={NICO12.scale} f={f} walk={WALK_NICO} />
        ) : (
          <Actor pose={POSE.nicoCelular} x={nx} feetY={NICO12.feet} scale={NICO12.scale} f={f} />
        )}
        {device && deviceState && deviceState.o > 0.001 && (
          <Device x={deviceState.x} y={deviceState.y} scale={deviceState.s} opacity={deviceState.o}>
            {device}
          </Device>
        )}
      </Layer>
    </>
  );
};

export const S12AiFred: React.FC = () => {
  const f = useCurrentFrame();
  const c = s12Cam(f);
  const born = range(f, T0.born, [0, 1], easeInOut);
  const dev = { x: interpolate(born, [0, 1], [phone12.x, DEV12.x]), y: interpolate(born, [0, 1], [phone12.y, DEV12.y]), s: interpolate(born, [0, 1], [0.03, DEV12.s]), o: Math.min(1, born * 4) };
  const pill = pop(f, T0.born[1], { damping: 16, stiffness: 110 }) * (1 - range(f, [T0.plano - 10, T0.plano], [0, 1], easeInOut));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <S12World f={f} cam={c} device={<ScanScreen f={(f - T0.scan) * 0.8} />} deviceState={dev} />
      {pill > 0.01 && (
        <div style={{ position: "absolute", left: 90, top: 70, transform: `scale(${pill})`, transformOrigin: "0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: S.sm, background: C.dark, color: "#fff", padding: `${S.md}px ${S.xl}px`, borderRadius: R.pill, fontFamily: FONT, fontSize: 24, fontWeight: 700, boxShadow: SH.float }}>
            <Icon name="sparkle" size={28} color="#B79CFF" /> AiFred reconociendo la góndola
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
