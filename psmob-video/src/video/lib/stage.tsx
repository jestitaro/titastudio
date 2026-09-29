import React from "react";
import { AbsoluteFill, Img, random, staticFile } from "remotion";
import { FONT } from "../ds/tokens";
import type { Cam as CamT } from "../../motion-test/camera";
import { Layer as LayerRe } from "../../motion-test/camera";

export { Layer, project, shake, toScreen, W, H } from "../../motion-test/camera";
export type { Cam } from "../../motion-test/camera";

// ——— Marca ———
export const QS = {
  dark: "#130D5D",
  darker: "#0A0736",
  violet: "#7025E0",
  blue: "#3C9FF1",
  indigo: "#463DE1",
  lilac: "#F4F1FF",
  lilac2: "#E9E3FF",
  surface: "#f1f5f9",
  gradient: "linear-gradient(135deg, #3C9FF1 0%, #3C96EF 3%, #463DE1 42%, #5932E0 60%, #6A28E0 83%, #7025E0 100%)",
  text: "#1e293b",
  textSoft: "#64748b",
} as const;

// ——— Personajes PNG (assets finales: solo posición, escala y máscaras) ———
// axisX / feetY medidos sobre el PNG para anclar poses sin saltos.
export type Pose = { file: string; w: number; h: number; axisX: number; feetY: number; k?: number };

export const POSE = {
  caroEstres: { file: "caro-estres.png", w: 1024, h: 1536, axisX: 508, feetY: 1514 },
  caroMostrando: { file: "caro-mostrando-pantalla.png", w: 1086, h: 1448, axisX: 532, feetY: 1427 },
  caroCelular: { file: "caro-celular.png", w: 1024, h: 1536, axisX: 493, feetY: 1512 },
  caroExplicando: { file: "caro-explicando.png", w: 1024, h: 1536, axisX: 478, feetY: 1506 },
  caroFeliz: { file: "caro-feliz.png", w: 1024, h: 1536, axisX: 498, feetY: 1507 },
  nicoCelular: { file: "nico-celular.png", w: 941, h: 1672, axisX: 514, feetY: 1641 },
  nicoExplicando: { file: "nico-explicando.png", w: 941, h: 1672, axisX: 526, feetY: 1644 },
  // Ojos cerrados (parpadeo). Caro comparte canvas con caro-celular; el de Nico viene en otro canvas y
  // escala: axis/feet calculados por registro de máscaras (k = 1.072) para que el parpadeo no salte.
  caroCelularBlink: { file: "caro-celular-sonriendo.png", w: 1024, h: 1536, axisX: 493, feetY: 1512 },
  nicoCelularBlink: { file: "nico-celular-sonriendo.png", w: 1024, h: 1536, axisX: 546.6, feetY: 1528.9, k: 1.072 },
  caroCaminandoA: { file: "caro-caminando.png", w: 1024, h: 1536, axisX: 522, feetY: 1486 },
  caroCaminandoB: { file: "caro-caminando-cerca.png", w: 1024, h: 1536, axisX: 539, feetY: 1491 },
  nicoCaminando: { file: "nico-caminando.png", w: 1024, h: 1536, axisX: 539, feetY: 1506 },
  caroSentada: { file: "caro-sentada.png", w: 1086, h: 1448, axisX: 552, feetY: 1396 },
  caroDurmiendo: { file: "caro-durmiendo.png", w: 1086, h: 1448, axisX: 566, feetY: 1416 },
  nicoSentado: { file: "nico-sentado.png", w: 1086, h: 1448, axisX: 571, feetY: 1408 },
  // Caminata nueva (ambos caminan hacia la derecha). Eje = centro de cadera, pies = apoyo más bajo:
  // así el torso no tiembla y la variación de altura entre fotogramas da el rebote natural.
  caroWalk1: { file: "caro-walk-1.png", w: 1024, h: 1536, axisX: 538, feetY: 1493 },
  caroWalk2: { file: "caro-walk-2.png", w: 1024, h: 1536, axisX: 548, feetY: 1496 },
  caroWalk3: { file: "caro-walk-3.png", w: 1024, h: 1536, axisX: 553, feetY: 1477 },
  caroWalk4: { file: "caro-walk-4.png", w: 1024, h: 1536, axisX: 542, feetY: 1481 },
  caroWalk5: { file: "caro-walk-5.png", w: 1024, h: 1536, axisX: 541, feetY: 1492 },
  nicoWalk1: { file: "nico-walk-1.png", w: 1024, h: 1536, axisX: 536, feetY: 1488 },
  nicoWalk2: { file: "nico-walk-2.png", w: 1024, h: 1536, axisX: 520, feetY: 1468 },
  nicoWalk3: { file: "nico-walk-3.png", w: 1024, h: 1536, axisX: 534, feetY: 1474 },
  nicoWalk4: { file: "nico-walk-4.png", w: 1024, h: 1536, axisX: 536, feetY: 1494 },
  // Caída (cara de sorpresa). Ancla en el centro del cuerpo.
  caroCaida: { file: "caro-caida.png", w: 1024, h: 1536, axisX: 520, feetY: 1273 },
} satisfies Record<string, Pose>;

