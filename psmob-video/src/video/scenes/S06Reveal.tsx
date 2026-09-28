import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, easeOut, osc, range } from "../../lib/motion";
import { CARO_SCREEN, Char, Layer, LightStudio, Particles, POSE, QS, toScreen } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { QSLogo } from "../brand/QSLogo";
import { Phone, SCREEN_H, SCREEN_W } from "../ui/Phone";
import { OrganizeScreen } from "../ui/screens/Organize";

// Escena 6 — alivio. Caro muestra su celular (PNG frontal, pantalla en blanco). La pantalla se enciende
// con la UI y un celular vectorial nace exactamente sobre el del PNG y crece recto y frontal al centro.
const CARO = { x: 830, feet: 1500, scale: 0.95 };
const pose = POSE.caroMostrando;
const SCR = {
  x: CARO.x + ((CARO_SCREEN.x0 + CARO_SCREEN.x1) / 2 - pose.axisX) * CARO.scale,
  y: CARO.feet + ((CARO_SCREEN.y0 + CARO_SCREEN.y1) / 2 - pose.feetY) * CARO.scale,
  w: (CARO_SCREEN.x1 - CARO_SCREEN.x0) * CARO.scale,
  h: (CARO_SCREEN.y1 - CARO_SCREEN.y0) * CARO.scale,
};

const DETACH: [number, number] = [40, 98];

const cam = (f: number): Cam => {
  const k = range(f, [0, 110], [0, 1], easeInOut);
  return { x: interpolate(k, [0, 1], [960, 860]), y: interpolate(k, [0, 1], [560, 470]), zoom: interpolate(k, [0, 1], [1.0, 1.28]) };
};

// UI encendiéndose dentro de la pantalla del PNG.
const ScreenContent: React.FC<{ f: number }> = ({ f }) => {
  const splash = range(f, [6, 14], [0, 1]) * (1 - range(f, [22, 30], [0, 1]));
  const ui = range(f, [22, 32], [0, 1], easeOut);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#FFFFFF" }}>
      <div style={{ position: "absolute", inset: 0, opacity: ui, transform: `translateY(${(1 - ui) * 40}px)` }}>
        <OrganizeScreen f={0} />
      </div>
      {splash > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: splash, background: "#FFFFFF" }}>
          <div style={{ transform: `scale(${0.8 + splash * 0.2})` }}>
            <QSLogo width={150} isoOnly id="s06splash" />
          </div>
        </div>
      )}
    </div>
  );
};

export const S06Reveal: React.FC = () => {
  const f = useCurrentFrame();
  const c = cam(f);
  const d = range(f, DETACH, [0, 1], easeInOut);
  // Posición/escala de la pantalla del PNG en pantalla (para que el celular vectorial nazca encima).
  const s0 = toScreen(c, 1, { x: SCR.x, y: SCR.y });
  const startScale = (SCR.h * s0.z) / SCREEN_H;
  const phoneX = interpolate(d, [0, 1], [s0.x, 960]);
  const phoneY = interpolate(d, [0, 1], [s0.y, 540]);
  const phoneScale = interpolate(d, [0, 1], [startScale, 1.0]);
  const caroFade = range(f, [DETACH[0] + 10, 116], [0, 1], easeInOut);
  const glow = range(f, [8, 30], [0, 1]) * (1 - d);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightStudio f={f} />
      <Layer cam={c} depth={0.4}>
        <Particles f={f} n={40} seed="s06" color={QS.violet} speed={0.4} size={[2, 5]} opacity={0.35} />
      </Layer>
      <Layer cam={c} depth={1} blur={caroFade * 10}>
        <div style={{ position: "absolute", inset: 0, opacity: 1 - caroFade }}>
          <Char pose={pose} x={CARO.x} feetY={CARO.feet} scale={CARO.scale} />
          {/* UI encendida sobre la pantalla en blanco del PNG (máscara con el radio de la pantalla) */}
          <div
            style={{
              position: "absolute",
              left: SCR.x - SCR.w / 2,
              top: SCR.y - SCR.h / 2,
              width: SCR.w,
              height: SCR.h,
              borderRadius: 9,
              overflow: "hidden",
            }}
          >
            <div style={{ width: SCREEN_W, height: SCREEN_H, transform: `scale(${SCR.w / SCREEN_W})`, transformOrigin: "0 0" }}>
              <ScreenContent f={f} />
            </div>
          </div>
          {/* Resplandor de "se encendió" */}
          <div
            style={{
              position: "absolute",
              left: SCR.x - 160,
              top: SCR.y - 160,
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: "radial-gradient(closest-side, rgba(124,92,252,0.35), rgba(124,92,252,0))",
              opacity: glow * (0.8 + osc(f, 30, 0.2)),
            }}
          />
        </div>
      </Layer>
      {/* Celular vectorial: nace sobre el del PNG y toma protagonismo, siempre derecho y frontal */}
      {f >= DETACH[0] && (
        <Phone x={phoneX} y={phoneY} scale={phoneScale} shadowO={d} bezelO={range(f, [DETACH[0], DETACH[0] + 10], [0, 1])}>
          <OrganizeScreen f={0} />
        </Phone>
      )}
    </AbsoluteFill>
  );
};
