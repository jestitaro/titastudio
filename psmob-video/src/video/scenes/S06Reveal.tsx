import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, osc, range } from "../../lib/motion";
import { Closeup, closeupScreen, Layer, LightStudio, Particles, QS, toScreen } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { APP_H, Device, PngScreen } from "../ds/Device";
import { QSLogo } from "../brand/QSLogo";
import { fillTri } from "../brand/loader";
import { VisitasScreen } from "../screens/Field";

// Escena 6 — alivio. Primer plano de Caro mostrando el celular (frontal). La pantalla se enciende con
// el loading de marca y la app; la cámara empuja y el celular vectorial nace exactamente sobre la
// pantalla del PNG y queda al centro, recto y frontal.
const CU = { right: 1960, top: -3, scale: 1 };
const SCR = closeupScreen("caro", CU.right, CU.top, CU.scale);
const DETACH: [number, number] = [66, 104];
export const S06_END = { x: 960, y: 540, s: 0.95 };

const cam = (f: number): Cam => {
  const k = range(f, [0, DETACH[0] + 10], [0, 1], easeInOut);
  return { x: interpolate(k, [0, 1], [1000, SCR.x + SCR.w / 2]), y: interpolate(k, [0, 1], [540, SCR.y + SCR.h / 2]), zoom: interpolate(k, [0, 1], [1, 1.14]) };
};

const ScreenContent: React.FC<{ f: number }> = ({ f }) => {
  const splash = range(f, [4, 10], [0, 1]) * (1 - range(f, [26, 32], [0, 1]));
  const ui = range(f, [26, 34], [0, 1]);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff" }}>
      <div style={{ position: "absolute", inset: 0, opacity: ui, transform: `translateY(${(1 - ui) * 30}px)` }}>
        <VisitasScreen f={0} />
      </div>
      {splash > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", opacity: splash }}>
          <QSLogo width={140} isoOnly id="s06iso" tri={fillTri(range(f, [6, 26], [0, 1]))} />
        </div>
      )}
    </div>
  );
};

export const S06Reveal: React.FC = () => {
  const f = useCurrentFrame();
  const c = cam(f);
  const d = range(f, DETACH, [0, 1], easeInOut);
  const s0 = toScreen(c, 1, { x: SCR.x + SCR.w / 2, y: SCR.y + SCR.h / 2 });
  const startScale = (SCR.w * s0.z) / 390;
  const px = interpolate(d, [0, 1], [s0.x, S06_END.x]);
  const py = interpolate(d, [0, 1], [s0.y + ((APP_H * startScale) / 2 - (SCR.h * s0.z) / 2), S06_END.y]);
  const ps = interpolate(d, [0, 1], [startScale, S06_END.s]);
  const caroOut = range(f, [DETACH[0] + 8, 112], [0, 1], easeInOut);
  const glow = range(f, [4, 20], [0, 1]) * (1 - d);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightStudio f={f} />
      <Layer cam={c} depth={0.4}>
        <Particles f={f} n={40} seed="s06" color={QS.violet} speed={0.4} size={[2, 5]} opacity={0.35} />
      </Layer>
      <Layer cam={c} depth={1} blur={caroOut * 12}>
        <div style={{ position: "absolute", inset: 0, opacity: 1 - caroOut, transform: `translate(${caroOut * 80}px, ${caroOut * 40}px)` }}>
          <div style={{ position: "absolute", left: SCR.x - 120, top: SCR.y - 120, width: SCR.w + 240, height: SCR.h + 240, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(112,37,224,0.35), rgba(112,37,224,0))", opacity: glow * (0.8 + osc(f, 30, 0.2)) }} />
          <Closeup who="caro" right={CU.right} top={CU.top} scale={CU.scale} />
          <PngScreen x={SCR.x} y={SCR.y} w={SCR.w} h={SCR.h} radius={SCR.r}>
            <ScreenContent f={f} />
          </PngScreen>
        </div>
      </Layer>
      {f >= DETACH[0] && (
        <Device x={px} y={py} scale={ps} opacity={range(f, [DETACH[0], DETACH[0] + 6], [0, 1])}>
          <VisitasScreen f={0} />
        </Device>
      )}
    </AbsoluteFill>
  );
};
