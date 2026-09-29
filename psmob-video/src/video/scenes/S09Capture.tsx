import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, pop, range } from "../../lib/motion";
import { Actor, camPath, Layer, LightStudio, POSE } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { Device } from "../ds/Device";
import { Chip } from "../ds/ui";
import { Kinetic } from "../ui/Kinetic";
import { es } from "../../i18n/es";
import { FormsFlow, FT } from "../screens/Forms";
import { ChatScreen } from "../screens/Chat";
import { Gondola } from "../ui/Gondola";
import { chatClock, nicoPhoneW } from "./S08Chat";
import { CAM_NICO, NICO_DEV, NICO_W } from "./world";

// Escena 9 — "Agiliza la captura de datos". Mismo encuadre que el final de la 8; el fondo pasa del estudio
// a la góndola con una cortina suave. El chat da paso al formulario (ritmo calmo), check de enviado,
// el celular vuelve a la mano de Nico y él sigue caminando hacia la izquierda, hacia donde mira.
const FORMS0 = 30;
const FTS = 0.7;
const toForms = (f: number) => (f - FORMS0) * FTS;
const DONE = FORMS0 + FT.success[1] / FTS; // ~130
const RETRACT: [number, number] = [DONE + 2, DONE + 22];
const WALK0 = RETRACT[1] - 2;

const cam = (f: number): Cam =>
  camPath(f, [
    { f: 0, ...CAM_NICO },
    { f: WALK0, x: CAM_NICO.x - 20, y: CAM_NICO.y + 10, zoom: CAM_NICO.zoom - 0.04 },
    { f: 180, x: 1080, y: 500, zoom: 1.02 },
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
  const wipe = range(f, [0, 40], [0, 1], easeInOut);
  const nav = range(f, [FORMS0 - 6, FORMS0 + 6], [0, 1], easeInOut);
  const ret = range(f, RETRACT, [0, 1], easeInOut);
  const walking = f >= WALK0;
  const walkX = interpolate(f, [WALK0, 180], [NICO_W.x, NICO_W.x - 520], { easing: (t) => t, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const done = pop(f, FORMS0 + FT.success[0] / FTS + 6, { damping: 16, stiffness: 110 });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightStudio f={f + 510} />
      {/* Cortina suave: la góndola entra desde la derecha */}
      <AbsoluteFill style={{ WebkitMaskImage: `linear-gradient(to left, black ${wipe * 120 - 20}%, transparent ${wipe * 120}%)`, maskImage: `linear-gradient(to left, black ${wipe * 120 - 20}%, transparent ${wipe * 120}%)` }}>
        <StoreBackdrop cam={c} offset={2600} />
      </AbsoluteFill>
      <Layer cam={c} depth={1}>
        <div style={{ position: "absolute", left: (walking ? walkX : NICO_W.x) - 200, top: NICO_W.feet - 16, width: 400, height: 32, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(19,13,93,0.16), rgba(19,13,93,0))" }} />
        {walking ? (
          <Actor pose={POSE.nicoCaminando} x={walkX} feetY={NICO_W.feet} scale={NICO_W.scale * 1.05} f={f} walk={{ poses: [POSE.nicoCaminando], period: 10, bob: 7 }} />
        ) : (
          <Actor pose={POSE.nicoCelular} x={NICO_W.x} feetY={NICO_W.feet} scale={NICO_W.scale} f={f} blink={{ pose: POSE.nicoCelularBlink, at: [60, 112] }} />
        )}
        {ret < 1 && (
          <Device x={interpolate(ret, [0, 1], [NICO_DEV.x, nicoPhoneW.x])} y={interpolate(ret, [0, 1], [NICO_DEV.y, nicoPhoneW.y])} scale={interpolate(ret, [0, 1], [NICO_DEV.s, 0.05])} opacity={1 - range(ret, [0.75, 1], [0, 1], (t) => t)}>
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${-nav * 30}%)` }}>
              <ChatScreen f={chatClock(165 + f)} mine="nico" />
            </div>
            {nav > 0 && (
              <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - nav) * 100}%)` }}>
                <FormsFlow f={Math.min(toForms(f), FT.success[1] + 6)} />
              </div>
            )}
          </Device>
        )}
        {done > 0.01 && (
          <div style={{ position: "absolute", left: (walking ? walkX : NICO_W.x) - 20, top: 150, transform: `translate(-50%, 0) scale(${done * (1 - range(f, [168, 180], [0, 1]))})` }}>
            <Chip tone="success" solid icon="check">
              Formulario enviado
            </Chip>
          </div>
        )}
      </Layer>
      <Kinetic f={f} text={es.video.kinetic.s09.text} at={36} out={DONE - 6} x={100} y={470} accent={[3, 4]} eyebrow={es.video.kinetic.s09.eyebrow} size={56} />
    </AbsoluteFill>
  );
};
