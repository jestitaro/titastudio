import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, osc, pop, range } from "../../lib/motion";
import { Actor, camPath, Layer, LightStudio, Particles, POSE, posePoint, QS } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { Device } from "../ds/Device";
import { C, FONT, R, S, SH, T } from "../ds/tokens";
import { Chip } from "../ds/ui";
import { Icon } from "../ui/icons";
import { Kinetic } from "../ui/Kinetic";
import { es } from "../../i18n/es";
import { IND, IndicatorsFlow } from "../screens/Indicators";
import { StoreBackdrop } from "./S09Capture";
import { CARO_W } from "./world";

// Escena 10 — "Información en tiempo real". Cortina suave desde la góndola al estudio: Caro, de cuerpo
// entero, recibe el formulario de Nico; su celular crece hacia su derecha (hacia donde mira) con los
// indicadores que se actualizan en vivo. Un solo movimiento de cámara: acercamiento lento.
export const DEV10 = { x: 1150, y: 520, s: 0.8 };
const BORN: [number, number] = [34, 70];
const FLOW0 = 40;
const TS = 0.85;
export const phone10 = (() => {
  const p = posePoint(POSE.caroCelular, CARO_W.scale, { x: 705, y: 380 });
  return { x: CARO_W.x + p.x, y: CARO_W.feet + p.y };
})();

export const camS10 = (f: number): Cam =>
  camPath(f, [
    { f: 0, x: 980, y: 540, zoom: 1.0 },
    { f: 165, x: 1010, y: 520, zoom: 1.08 },
  ]);

const LiveChip: React.FC<{ f: number; at: number; label: string; value: string; up: string; x: number; y: number }> = ({ f, at, label, value, up, x, y }) => {
  const p = pop(f, at, { damping: 16, stiffness: 110 });
  if (p <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y + osc(f, 90, 5), transform: `translate(-50%, -50%) scale(${p})`, background: C.surface, borderRadius: R.card, boxShadow: SH.float, padding: `${S.md}px ${S.lg}px`, display: "flex", alignItems: "center", gap: S.md, fontFamily: FONT }}>
      <div style={{ width: 44, height: 44, borderRadius: R.sm, background: C.violetSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="chart" size={26} color={C.violet} />
      </div>
      <div>
        <div style={{ ...T.caption, fontSize: 15, color: C.text2 }}>{label}</div>
        <div style={{ ...T.kpi, color: C.text }}>
          {value} <span style={{ fontSize: 16, color: C.success }}>▲ {up}</span>
        </div>
      </div>
    </div>
  );
};

export const S10Realtime: React.FC = () => {
  const f = useCurrentFrame();
  const c = camS10(f);
  const wipe = range(f, [0, 40], [0, 1], easeInOut);
  const born = range(f, BORN, [0, 1], easeInOut);
  const notif = pop(f, 18, { damping: 16, stiffness: 110 }) * (1 - range(f, [40, 52], [0, 1]));
  const storeCam: Cam = { x: 1080, y: 500, zoom: 1.02 };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <StoreBackdrop cam={storeCam} offset={2600} />
      <AbsoluteFill style={{ WebkitMaskImage: `linear-gradient(to left, black ${wipe * 120 - 20}%, transparent ${wipe * 120}%)`, maskImage: `linear-gradient(to left, black ${wipe * 120 - 20}%, transparent ${wipe * 120}%)` }}>
        <LightStudio f={f + 690} />
        <Layer cam={c} depth={0.4}>
          <Particles f={f} n={30} seed="s10" color={QS.indigo} speed={0.25} size={[2, 5]} opacity={0.3} />
        </Layer>
        <Layer cam={c} depth={1}>
          <div style={{ position: "absolute", left: CARO_W.x - 200, top: CARO_W.feet - 16, width: 400, height: 32, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(19,13,93,0.16), rgba(19,13,93,0))" }} />
          <Actor pose={POSE.caroCelular} x={CARO_W.x} feetY={CARO_W.feet} scale={CARO_W.scale} f={f} blink={{ pose: POSE.caroCelularBlink, at: [24, 120] }} />
          {notif > 0.01 && (
            <div style={{ position: "absolute", left: phone10.x + 30, top: phone10.y - 80, transform: `translate(-50%, -50%) scale(${notif})` }}>
              <Chip tone="success" solid icon="check">
                Formulario recibido · Nico
              </Chip>
            </div>
          )}
          {born > 0.01 && (
            <Device x={interpolate(born, [0, 1], [phone10.x, DEV10.x])} y={interpolate(born, [0, 1], [phone10.y, DEV10.y])} scale={interpolate(born, [0, 1], [0.05, DEV10.s])} opacity={Math.min(1, born * 4)}>
              <IndicatorsFlow f={(f - FLOW0) * TS} />
            </Device>
          )}
        </Layer>
        <LiveChip f={f} at={FLOW0 + IND.live1 / TS + 4} label="OSA" value="71%" up="7 pts" x={1600} y={300} />
        <Kinetic f={f} text={es.video.kinetic.s10.text} at={70} out={200} x={1440} y={560} accent={[3, 4]} eyebrow={es.video.kinetic.s10.eyebrow} size={52} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
