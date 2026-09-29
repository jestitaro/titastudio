import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, osc, pop, range } from "../../lib/motion";
import { Actor, Layer, LightStudio, Particles, POSE, posePoint, QS } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { APP_H, APP_W, Device } from "../ds/Device";
import { C, FONT, R, S, SH, T } from "../ds/tokens";
import { Icon } from "../ui/icons";
import { Kinetic } from "../ui/Kinetic";
import { es } from "../../i18n/es";
import { IND, IndicatorsFlow } from "../screens/Indicators";

// Escena 10 — "Información en tiempo real". Caro → su celular crece (frontal) → Indicadores con count-up
// → push al detalle de OSA (se actualiza en vivo) → swipe a Exhibición y OSA → vuelve Caro.
const CARO = { x: 900, feet: 1180, scale: 0.74 };
const FLOW0 = 20;
export const S10_END = { x: 700, y: 540, s: 0.95 };
const phone = (() => {
  const p = posePoint(POSE.caroCelular, CARO.scale, { x: 705, y: 380 });
  return { x: CARO.x + p.x, y: CARO.feet + p.y };
})();
// Card OSA (primera del grid) en coords de pantalla del celular final.
const OSA_CARD = { x: S10_END.x + (101 - APP_W / 2) * S10_END.s, y: S10_END.y + (205 - APP_H / 2) * S10_END.s };

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
  const born = range(f, [12, 32], [0, 1], easeInOut);
  const caroOut = range(f, [14, 34], [0, 1], easeInOut);
  const caroBack = range(f, [102, 122], [0, 1], easeInOut);
  const zin = range(f, [38, 50], [0, 1], easeInOut) * (1 - range(f, [60, 70], [0, 1], easeInOut));
  const cam: Cam = { x: interpolate(zin, [0, 1], [960, OSA_CARD.x]), y: interpolate(zin, [0, 1], [540, OSA_CARD.y]), zoom: 1 + zin * 1.1 };
  const ph = { x: interpolate(born, [0, 1], [phone.x, S10_END.x]), y: interpolate(born, [0, 1], [phone.y, S10_END.y]), s: interpolate(born, [0, 1], [0.07, S10_END.s]) };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightStudio f={f + 525} />
      <Layer cam={cam} depth={0.4}>
        <Particles f={f} n={30} seed="s10" color={QS.indigo} speed={0.3} size={[2, 5]} opacity={0.3} />
      </Layer>
      <Layer cam={cam} depth={1}>
        {/* Caro: al inicio al centro; al final vuelve por la derecha */}
        {caroOut < 1 && (
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${caroOut * 900}px)`, opacity: 1 - caroOut * 0.3 }}>
            <Actor pose={POSE.caroCelular} x={CARO.x} feetY={CARO.feet} scale={CARO.scale} f={f} blink={{ pose: POSE.caroCelularBlink, at: [4] }} />
          </div>
        )}
        {caroBack > 0 && (
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - caroBack) * 700}px)` }}>
            <Actor pose={POSE.caroCelular} x={1560} feetY={CARO.feet} scale={CARO.scale} f={f} blink={{ pose: POSE.caroCelularBlink, at: [134] }} />
          </div>
        )}
        {born > 0.01 && (
          <Device x={ph.x} y={ph.y} scale={ph.s} opacity={Math.min(1, born * 5)}>
            <IndicatorsFlow f={f - FLOW0} />
          </Device>
        )}
      </Layer>
      {/* Etiqueta del detalle durante el push */}
      {zin > 0.6 && (
        <div style={{ position: "absolute", left: 1100, top: 330, opacity: range(zin, [0.6, 1], [0, 1], (t) => t), display: "flex", alignItems: "center", gap: S.sm, background: C.surface, borderRadius: R.pill, padding: `${S.sm}px ${S.lg}px`, boxShadow: SH.float, fontFamily: FONT, ...T.cardTitle, fontSize: 20 }}>
          <span style={{ width: 10, height: 10, borderRadius: 5, background: C.success }} /> OSA actualizado · 64% → 71%
        </div>
      )}
      <LiveChip f={f} at={FLOW0 + IND.live2 + 2} label="Jabón para la ropa" value="69,10%" up="1,28" x={1500} y={250} />
      <LiveChip f={f} at={FLOW0 + IND.live3 + 2} label="OSA general" value="36%" up="6 pts" x={1140} y={860} />
      <Kinetic f={f} text={es.video.kinetic.s10.text} at={68} out={100} x={1130} y={520} accent={[3, 4]} eyebrow={es.video.kinetic.s10.eyebrow} size={60} />
    </AbsoluteFill>
  );
};