// Ciclos de caminata ordenados por altura de cabeza (alto → bajo → alto) para un rebote suave.
export const WALK_CARO = { poses: [POSE.caroWalk5, POSE.caroWalk2, POSE.caroWalk1, POSE.caroWalk4, POSE.caroWalk3, POSE.caroWalk4, POSE.caroWalk1, POSE.caroWalk2], period: 2, bob: 0 };
export const WALK_NICO = { poses: [POSE.nicoWalk4, POSE.nicoWalk1, POSE.nicoWalk3, POSE.nicoWalk2, POSE.nicoWalk3, POSE.nicoWalk1], period: 3, bob: 0 };

// Primeros planos mostrando el celular (PNG apaisados recortados en los bordes derecho/arriba/abajo).
// Se anclan al borde derecho del cuadro; `screen` = pantalla en blanco del celular (coords del PNG).
export const CLOSEUP = {
  caro: { file: "caro-mostrando-celu.png", w: 1448, h: 1086, screen: { x0: 313, y0: 219, x1: 661, y1: 907, r: 40 } },
  nico: { file: "nico-mostrando-celu.png", w: 1448, h: 1086, screen: { x0: 397, y0: 317, x1: 671, y1: 888, r: 34 } },
} as const;

// Pantalla en blanco del celular que Caro muestra (coords del PNG).
export const CARO_SCREEN = { x0: 338, y0: 217, x1: 428, y1: 404 };

// Punto del PNG → coords locales del contenedor del personaje (origen = pies en el eje).
export const posePoint = (pose: Pose, scale: number, p: { x: number; y: number }) => ({
  x: (p.x - pose.axisX) * scale,
  y: (p.y - pose.feetY) * scale,
});

export const Char: React.FC<{
  pose: Pose;
  x: number;
  feetY: number;
  scale: number;
  opacity?: number;
  flip?: boolean;
  style?: React.CSSProperties;
}> = ({ pose, x, feetY, scale: s0, opacity = 1, style }) => {
  const scale = s0 * (pose.k ?? 1);
  return (
    <Img
      src={staticFile(`personajes/${pose.file}`)}
      style={{
        position: "absolute",
        left: x - pose.axisX * scale,
        top: feetY - pose.feetY * scale,
        width: pose.w * scale,
        height: pose.h * scale,
        opacity,
        ...style,
      }}
    />
  );
};

// Parpadeo: intercala el PNG de ojos cerrados durante 3 frames en los frames indicados.
export const isBlink = (f: number, at: number[]) => at.some((a) => f >= a && f < a + 3);

// Actor: personaje PNG con parpadeo opcional y ciclo de caminata (alterna PNG de pasos + rebote vertical).
// Contenedor con tamaño (inset 0) para que el Img nunca quede en un padre de tamaño cero.
export const Actor: React.FC<{
  pose: Pose;
  x: number;
  feetY: number;
  scale: number;
  f: number;
  blink?: { pose: Pose; at: number[] };
  walk?: { poses: Pose[]; period: number; bob: number };
  opacity?: number;
}> = ({ pose, x, feetY, scale, f, blink, walk, opacity = 1 }) => {
  let p = pose;
  let y = feetY;
  if (walk) {
    const step = Math.floor(f / walk.period);
    p = walk.poses[step % walk.poses.length];
    const phase = (f % walk.period) / walk.period;
    y = feetY - Math.sin(phase * Math.PI) * walk.bob;
  } else if (blink && isBlink(f, blink.at)) {
    p = blink.pose;
  }
  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      <Char pose={p} x={x} feetY={y} scale={scale} />
    </div>
  );
};

