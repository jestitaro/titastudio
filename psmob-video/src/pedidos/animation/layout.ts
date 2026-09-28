// Geometría de la UI en el viewport lógico (1600×900, escalado ×1.2 a 1920×1080).
// Cursor y cámara apuntan a estas mismas coordenadas: una sola fuente de verdad.

export const VIEW = { w: 1600, h: 900, scale: 1.2 };

export type Rect = { x: number; y: number; w: number; h: number };
export const center = (r: Rect): [number, number] => [r.x + r.w / 2, r.y + r.h / 2];
export const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  w: a.w + (b.w - a.w) * t,
  h: a.h + (b.h - a.h) * t,
});

export const SHELL = { sidebarW: 208, topbarH: 64 };

const top = 76;
const bottom = 884;
const left = SHELL.sidebarW + 20; // 228
const right = VIEW.w - 20; // 1580

// Cards principales
export const CARD = {
  list: { x: left, y: top, w: right - left, h: bottom - top } as Rect,
  main: { x: left, y: top, w: 1004, h: bottom - top } as Rect,
  side: { x: left + 1004 + 20, y: top, w: right - (left + 1004 + 20), h: bottom - top } as Rect,
  sideCompact: { x: left + 1004 + 20, y: top, w: right - (left + 1004 + 20), h: 304 } as Rect,
  cart: { x: left + 1004 + 20, y: top + 324, w: right - (left + 1004 + 20), h: bottom - top - 324 } as Rect,
  modal: { x: 608, y: 354, w: 384, h: 184 } as Rect,
};

export const PAD = 24;
const mx = CARD.main.x + PAD; // borde interno izquierdo
const mw = CARD.main.w - PAD * 2; // ancho interno

// ── Listado ─────────────────────────────────────────────────────
const lx = CARD.list.x + 20;
export const LIST = {
  innerX: lx,
  innerW: CARD.list.w - 40,
  headerY: CARD.list.y + 20,
  newBtn: { x: lx + 72, y: CARD.list.y + 20, w: 124, h: 32 } as Rect,
  search: { x: CARD.list.x + CARD.list.w / 2 - 240, y: CARD.list.y + 20, w: 480, h: 32 } as Rect,
  tableHeadY: CARD.list.y + 100,
  rowsY: CARD.list.y + 132,
  rowH: 42,
  cols: [112, 150, 250, 330, 150, 190, 130], // Fecha, Nº, Cliente, Sucursal, Total, Estado, Acciones
};

// ── Modal tipo de pedido ────────────────────────────────────────
export const MODAL = {
  trad: { x: CARD.modal.x + CARD.modal.w / 2 - 50, y: CARD.modal.y + 96, w: 100, h: 30 } as Rect,
  esp: { x: CARD.modal.x + CARD.modal.w / 2 - 50, y: CARD.modal.y + 134, w: 100, h: 30 } as Rect,
};

// ── Información general ─────────────────────────────────────────
export const FORM = {
  innerX: mx,
  innerW: mw,
  back: { x: mx, y: top + 24, w: 78, h: 30 } as Rect,
  titleY: top + 70,
  oc: { x: mx, y: top + 126, w: mw, h: 34 } as Rect,
  client: { x: mx, y: top + 194, w: mw, h: 34 } as Rect,
  branch: { x: mx, y: top + 262, w: mw, h: 34 } as Rect,
  date: { x: mx, y: top + 330, w: mw / 2, h: 34 } as Rect,
  obs: { x: mx, y: top + 398, w: mw, h: 60 } as Rect,
  save: { x: mx + mw - 170, y: bottom - PAD - 34, w: 170, h: 34 } as Rect,
  optionH: 34,
  panelSearchH: 46,
};
// Panel de opciones debajo de un select.
export const panelRect = (field: Rect, options: number): Rect => ({
  x: field.x,
  y: field.y + field.h + 4,
  w: field.w,
  h: FORM.panelSearchH + options * FORM.optionH + 8,
});
export const optionCenter = (field: Rect, i: number): [number, number] => [
  field.x + 140,
  field.y + field.h + 4 + FORM.panelSearchH + i * FORM.optionH + FORM.optionH / 2,
];

// ── Selección de productos ──────────────────────────────────────
export const PRODUCTS_L = {
  titleY: top + 70,
  search: { x: mx + 440, y: top + 62, w: 450, h: 32 } as Rect,
  chip: { x: mx, y: top + 104, w: 84, h: 36 } as Rect,
  headY: top + 156,
  rowsY: top + 188,
  rowH: 36,
  visibleRows: 14,
  // Producto, UxB, Pres., PSL, Desc.%, P/Desc.%, info, Cantidad
  cols: [290, 70, 80, 118, 90, 118, 30, mw - (290 + 70 + 80 + 118 + 90 + 118 + 30)],
  qtyW: 108,
  qtyEditW: 52,
  continueBtn: { x: mx + mw - 124, y: bottom - PAD - 32, w: 124, h: 32 } as Rect,
  pagerY: bottom - PAD - 32 - 46,
};
const qtyColX = mx + PRODUCTS_L.cols.slice(0, 7).reduce((a, b) => a + b, 0);
export const qtyInput = (row: number): Rect => ({
  x: qtyColX + 22,
  y: PRODUCTS_L.rowsY + row * PRODUCTS_L.rowH + (PRODUCTS_L.rowH - 24) / 2,
  w: PRODUCTS_L.qtyW,
  h: 24,
});
export const qtyCheck = (row: number): [number, number] => {
  const r = qtyInput(row);
  return [r.x + PRODUCTS_L.qtyEditW + 16, r.y + r.h / 2];
};

// ── Carrito ─────────────────────────────────────────────────────
export const CART = {
  innerX: CARD.cart.x + PAD,
  innerW: CARD.cart.w - PAD * 2,
  totalY: CARD.cart.y + 28,
  metaY: CARD.cart.y + 66,
  itemsY: CARD.cart.y + 100,
  itemH: 66,
};

// ── Stepper ─────────────────────────────────────────────────────
export const STEPPER = {
  innerX: CARD.side.x + PAD,
  innerW: CARD.side.w - PAD * 2,
  titleY: top + 28,
  stepsY: top + 96,
  stepH: 54,
  stepGap: 12,
};

// ── Resumen ─────────────────────────────────────────────────────
export const SUMMARY = {
  titleY: top + 70,
  info: { x: mx, y: top + 96, w: mw, h: 92 } as Rect,
  headY: top + 206,
  rowsY: top + 232,
  rowH: 62,
  rowGap: 10,
  send: { x: mx + mw - 144, y: bottom - PAD - 34, w: 144, h: 34 } as Rect,
};

// ── Toast ───────────────────────────────────────────────────────
export const TOAST: Rect = { x: VIEW.w - 20 - 340, y: 84, w: 340, h: 72 };
