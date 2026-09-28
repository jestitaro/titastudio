import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

// Cámara 2.5D: cada capa se proyecta con un factor de profundidad.
// depth 0 = fijo a pantalla, 1 = plano del personaje, >1 = foreground (se mueve más que la cámara).
export type Cam = { x: number; y: number; zoom: number };

export const W = 1920;
export const H = 1080;

export const project = (cam: Cam, depth: number) => ({
  z: 1 + (cam.zoom - 1) * depth,
  fx: W / 2 + (cam.x - W / 2) * depth,
  fy: H / 2 + (cam.y - H / 2) * depth,
});

// Posición en pantalla de un punto del mundo, útil para anclar overlays.
export const toScreen = (cam: Cam, depth: number, p: { x: number; y: number }) => {
  const { z, fx, fy } = project(cam, depth);
  return { x: W / 2 + (p.x - fx) * z, y: H / 2 + (p.y - fy) * z, z };
};

export const Layer: React.FC<{
  cam: Cam;
  depth: number;
  blur?: number;
  children: React.ReactNode;
}> = ({ cam, depth, blur = 0, children }) => {
  const { z, fx, fy } = project(cam, depth);
  return (
    <AbsoluteFill
      style={{
        transformOrigin: "0 0",
        transform: `translate(${W / 2}px, ${H / 2}px) scale(${z}) translate(${-fx}px, ${-fy}px)`,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Temblor determinista (suma de senos no conmensurables), sin random.
export const shake = (frame: number, amp: number) => ({
  x: (Math.sin(frame * 1.7) * 0.6 + Math.sin(frame * 3.1 + 1.3) * 0.4) * amp,
  y: (Math.sin(frame * 2.3 + 0.7) * 0.6 + Math.sin(frame * 4.3 + 2.1) * 0.4) * amp,
});

// Personajes PNG: se posicionan por el eje de piernas y la línea de pies medidos en el PNG,
// así un cambio de pose no hace saltar al personaje. Escala uniforme, sin transformaciones propias.
export type CharPose = { file: string; w: number; h: number; axisX: number; feetY: number };

export const POSES = {
  caroFeliz: { file: "caro-feliz.png", w: 1024, h: 1536, axisX: 498, feetY: 1507 },
  caroCelular: { file: "caro-celular.png", w: 1024, h: 1536, axisX: 493, feetY: 1512 },
  caroEstres: { file: "caro-estres.png", w: 1024, h: 1536, axisX: 508, feetY: 1514 },
  nicoCelular: { file: "nico-celular.png", w: 941, h: 1672, axisX: 514, feetY: 1641 },
  nicoFeliz: { file: "nico-feliz.png", w: 941, h: 1672, axisX: 480, feetY: 1636 },
} satisfies Record<string, CharPose>;

export const CHAR_SCALE = 0.62;
export const FLOOR_Y = 1040;

// Punto del PNG (coords fuente) → mundo.
export const charPoint = (pose: CharPose, x: number, p: { x: number; y: number }) => ({
  x: x + (p.x - pose.axisX) * CHAR_SCALE,
  y: FLOOR_Y + (p.y - pose.feetY) * CHAR_SCALE,
});

export const Character: React.FC<{ pose: CharPose; x: number; opacity?: number }> = ({ pose, x, opacity = 1 }) => (
  <Img
    src={staticFile(`personajes/${pose.file}`)}
    style={{
      position: "absolute",
      left: x - pose.axisX * CHAR_SCALE,
      top: FLOOR_Y - pose.feetY * CHAR_SCALE,
      width: pose.w * CHAR_SCALE,
      height: pose.h * CHAR_SCALE,
      opacity,
    }}
  />
);

export const FloorShadow: React.FC<{ x: number; width?: number; opacity?: number }> = ({ x, width = 360, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x - width / 2,
      top: FLOOR_Y - 18,
      width,
      height: 36,
      borderRadius: "50%",
      background: "radial-gradient(closest-side, rgba(38,50,56,0.16), rgba(38,50,56,0))",
      opacity,
    }}
  />
);
