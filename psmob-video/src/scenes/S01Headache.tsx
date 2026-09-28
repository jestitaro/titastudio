import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Caro } from "../characters/Caro";
import { FaceState, neutralFace } from "../characters/parts";
import { brand } from "../design/illustration";
import { es } from "../i18n/es";
import { easeInOut, easeOut, osc, pop, range } from "../lib/motion";
import { AlarmClock, Bolt, OfficeBackdrop, Swirl, ThoughtCloud, WarningSign } from "../props/Chaos";
import { NotificationCard } from "../ui/NotificationCard";
import { Subtitle } from "../ui/Subtitle";

// 01 · 0:00–0:06 · El dolor de cabeza (180 frames @30fps)
export const S01_DURATION = 180;

const T = {
  armUp: 10,
  squeeze: 16,
  cloud: 16,
  bolts: 24,
  clock: 30,
  warning: 38,
  notifs: [48, 60, 72],
  peek: 96,
  badgeJump: 108,
  deadpan: 118,
  sighIn: 132,
  sighOut: 146,
  reSqueeze: 156,
};

// Capa con parallax respecto de la cámara.
const Layer: React.FC<{ depth: number; cam: { x: number; y: number; s: number }; children: React.ReactNode }> = ({
  depth,
  cam,
  children,
}) => {
  const s = 1 + (cam.s - 1) * depth;
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${cam.x * depth}px, ${cam.y * depth}px) scale(${s})`,
        transformOrigin: "960px 470px",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Pop con overshoot + idle flotante: nada entra lineal ni queda quieto.
const Pop: React.FC<{
  at: number;
  x: number;
  y: number;
  w: number;
  h?: number;
  from?: number;
  rot?: number;
  float?: number;
  children: React.ReactNode;
}> = ({ at, x, y, w, h, from = 0.4, rot = 0, float = 8, children }) => {
  const frame = useCurrentFrame();
  const p = pop(frame, at);
  const idle = osc(frame, 60 + (x % 23), float, x);
  const scale = interpolate(p, [0, 1], [from, 1]);
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - (h ?? w) / 2,
        width: w,
        height: h,
        opacity: Math.min(1, p * 2),
        transform: `translateY(${(1 - p) * 40 + idle}px) scale(${scale}) rotate(${(1 - p) * rot + osc(frame, 90, 1.5, x)}deg)`,
      }}
    >
      {children}
    </div>
  );
};

export const S01Headache: React.FC<{ showSubtitles?: boolean }> = ({ showSubtitles = true }) => {
  const frame = useCurrentFrame();
  const copy = es.s01;

  // Cámara: push-in suave con leve deriva lateral.
  const cam = {
    s: range(frame, [0, S01_DURATION], [1, 1.12], easeInOut),
    x: range(frame, [0, S01_DURATION], [10, -14], easeInOut),
    y: range(frame, [0, S01_DURATION], [0, 10], easeInOut),
  };

  // Actuación de Caro: entra desde abajo con la mano ya en la frente y remata con un facepalm.
  const enter = pop(frame, 0, { damping: 13, stiffness: 110 });
  const enterY = interpolate(enter, [0, 1], [320, 0]);
  const squash = 1 + (1 - enter) * 0.04;
  const lift = range(frame, [T.armUp, T.armUp + 6], [0, 1], easeOut);
  const slap = pop(frame, T.armUp + 6, { damping: 9, stiffness: 220 });
  const tap = lift * (1 - slap);
  const arm = { upper: 235 - tap * 8, fore: 321 - tap * 26 };
  const recoil = frame >= T.armUp + 6 ? osc(frame - T.armUp - 6, 10, 4) * Math.exp(-(frame - T.armUp - 6) / 8) : 0;

  const sigh =
    frame < T.sighOut
      ? range(frame, [T.sighIn, T.sighOut], [0, 16], easeInOut)
      : range(frame, [T.sighOut, T.sighOut + 10], [16, -6], easeOut) +
        range(frame, [T.sighOut + 10, T.sighOut + 24], [0, 6], easeInOut);

  let face: FaceState = { ...neutralFace, mouth: "flat", browL: 4, browR: 4 };
  let tilt = recoil;
  if (frame >= T.squeeze) {
    face = { ...face, eyes: "squeeze", browL: 14, browR: 14, mouth: "ugh" };
    tilt = range(frame, [T.squeeze, T.squeeze + 16], [0, -6]) + recoil;
  }
  if (frame >= T.peek) {
    face = { ...face, eyes: "open", lookX: 1, lookY: 0.2, browL: 12, browR: -8, browLift: 0, mouth: "ugh" };
    tilt = range(frame, [T.peek, T.peek + 10], [-6, -3]);
  }
  if (frame >= T.badgeJump) {
    face = { ...face, browR: -14, browLift: 6 };
  }
  if (frame >= T.deadpan) {
    face = { ...face, lookX: 0, lookY: 0, browL: 2, browR: -12, browLift: 4, mouth: "flat" };
  }
  if (frame >= T.sighIn) {
    face = { ...face, eyes: "closed", browL: -6, browR: -6, browLift: 8, mouth: "flat" };
  }
  if (frame >= T.sighOut) {
    face = { ...face, eyes: "closed", browLift: 0, browL: 6, browR: 6, mouth: "o" };
  }
  if (frame >= T.reSqueeze) {
    face = { ...face, eyes: "squeeze", browL: 14, browR: 14, mouth: "ugh" };
    tilt = range(frame, [T.reSqueeze, T.reSqueeze + 12], [-3, -7]);
  }

  // Pulso del caos: se acelera hacia el final (pasa la posta a los malabares).
  const intensity = range(frame, [120, S01_DURATION], [1, 1.8]);
  const pulse = (period: number, amp: number, ph = 0) => 1 + Math.abs(osc(frame * intensity, period, amp, ph));

  const badge = frame < T.badgeJump ? Math.round(range(frame, [T.notifs[0] + 4, T.notifs[0] + 30], [1, copy.notifForms.badge])) : 27;
  const badgeKick = pop(frame, T.badgeJump);
  const badgeShake = frame >= T.badgeJump ? osc(frame, 4, 6) * (1 - badgeKick) : 0;

  const swirlP = range(frame, [28, 64], [0, 1], easeOut);
  const clockSpin = frame * 22 * intensity;
  const ring = frame >= T.clock ? osc(frame, 3, 1) : 0;

  // Bocanada del suspiro.
  const puff = range(frame, [T.sighOut, T.sighOut + 22], [0, 1], easeOut);

  // Luz ambiente que late con el caos.
  const glow = 0.55 + osc(frame * intensity, 45, 0.08);

  return (
    <AbsoluteFill style={{ background: brand.night, overflow: "hidden" }}>
      {/* Fondo: degradé de marca + oficina translúcida */}
      <Layer depth={0.35} cam={cam}>
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 70% 75% at 50% 42%, rgba(112,37,224,${glow}) 0%, ${brand.navy} 55%, ${brand.night} 100%)`,
          }}
        />
        <OfficeBackdrop />
      </Layer>

      {/* Remolinos detrás del personaje */}
      <Layer depth={0.7} cam={cam}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute" }}>
          <g transform={`rotate(${frame * 0.6 * intensity},960,420)`}>
            <Swirl progress={swirlP} d="M700,300 C640,380 660,470 720,520" />
            <Swirl progress={swirlP} d="M1210,280 C1280,350 1270,450 1210,500" />
            <Swirl progress={swirlP} d="M760,200 C820,160 900,150 950,160" width={3} />
            <Swirl progress={swirlP} d="M1120,190 C1170,210 1200,240 1215,270" width={3} />
          </g>
        </svg>
      </Layer>

      {/* Caro */}
      <Layer depth={1} cam={cam}>
        <div style={{ position: "absolute", left: 552, top: 80 + enterY, width: 816, height: 1020, transform: `scale(${1 / squash},${squash})`, transformOrigin: "50% 100%" }}>
          <Caro face={face} arm={arm} hand="open" headTilt={tilt} shoulderLift={sigh} sway={osc(frame, 30, 1) * (frame > T.sighOut ? 2 : 0)} />
        </div>
        {/* bocanada */}
        {puff > 0 && puff < 1 && (
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute" }}>
            {[0, 1, 2].map((i) => (
              <circle
                key={i}
                cx={938 - puff * (70 + i * 40)}
                cy={556 + puff * (20 + i * 26)}
                r={(10 + i * 6) * (1 - puff * 0.4)}
                fill="rgba(255,255,255,0.8)"
                opacity={1 - puff}
              />
            ))}
          </svg>
        )}
      </Layer>

      {/* Caos: objetos pana + notificaciones PSMob, plano delantero */}
      <Layer depth={1.25} cam={cam}>
        <Pop at={T.cloud} x={960} y={168} w={380} h={230} from={0.2}>
          <div style={{ width: "100%", height: "100%", transform: `scale(${pulse(50, 0.03)})` }}>
            <ThoughtCloud papers={frame > T.cloud + 14 ? 3 : frame > T.cloud + 7 ? 2 : 1} />
          </div>
        </Pop>

        {[
          { x: 730, y: 360, r: -20, ph: 0 },
          { x: 1190, y: 340, r: 18, ph: 7 },
          { x: 600, y: 450, r: -35, ph: 3 },
          { x: 1220, y: 520, r: 30, ph: 11 },
        ].map((b, i) => (
          <Pop key={i} at={T.bolts + i * 3} x={b.x} y={b.y} w={54} h={90} rot={b.r} float={4}>
            <div
              style={{
                width: "100%",
                height: "100%",
                transform: `rotate(${b.r}deg) scale(${pulse(14, 0.12, b.ph)})`,
                opacity: 0.75 + osc(frame * intensity, 10, 0.25, b.ph * 3),
              }}
            >
              <Bolt />
            </div>
          </Pop>
        ))}

        <Pop at={T.clock} x={1370} y={250} w={170} h={187} rot={25}>
          <div style={{ width: "100%", height: "100%", transform: `rotate(${osc(frame, 3, ring ? 3 : 0)}deg)` }}>
            <AlarmClock minuteDeg={clockSpin} ring={ring} />
          </div>
        </Pop>

        <Pop at={T.warning} x={560} y={250} w={120} h={106} rot={-25}>
          <div style={{ width: "100%", height: "100%", transform: `scale(${pulse(24, 0.08)})` }}>
            <WarningSign />
          </div>
        </Pop>

        <Pop at={T.notifs[0]} x={400} y={660} w={460} h={90} rot={-6} float={10}>
          <div style={{ transform: `translateX(${badgeShake}px)` }}>
            <NotificationCard
              icon="form"
              tone="danger"
              title={copy.notifForms.title}
              subtitle={copy.notifForms.subtitle}
              badge={badge}
              width={460}
            />
          </div>
        </Pop>
        <Pop at={T.notifs[1]} x={1480} y={500} w={380} h={90} rot={6} float={9}>
          <NotificationCard icon="pin" title={copy.notifVisit.title} subtitle={copy.notifVisit.subtitle} />
        </Pop>
        <Pop at={T.notifs[2]} x={1450} y={720} w={380} h={110} rot={-4} float={11}>
          <NotificationCard icon="route" tone="warning" title={copy.notifRoute.title} chip={copy.notifRoute.chip} />
        </Pop>
      </Layer>

      {/* Viñeta para profundidad */}
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(5,3,30,0.55) 100%)" }}
      />

      {showSubtitles && <Subtitle text={es.vo.s01} />}
    </AbsoluteFill>
  );
};
