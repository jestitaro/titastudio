import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, easeOut, pop, range } from "../../lib/motion";
import { Actor, Layer, POSE, posePoint } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { Device } from "../ds/Device";
import { Chip } from "../ds/ui";
import { Kinetic } from "../ui/Kinetic";
import { es } from "../../i18n/es";
import { FormsFlow, FT } from "../screens/Forms";
import { Gondola } from "../ui/Gondola";

// Escena 9 — "Agiliza la captura de datos". Nico en el PDV toca el celular → la app crece desde su mano
// (derecha y frontal) → formulario, marcas, enviar, check → vuelve a su mano y Nico sigue caminando.
const NICO = { x: 380, feet: 1190, scale: 0.74 };
const FLOW0 = 22; // inicio del flujo de formulario
const RETRACT: [number, number] = [FLOW0 + FT.success[1] + 2, FLOW0 + FT.success[1] + 14];
export const S09_PHONE = { x: 1400, y: 540, s: 0.9 };

const phone = (() => {
  const p = posePoint(POSE.nicoCelular, NICO.scale, { x: 275, y: 460 });
  return { x: NICO.x + p.x, y: NICO.feet + p.y };
})();

export const StoreBackdrop: React.FC<{ cam: Cam; blur?: number; offset?: number }> = ({ cam, blur = 6, offset = 1200 }) => (
  <>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #EEF0FA 0%, #E2E6F4 60%, #D3D9EC 100%)" }} />
    <Layer cam={cam} depth={0.55} blur={blur}>
      <div style={{ position: "absolute", left: -offset, top: 40, transform: "scale(0.9)", transformOrigin: "0 0" }}>
        <Gondola from={offset - 400} to={offset + 2800} />
      </div>
      <div style={{ position: "absolute", left: -400, top: 1010, width: 3000, height: 400, background: "#C9D0E4" }} />
    </Layer>
  </>
);

export const S09Capture: React.FC = () => {
  const f = useCurrentFrame();
  const born = range(f, [14, 32], [0, 1], easeInOut);
  const ret = range(f, RETRACT, [0, 1], easeInOut);
  const k = born * (1 - ret);
  const walk = f >= RETRACT[1] - 2;
  const walkX = interpolate(f, [RETRACT[1] - 2, 120], [NICO.x, NICO.x + 420], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam: Cam = { x: 960 + range(f, [RETRACT[1], 120], [0, 60]), y: 540, zoom: 1 + range(f, [0, 30], [0.06, 0], easeOut) };
  const done = pop(f, FLOW0 + FT.success[0] + 4, { damping: 11, stiffness: 150 });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <StoreBackdrop cam={cam} offset={2200} />
      <Layer cam={cam} depth={1}>
        <div style={{ position: "absolute", left: (walk ? walkX : NICO.x) - 200, top: NICO.feet - 16, width: 400, height: 32, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(19,13,93,0.18), rgba(19,13,93,0))" }} />
        <Actor
          pose={walk ? POSE.nicoCaminando : POSE.nicoCelular}
          x={walk ? walkX : NICO.x}
          feetY={NICO.feet}
          scale={NICO.scale}
          f={f}
          blink={walk ? undefined : { pose: POSE.nicoCelularBlink, at: [6, 60] }}
          walk={walk ? { poses: [POSE.nicoCaminando], period: 8, bob: 8 } : undefined}
        />
        {done > 0.01 && (
          <div style={{ position: "absolute", left: (walk ? walkX : NICO.x) + 10, top: 150, transform: `translate(-50%, 0) scale(${done})` }}>
            <Chip tone="success" solid icon="check">
              Formulario enviado
            </Chip>
          </div>
        )}
        {/* Toque en el teléfono */}
        {f >= 6 && f < 20 && <div style={{ position: "absolute", left: phone.x - 20 - (f - 6) * 5, top: phone.y - 20 - (f - 6) * 5, width: 40 + (f - 6) * 10, height: 40 + (f - 6) * 10, borderRadius: "50%", border: "4px solid #7025E0", opacity: 1 - (f - 6) / 14 }} />}
      </Layer>
      {k > 0.01 && (
        <Device x={interpolate(k, [0, 1], [phone.x, S09_PHONE.x])} y={interpolate(k, [0, 1], [phone.y, S09_PHONE.y])} scale={interpolate(k, [0, 1], [0.07, S09_PHONE.s])} opacity={Math.min(1, k * 5)}>
          <FormsFlow f={Math.min(f - FLOW0, FT.success[1] + 6)} />
        </Device>
      )}
      <Kinetic f={f} text={es.video.kinetic.s09.text} at={24} out={96} x={640} y={500} accent={[3, 4]} eyebrow={es.video.kinetic.s09.eyebrow} size={56} />
    </AbsoluteFill>
  );
};
