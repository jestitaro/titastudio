import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { osc, range } from "../../lib/motion";
import { camPath, Closeup, closeupScreen, Layer, LightStudio, Particles, QS, toScreen } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { PngScreen } from "../ds/Device";
import { QSLogo } from "../brand/QSLogo";
import { fillTri } from "../brand/loader";
import { VisitasScreen } from "../screens/Field";

// Escena 6 — alivio. Primer plano de Caro mostrando su celular (frontal). La pantalla se enciende con el
// loading de marca y la app. Un solo movimiento: push-in lento hacia el teléfono, con su cara en cuadro.
const CU = { right: 1960, top: -3, scale: 1 };
const SCR = closeupScreen("caro", CU.right, CU.top, CU.scale);
const SCR_C = { x: SCR.x + SCR.w / 2, y: SCR.y + SCR.h / 2 };

const cam = (f: number): Cam =>
  camPath(f, [
    { f: 0, x: 1100, y: 560, zoom: 1 },
    { f: 150, x: 1060, y: SCR_C.y, zoom: 1.32 },
  ]);

// Rectángulo en pantalla de la UI al final (la escena 7 arranca con el celular exactamente ahí).
export const S06_UI_END = (() => {
  const s = toScreen(cam(150), 1, SCR_C);
  return { x: s.x, y: s.y, w: SCR.w * s.z };
})();

const ScreenContent: React.FC<{ f: number }> = ({ f }) => {
  const splash = range(f, [8, 16], [0, 1]) * (1 - range(f, [40, 50], [0, 1]));
  const ui = range(f, [40, 54], [0, 1]);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff" }}>
      <div style={{ position: "absolute", inset: 0, opacity: ui, transform: `translateY(${(1 - ui) * 24}px)` }}>
        <VisitasScreen f={0} />
      </div>
      {splash > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", opacity: splash }}>
          <QSLogo width={140} isoOnly id="s06iso" tri={fillTri(range(f, [10, 40], [0, 1]))} />
        </div>
      )}
    </div>
  );
};

export const S06Reveal: React.FC = () => {
  const f = useCurrentFrame();
  const c = cam(f);
  const glow = range(f, [8, 30], [0, 1]) * (1 - range(f, [60, 100], [0, 1]));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightStudio f={f} />
      <Layer cam={c} depth={0.4}>
        <Particles f={f} n={40} seed="s06" color={QS.violet} speed={0.3} size={[2, 5]} opacity={0.3} />
      </Layer>
      <Layer cam={c} depth={1}>
        <div style={{ position: "absolute", left: SCR.x - 120, top: SCR.y - 120, width: SCR.w + 240, height: SCR.h + 240, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(112,37,224,0.3), rgba(112,37,224,0))", opacity: glow * (0.85 + osc(f, 40, 0.15)) }} />
        <Closeup who="caro" right={CU.right} top={CU.top} scale={CU.scale} />
        <PngScreen x={SCR.x} y={SCR.y} w={SCR.w} h={SCR.h} radius={SCR.r}>
          <ScreenContent f={f} />
        </PngScreen>
      </Layer>
    </AbsoluteFill>
  );
};
