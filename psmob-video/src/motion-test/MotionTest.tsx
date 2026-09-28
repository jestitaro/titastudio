import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { color, fontWeight } from "../design/psmob-tokens";
import { roboto } from "../design/fonts";
import { es } from "../i18n/es";
import { easeInOut, easeOut, osc, pop, range } from "../lib/motion";
import {
  Cam,
  Character,
  charPoint,
  FloorShadow,
  H,
  Layer,
  POSES,
  project,
  shake,
  toScreen,
  W,
} from "./camera";
import { AlertCard, Chip, ChatScreen, Clock, IconKind, IconTile, PhoneFrame, VisitListScreen } from "./ui";

const t = es.motionTest;

export const MOTION_TEST_DURATION = 300;

// Versión: v1 = primer corte; v2 = correcciones tras revisar el contact sheet.
export type MotionTestProps = { version: "v1" | "v2" };

// ——— Timeline (frames @30fps) ———
const T = {
  cutPhone: 60, // match cut Caro neutral → Caro celular
  phoneIn: 64, // la pantalla sale del celular
  cutStress: 120, // corte a Caro en estrés
  notifIn: 160, // notificación de chat entra
  expand: [174, 194] as [number, number], // la notificación se expande y revela a Nico
  chatIn: 190,
  pullBack: [246, 284] as [number, number],
  logoIn: 262,
};

const sine = Easing.bezier(0.37, 0, 0.63, 1);

const fromScreen = (cam: Cam, depth: number, s: { x: number; y: number }) => {
  const { z, fx, fy } = project(cam, depth);
  return { x: fx + (s.x - W / 2) / z, y: fy + (s.y - H / 2) / z };
};

// ——— Mundo 1: Caro sola (0–196) ———
const CARO_X = 960;

const cam1 = (f: number, v: MotionTestProps["version"]): Cam => {
  if (f < T.cutStress) {
    // Un solo movimiento continuo que atraviesa el match cut: la cámara no se detiene en el corte.
    const zoom = range(f, [0, 84], [1, 1.6]) + range(f, [84, 120], [0, 0.08], sine);
    const x = range(f, [36, 92], [960, 1090]) + range(f, [92, 120], [0, 20], sine);
    const y = range(f, [0, 84], [540, 385]);
    const s = shake(f, range(f, [110, 118], [0, v === "v2" ? 2.5 : 3]));
    return { x: x + s.x, y: y + s.y, zoom };
  }
  const zoom = v === "v2" ? range(f, [T.cutStress, 196], [1.42, 1.6], sine) : range(f, [T.cutStress, 196], [1.22, 1.4], sine);
  const y = v === "v2" ? range(f, [T.cutStress, 196], [420, 395], sine) : range(f, [T.cutStress, 196], [450, 420], sine);
  const s = shake(f, range(f, [T.cutStress, 150], [2, v === "v2" ? 4 : 6]));
  return { x: 960 + s.x, y: y + s.y, zoom };
};

// Aparición con resorte de elementos de ambiente.
const appear = (f: number, at: number) => pop(f, at);

