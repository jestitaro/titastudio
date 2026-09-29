import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, osc, pop, range } from "../../lib/motion";
import { Actor, camPath, Layer, LightStudio, Particles, POSE, posePoint, QS, throughBlur } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { APP_H, APP_W, Device } from "../ds/Device";
import { C, FONT, R, S, SH, T } from "../ds/tokens";
import { Chip } from "../ds/ui";
import { Icon } from "../ui/icons";
import { Kinetic } from "../ui/Kinetic";
import { es } from "../../i18n/es";
import { IND, IndicatorsFlow } from "../screens/Indicators";

// Escena 10 — "Información en tiempo real". La cámara arranca pegada al celular de Caro (llega el dato),
// abre para revelarla, empuja hacia el celular que crece desde su mano, se acerca al detalle de OSA que se
// actualiza en vivo, vuelve a abrir para incluir a Caro y termina empujando dentro de la pantalla.
const CARO = { x: 1560, feet: 1180, scale: 0.74 };
const DEV = { x: 760, y: 540, s: 0.95 };
const FLOW0 = 20;
const BORN: [number, number] = [22, 44];
const phone = (() => {
  const p = posePoint(POSE.caroCelular, CARO.scale, { x: 705, y: 380 });
  return { x: CARO.x + p.x, y: CARO.feet + p.y };
})();
const OSA_CARD = { x: DEV.x + (101 - APP_W / 2) * DEV.s, y: DEV.y + (205 - APP_H / 2) * DEV.s };
// Punto de la pantalla (hoja blanca de OSA) donde entra la cámara al final.
export const S10_EXIT = { x: DEV.x, y: DEV.y + 120 };

const cam = (f: number): Cam =>
  camPath(f, [
    { f: 0, x: phone.x, y: phone.y, zoom: 2.3 },
    { f: 22, x: 1320, y: 560, zoom: 1.0 },
    { f: 44, x: 880, y: 540, zoom: 1.12 },
    { f: 56, x: OSA_CARD.x + 40, y: OSA_CARD.y, zoom: 1.9 },
    { f: 66, x: OSA_CARD.x + 40, y: OSA_CARD.y, zoom: 1.95 },
    { f: 80, x: 880, y: 540, zoom: 1.12 },
    { f: 104, x: 900, y: 540, zoom: 1.14 },
    { f: 128, x: 1180, y: 560, zoom: 1.0 },
    { f: 136, x: 1170, y: 560, zoom: 1.0 },
    { f: 150, x: S10_EXIT.x, y: S10_EXIT.y, zoom: 2.2 },
  ]);

const LiveChip: React.FC<{ f: number; at: number; label: string; value: string; up: string; x: number; y: number }> = ({ f, at, label, value, up, x, y }) => {
  const p = pop(f, at, { damping: 12, stiffness: 150 });
  if (p <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y + osc(f, 70, 6), transform: `translate(-50%, -50%) scale(${p})`, background: C.surface, borderRadius: R.card, boxShadow: SH.float, padding: `${S.md}px ${S.lg}px`, display: "flex", alignItems: "center", gap: S.md, fontFamily: FONT }}>
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
  const c = cam(f);
  const born = range(f, BORN, [0, 1], easeInOut);
  const notif = pop(f, 2, { damping: 12, stiffness: 160 }) * (1 - range(f, [26, 34], [0, 1]));
  const detail = range(f, [54, 60], [0, 1]) * (1 - range(f, [70, 76], [0, 1]));
  const blur = throughBlur(f, 150, 10, 10, 12);
  return (
    <AbsoluteFill style={{ overflow: "hidden", filter: blur > 0 ? `blur(${blur}px)` : undefined }}>
      <LightStudio f={f + 525} />
      <Layer cam={c} depth={0.4}>
        <Particles f={f} n={30} seed="s10" color={QS.indigo} speed={0.3} size={[2, 5]} opacity={0.3} />
      </Layer>
      <Layer cam={c} depth={1}>
        <div style={{ position: "absolute", left: CARO.x - 200, top: CARO.feet - 16, width: 400, height: 32, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(19,13,93,0.16), rgba(19,13,93,0))" }} />
        <Actor pose={POSE.caroCelular} x={CARO.x} feetY={CARO.feet} scale={CARO.scale} f={f} blink={{ pose: POSE.caroCelularBlink, at: [16, 122] }} />
        {/* El dato que llega desde el campo */}
        {notif > 0.01 && (
          <div style={{ position: "absolute", left: phone.x, top: phone.y - 70, transform: `translate(-50%, -50%) scale(${notif * 0.5})` }}>
            <Chip tone="success" solid icon="check">
              Formulario recibido
            </Chip>
          </div>
        )}
        {born > 0.01 && (
          <Device x={interpolate(born, [0, 1], [phone.x, DEV.x])} y={interpolate(born, [0, 1], [phone.y, DEV.y])} scale={interpolate(born, [0, 1], [0.07, DEV.s])} opacity={Math.min(1, born * 5)}>
            <IndicatorsFlow f={f - FLOW0} />
          </Device>
        )}
      </Layer>
      {detail > 0 && (
        <div style={{ position: "absolute", left: 1180, top: 300, opacity: detail, display: "flex", alignItems: "center", gap: S.sm, background: C.surface, borderRadius: R.pill, padding: `${S.sm}px ${S.lg}px`, boxShadow: SH.float, fontFamily: FONT, ...T.cardTitle, fontSize: 20 }}>
          <span style={{ width: 10, height: 10, borderRadius: 5, background: C.success }} /> OSA actualizado · 64% → 71%
        </div>
      )}
      <LiveChip f={f} at={FLOW0 + IND.live2 + 2} label="Jabón para la ropa" value="69,10%" up="1,28" x={1500} y={230} />
      <Kinetic f={f} text={es.video.kinetic.s10.text} at={78} out={112} x={1120} y={560} accent={[3, 4]} eyebrow={es.video.kinetic.s10.eyebrow} size={56} />
    </AbsoluteFill>
  );
};
