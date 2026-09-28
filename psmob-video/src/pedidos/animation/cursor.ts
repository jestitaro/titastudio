// Cursor: trayectoria por tramos, cada uno con arco leve y frenado antes del target.
// La posición es función pura del frame.
import { clamp, easeCursor, easeOutCubic, lerp, progress } from "./easing";
import { cartMinusCenter, cartTrashCenter, center, FORM, LIST, MODAL, optionCenter, PRODUCTS_L, qtyInputCenter, qtyPlusCenter, SUMMARY } from "./layout";
import { T } from "./timeline";
import { BRANCH_INDEX, CLIENT_INDEX, LINE_A, LINE_B, LINE_C } from "../data/mock-data";

type Pt = [number, number];
type Move = { span: readonly [number, number]; to: Pt; arc?: number };

const START: Pt = [1040, 640];

const MOVES: Move[] = [
  { span: T.cursorToNew, to: [center(LIST.newBtn)[0] + 8, center(LIST.newBtn)[1] + 2], arc: 0.12 },
  { span: T.cursorToTrad, to: [center(MODAL.trad)[0] + 6, center(MODAL.trad)[1] + 2], arc: -0.1 },
  { span: T.cursorToOc, to: [FORM.oc.x + 240, center(FORM.oc)[1] + 2], arc: 0.08 },
  { span: T.cursorToClient, to: [FORM.client.x + 260, center(FORM.client)[1] + 2], arc: -0.1 },
  { span: T.cursorToClientOpt, to: [optionCenter(FORM.client, CLIENT_INDEX)[0] + 40, optionCenter(FORM.client, CLIENT_INDEX)[1] + 2], arc: 0.1 },
  { span: T.cursorToBranch, to: [FORM.branch.x + 300, center(FORM.branch)[1] + 2], arc: -0.12 },
  { span: T.cursorToBranchOpt, to: [optionCenter(FORM.branch, BRANCH_INDEX)[0] + 20, optionCenter(FORM.branch, BRANCH_INDEX)[1] + 2], arc: 0.1 },
  { span: T.cursorToSave, to: [center(FORM.save)[0] + 10, center(FORM.save)[1] + 2], arc: 0.08 },
  { span: T.cursorToQtyA, to: [qtyInputCenter(LINE_A.index)[0] + 4, qtyInputCenter(LINE_A.index)[1] + 2], arc: -0.1 },
  { span: T.cursorToQtyB, to: [qtyInputCenter(LINE_B.index)[0] + 4, qtyInputCenter(LINE_B.index)[1] + 2], arc: 0.25 },
  { span: T.cursorToPlusC, to: [qtyPlusCenter(LINE_C.index)[0] + 1, qtyPlusCenter(LINE_C.index)[1] + 2], arc: 0.25 },
  // Resumen del Pedido: el ítem A es el primero, B el segundo.
  { span: T.cursorToMinusA, to: [cartMinusCenter(0)[0] + 1, cartMinusCenter(0)[1] + 2], arc: -0.12 },
  { span: T.cursorToTrashB, to: [cartTrashCenter(1)[0] + 1, cartTrashCenter(1)[1] + 2], arc: 0.1 },
  { span: T.cursorToContinue, to: [center(PRODUCTS_L.continueBtn)[0] + 10, center(PRODUCTS_L.continueBtn)[1] + 2], arc: 0.1 },
  { span: T.cursorToSend, to: [center(SUMMARY.send)[0] + 10, center(SUMMARY.send)[1] + 2], arc: -0.12 },
  { span: T.cursorOut, to: [1290, 720], arc: 0.1 },
];

const CLICKS = [
  T.clickNew,
  T.clickTrad,
  T.clickOc,
  T.clickClient,
  T.clickClientOpt,
  T.clickBranch,
  T.clickBranchOpt,
  T.clickSave,
  T.clickQtyA,
  T.clickQtyB,
  ...T.plusC,
  ...T.minusA,
  T.clickTrashB,
  T.clickContinue,
  T.clickSend,
];

// Tramos en los que el cursor está sobre algo clickeable (mano).
const POINTER: [number, number][] = [
  [T.cursorToNew[1] - 10, T.clickNew + 10],
  [T.cursorToTrad[1] - 8, T.clickTrad + 8],
  [T.cursorToClientOpt[1] - 8, T.clickClientOpt + 6],
  [T.cursorToBranchOpt[1] - 8, T.clickBranchOpt + 6],
  [T.cursorToSave[1] - 8, T.clickSave + 10],
  [T.cursorToPlusC[1] - 6, T.plusC[2] + 10],
  [T.cursorToMinusA[1] - 6, T.cursorToTrashB[0] + 4],
  [T.cursorToTrashB[1] - 6, T.clickTrashB + 8],
  [T.cursorToContinue[1] - 8, T.clickContinue + 10],
  [T.cursorToSend[1] - 8, T.clickSend + 10],
];
// Sobre inputs de texto: I-beam.
const TEXT: [number, number][] = [
  [T.cursorToOc[1] - 6, T.cursorToClient[0] + 4],
  [T.cursorToQtyA[1] - 6, T.cursorToQtyB[0] + 4],
  [T.cursorToQtyB[1] - 6, T.cursorToPlusC[0] + 4],
];

const inAny = (f: number, ranges: [number, number][]) => ranges.some(([a, b]) => f >= a && f <= b);

export type CursorState = {
  x: number;
  y: number;
  opacity: number;
  press: number; // 0..1 hundimiento del click
  ring: number; // 0..1 onda del click (0 = sin onda)
  kind: "arrow" | "pointer" | "text";
};

export const getCursor = (frame: number): CursorState => {
  let pos: Pt = START;
  for (const m of MOVES) {
    const [a, b] = m.span;
    if (frame <= a) break;
    const from = pos;
    const t = progress(frame, a, b, easeCursor);
    // Arco: desplazamiento perpendicular proporcional a la distancia.
    const dx = m.to[0] - from[0];
    const dy = m.to[1] - from[1];
    const bow = Math.sin(Math.PI * t) * (m.arc ?? 0);
    pos = [lerp(from[0], m.to[0], t) - dy * bow, lerp(from[1], m.to[1], t) + dx * bow];
    if (frame < b) break;
    pos = m.to;
  }

  let press = 0;
  let ring = 0;
  for (const c of CLICKS) {
    if (frame >= c - 4 && frame <= c + 10) {
      press = frame < c ? progress(frame, c - 4, c, easeOutCubic) : 1 - progress(frame, c, c + 10, easeOutCubic);
    }
    if (frame >= c && frame <= c + 22) ring = clamp((frame - c) / 22);
  }

  const opacity = progress(frame, T.cursorIn, T.cursorIn + 14, easeOutCubic) * (1 - progress(frame, T.cursorOut[1] - 10, T.cursorOut[1] + 12));

  return {
    x: pos[0],
    y: pos[1],
    opacity,
    press,
    ring,
    kind: inAny(frame, POINTER) ? "pointer" : inAny(frame, TEXT) ? "text" : "arrow",
  };
};
