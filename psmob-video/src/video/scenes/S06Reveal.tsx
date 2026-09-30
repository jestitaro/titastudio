import React from "react";
import { AbsoluteFill } from "remotion";
import { useSceneFrame } from "../lib/sceneClock";
import { easeInOut, osc, range } from "../../lib/motion";
import { camPath, Closeup, closeupScreen, Layer, LightStudio, Particles, QS, toScreen } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { APP_W, Device, PngScreen } from "../ds/Device";
import { CARO_APP_H } from "./world";
import { QSLogo } from "../brand/QSLogo";
import { fillTri } from "../brand/loader";
import { VisitasScreen } from "../screens/Field";

// Escena 6 — alivio. Primer plano de Caro mostrando su celular (frontal). La pantalla se enciende con el
// loading de marca y la app. Push-in lento hasta que el teléfono ocupa el cuadro; ahí el celular del PNG
// se funde con el celular vectorial y Caro desaparece con un fade suave (el teléfono nunca queda huérfano:
// lo sostiene ella hasta que ocupa todo el cuadro). El PNG está recortado a la derecha: su borde queda
// siempre fuera de cuadro para que no se vea el pelo cortado.
const CU = { right: 2200, top: -60, scale: 1.1 }; // bordes recortados del PNG siempre fuera de cuadro
const SCR = closeupScreen("caro", CU.right, CU.top, CU.scale);
const SCR_C = { x: SCR.x + SCR.w / 2, y: SCR.y + SCR.h / 2 };
const DEV_S = SCR.w / APP_W; // celular vectorial con la misma pantalla (ancho y proporción) que el PNG
const SWAP: [number, number] = [118, 140];

const cam = (f: number): Cam =>
  camPath(f, [
    { f: 0, x: 1110, y: 560, zoom: 1 },
    { f: 24, x: 1110, y: 560, zoom: 1.01 },
    { f: 150, x: SCR_C.x, y: SCR_C.y, zoom: 1.3 },
    { f: 165, x: SCR_C.x, y: SCR_C.y, zoom: 1.31 },
  ]);

// Rectángulo en pantalla de la UI al final (la escena 7 arranca con el celular exactamente ahí).
export const S06_UI_END = (() => {
  const s = toScreen(cam(165), 1, SCR_C);
  return { x: s.x, y: s.y, w: APP_W * DEV_S * s.z };
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
  const f = useSceneFrame();
  const c = cam(f);
  const glow = range(f, [8, 30], [0, 1]) * (1 - range(f, [60, 100], [0, 1]));
  const swap = range(f, SWAP, [0, 1], easeInOut);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightStudio f={f} />
      <Layer cam={c} depth={0.4}>
        <Particles f={f} n={40} seed="s06" color={QS.violet} speed={0.3} size={[2, 5]} opacity={0.3} />
      </Layer>
      <Layer cam={c} depth={1}>
        <div style={{ position: "absolute", left: SCR.x - 120, top: SCR.y - 120, width: SCR.w + 240, height: SCR.h + 240, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(112,37,224,0.3), rgba(112,37,224,0))", opacity: glow * (0.85 + osc(f, 40, 0.15)) }} />
        {swap < 1 && (
          <div style={{ position: "absolute", inset: 0, opacity: 1 - swap }}>
            <Closeup who="caro" right={CU.right} top={CU.top} scale={CU.scale} />
            <PngScreen x={SCR.x} y={SCR.y} w={SCR.w} h={SCR.h} radius={SCR.r}>
              <ScreenContent f={f} />
            </PngScreen>
          </div>
        )}
        {swap > 0 && (
          <Device x={SCR_C.x} y={SCR_C.y} scale={DEV_S} opacity={swap} appH={CARO_APP_H}>
            <ScreenContent f={f} />
          </Device>
        )}
      </Layer>
    </AbsoluteFill>
  );
};
