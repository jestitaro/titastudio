import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, pop, range } from "../../lib/motion";
import { Actor, camPath, Layer, POSE, posePoint, throughBlur } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { Device } from "../ds/Device";
import { Chip } from "../ds/ui";
import { Kinetic } from "../ui/Kinetic";
import { es } from "../../i18n/es";
import { FormsFlow, FT } from "../screens/Forms";
import { Gondola } from "../ui/Gondola";

// Escena 9 — "Agiliza la captura de datos". Llega con zoom dentro del formulario (continúa el push-in de
// la 8), completa la carga y hace zoom out para revelar a Nico en el PDV; guarda el celular, sigue
// caminando y la cámara empuja hacia el aviso "Formulario enviado" (zoom-through a la 10).
const NICO = { x: 360, feet: 1190, scale: 0.74 };
const DEV = { x: 1400, y: 540, s: 0.9 };
const FLOW0 = 6;
const RETRACT: [number, number] = [92, 104];
const WALK0 = 102;

const phone = (() => {
  const p = posePoint(POSE.nicoCelular, NICO.scale, { x: 275, y: 460 });
  return { x: NICO.x + p.x, y: NICO.feet + p.y };
})();
const walkX = (f: number) => interpolate(f, [WALK0, 120], [NICO.x, NICO.x + 240], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const cam = (f: number): Cam =>
  camPath(f, [
    { f: 0, x: DEV.x, y: DEV.y, zoom: 1.45 },
    { f: 22, x: DEV.x, y: DEV.y, zoom: 1.3 },
    { f: 80, x: DEV.x - 20, y: DEV.y, zoom: 1.22 },
    { f: 104, x: 1000, y: 560, zoom: 1.0 },
    { f: 110, x: 1010, y: 550, zoom: 1.02 },
    { f: 120, x: walkX(120) + 10, y: 200, zoom: 1.9 },
  ]);

export const StoreBackdrop: React.FC<{ cam: Cam; blur?: number; offset?: number }> = ({ cam: c, blur = 6, offset = 1200 }) => (
  <>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #EEF0FA 0%, #E2E6F4 60%, #D3D9EC 100%)" }} />
    <Layer cam={c} depth={0.55} blur={blur}>
      <div style={{ position: "absolute", left: -offset, top: 40, transform: "scale(0.9)", transformOrigin: "0 0" }}>
        <Gondola from={offset - 600} to={offset + 3000} />
      </div>
      <div style={{ position: "absolute", left: -600, top: 1010, width: 3400, height: 500, background: "#C9D0E4" }} />
    </Layer>
  </>
);

export const S09Capture: React.FC = () => {
  const f = useCurrentFrame();
  const c = cam(f);
  const ret = range(f, RETRACT, [0, 1], easeInOut);
  const walk = f >= WALK0;
  const done = pop(f, FLOW0 + FT.success[0] + 4, { damping: 11, stiffness: 150 });
  const blur = throughBlur(f, 120, 8, 8, 12);
  return (
    <AbsoluteFill style={{ overflow: "hidden", filter: blur > 0 ? `blur(${blur}px)` : undefined }}>
      <StoreBackdrop cam={c} offset={2200} />
      <Layer cam={c} depth={1}>
        <div style={{ position: "absolute", left: (walk ? walkX(f) : NICO.x) - 200, top: NICO.feet - 16, width: 400, height: 32, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(19,13,93,0.18), rgba(19,13,93,0))" }} />
        <Actor
          pose={walk ? POSE.nicoCaminando : POSE.nicoCelular}
          x={walk ? walkX(f) : NICO.x}
          feetY={NICO.feet}
          scale={NICO.scale}
          f={f}
          blink={walk ? undefined : { pose: POSE.nicoCelularBlink, at: [56, 84] }}
          walk={walk ? { poses: [POSE.nicoCaminando], period: 8, bob: 8 } : undefined}
        />
        {ret < 1 && (
          <Device x={interpolate(ret, [0, 1], [DEV.x, phone.x])} y={interpolate(ret, [0, 1], [DEV.y, phone.y])} scale={interpolate(ret, [0, 1], [DEV.s, 0.07])} opacity={1 - range(ret, [0.75, 1], [0, 1], (t) => t)}>
            <FormsFlow f={Math.min(f - FLOW0, FT.success[1] + 8)} />
          </Device>
        )}
        {done > 0.01 && (
          <div style={{ position: "absolute", left: (walk ? walkX(f) : NICO.x) + 10, top: 170, transform: `translate(-50%, 0) scale(${done})` }}>
            <Chip tone="success" solid icon="check">
              Formulario enviado
            </Chip>
          </div>
        )}
      </Layer>
      <Kinetic f={f} text={es.video.kinetic.s09.text} at={16} out={84} x={110} y={500} accent={[3, 4]} eyebrow={es.video.kinetic.s09.eyebrow} size={60} />
    </AbsoluteFill>
  );
};