const Float: React.FC<{
  x: number;
  y: number;
  f: number;
  at: number;
  out?: number;
  phase?: number;
  children: React.ReactNode;
}> = ({ x, y, f, at, out, phase = 0, children }) => {
  const p = appear(f, at);
  const q = out === undefined ? 1 : 1 - range(f, [out, out + 8], [0, 1]);
  const s = Math.min(p, 1.2) * q;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + osc(f, 90, 6, phase),
        transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * s})`,
        opacity: Math.min(1, p * 1.6) * q,
      }}
    >
      {children}
    </div>
  );
};

const Backdrop: React.FC<{ cam: Cam; f: number; warm: number }> = ({ cam, f, warm }) => {
  const bg = interpolate(warm, [0, 1], [0, 1]);
  return (
    <>
      <AbsoluteFill style={{ background: bg > 0 ? `color-mix(in srgb, #FFF1E6 ${bg * 100}%, #F3F6FC)` : "#F3F6FC" }} />
      <Layer cam={cam} depth={0.2}>
        <div
          style={{
            position: "absolute",
            left: -600,
            top: -400,
            width: W + 1200,
            height: H + 800,
            backgroundImage: "radial-gradient(rgba(33,150,243,0.16) 2px, transparent 2.5px)",
            backgroundSize: "44px 44px",
            opacity: 0.7,
          }}
        />
      </Layer>
      <Layer cam={cam} depth={0.35}>
        <div
          style={{
            position: "absolute",
            left: 520,
            top: 60,
            width: 880,
            height: 880,
            borderRadius: "50%",
            background: `radial-gradient(closest-side, ${warm > 0.5 ? "rgba(255,152,0,0.16)" : "rgba(33,150,243,0.14)"}, rgba(255,255,255,0))`,
            transform: `scale(${1 + osc(f, 150, 0.03)})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 1300,
            top: 120,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: color.accentLight,
            opacity: 0.55,
          }}
        />
        <div style={{ position: "absolute", left: 220, top: 620, width: 360, height: 360, borderRadius: "50%", background: color.primaryLight, opacity: 0.6 }} />
      </Layer>
    </>
  );
};

const PhoneInsert: React.FC<{
  f: number;
  start: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
  fromRot: number;
  children: React.ReactNode;
  exit?: [number, number];
  shakeAmp?: number;
  scale?: number;
}> = ({ f, start, from, to, fromRot, children, exit, shakeAmp = 0, scale: size = 0.62 }) => {
  const p = pop(f, start, { damping: 16, stiffness: 110, mass: 0.9 });
  const e = exit ? range(f, exit, [0, 1], easeInOut) : 0;
  const k = p * (1 - e);
  const scale = size * interpolate(k, [0, 1], [0.08, 1]);
  const x = interpolate(k, [0, 1], [from.x, to.x]);
  const y = interpolate(k, [0, 1], [from.y, to.y]);
  const rot = interpolate(k, [0, 1], [fromRot, -3]) + osc(f, 110, 0.6);
  const s = shake(f, shakeAmp);
  if (f < start) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x + s.x,
        top: y + osc(f, 100, 4) + s.y,
        transformOrigin: "0 0",
        transform: `rotate(${rot}deg) scale(${scale}) translate(-50%, -50%)`,
        opacity: Math.min(1, k * 4),
      }}
    >
      <PhoneFrame>{children}</PhoneFrame>
    </div>
  );
};

type Slot = { x: number; y: number; depth: number; blur: number; rot: number };
const STRESS_SLOTS: Slot[] = [
  { x: 1430, y: 250, depth: 1.3, blur: 0, rot: 3 },
  { x: 500, y: 560, depth: 1.45, blur: 0, rot: -4 },
  { x: 1450, y: 590, depth: 1.2, blur: 0, rot: -2 },
  { x: 560, y: 250, depth: 1.7, blur: 2.5, rot: 5 },
];

// v2: más cerca de Caro, sin tapar la cara; la última en foreground desenfocada abajo.
const STRESS_SLOTS_V2: Slot[] = [
  { x: 1370, y: 215, depth: 1.25, blur: 0, rot: 3 },
  { x: 560, y: 470, depth: 1.35, blur: 0, rot: -4 },
  { x: 1390, y: 505, depth: 1.15, blur: 0, rot: -2 },
  { x: 600, y: 700, depth: 1.6, blur: 3, rot: 5 },
];

const WorldCaro: React.FC<{ f: number; v: MotionTestProps["version"] }> = ({ f, v }) => {
  const cam = cam1(f, v);
  const stress = f >= T.cutStress;
  const warm = range(f, [T.cutStress - 2, T.cutStress + 14], [0, 1]);
  const pose = f < T.cutPhone ? POSES.caroFeliz : !stress ? POSES.caroCelular : POSES.caroEstres;
  const phoneWorld = charPoint(POSES.caroCelular, CARO_X, { x: 705, y: 380 });
  const lf = f - T.phoneIn;
  const ambientOut = v === "v2" ? 58 : T.phoneIn;
  // En v2 la cámara del tramo de estrés ya no deja que las cards tapen la cara.
  const slots = v === "v2" ? STRESS_SLOTS_V2 : STRESS_SLOTS;
  // Las alertas nacen donde estaba la pantalla del celular en el último frame antes del corte.
  const phoneScreen = toScreen(cam1(T.cutStress - 1, v), 1, { x: 1390, y: 430 });

  return (
    <AbsoluteFill>
      <Backdrop cam={cam} f={f} warm={warm} />

      {/* Fondo lejano: tiles de íconos */}
      <Layer cam={cam} depth={0.5} blur={1.2}>
        {(
          [
            ["chart", 520, 300, 8],
            ["calendar", 1400, 250, 12],
            ["box", 1480, 720, 16],
            ["route", 460, 780, 20],
          ] as [IconKind, number, number, number][]
        ).map(([k, x, y, at], i) => (
          <Float key={k} x={x} y={y} f={f} at={at} phase={i * 20}>
            <div style={{ opacity: 0.75 }}>
              <IconTile kind={k} size={84} tint={stress && i < 2 ? color.danger : color.primaryDark} />
            </div>
          </Float>
        ))}
      </Layer>

      {/* Reloj: aparece con el estrés */}
      {stress && (
        <Layer cam={cam} depth={0.75}>
          <Float x={v === "v2" ? 700 : 700} y={v === "v2" ? 215 : 300} f={f} at={T.cutStress + 4}>
            <Clock frame={f} size={170} speed={1.4} />
          </Float>
        </Layer>
      )}

      {/* Plano medio: chips */}
      <Layer cam={cam} depth={0.8}>
        <Float x={1330} y={430} f={f} at={18} out={ambientOut} phase={10}>
          <Chip icon="pin" label={t.chips.visit} />
        </Float>
        <Float x={590} y={470} f={f} at={24} out={ambientOut} phase={40}>
          <Chip icon="check" label={t.chips.sync} tint={color.successDark} />
        </Float>
      </Layer>

      {/* Personaje */}
      <Layer cam={cam} depth={1}>
        <FloorShadow x={CARO_X} />
        <Character pose={pose} x={CARO_X} />
        {!stress && (
          <PhoneInsert
            f={f}
            start={T.phoneIn}
            from={phoneWorld}
            to={{ x: 1390, y: 430 }}
            fromRot={-28}
            shakeAmp={range(f, [108, 116], [0, 4])}
          >
            <VisitListScreen frame={lf} revealAt={8} tapAt={26} scrollAt={34} alertsAt={v === "v2" ? 44 : 46} />
          </PhoneInsert>
        )}
      </Layer>

      {/* Estrés: las alertas salen de donde estaba el celular e invaden el cuadro */}
      {stress &&
        t.stress.map((a, i) => {
          const s = slots[i];
          // v2: el burst arranca antes del corte para que el primer frame de estrés ya tenga acción.
          const at = T.cutStress + i * 4 - (v === "v2" ? 3 : 0);
          const p = pop(f, at, { damping: 13, stiffness: 120, mass: 0.9 });
          const origin = fromScreen(cam1(T.cutStress, v), s.depth, phoneScreen);
          const x = interpolate(p, [0, 1], [origin.x, s.x]);
          const y = interpolate(p, [0, 1], [origin.y, s.y]);
          const badge = Math.min(12, 3 + Math.floor(Math.max(0, f - at) / 5));
          return (
            <Layer key={a.title} cam={cam} depth={s.depth} blur={s.blur}>
              <div
                style={{
                  position: "absolute",
                  left: x,
                  top: y + osc(f, 70, 5, i * 17),
                  transform: `translate(-50%, -50%) rotate(${s.rot * p}deg) scale(${interpolate(p, [0, 1], [0.3, v === "v2" ? 1 : 0.8])})`,
                  opacity: Math.min(1, p * 3),
                }}
              >
                <AlertCard title={a.title} subtitle={a.subtitle} tone={a.tone} badge={i < 2 ? badge : undefined} />
              </div>
            </Layer>
          );
        })}

      {/* Foreground: tiles desenfocados que salen de cuadro con el push-in */}
      <Layer cam={cam} depth={1.7} blur={4}>
        <Float x={1600} y={880} f={f} at={10} phase={30}>
          <IconTile kind="pin" size={120} tint={color.accent} />
        </Float>
        <Float x={300} y={190} f={f} at={14} phase={60}>
          <IconTile kind="chart" size={100} />
        </Float>
      </Layer>

      {/* Viñeta cálida en estrés */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(244,67,54,0.16) 100%)",
          opacity: warm * (0.8 + osc(f, 24, 0.2)),
        }}
      />
    </AbsoluteFill>
  );
};

// ——— Mundo 2: Nico (+ Caro fuera de cuadro para el cierre) ———
const NICO_X = 1300;
const CARO2_X = { v1: 430, v2: 410 };

const CAM2 = {
  v1: { z0: 1.95, z1: 1.7, x0: 1215, x1: 1200, y0: 395, y1: 395, endX: 865 },
  v2: { z0: 1.75, z1: 1.55, x0: 1200, x1: 1190, y0: 350, y1: 370, endX: 855 },
};

const cam2 = (f: number, v: MotionTestProps["version"]): Cam => {
  const c = CAM2[v];
  if (f < T.pullBack[0]) {
    return {
      zoom: range(f, [T.expand[0], T.pullBack[0]], [c.z0, c.z1], easeOut),
      x: range(f, [T.expand[0], T.pullBack[0]], [c.x0, c.x1], easeOut),
      y: range(f, [T.expand[0], T.pullBack[0]], [c.y0, c.y1], easeOut),
    };
  }
  const k = range(f, T.pullBack, [0, 1], easeInOut);
  const settle = range(f, [T.pullBack[1], 300], [0, 0.03], sine);
  return {
    zoom: interpolate(k, [0, 1], [c.z1, 1.0]) + settle,
    x: interpolate(k, [0, 1], [c.x1, c.endX]),
    y: interpolate(k, [0, 1], [c.y1, 560]),
  };
};

const Logo: React.FC<{ f: number; x: number }> = ({ f, x }) => {
  const icon = pop(f, T.logoIn);
  const word = range(f, [T.logoIn + 4, T.logoIn + 16], [0, 1], easeOut);
  const tag = range(f, [T.logoIn + 10, T.logoIn + 22], [0, 1], easeOut);
  return (
    <div style={{ position: "absolute", left: x, top: 250, transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: color.primaryGradient,
            boxShadow: "0 12px 28px rgba(25,118,210,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${icon}) rotate(${(1 - icon) * -20}deg)`,
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24">
            <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" fill="#fff" />
            <path d="m9 10 2 2 4-4" stroke={color.primaryDark} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div
          style={{
            fontFamily: roboto,
            fontSize: 54,
            fontWeight: fontWeight.bold,
            color: color.textPrimary,
            letterSpacing: -0.5,
            clipPath: `inset(0 ${(1 - word) * 100}% 0 0)`,
            transform: `translateX(${(1 - word) * -16}px)`,
          }}
        >
          {t.brand}
        </div>
      </div>
      <div
        style={{
          fontFamily: roboto,
          fontSize: 22,
          color: color.textSecondary,
          opacity: tag,
          transform: `translateY(${(1 - tag) * 10}px)`,
        }}
      >
        {t.tagline}
      </div>
    </div>
  );
};

const WorldNico: React.FC<{ f: number; v: MotionTestProps["version"] }> = ({ f, v }) => {
  const cam = cam2(f, v);
  const caroX = CARO2_X[v];
  const phoneWorld = charPoint(POSES.nicoCelular, NICO_X, { x: 275, y: 460 });
  const chatF = f - T.chatIn;
  return (
    <AbsoluteFill>
      <Backdrop cam={cam} f={f} warm={0} />

      <Layer cam={cam} depth={0.5} blur={1.2}>
        {(
          [
            ["chat", 1560, 230, T.chatIn + 6],
            ["check", 700, 640, T.chatIn + 12],
            ["calendar", 250, 300, T.pullBack[0] + 6],
            ["chart", 1620, 700, T.pullBack[0] + 10],
          ] as [IconKind, number, number, number][]
        ).map(([k, x, y, at], i) => (
          <Float key={k} x={x} y={y} f={f} at={at} phase={i * 23}>
            <div style={{ opacity: 0.75 }}>
              <IconTile kind={k} size={84} tint={k === "check" ? color.successDark : color.primaryDark} />
            </div>
          </Float>
        ))}
      </Layer>

      <Layer cam={cam} depth={0.9}>
        {f >= T.logoIn - 4 && <Logo f={f} x={CAM2[v].endX} />}
      </Layer>

      <Layer cam={cam} depth={1}>
        <FloorShadow x={caroX} />
        <Character pose={POSES.caroFeliz} x={caroX} />
        <FloorShadow x={NICO_X} />
        <Character pose={POSES.nicoCelular} x={NICO_X} />
        <PhoneInsert
          f={f}
          start={T.chatIn}
          from={phoneWorld}
          to={v === "v2" ? { x: 935, y: 410 } : { x: 905, y: 440 }}
          fromRot={-18}
          exit={[T.pullBack[0] + 2, T.pullBack[0] + 16]}
          scale={v === "v2" ? 0.68 : 0.62}
        >
          <ChatScreen frame={chatF} inAt={v === "v2" ? 6 : 10} typingAt={v === "v2" ? 16 : 18} outAt={26} history={v === "v2"} />
        </PhoneInsert>
      </Layer>

      <Layer cam={cam} depth={1.6} blur={4}>
        <Float x={v === "v2" ? 1700 : 1650} y={900} f={f} at={T.chatIn + 4} phase={10}>
          <IconTile kind="chat" size={120} tint={color.accent} />
        </Float>
        <Float x={140} y={860} f={f} at={T.pullBack[0] + 8} phase={45}>
          <IconTile kind="pin" size={110} />
        </Float>
      </Layer>
    </AbsoluteFill>
  );
};

// Notificación de chat que entra durante el estrés y se expande hasta ser el cuadro siguiente.
const NOTIF = { x: 1180, y: 770, w: 470, h: 116 };

const ChatNotif: React.FC<{ f: number; v: MotionTestProps["version"] }> = ({ f, v }) => {
  const p = pop(f, T.notifIn, { damping: 14, stiffness: 130 });
  const contentOut = range(f, [T.expand[0], T.expand[0] + (v === "v2" ? 4 : 6)], [1, 0]);
  // v2: la superficie de la card se disuelve dentro de su propio marco mientras crece.
  const surface = v === "v2" ? range(f, [T.expand[0] + 2, T.expand[0] + 9], [1, 0]) : 1;
  const k = range(f, T.expand, [0, 1], easeInOut);
  const x = interpolate(k, [0, 1], [NOTIF.x - NOTIF.w / 2, 0]) + (1 - p) * 700;
  const y = interpolate(k, [0, 1], [NOTIF.y - NOTIF.h / 2, 0]);
  const w = interpolate(k, [0, 1], [NOTIF.w, W]);
  const h = interpolate(k, [0, 1], [NOTIF.h, H]);
  if (f < T.notifIn || f >= T.expand[1] + 8) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: interpolate(k, [0, 1], [22, 0]),
        background: `rgba(243,246,252,${surface})`,
        boxShadow: `0 30px 70px rgba(20,32,70,${0.3 * (1 - k) * (v === "v2" ? 0 : 1)})`,
        opacity: f >= T.expand[1] ? 0 : 1,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 24px", opacity: contentOut, fontFamily: roboto }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            background: color.primary,
            color: "#fff",
            fontSize: 28,
            fontWeight: fontWeight.medium,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          N
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 24, fontWeight: fontWeight.medium, color: color.textPrimary }}>{t.chatNotif.title}</div>
          <div style={{ fontSize: 18, color: color.textSecondary, marginTop: 2 }}>{t.chatNotif.subtitle}</div>
        </div>
        <IconTile kind="chat" size={52} tint={color.primary} bg={color.primaryLight} />
      </div>
    </div>
  );
};

