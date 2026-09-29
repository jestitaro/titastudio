import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, pop, range } from "../../lib/motion";
import { Actor, camPath, Closeup, closeupScreen, Layer, LightStudio, Particles, POSE, posePoint, QS, throughBlur } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { Device, PngScreen } from "../ds/Device";
import { C, FONT, R, S, SH, T } from "../ds/tokens";
import { Chip } from "../ds/ui";
import { Kinetic } from "../ui/Kinetic";
import { es } from "../../i18n/es";
import { ChatScreen } from "../screens/Chat";
import { VisitasScreen } from "../screens/Field";
import { S07_CAM_END, S07_CARO, S07_DEV } from "./S07Organize";

// Escena 8 — "Optimiza la comunicación". Continúa la cámara de la 7: push-out a un plano abierto con
// Caro y Nico (Nico entra caminando), el mensaje viaja de un celular al otro, push-in al teléfono de Nico
// y zoom-through a su primer plano; push-in suave al chat.
const CARO = S07_CARO;
const NICO = { x: 1560, feet: 1150, scale: 0.66 };
const CUT = 46;
const CU = { right: 1960, top: -3, scale: 1 };
const SCR = closeupScreen("nico", CU.right, CU.top, CU.scale);
const SCR_C = { x: SCR.x + SCR.w / 2, y: SCR.y + SCR.h / 2 };

const caroPhone = (() => {
  const p = posePoint(POSE.caroCelular, CARO.scale, { x: 705, y: 380 });
  return { x: CARO.x + p.x, y: CARO.feet + p.y };
})();
const nicoPhone = (() => {
  const p = posePoint(POSE.nicoCelular, NICO.scale, { x: 275, y: 460 });
  return { x: NICO.x + p.x, y: NICO.feet + p.y };
})();

const camA = (f: number): Cam =>
  camPath(f, [
    { f: 0, ...S07_CAM_END },
    { f: 24, x: 1080, y: 560, zoom: 0.95 },
    { f: 32, x: 1090, y: 560, zoom: 0.96 },
    { f: CUT, x: nicoPhone.x, y: nicoPhone.y, zoom: 2.6 },
  ]);
const camB = (f: number): Cam =>
  camPath(f, [
    { f: CUT, x: SCR_C.x, y: SCR_C.y, zoom: 1.7 },
    { f: 68, x: 1010, y: 540, zoom: 1.0 },
    { f: 106, x: SCR_C.x - 40, y: SCR_C.y, zoom: 1.1 },
    { f: 120, x: SCR_C.x, y: SCR_C.y, zoom: 1.32 },
  ]);

const MiniBubble: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ background: C.primarySoft, borderRadius: `${R.card}px ${R.card}px ${R.sm / 2}px ${R.card}px`, padding: `${S.sm}px ${S.md}px`, boxShadow: SH.float, fontFamily: FONT, ...T.body, fontSize: 18, color: C.text, whiteSpace: "nowrap" }}>{text}</div>
);

