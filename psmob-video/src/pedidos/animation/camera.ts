// Cámara virtual: foco (x, y) en coordenadas lógicas + escala.
// Keyframes consecutivos iguales = respiración (la cámara no se mueve).
import { Cam, CamKey, cameraTransform, HOME, makeCamera } from "../../qs-kit/motion/camera";
import { CARD, CART, center, FORM, LIST } from "./layout";
import { T } from "./timeline";

const [nbx, nby] = center(LIST.newBtn);

// Panel lateral (card inferior derecha): un solo encuadre con total, métricas y líneas,
// así la edición y la eliminación se ven junto al total que cambia.
const FOCUS_PANEL: Cam = { x: CARD.cart.x + CARD.cart.w, y: (CART.totalY + CART.itemsY + 3 * CART.itemH) / 2 + 10, s: 2.1 };

// Fila nueva del listado: de Cliente a Acciones (se lee qué pedido es y su estado),
// con la zona de toasts arriba a la derecha en cuadro.
const FOCUS_ROW: Cam = { x: 1100, y: 300, s: 1.45 };

const KEYS: CamKey[] = [
  { f: 0, cam: HOME },
  { f: T.pushIn[0], cam: HOME },
  // Push-in hacia "+ Nuevo Pedido"
  { f: T.pushIn[1], cam: { x: nbx + 120, y: nby + 120, s: 1.35 } },
  { f: T.clickNew + 8, cam: { x: nbx + 120, y: nby + 120, s: 1.35 } },
  // Modal centrado, leve acercamiento a "Tradicional"
  { f: T.modalOpen[1] + 10, cam: { x: 800, y: 458, s: 1.45 } },
  { f: T.clickTrad, cam: { x: 800, y: 462, s: 1.5 } },
  // Morph a formulario: vuelve a plano general
  { f: T.morph[1] + 8, cam: HOME },
  { f: T.cursorToClient[0], cam: HOME },
  // Formulario → Cliente: zoom cerrado sobre el campo y su desplegable (también cubre Sucursal)
  { f: T.clickClient + 8, cam: { x: 670, y: center(FORM.client)[1] + 130, s: 1.8 } },
  { f: T.cursorToSave[0], cam: { x: 670, y: center(FORM.client)[1] + 150, s: 1.8 } },
  { f: T.cursorToSave[1] + 6, cam: HOME },
  // Selección de productos: pantalla completa, la tabla es la protagonista
  { f: T.focusIn[0], cam: HOME },
  // Enfoque: pan + zoom hacia abajo a la derecha, hasta encuadrar el Resumen del Pedido
  { f: T.focusIn[1], cam: FOCUS_PANEL },
  { f: T.focusHold, cam: FOCUS_PANEL },
  // Alejamiento: vuelta a la pantalla completa
  { f: T.focusOut[1], cam: HOME },
  // Resumen y envío: plano general, sin zoom a botones (Continuar / Enviar Pedido)
  { f: T.newRow[0], cam: HOME },
  // Ciclo de vida: zoom a la fila nueva (Estado + Acciones) con los toasts en cuadro
  { f: T.rowFocus[0], cam: HOME },
  { f: T.rowFocus[1], cam: FOCUS_ROW },
  { f: T.rowFocusOut[0], cam: FOCUS_ROW },
  { f: T.rowFocusOut[1], cam: HOME },
  { f: T.end, cam: HOME },
];

export const getCamera = makeCamera(KEYS);
export { cameraTransform };
