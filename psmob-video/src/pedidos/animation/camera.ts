// Cámara virtual: foco (x, y) en coordenadas lógicas + escala.
// Keyframes consecutivos iguales = respiración (la cámara no se mueve).
import { easeCamera, lerp, progress } from "./easing";
import { center, FORM, LIST, SUMMARY, VIEW } from "./layout";
import { T } from "./timeline";

type Cam = { x: number; y: number; s: number };
type Key = { f: number; cam: Cam };

const HOME: Cam = { x: VIEW.w / 2, y: VIEW.h / 2, s: 1 };
const [nbx, nby] = center(LIST.newBtn);

const KEYS: Key[] = [
  { f: 0, cam: HOME },
  { f: T.pushIn[0], cam: HOME },
  // Push-in hacia "+ Nuevo Pedido"
  { f: T.pushIn[1], cam: { x: nbx + 260, y: nby + 190, s: 1.1 } },
  { f: T.clickNew + 8, cam: { x: nbx + 260, y: nby + 190, s: 1.1 } },
  // Modal centrado, leve acercamiento a "Tradicional"
  { f: T.modalOpen[1] + 10, cam: { x: 800, y: 468, s: 1.06 } },
  { f: T.clickTrad, cam: { x: 800, y: 468, s: 1.06 } },
  // Morph a formulario: vuelve a plano general
  { f: T.morph[1] + 8, cam: HOME },
  { f: T.cursorToClient[0], cam: HOME },
  // Formulario → Cliente
  { f: T.clickClient + 8, cam: { x: 640, y: center(FORM.client)[1] + 110, s: 1.08 } },
  { f: T.cursorToSave[0], cam: { x: 640, y: center(FORM.client)[1] + 130, s: 1.08 } },
  { f: T.cursorToSave[1] + 6, cam: HOME },
  { f: T.cursorToQtyA[0], cam: HOME },
  // Tabla → Cantidad
  { f: T.clickQtyA, cam: { x: 1040, y: 380, s: 1.12 } },
  { f: T.clickCheckA + 4, cam: { x: 1040, y: 380, s: 1.12 } },
  // Tabla → carrito
  { f: T.cartUpdateA[1] + 6, cam: { x: 1250, y: 420, s: 1.12 } },
  { f: T.cursorToQtyB[0] + 6, cam: { x: 1250, y: 420, s: 1.12 } },
  { f: T.clickQtyB, cam: { x: 1120, y: 380, s: 1.12 } },
  { f: T.clickCheckB + 4, cam: { x: 1120, y: 380, s: 1.12 } },
  // Plano general para ver validación completa (tabla + carrito + mínimo)
  { f: T.validationDown[0], cam: HOME },
  { f: T.cursorToContinue[0], cam: HOME },
  { f: T.clickContinue + 6, cam: { x: 820, y: 500, s: 1.04 } },
  // Resumen: recorrido sutil de la información hacia Enviar Pedido
  { f: T.summaryInfo[1], cam: { x: 760, y: 360, s: 1.08 } },
  { f: T.cursorToSend[0], cam: { x: 820, y: 400, s: 1.08 } },
  { f: T.clickSend + 4, cam: { x: center(SUMMARY.send)[0] - 300, y: center(SUMMARY.send)[1] - 250, s: 1.1 } },
  { f: T.sending[1], cam: { x: center(SUMMARY.send)[0] - 300, y: center(SUMMARY.send)[1] - 250, s: 1.1 } },
  // Se abre el plano para que el toast (arriba a la derecha) entre en cuadro, y se vuelve al listado
  { f: T.toast[1] + 8, cam: HOME },
  { f: T.newRow[0], cam: HOME },
  // Foco final en la fila nueva
  { f: T.newRow[1] + 60, cam: { x: 840, y: 380, s: 1.05 } },
  { f: T.end, cam: { x: 840, y: 380, s: 1.05 } },
];

// Evita mostrar fuera del viewport cuando hay zoom.
const clampFocus = (c: Cam): Cam => {
  const hw = VIEW.w / (2 * c.s);
  const hh = VIEW.h / (2 * c.s);
  return { s: c.s, x: Math.min(VIEW.w - hw, Math.max(hw, c.x)), y: Math.min(VIEW.h - hh, Math.max(hh, c.y)) };
};

export const getCamera = (frame: number): Cam => {
  let cam = KEYS[0].cam;
  for (let i = 1; i < KEYS.length; i++) {
    const a = KEYS[i - 1];
    const b = KEYS[i];
    if (frame <= b.f) {
      const t = progress(frame, a.f, b.f, easeCamera);
      cam = { x: lerp(a.cam.x, b.cam.x, t), y: lerp(a.cam.y, b.cam.y, t), s: lerp(a.cam.s, b.cam.s, t) };
      return clampFocus(cam);
    }
    cam = b.cam;
  }
  return clampFocus(cam);
};

// Transform CSS del contenedor de cámara (coordenadas lógicas).
export const cameraTransform = (cam: Cam) =>
  `translate(${VIEW.w / 2}px, ${VIEW.h / 2}px) scale(${cam.s}) translate(${-cam.x}px, ${-cam.y}px)`;