export const S08Chat: React.FC = () => {
  const f = useCurrentFrame();
  const inA = f < CUT;
  const back = range(f, [0, 16], [0, 1], easeInOut);
  const nicoWalk = f < 22;
  const nicoX = interpolate(f, [0, 22], [2150, NICO.x], { easing: (t) => 1 - (1 - t) * (1 - t), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fly = range(f, [16, 36], [0, 1], easeInOut);
  const bx = interpolate(fly, [0, 1], [caroPhone.x, nicoPhone.x]);
  const by = interpolate(fly, [0, 1], [caroPhone.y, nicoPhone.y]) - Math.sin(fly * Math.PI) * 200;
  const ping = range(f, [34, 44], [0, 1]);
  const read = pop(f, CUT + 42, { damping: 11, stiffness: 160 });
  const blurA = throughBlur(f, CUT, 8, 0, 12);
  const blurB = throughBlur(f - CUT, 120 - CUT, 8, 8, 12);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightStudio f={f + 285} />
      {inA ? (
        <AbsoluteFill style={{ filter: blurA > 0 ? `blur(${blurA}px)` : undefined }}>
          <Layer cam={camA(f)} depth={0.4}>
            <Particles f={f} n={30} seed="s08" color={QS.indigo} speed={0.3} size={[2, 5]} opacity={0.3} />
          </Layer>
          <Layer cam={camA(f)} depth={1}>
            <Actor pose={POSE.caroCelular} x={CARO.x} feetY={CARO.feet} scale={CARO.scale} f={f} blink={{ pose: POSE.caroCelularBlink, at: [30] }} />
            <Actor pose={nicoWalk ? POSE.nicoCaminando : POSE.nicoCelular} x={nicoX} feetY={NICO.feet} scale={nicoWalk ? NICO.scale * 1.05 : NICO.scale} f={f} walk={nicoWalk ? { poses: [POSE.nicoCaminando], period: 8, bob: 8 } : undefined} />
            {back < 1 && (
              <Device x={interpolate(back, [0, 1], [S07_DEV.x, caroPhone.x])} y={interpolate(back, [0, 1], [S07_DEV.y, caroPhone.y])} scale={interpolate(back, [0, 1], [S07_DEV.s, 0.07])} opacity={1 - range(back, [0.75, 1], [0, 1], (t) => t)}>
                <VisitasScreen f={165} />
              </Device>
            )}
            {fly > 0 && fly < 1 && (
              <div style={{ position: "absolute", left: bx, top: by, transform: `translate(-50%, -50%) scale(${1 + Math.sin(fly * Math.PI) * 0.4})` }}>
                <MiniBubble text="¿Viste los datos que te envié?" />
              </div>
            )}
            {ping > 0 && ping < 1 && <div style={{ position: "absolute", left: nicoPhone.x - 20 - ping * 60, top: nicoPhone.y - 20 - ping * 60, width: 40 + ping * 120, height: 40 + ping * 120, borderRadius: "50%", border: `4px solid ${C.violet}`, opacity: 1 - ping }} />}
          </Layer>
        </AbsoluteFill>
      ) : (
        <>
          <AbsoluteFill style={{ filter: blurB > 0 ? `blur(${blurB}px)` : undefined }}>
            <Layer cam={camB(f)} depth={0.4}>
              <Particles f={f} n={30} seed="s08b" color={QS.indigo} speed={0.3} size={[2, 5]} opacity={0.3} />
            </Layer>
            <Layer cam={camB(f)} depth={1}>
              <Closeup who="nico" right={CU.right} top={CU.top} scale={CU.scale} />
              <PngScreen x={SCR.x} y={SCR.y} w={SCR.w} h={SCR.h} radius={SCR.r}>
                <ChatScreen f={f - CUT + 22} mine="nico" />
              </PngScreen>
            </Layer>
          </AbsoluteFill>
          {read > 0.01 && f < 112 && (
            <div style={{ position: "absolute", left: 110, top: 700, transform: `scale(${read})`, transformOrigin: "0 50%", display: "flex", alignItems: "center", gap: S.sm, background: C.surface, borderRadius: R.pill, padding: `${S.sm}px ${S.lg}px`, boxShadow: SH.float }}>
              <div style={{ width: 30, height: 30, borderRadius: 15, background: C.violet, color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>CF</div>
              <span style={{ fontFamily: FONT, ...T.cardTitle, fontSize: 18, color: C.text }}>Caro vio tu respuesta</span>
              <Chip tone="info" icon="check">
                Leído
              </Chip>
            </div>
          )}
          <Kinetic f={f - CUT} text={es.video.kinetic.s08.text} at={8} out={60} x={110} y={440} accent={[2]} eyebrow={es.video.kinetic.s08.eyebrow} size={60} />
        </>
      )}
    </AbsoluteFill>
  );
};