export const MotionTest: React.FC<MotionTestProps> = ({ version }) => {
  const f = useCurrentFrame();
  const k = range(f, T.expand, [0, 1], easeInOut);
  const r = {
    x: interpolate(k, [0, 1], [NOTIF.x - NOTIF.w / 2, 0]),
    y: interpolate(k, [0, 1], [NOTIF.y - NOTIF.h / 2, 0]),
    w: interpolate(k, [0, 1], [NOTIF.w, W]),
    h: interpolate(k, [0, 1], [NOTIF.h, H]),
  };
  const radius = interpolate(k, [0, 1], [22, 0]);
  const reveal = version === "v2" ? 1 : range(f, [T.expand[0] + 4, T.expand[1] + 4], [0, 1]);
  return (
    <AbsoluteFill style={{ background: "#F3F6FC", overflow: "hidden" }}>
      {f < T.expand[1] && <WorldCaro f={f} v={version} />}
      {f >= T.notifIn && version === "v1" && <ChatNotif f={f} v={version} />}
      {version === "v2" && f >= T.expand[0] && f < T.expand[1] && (
        // Sombra de la ventana en expansión, por debajo del contenido revelado.
        <div
          style={{
            position: "absolute",
            left: r.x,
            top: r.y,
            width: r.w,
            height: r.h,
            borderRadius: radius,
            boxShadow: `0 30px 70px rgba(20,32,70,${0.3 * (1 - k)})`,
          }}
        />
      )}
      {f >= T.expand[0] && (
        <AbsoluteFill
          style={{
            clipPath: `inset(${r.y}px ${W - r.x - r.w}px ${H - r.y - r.h}px ${r.x}px round ${radius}px)`,
            opacity: reveal,
          }}
        >
          <WorldNico f={f} v={version} />
        </AbsoluteFill>
      )}
      {f >= T.notifIn && version === "v2" && <ChatNotif f={f} v={version} />}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(20,32,70,0.10) 100%)" }} />
    </AbsoluteFill>
  );
};
