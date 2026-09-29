import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, range } from "../../lib/motion";
import { Actor, camPath, Layer, LightStudio, Particles, POSE, posePoint, QS } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { Device } from "../ds/Device";
import { C, FONT, R, S, SH, T } from "../ds/tokens";
import { Kinetic } from "../ui/Kinetic";
import { es } from "../../i18n/es";
import { ChatScreen } from "../screens/Chat";
import { VisitasScreen } from "../screens/Field";
import { S07_CAM_END, S07_VF_END } from "./S07Organize";
import { CAM_NICO, CARO_W, DEV7, NICO_DEV, NICO_W } from "./world";

// Escena 8 — "Optimiza la comunicación". La cámara continúa desde la 7 y abre despacio a un plano con Caro
// y Nico frente a frente (Nico entra caminando hacia la izquierda, hacia donde mira). El mensaje viaja de
// un celular al otro; la cámara se acerca a Nico (plano americano) y el chat crece desde su celular.
const NICO_STOP = 60;
const CHAT_IN: [number, number] = [100, 128];
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
    { f: 50, x: 1040, y: 540, zoom: 0.94 },
    { f: 96, x: 1050, y: 540, zoom: 0.95 },
    { f: 150, ...CAM_NICO },
    { f: 165, ...CAM_NICO },
  ]);

const MiniBubble: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ background: C.primarySoft, borderRadius: `${R.card}px ${R.card}px ${R.sm / 2}px ${R.card}px`, padding: `${S.sm}px ${S.md}px`, boxShadow: SH.float, fontFamily: FONT, ...T.body, fontSize: 20, color: C.text, whiteSpace: "nowrap" }}>{text}</div>
);

// Nico: entra caminando hacia la izquierda y se frena; después, con el celular.
export const NicoWalkIn: React.FC<{ f: number; stop: number; from: number }> = ({ f, stop, from }) => {
  const walking = f < stop;
  const x = interpolate(f, [0, stop], [from, NICO_W.x], { easing: (t) => 1 - Math.pow(1 - t, 2.2), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return walking ? (
    <Actor pose={POSE.nicoCaminando} x={x} feetY={NICO_W.feet} scale={NICO_W.scale * 1.05} f={f} walk={{ poses: [POSE.nicoCaminando], period: 10, bob: 7 }} />
  ) : (
    <Actor pose={POSE.nicoCelular} x={NICO_W.x} feetY={NICO_W.feet} scale={NICO_W.scale} f={f} blink={{ pose: POSE.nicoCelularBlink, at: [88, 140] }} />
  );
};

export const S08Chat: React.FC = () => {
  const f = useCurrentFrame();
  const c = camS08(f);
  const back = range(f, [0, 30], [0, 1], easeInOut);
  const fly = range(f, [58, 92], [0, 1], easeInOut);
  const bx = interpolate(fly, [0, 1], [caroPhoneW.x, nicoPhoneW.x]);
  const by = interpolate(fly, [0, 1], [caroPhoneW.y, nicoPhoneW.y]) - Math.sin(fly * Math.PI) * 180;
  const ping = range(f, [90, 104], [0, 1]);
  const chat = range(f, CHAT_IN, [0, 1], easeInOut);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightStudio f={f + 345} />
      <Layer cam={c} depth={0.4}>
        <Particles f={f} n={30} seed="s08" color={QS.indigo} speed={0.25} size={[2, 5]} opacity={0.3} />
      </Layer>
      <Layer cam={c} depth={1}>
        <div style={{ position: "absolute", left: CARO_W.x - 200, top: CARO_W.feet - 16, width: 400, height: 32, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(19,13,93,0.16), rgba(19,13,93,0))" }} />
        <Actor pose={POSE.caroCelular} x={CARO_W.x} feetY={CARO_W.feet} scale={CARO_W.scale} f={f} blink={{ pose: POSE.caroCelularBlink, at: [40, 120] }} />
        <NicoWalkIn f={f} stop={NICO_STOP} from={2250} />
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
      <Kinetic f={f} text={es.video.kinetic.s08.text} at={100} out={150} x={100} y={470} accent={[2]} eyebrow={es.video.kinetic.s08.eyebrow} size={56} />
    </AbsoluteFill>
  );
};
