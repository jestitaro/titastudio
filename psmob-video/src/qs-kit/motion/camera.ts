// Motor de cámara virtual. Cada video define sus keyframes {f, cam} y obtiene getCamera(frame).
// Keyframes consecutivos iguales = la cámara respira (no se mueve).
import { easeCamera, lerp, progress } from "./easing";
import { VIEW } from "./viewport";

export type Cam = { x: number; y: number; s: number }; // foco en coords lógicas + escala
export type CamKey = { f: number; cam: Cam };

export const HOME: Cam = { x: VIEW.w / 2, y: VIEW.h / 2, s: 1 };

// Evita mostrar fuera del stage cuando hay zoom.
export const clampFocus = (c: Cam): Cam => {
  const hw = VIEW.w / (2 * c.s);
  const hh = VIEW.h / (2 * c.s);
  return { s: c.s, x: Math.min(VIEW.w - hw, Math.max(hw, c.x)), y: Math.min(VIEW.h - hh, Math.max(hh, c.y)) };
};

// Interpola el rectángulo visible (1/escala lineal) y no la escala: paneo y zoom avanzan
// juntos a velocidad pareja en pantalla, sin la aceleración de un zoom lineal.
export const makeCamera = (keys: CamKey[]) => (frame: number): Cam => {
  if (frame <= keys[0].f) return clampFocus(keys[0].cam);
  for (let i = 1; i < keys.length; i++) {
    if (frame <= keys[i].f) {
      const a = clampFocus(keys[i - 1].cam);
      const b = clampFocus(keys[i].cam);
      const t = progress(frame, keys[i - 1].f, keys[i].f, easeCamera);
      return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), s: 1 / lerp(1 / a.s, 1 / b.s, t) };
    }
  }
  return clampFocus(keys[keys.length - 1].cam);
};

// Transform CSS del contenedor de cámara (coordenadas lógicas).
export const cameraTransform = (cam: Cam) =>
  `translate(${VIEW.w / 2}px, ${VIEW.h / 2}px) scale(${cam.s}) translate(${-cam.x}px, ${-cam.y}px)`;
