import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, pop, range } from "../../lib/motion";
import { Actor, camPath, Contact, Floor, Layer, LightStudio, Particles, POSE, posePoint, QS } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { Device } from "../ds/Device";
import { Chip } from "../ds/ui";
import { Kinetic } from "../ui/Kinetic";
import { es } from "../../i18n/es";
import { IndicatorsFlow } from "../screens/Indicators";
import { StoreBackdrop } from "./S09Capture";
import { CARO_W, DEV7, FLOOR_Y } from "./world";

// Escena 10 — "Información en tiempo real". Cortina suave desde la góndola al estudio. Arranca cerca de
// Caro (plano medio, con su celular) y la cámara se abre mientras su celular crece a su derecha: personaje
// y teléfono en una misma composición, con piso y sombra; el texto a la derecha, con aire.
export const DEV10 = DEV7;
const BORN: [number, number] = [34, 72];
const FLOW0 = 40;
const TS = 0.85;
export const phone10 = (() => {
  const p = posePoint(POSE.caroCelular, CARO_W.scale, { x: 705, y: 380 });
  return { x: CARO_W.x + p.x, y: CARO_W.feet + p.y };
})();

export const camS10 = (f: number): Cam =>
  camPath(f, [
    { f: 0, x: 720, y: 430, zoom: 1.25 },
    { f: 24, x: 730, y: 432, zoom: 1.24 },
    { f: 112, x: 1080, y: 540, zoom: 1.0 },
    { f: 180, x: 1090, y: 535, zoom: 1.02 },
  ]);

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
          <Floor y={FLOOR_Y} />
          <Contact x={CARO_W.x} y={CARO_W.feet} />
          <Actor pose={POSE.caroCelular} x={CARO_W.x} feetY={CARO_W.feet} scale={CARO_W.scale} f={f} blink={{ pose: POSE.caroCelularBlink, at: [24, 120] }} />
          {notif > 0.01 && (
            <div style={{ position: "absolute", left: DEV10.x, top: 330, transform: `translate(-50%, -50%) scale(${notif})` }}>
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
        <Kinetic f={f} text={es.video.kinetic.s10.text} at={96} out={220} x={1330} y={540} accent={[3, 4]} eyebrow={es.video.kinetic.s10.eyebrow} size={56} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
