import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, range } from "../../lib/motion";
import { Actor, camPath, Contact, Floor, Layer, LightStudio, Particles, POSE, QS } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { DEVICE_H, DEVICE_W, Device } from "../ds/Device";
import { IndicatorsFlow } from "../screens/Indicators";
import { PowerBIReport } from "../screens/PowerBI";
import { camS10, DEV10 } from "./S10Realtime";
import { CARO_W, FLOOR_Y } from "./world";

// Escena 11 — el reporte es protagonista (lenguaje Power BI), dentro de un monitor de pie apoyado en el
// piso del estudio (no un rectángulo flotante). El celular de Caro se abre en la pantalla del monitor, la
// cámara se acerca a los KPI y después se abre para incluir a Caro (izquierda, mirando su celular) y a
// Nico (derecha, señalando el reporte), que entran enteros por el movimiento de cámara.
const REPORT = { w: 1160, h: 800 };
const PANEL = { x: 970, y: 150, w: 860, h: 593 };
const K = PANEL.w / REPORT.w;
const BEZEL = 16;
const MORPH: [number, number] = [0, 40];
const NICO = { x: 2300, feet: FLOOR_Y, scale: 0.5 };

const cam = (f: number): Cam =>
  camPath(f, [
    { f: 0, ...camS10(180) },
    { f: 56, x: 1450, y: 340, zoom: 1.55 },
    { f: 100, x: 1450, y: 345, zoom: 1.56 },
    { f: 170, x: 1450, y: 540, zoom: 0.8 },
    { f: 195, x: 1450, y: 540, zoom: 0.81 },
  ]);

export const S11Dashboard: React.FC = () => {
  const f = useCurrentFrame();
  const c = cam(f);
  const m = range(f, MORPH, [0, 1], easeInOut);
  const frame = range(f, [16, 44], [0, 1], easeInOut);
  const start = { x: DEV10.x - (DEVICE_W * DEV10.s) / 2, y: DEV10.y - (DEVICE_H * DEV10.s) / 2, w: DEVICE_W * DEV10.s, h: DEVICE_H * DEV10.s };
  const r = { x: interpolate(m, [0, 1], [start.x, PANEL.x]), y: interpolate(m, [0, 1], [start.y, PANEL.y]), w: interpolate(m, [0, 1], [start.w, PANEL.w]), h: interpolate(m, [0, 1], [start.h, PANEL.h]) };
  const standH = FLOOR_Y - (PANEL.y + PANEL.h + BEZEL);
  const cx = PANEL.x + PANEL.w / 2;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightStudio f={f + 855} />
      <Layer cam={c} depth={0.4}>
        <Particles f={f} n={30} seed="s11" color={QS.indigo} speed={0.25} size={[2, 5]} opacity={0.3} />
      </Layer>
      <Layer cam={c} depth={1}>
        <Floor y={FLOOR_Y} />
        {/* Monitor de pie: pie y base apoyados en el piso */}
        <div style={{ opacity: frame }}>
          <Contact x={cx} y={FLOOR_Y} w={420} />
          <div style={{ position: "absolute", left: cx - 30, top: PANEL.y + PANEL.h + BEZEL - 4, width: 60, height: standH * frame, background: "linear-gradient(90deg, #2A2F55, #3A4070 50%, #2A2F55)", borderRadius: 6 }} />
          <div style={{ position: "absolute", left: cx - 190, top: FLOOR_Y - 16, width: 380, height: 16, borderRadius: 8, background: "#2A2F55", transform: `scaleX(${frame})` }} />
          <div style={{ position: "absolute", left: PANEL.x - BEZEL, top: PANEL.y - BEZEL, width: PANEL.w + BEZEL * 2, height: PANEL.h + BEZEL * 2, borderRadius: 22, background: "#1F2340", boxShadow: "0 40px 80px rgba(19,13,93,0.28)" }} />
        </div>
        <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: interpolate(m, [0, 1], [56, 8]), overflow: "hidden", background: "#F3F2F1" }}>
          <div style={{ position: "absolute", left: 0, top: 0, opacity: range(f, [14, 34], [0, 1]) }}>
            <div style={{ transform: `scale(${K})`, transformOrigin: "0 0" }}>
              <PowerBIReport f={f - 24} w={REPORT.w} h={REPORT.h} />
            </div>
          </div>
          {/* Reflejo sutil de pantalla */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 35%)", opacity: frame }} />
        </div>
        {m < 0.4 && (
          <div style={{ position: "absolute", inset: 0, opacity: 1 - m / 0.4 }}>
            <Device x={DEV10.x} y={DEV10.y} scale={DEV10.s}>
              <IndicatorsFlow f={(180 - 40) * 0.85} />
            </Device>
          </div>
        )}
        <Contact x={CARO_W.x} y={CARO_W.feet} />
        <Contact x={NICO.x} y={NICO.feet} />
        <Actor pose={POSE.caroCelular} x={CARO_W.x} feetY={CARO_W.feet} scale={CARO_W.scale} f={f} />
        <Actor pose={POSE.nicoExplicando} x={NICO.x} feetY={NICO.feet} scale={NICO.scale} f={f} />
      </Layer>
    </AbsoluteFill>
  );
};
