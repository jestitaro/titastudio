import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, easeOut, pop, range } from "../../lib/motion";
import { Actor, Closeup, closeupScreen, Layer, LightStudio, Particles, POSE, posePoint, QS } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { Device, PngScreen } from "../ds/Device";
import { C, FONT, R, S, SH, T } from "../ds/tokens";
import { Chip } from "../ds/ui";
import { Kinetic } from "../ui/Kinetic";
import { es } from "../../i18n/es";
import { ChatScreen } from "../screens/Chat";
import { VisitasScreen } from "../screens/Field";
import { S07_END } from "./S07Organize";

// Escena 8 — "Optimiza la comunicación". Caro y Nico con sus celulares: el mensaje viaja de uno a otro;
// después, primer plano de Nico con el chat en su pantalla (typing, respuesta, doble check).
const CARO = { x: 480, feet: 1150, scale: 0.72 };
const NICO = { x: 1480, feet: 1150, scale: 0.66 };
const CUT = 46;
const CU = { right: 1960, top: -3, scale: 1 };
const SCR = closeupScreen("nico", CU.right, CU.top, CU.scale);

const caroPhone = (() => {
  const p = posePoint(POSE.caroCelular, CARO.scale, { x: 705, y: 380 });
  return { x: CARO.x + p.x, y: CARO.feet + p.y };
})();
const nicoPhone = (() => {
  const p = posePoint(POSE.nicoCelular, NICO.scale, { x: 275, y: 460 });
  return { x: NICO.x + p.x, y: NICO.feet + p.y };
})();

const MiniBubble: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ background: C.primarySoft, borderRadius: `${R.card}px ${R.card}px ${R.sm / 2}px ${R.card}px`, padding: `${S.sm}px ${S.md}px`, boxShadow: SH.float, fontFamily: FONT, ...T.body, fontSize: 18, color: C.text, whiteSpace: "nowrap" }}>{text}</div>
);

export const S08Chat: React.FC = () => {
  const f = useCurrentFrame();
  const inA = f < CUT;
  // A: el celular de la escena 7 vuelve a la mano de Caro
  const back = range(f, [0, 14], [0, 1], easeInOut);
  const nicoIn = range(f, [0, 20], [0, 1], easeOut);
  const fly = range(f, [14, 36], [0, 1], easeInOut);
  const bx = interpolate(fly, [0, 1], [caroPhone.x, nicoPhone.x]);
  const by = interpolate(fly, [0, 1], [caroPhone.y, nicoPhone.y]) - Math.sin(fly * Math.PI) * 220;
  const ping = range(f, [36, 46], [0, 1]);
  // B: push al celular de Nico (primer plano)
  const camA: Cam = { x: 960 + range(f, [36, CUT], [0, 1], easeInOut) * (nicoPhone.x - 960), y: 540 + range(f, [36, CUT], [0, 1], easeInOut) * (nicoPhone.y - 540), zoom: 1 + range(f, [36, CUT], [0, 1], (t) => t * t) * 1.2 };
  const camB: Cam = { x: 980 + range(f, [CUT, 120], [0, 1]) * 40, y: 540, zoom: interpolate(range(f, [CUT, CUT + 14], [0, 1], easeOut), [0, 1], [1.12, 1.0]) + range(f, [CUT + 14, 120], [0, 0.04]) };
  const read = pop(f, CUT + 42, { damping: 11, stiffness: 160 });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightStudio f={f + 285} />
      {inA ? (
        <>
          <Layer cam={camA} depth={0.4}>
            <Particles f={f} n={30} seed="s08" color={QS.indigo} speed={0.3} size={[2, 5]} opacity={0.3} />
          </Layer>
          <Layer cam={camA} depth={1}>
            <Actor pose={POSE.caroCelular} x={CARO.x} feetY={CARO.feet} scale={CARO.scale} f={f} blink={{ pose: POSE.caroCelularBlink, at: [30] }} />
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - nicoIn) * 600}px)` }}>
              <Actor pose={POSE.nicoCelular} x={NICO.x} feetY={NICO.feet} scale={NICO.scale} f={f} blink={{ pose: POSE.nicoCelularBlink, at: [22] }} />
            </div>
            {fly > 0 && fly < 1 && (
              <div style={{ position: "absolute", left: bx, top: by, transform: `translate(-50%, -50%) scale(${1 + Math.sin(fly * Math.PI) * 0.45})` }}>
                <MiniBubble text="¿Viste los datos que te envié?" />
              </div>
            )}
            {ping > 0 && ping < 1 && <div style={{ position: "absolute", left: nicoPhone.x - 20 - ping * 60, top: nicoPhone.y - 20 - ping * 60, width: 40 + ping * 120, height: 40 + ping * 120, borderRadius: "50%", border: `4px solid ${C.violet}`, opacity: 1 - ping }} />}
          </Layer>
          {back < 1 && (
            <Device x={interpolate(back, [0, 1], [S07_END.x, caroPhone.x])} y={interpolate(back, [0, 1], [S07_END.y, caroPhone.y])} scale={interpolate(back, [0, 1], [S07_END.s, 0.08])} opacity={1 - range(back, [0.7, 1], [0, 1], (t) => t)}>
              <VisitasScreen f={165} />
            </Device>
          )}
        </>
      ) : (
        <>
          <Layer cam={camB} depth={0.4}>
            <Particles f={f} n={30} seed="s08b" color={QS.indigo} speed={0.3} size={[2, 5]} opacity={0.3} />
          </Layer>
          <Layer cam={camB} depth={1}>
            <Closeup who="nico" right={CU.right} top={CU.top} scale={CU.scale} />
            <PngScreen x={SCR.x} y={SCR.y} w={SCR.w} h={SCR.h} radius={SCR.r}>
              <ChatScreen f={f - CUT + 22} mine="nico" />
            </PngScreen>
          </Layer>
          {read > 0.01 && (
            <div style={{ position: "absolute", left: 640, top: 800, transform: `scale(${read})`, transformOrigin: "0 50%", display: "flex", alignItems: "center", gap: S.sm, background: C.surface, borderRadius: R.pill, padding: `${S.sm}px ${S.lg}px`, boxShadow: SH.float }}>
              <div style={{ width: 30, height: 30, borderRadius: 15, background: C.violet, color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>CF</div>
              <span style={{ fontFamily: FONT, ...T.cardTitle, fontSize: 18, color: C.text }}>Caro vio tu respuesta</span>
              <Chip tone="info" icon="check">
                Leído
              </Chip>
            </div>
          )}
          <Kinetic f={f - CUT} text={es.video.kinetic.s08.text} at={4} out={64} x={110} y={470} accent={[2]} eyebrow={es.video.kinetic.s08.eyebrow} size={60} />
        </>
      )}
    </AbsoluteFill>
  );
};
