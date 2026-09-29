import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, range } from "../../lib/motion";
import { Actor, camPath, Layer, LightStudio, POSE } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { DEVICE_H, DEVICE_W, Device } from "../ds/Device";
import { IndicatorsFlow } from "../screens/Indicators";
import { PowerBIReport } from "../screens/PowerBI";
import { camS10, DEV10 } from "./S10Realtime";
import { CARO_W, NICO_W } from "./world";

// Escena 11 — el reporte es protagonista (lenguaje Power BI). El celular de Caro se abre en el panel;
// la cámara arranca cerca de los KPI y se aleja despacio para incluir a Caro y a Nico, que entra
// caminando hacia la izquierda. Caro a la izquierda mira su celular (de frente al reporte); Nico señala el panel.
const REPORT = { w: 1160, h: 800 };
const PANEL = { x: 730, y: 110, w: 780, h: 538 };
const K = PANEL.w / REPORT.w;
const MORPH: [number, number] = [0, 36];

const cam = (f: number): Cam =>
  camPath(f, [
    { f: 0, ...camS10(165) },
    { f: 50, x: 1060, y: 300, zoom: 1.3 },
    { f: 140, x: 1060, y: 520, zoom: 0.98 },
    { f: 165, x: 1060, y: 520, zoom: 0.99 },
  ]);

export const S11Dashboard: React.FC = () => {
  const f = useCurrentFrame();
  const c = cam(f);
  const m = range(f, MORPH, [0, 1], easeInOut);
  const start = { x: DEV10.x - (DEVICE_W * DEV10.s) / 2, y: DEV10.y - (DEVICE_H * DEV10.s) / 2, w: DEVICE_W * DEV10.s, h: DEVICE_H * DEV10.s };
  const r = { x: interpolate(m, [0, 1], [start.x, PANEL.x]), y: interpolate(m, [0, 1], [start.y, PANEL.y]), w: interpolate(m, [0, 1], [start.w, PANEL.w]), h: interpolate(m, [0, 1], [start.h, PANEL.h]) };
  const nicoWalk = f < 110;
  const nicoX = interpolate(f, [40, 110], [2250, 1790], { easing: (t) => 1 - Math.pow(1 - t, 2), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightStudio f={f + 855} />
      <Layer cam={c} depth={1}>
        <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: interpolate(m, [0, 1], [56, 6]), overflow: "hidden", background: "#F3F2F1", boxShadow: "0 30px 70px rgba(19,13,93,0.2)" }}>
          <div style={{ position: "absolute", left: 0, top: 0, opacity: range(f, [10, 30], [0, 1]) }}>
            <div style={{ transform: `scale(${K})`, transformOrigin: "0 0" }}>
              <PowerBIReport f={f - 20} w={REPORT.w} h={REPORT.h} />
            </div>
          </div>
        </div>
        {m < 0.4 && (
          <div style={{ position: "absolute", inset: 0, opacity: 1 - m / 0.4 }}>
            <Device x={DEV10.x} y={DEV10.y} scale={DEV10.s}>
              <IndicatorsFlow f={(165 - 40) * 0.85} />
            </Device>
          </div>
        )}
        <Actor pose={POSE.caroCelular} x={CARO_W.x} feetY={CARO_W.feet} scale={CARO_W.scale} f={f} blink={{ pose: POSE.caroCelularBlink, at: [60, 140] }} />
        {nicoWalk ? (
          <Actor pose={POSE.nicoCaminando} x={nicoX} feetY={NICO_W.feet} scale={NICO_W.scale * 1.05} f={f} walk={{ poses: [POSE.nicoCaminando], period: 10, bob: 7 }} />
        ) : (
          <Actor pose={POSE.nicoExplicando} x={1790} feetY={NICO_W.feet} scale={NICO_W.scale} f={f} />
        )}
      </Layer>
    </AbsoluteFill>
  );
};