// Primer plano anclado al borde derecho (x = borde derecho del PNG en el mundo).
export const Closeup: React.FC<{ who: keyof typeof CLOSEUP; right: number; top: number; scale: number }> = ({ who, right, top, scale }) => {
  const c = CLOSEUP[who];
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Img src={staticFile(`personajes/${c.file}`)} style={{ position: "absolute", left: right - c.w * scale, top, width: c.w * scale, height: c.h * scale }} />
    </div>
  );
};
export const closeupScreen = (who: keyof typeof CLOSEUP, right: number, top: number, scale: number) => {
  const c = CLOSEUP[who];
  const left = right - c.w * scale;
  return { x: left + c.screen.x0 * scale, y: top + c.screen.y0 * scale, w: (c.screen.x1 - c.screen.x0) * scale, h: (c.screen.y1 - c.screen.y0) * scale, r: c.screen.r * scale };
};

export const Shadow: React.FC<{ x: number; y: number; w?: number; o?: number; dark?: boolean }> = ({ x, y, w = 380, o = 1, dark }) => (
  <div
    style={{
      position: "absolute",
      left: x - w / 2,
      top: y - w * 0.05,
      width: w,
      height: w * 0.1,
      borderRadius: "50%",
      background: `radial-gradient(closest-side, ${dark ? "rgba(0,0,0,0.45)" : "rgba(19,13,93,0.16)"}, rgba(0,0,0,0))`,
      opacity: o,
    }}
  />
);

// Piso: línea suave de horizonte + sombra de contacto. Evita que los personajes "floten".
export const Floor: React.FC<{ y: number; color?: string; o?: number }> = ({ y, color = "rgba(19,13,93,0.10)", o = 1 }) => (
  <div style={{ position: "absolute", left: -2000, top: y, width: 6000, height: 900, opacity: o, background: "linear-gradient(180deg, rgba(226,230,244,0.9), rgba(244,241,255,0.4) 400px)", borderTop: `2px solid ${color}` }} />
);
export const Contact: React.FC<{ x: number; y: number; w?: number; o?: number }> = ({ x, y, w = 300, o = 1 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - w * 0.06, width: w, height: w * 0.12, borderRadius: "50%", opacity: o, background: "radial-gradient(closest-side, rgba(19,13,93,0.22), rgba(19,13,93,0))" }} />
);

// ——— Fondos ———
// Estudio claro del primer video: fondo claro, trama de puntos y círculos suaves (con profundidad).
export const DotStudio: React.FC<{ f: number; cam: CamT }> = ({ f, cam }) => (
  <>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #F6F8FD 0%, #EEF1FA 100%)" }} />
    <LayerRe cam={cam} depth={0.2}>
      <div style={{ position: "absolute", left: -800, top: -600, width: 3600, height: 2400, backgroundImage: "radial-gradient(rgba(29,78,216,0.16) 2px, transparent 2.5px)", backgroundSize: "44px 44px", opacity: 0.75 }} />
    </LayerRe>
    <LayerRe cam={cam} depth={0.35}>
      <div style={{ position: "absolute", left: 540, top: 60, width: 880, height: 880, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(29,78,216,0.12), rgba(255,255,255,0))", transform: `scale(${1 + Math.sin(f / 24) * 0.03})` }} />
      <div style={{ position: "absolute", left: 1320, top: 110, width: 400, height: 400, borderRadius: "50%", background: "#EDE5FC", opacity: 0.6 }} />
      <div style={{ position: "absolute", left: 200, top: 600, width: 360, height: 360, borderRadius: "50%", background: "#DBEAFE", opacity: 0.6 }} />
    </LayerRe>
  </>
);
export const DarkSpace: React.FC<{ glow?: string; tint?: number }> = ({ glow = "rgba(112,37,224,0.35)", tint = 0 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 70% 80% at 50% 45%, ${glow}, rgba(0,0,0,0) 70%), linear-gradient(180deg, #1A1270 0%, ${QS.dark} 45%, ${QS.darker} 100%)`,
    }}
  >
    {tint > 0 && <AbsoluteFill style={{ background: "#05031F", opacity: tint }} />}
  </AbsoluteFill>
);

