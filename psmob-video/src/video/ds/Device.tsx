import React from "react";
import { SH } from "./tokens";

// Celular vectorial: siempre frontal y derecho. Sin rotaciones ni perspectiva.
export const APP_W = 390;
export const APP_H = 844;
const BEZEL = 12;
export const DEVICE_W = APP_W + BEZEL * 2;
export const DEVICE_H = APP_H + BEZEL * 2;

// `appH` permite igualar la proporción de la pantalla del celular que Caro sostiene en el PNG.
export const Device: React.FC<{ x: number; y: number; scale: number; children: React.ReactNode; opacity?: number; appH?: number }> = ({ x, y, scale, children, opacity = 1, appH = APP_H }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: DEVICE_W,
      height: appH + BEZEL * 2,
      transform: `translate(-50%, -50%) scale(${scale})`,
      borderRadius: 60,
      padding: BEZEL,
      background: "#141A33",
      boxShadow: `${SH.float}, inset 0 0 0 2px #2B3456`,
      opacity,
    }}
  >
    <div style={{ position: "relative", width: APP_W, height: appH, borderRadius: 48, overflow: "hidden", background: "#fff" }}>
      {children}
      <div style={{ position: "absolute", top: 10, left: APP_W / 2 - 50, width: 100, height: 28, borderRadius: 14, background: "#141A33" }} />
      {/* Anillo del color del bisel: tapa el borde antialiasado para que la app llegue al marco */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 48, boxShadow: "inset 0 0 0 2px #141A33", pointerEvents: "none" }} />
    </div>
  </div>
);

// UI montada sobre la pantalla en blanco de un PNG (celular frontal del personaje).
// Escala uniforme por ancho; la altura de la app se adapta a la pantalla del PNG.
export const PngScreen: React.FC<{ x: number; y: number; w: number; h: number; radius: number; children: React.ReactNode; notch?: boolean }> = ({
  x,
  y,
  w,
  h,
  radius,
  children,
  notch,
}) => {
  const k = w / APP_W;
  return (
    // 2 px de sangrado sobre el marco del PNG para que no quede una línea clara entre pantalla y bisel.
    <div style={{ position: "absolute", left: x - 2, top: y - 2, width: w + 4, height: h + 4, borderRadius: radius + 2, overflow: "hidden", background: "#fff" }}>
      <div style={{ position: "absolute", left: 2, top: 2, width: APP_W, height: h / k, transform: `scale(${k})`, transformOrigin: "0 0" }}>{children}</div>
      {notch && <div style={{ position: "absolute", top: 0, left: w * 0.31, width: w * 0.38, height: w * 0.07, borderRadius: `0 0 ${w * 0.04}px ${w * 0.04}px`, background: "#0B1540" }} />}
    </div>
  );
};
