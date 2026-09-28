// Cámara virtual: foco (x, y) en coordenadas lógicas + escala.
// Keyframes consecutivos iguales = respiración (la cámara no se mueve).
import { easeCamera, lerp, progress } from "./easing";
import { CARD, center, FORM, LIST, SUMMARY, VIEW } from "./layout";
import { T } from "./timeline";

type Cam = { x: number; y: number; s: number };
type Key = { f: number; cam: Cam };

const HOME: Cam = { x: VIEW.w / 2, y: VIEW.h / 2, s: 1 };
const [nbx, nby] = center(LIST.newBtn);

// Encuadre del Resumen del Pedido (card inferior derecha). Escala alta a propósito:
// es el único zoom fuerte del video y tiene que leerse como "acercarse al panel".
const FOCUS_CART: Cam = { x: CARD.cart.x + CARD.cart.w / 2 - 250, y: CARD.cart.y + CARD.cart.h / 2 + 10, s: 1.6 };

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
  // Selección de productos: pantalla completa, la tabla es la protagonista
  { f: T.focusIn[0], cam: HOME },
  // Enfoque: pan + zoom hacia abajo a la derecha, hasta encuadrar el Resumen del Pedido
  { f: T.focusIn[1], cam: FOCUS_CART },
  { f: T.focusHold, cam: FOCUS_CART },
  // Alejamiento: vuelta a la pantalla completa
  { f: T.focusOut[1], cam: HOME },
  { f: T.cursorToContinue[0] + 10, cam: HOME },
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

// Interpola el rectángulo visible (1/escala lineal) y no la escala: así el paneo y el zoom
// avanzan juntos a velocidad pareja en pantalla, sin la aceleración de un zoom lineal.
export const getCamera = (frame: number): Cam => {
  if (frame <= KEYS[0].f) return clampFocus(KEYS[0].cam);
  for (let i = 1; i < KEYS.length; i++) {
    const a = clampFocus(KEYS[i - 1].cam);
    const b = clampFocus(KEYS[i].cam);
    if (frame <= KEYS[i].f) {
      const t = progress(frame, KEYS[i - 1].f, KEYS[i].f, easeCamera);
      return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), s: 1 / lerp(1 / a.s, 1 / b.s, t) };
    }
  }
  return clampFocus(KEYS[KEYS.length - 1].cam);
};

// Transform CSS del contenedor de cámara (coordenadas lógicas).
export const cameraTransform = (cam: Cam) =>
  `translate(${VIEW.w / 2}px, ${VIEW.h / 2}px) scale(${cam.s}) translate(${-cam.x}px, ${-cam.y}px)`;