export const LightStudio: React.FC<{ f: number; accent?: number }> = ({ f, accent = 1 }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, #FFFFFF 0%, ${QS.lilac} 100%)` }}>
    <div
      style={{
        position: "absolute",
        left: 1180 + Math.sin(f / 70) * 30,
        top: -260,
        width: 900,
        height: 900,
        borderRadius: "50%",
        background: "radial-gradient(closest-side, rgba(112,37,224,0.16), rgba(112,37,224,0))",
        opacity: accent,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: -300 + Math.cos(f / 80) * 30,
        top: 420,
        width: 1000,
        height: 1000,
        borderRadius: "50%",
        background: "radial-gradient(closest-side, rgba(60,159,241,0.16), rgba(60,159,241,0))",
        opacity: accent,
      }}
    />
  </AbsoluteFill>
);

// Partículas / estrellas deterministas (seed fija).
export const Particles: React.FC<{
  f: number;
  n?: number;
  seed?: string;
  color?: string;
  speed?: number;
  area?: { w: number; h: number; x: number; y: number };
  size?: [number, number];
  opacity?: number;
}> = ({ f, n = 90, seed = "p", color = "#FFFFFF", speed = 1, area = { x: -200, y: -200, w: 2320, h: 1480 }, size = [1.5, 4], opacity = 1 }) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const rx = random(`${seed}x${i}`);
      const ry = random(`${seed}y${i}`);
      const rs = random(`${seed}s${i}`);
      const rp = random(`${seed}p${i}`);
      const drift = (f * (0.2 + rs * 0.6) * speed) % area.h;
      const y = area.y + ((ry * area.h - drift + area.h) % area.h);
      const x = area.x + rx * area.w + Math.sin(f / 50 + rp * 6) * 12;
      const s = size[0] + rs * (size[1] - size[0]);
      const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(f / (8 + rp * 14) + rp * 20));
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: s,
            height: s,
            borderRadius: "50%",
            background: color,
            opacity: tw * opacity * (0.4 + rs * 0.6),
            boxShadow: s > 3 ? `0 0 ${s * 3}px ${color}` : undefined,
          }}
        />
      );
    })}
  </>
);

// Referencia de locución para el draft: discreta, sin caja negra.
export const VoRef: React.FC<{ text: string; o: number; dark?: boolean }> = ({ text, o, dark }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 30,
      textAlign: "center",
      fontFamily: FONT,
      fontSize: 24,
      fontWeight: 600,
      color: dark ? "rgba(255,255,255,0.8)" : "rgba(19,13,93,0.7)",
      opacity: o,
      letterSpacing: 0.2,
    }}
  >
    <span style={{ padding: "4px 12px", borderRadius: 8, background: dark ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.6)" }}>VO · {text}</span>
  </div>
);

// ——— Lenguaje de cámara ———
// Un solo easing para todos los movimientos de cámara: arranque suave, llegada larga y controlada.
export const camEase = (t: number) => {
  // bezier(0.45, 0, 0.15, 1) aproximada por una curva suave simétrica con cola larga
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
export const camRange = (f: number, [a, b]: [number, number], [from, to]: [number, number]) => {
  const t = b === a ? 1 : Math.min(1, Math.max(0, (f - a) / (b - a)));
  return from + (to - from) * camEase(t);
};

// Mueve la cámara por tramos (keyframes) con el mismo easing entre cada par.
export type CamKey = { f: number; x: number; y: number; zoom: number };
export const camPath = (f: number, keys: CamKey[]): CamT => {
  if (f <= keys[0].f) return { x: keys[0].x, y: keys[0].y, zoom: keys[0].zoom };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (f <= b.f) {
      const t = camEase((f - a.f) / (b.f - a.f));
      // El zoom se interpola en escala logarítmica para que se sienta parejo al acercarse y alejarse.
      const zoom = Math.exp(Math.log(a.zoom) + (Math.log(b.zoom) - Math.log(a.zoom)) * t);
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, zoom };
    }
  }
  const l = keys[keys.length - 1];
  return { x: l.x, y: l.y, zoom: l.zoom };
};

// Desenfoque de movimiento para los zoom-through entre escenas (sube al final / baja al inicio).
export const throughBlur = (f: number, dur: number, outFrames = 0, inFrames = 0, max = 10) => {
  const o = outFrames > 0 ? Math.max(0, (f - (dur - outFrames)) / outFrames) : 0;
  const i = inFrames > 0 ? Math.max(0, 1 - f / inFrames) : 0;
  return Math.min(1, o * o + i * i) * max;
};
