import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, range } from "../../lib/motion";
import { Actor, camPath, Contact, Floor, Layer, LightStudio, Particles, POSE, posePoint, QS } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { Device } from "../ds/Device";
import { C, FONT, R, S, SH, T } from "../ds/tokens";
import { Kinetic } from "../ui/Kinetic";
import { es } from "../../i18n/es";
import { ChatScreen } from "../screens/Chat";
import { VisitasScreen } from "../screens/Field";
import { S07_CAM_END, S07_VF_END } from "./S07Organize";
import { CAM_NICO, CARO_W, DEV7, FLOOR_Y, NICO_DEV, NICO_W } from "./world";

// Escena 8 — "Optimiza la comunicación". La cámara continúa desde la 7: un pequeño zoom out revela el
// contexto (Caro a la izquierda, Nico a la derecha, ya parado con su celular, piso y sombras). El mensaje
// viaja de un celular al otro; después push-in a Nico (hasta la cintura), el chat crece desde su celular y
// el texto entra a la izquierda, en el aire que deja Caro al salir de cuadro.
const CHAT_IN: [number, number] = [112, 146];
// Reloj interno del chat (lo continúa la escena 9).
export const chatClock = (f: number) => (f - CHAT_IN[0]) * 0.75 + 10;

export const caroPhoneW = (() => {
  const p = posePoint(POSE.caroCelular, CARO_W.scale, { x: 705, y: 380 });
  return { x: CARO_W.x + p.x, y: CARO_W.feet + p.y };
})();
export const nicoPhoneW = (() => {
  const p = posePoint(POSE.nicoCelular, NICO_W.scale, { x: 275, y: 460 });
  return { x: NICO_W.x + p.x, y: NICO_W.feet + p.y };
})();

export const camS08 = (f: number): Cam =>
  camPath(f, [
    { f: 0, ...S07_CAM_END },
    { f: 54, x: 1300, y: 540, zoom: 0.82 },
    { f: 100, x: 1310, y: 538, zoom: 0.83 },
    { f: 168, ...CAM_NICO },
    { f: 195, ...CAM_NICO },
  ]);

const MiniBubble: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ background: C.primarySoft, borderRadius: `${R.card}px ${R.card}px ${R.sm / 2}px ${R.card}px`, padding: `${S.sm}px ${S.md}px`, boxShadow: SH.float, fontFamily: FONT, ...T.body, fontSize: 20, color: C.text, whiteSpace: "nowrap" }}>{text}</div>
);

export const S08Chat: React.FC = () => {
  const f = useCurrentFrame();
  const c = camS08(f);
  const back = range(f, [0, 30], [0, 1], easeInOut);
  const fly = range(f, [60, 96], [0, 1], easeInOut);
  const bx = interpolate(fly, [0, 1], [caroPhoneW.x, nicoPhoneW.x]);
  const by = interpolate(fly, [0, 1], [caroPhoneW.y, nicoPhoneW.y]) - Math.sin(fly * Math.PI) * 180;
  const ping = range(f, [94, 108], [0, 1]);
  const chat = range(f, CHAT_IN, [0, 1], easeInOut);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightStudio f={f + 345} />
      <Layer cam={c} depth={0.4}>
        <Particles f={f} n={30} seed="s08" color={QS.indigo} speed={0.25} size={[2, 5]} opacity={0.3} />
      </Layer>
      <Layer cam={c} depth={1}>
        <Floor y={FLOOR_Y} />
        <Contact x={CARO_W.x} y={CARO_W.feet} />
        <Contact x={NICO_W.x} y={NICO_W.feet} />
        <Actor pose={POSE.caroCelular} x={CARO_W.x} feetY={CARO_W.feet} scale={CARO_W.scale} f={f} blink={{ pose: POSE.caroCelularBlink, at: [40, 120] }} />
        <Actor pose={POSE.nicoCelular} x={NICO_W.x} feetY={NICO_W.feet} scale={NICO_W.scale} f={f} blink={{ pose: POSE.nicoCelularBlink, at: [70, 150] }} />
        {/* El celular de la 7 vuelve a la mano de Caro */}
        {back < 1 && (
          <Device x={interpolate(back, [0, 1], [DEV7.x, caroPhoneW.x])} y={interpolate(back, [0, 1], [DEV7.y, caroPhoneW.y])} scale={interpolate(back, [0, 1], [DEV7.s, 0.06])} opacity={1 - range(back, [0.75, 1], [0, 1], (t) => t)}>
            <VisitasScreen f={S07_VF_END} />
          </Device>
        )}
        {fly > 0 && fly < 1 && (
          <div style={{ position: "absolute", left: bx, top: by, transform: `translate(-50%, -50%) scale(${0.9 + Math.sin(fly * Math.PI) * 0.3})` }}>
            <MiniBubble text="¿Viste los datos que te envié?" />
          </div>
        )}
        {ping > 0 && ping < 1 && <div style={{ position: "absolute", left: nicoPhoneW.x - 20 - ping * 50, top: nicoPhoneW.y - 20 - ping * 50, width: 40 + ping * 100, height: 40 + ping * 100, borderRadius: "50%", border: `4px solid ${C.violet}`, opacity: 1 - ping }} />}
        {/* El chat crece desde el celular de Nico, a su izquierda */}
        {chat > 0.01 && (
          <Device x={interpolate(chat, [0, 1], [nicoPhoneW.x, NICO_DEV.x])} y={interpolate(chat, [0, 1], [nicoPhoneW.y, NICO_DEV.y])} scale={interpolate(chat, [0, 1], [0.05, NICO_DEV.s])} opacity={Math.min(1, chat * 4)}>
            <ChatScreen f={chatClock(f)} mine="nico" />
          </Device>
        )}
      </Layer>
      <Kinetic f={f} text={es.video.kinetic.s08.text} at={132} out={184} x={110} y={500} accent={[2]} eyebrow={es.video.kinetic.s08.eyebrow} size={56} />
    </AbsoluteFill>
  );
};
