import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, pop, range } from "../../lib/motion";
import { Actor, camPath, Contact, Floor, Layer, LightStudio, Particles, POSE, posePoint, QS } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { Device } from "../ds/Device";
import { C, FONT, SH } from "../ds/tokens";
import { Kinetic } from "../ui/Kinetic";
import { es } from "../../i18n/es";
import { ChatScreen, CONVO } from "../screens/Chat";
import { VisitasScreen } from "../screens/Field";
import { S07_CAM_END, S07_VF_END } from "./S07Organize";
import { CAM_NICO, CARO_APP_H, CARO_W, DEV7, FLOOR_Y, NICO_DEV, NICO_W } from "./world";

// Escena 8 — "Optimiza la comunicación". La cámara continúa desde la 7: un pequeño zoom out revela el
// contexto (Caro a la izquierda, Nico a la derecha). Conversan: globos grandes, uno por vez y con tiempo
// de lectura, junto a quien habla. Después push-in a Nico (hasta la cintura): el chat crece desde su
// celular con la conversación completa y el texto entra a la izquierda, donde ya no está Caro.
export const S08_DUR = 255;
const LINES = [50, 88, 126, 164]; // entrada de cada globo (mismo orden que CONVO)
const PUSH: [number, number] = [178, 232];
const CHAT_IN: [number, number] = [188, 220];
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
    { f: 48, x: 1300, y: 520, zoom: 0.9 },
    { f: PUSH[0], x: 1310, y: 518, zoom: 0.91 },
    { f: PUSH[1], ...CAM_NICO },
    { f: S08_DUR, ...CAM_NICO },
  ]);

// Globo de diálogo con colita hacia quien habla.
const Speech: React.FC<{ text: string; side: "left" | "right"; p: number }> = ({ text, side, p }) => (
  <div style={{ position: "relative", background: side === "left" ? C.surface : C.primarySoft, borderRadius: 26, padding: "18px 26px", boxShadow: SH.float, fontFamily: FONT, fontSize: 34, fontWeight: 500, color: C.text, whiteSpace: "nowrap", transform: `scale(${0.7 + 0.3 * p})`, transformOrigin: side === "left" ? "0% 100%" : "100% 100%", opacity: Math.min(1, p * 1.5) }}>
    {text}
    <svg width={34} height={26} viewBox="0 0 34 26" style={{ position: "absolute", bottom: -22, [side === "left" ? "left" : "right"]: 26, transform: side === "right" ? "scaleX(-1)" : undefined }}>
      <path d="M0 0 H34 L4 26 Z" fill={side === "left" ? C.surface : C.primarySoft} />
    </svg>
  </div>
);

export const S08Chat: React.FC = () => {
  const f = useCurrentFrame();
  const c = camS08(f);
  const back = range(f, [0, 30], [0, 1], easeInOut);
  const chat = range(f, CHAT_IN, [0, 1], easeInOut);
  const talkOut = 1 - range(f, [PUSH[0], PUSH[0] + 14], [0, 1], easeInOut);
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
        <Actor pose={POSE.caroCelular} x={CARO_W.x} feetY={CARO_W.feet} scale={CARO_W.scale} f={f} />
        <Actor pose={POSE.nicoCelular} x={NICO_W.x} feetY={NICO_W.feet} scale={NICO_W.scale} f={f} />
        {/* El celular de la 7 vuelve a la mano de Caro */}
        {back < 1 && (
          <Device x={interpolate(back, [0, 1], [DEV7.x, caroPhoneW.x])} y={interpolate(back, [0, 1], [DEV7.y, caroPhoneW.y])} scale={interpolate(back, [0, 1], [DEV7.s, 0.06])} opacity={1 - range(back, [0.75, 1], [0, 1], (t) => t)} appH={CARO_APP_H}>
            <VisitasScreen f={S07_VF_END} />
          </Device>
        )}
        {/* Conversación en cascada, como un chat: cada globo entra más abajo que el anterior, alineado
            hacia quien habla (Caro a la izquierda, Nico a la derecha), y todos quedan hasta el push-in. */}
        {talkOut > 0 &&
          CONVO.map((m, i) => {
            const p = pop(f, LINES[i], { damping: 15, stiffness: 120 });
            if (p <= 0.01) return null;
            const caro = m.from === "caro";
            return (
              <div key={i} style={{ position: "absolute", left: caro ? CARO_W.x + 190 : NICO_W.x - 190, top: 110 + i * 108 + (1 - Math.min(1, p)) * 20, transform: `translateX(${caro ? 0 : -100}%)`, opacity: talkOut }}>
                <Speech text={m.text} side={caro ? "left" : "right"} p={p} />
              </div>
            );
          })}
        {/* El chat crece desde el celular de Nico, a su izquierda, con la conversación completa */}
        {chat > 0.01 && (
          <Device x={interpolate(chat, [0, 1], [nicoPhoneW.x, NICO_DEV.x])} y={interpolate(chat, [0, 1], [nicoPhoneW.y, NICO_DEV.y])} scale={interpolate(chat, [0, 1], [0.05, NICO_DEV.s])} opacity={Math.min(1, chat * 4)}>
            <ChatScreen f={chatClock(f)} mine="nico" />
          </Device>
        )}
      </Layer>
      <Kinetic f={f} text={es.video.kinetic.s08.text} at={200} out={246} x={110} y={500} accent={[2]} eyebrow={es.video.kinetic.s08.eyebrow} size={56} />
    </AbsoluteFill>
  );
};
