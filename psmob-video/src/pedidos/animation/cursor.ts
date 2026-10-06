// Cursor: trayectoria por tramos, cada uno con arco leve y frenado antes del target.
// La posición es función pura del frame.
import { CursorMove, CursorState, makeCursor } from "../../qs-kit/motion/cursor";
import type { Pt } from "../../qs-kit/motion/viewport";
import { cartMinusCenter, cartTrashCenter, center, FORM, LIST, MODAL, optionCenter, PRODUCTS_L, qtyInputCenter, qtyPlusCenter, SUMMARY } from "./layout";
import { T } from "./timeline";
import { BRANCH_INDEX, CLIENT_INDEX, LINE_A, LINE_B, LINE_C } from "../data/mock-data";


const START: Pt = [1040, 640];

const MOVES: CursorMove[] = [
  { span: T.cursorToNew, to: [center(LIST.newBtn)[0] + 8, center(LIST.newBtn)[1] + 2], arc: 0.12 },
  { span: T.cursorToTrad, to: [MODAL.trad.x + MODAL.trad.w - 70, center(MODAL.trad)[1] + 4], arc: -0.1 },
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

export type { CursorState };

export const getCursor = makeCursor({
  start: START,
  moves: MOVES,
  clicks: CLICKS,
  pointer: POINTER,
  text: TEXT,
  fadeIn: T.cursorIn,
  fadeOut: T.cursorOut[1] + 12,
});
