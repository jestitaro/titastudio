// getSceneState(frame): todo el estado visual del video derivado de un único número.
// Los componentes son presentacionales: reciben este estado y no calculan tiempos.
import {
  clamp,
  easeInOutCubic,
  easeInOutQuart,
  easeOutCubic,
  easeProduct,
  lerp,
  pressScale,
  progress,
  pulse,
} from "../../qs-kit/motion/easing";
import { getCamera } from "./camera";
import { CursorState, getCursor } from "./cursor";
import { CARD, FORM, LIST, lerpRect, panelRect, PRODUCTS_L, Rect, SUMMARY } from "./layout";
import { T, VALUE_TWEEN } from "./timeline";
import { BRANCH_OPTIONS, CLIENT_OPTIONS, FINAL_LINES, LINE_A, LINE_B, LINE_C, ORDER, OrderStatus, PRODUCTS } from "../data/mock-data";

const inside = (cur: CursorState, r: Rect, pad = 0) =>
  cur.opacity > 0.5 && cur.x >= r.x - pad && cur.x <= r.x + r.w + pad && cur.y >= r.y - pad && cur.y <= r.y + r.h + pad;

// Hover suave: 0→1 al entrar, 1→0 al salir, derivado de ventanas de tiempo fijas.
const hoverWindow = (frame: number, from: number, to: number) => pulse(frame, from, from + 6, to, to + 8, easeOutCubic);

// Revelado estándar de un bloque: opacidad + translateY.
export type Reveal = { o: number; y: number };
const reveal = (frame: number, start: number, dur = 22, dist = 8): Reveal => {
  const p = progress(frame, start, start + dur, easeProduct);
  return { o: p, y: (1 - p) * dist };
};

export type StepState = { active: number; done: number };

export const getSceneState = (frame: number) => {
  const f = frame;
  const cursor = getCursor(f);
  const camera = getCamera(f);

  // ── Fases ───────────────────────────────────────────────────────
  const morphP = progress(f, T.morph[0], T.morph[1], easeInOutQuart);
  const toSummaryP = progress(f, T.toSummary[0], T.toSummary[1], easeInOutQuart);
  const backP = progress(f, T.backToList[0], T.backToList[1], easeInOutQuart);
  const phaseB = f >= T.backToList[0]; // regreso al listado

  // ── Cards (capa de fondo compartida entre pantallas) ───────────
  const modalOpen = progress(f, T.modalOpen[0], T.modalOpen[1], easeProduct);
  let mainRect: Rect = CARD.modal;
  let mainOpacity = 0;
  let mainScale = 1;
  let mainLift = 0;
  if (f >= T.modalOpen[0]) {
    mainOpacity = modalOpen;
    mainScale = lerp(0.96, 1, modalOpen);
    mainLift = (1 - modalOpen) * 8;
    if (f >= T.morph[0]) {
      mainRect = lerpRect(CARD.modal, CARD.main, morphP);
      mainScale = 1;
      mainLift = 0;
    }
    if (phaseB) mainRect = lerpRect(CARD.main, CARD.list, backP);
  }

  const listCardOpacity = phaseB ? 0 : 1 - progress(f, T.morph[0] + 14, T.morph[1] - 4, easeOutCubic);
  const backdrop = f < T.morph[0] ? modalOpen * 0.42 : 0.42 * (1 - progress(f, T.morph[0], T.morph[0] + 36, easeInOutCubic));

  // Columna derecha: stepper (full → compacto → full) + carrito
  const stepperIn = progress(f, T.stepperIn[0], T.stepperIn[1], easeProduct);
  const compact = progress(f, T.cartIn[0] - 6, T.cartIn[1] - 6, easeInOutQuart) * (1 - toSummaryP);
  const sideRect = lerpRect(CARD.side, CARD.sideCompact, compact);
  const sideOut = backP;
  const side = {
    rect: sideRect,
    opacity: stepperIn * (1 - progress(f, T.backToList[0], T.backToList[0] + 24)),
    x: (1 - stepperIn) * 28 + sideOut * 28,
  };
  const cartIn = progress(f, T.cartIn[0], T.cartIn[1], easeProduct);
  const cartOut = progress(f, T.toSummary[0], T.toSummary[0] + 26, easeInOutCubic);
  const cartCard = { rect: CARD.cart, opacity: cartIn * (1 - cartOut), y: (1 - cartIn) * 16 + cartOut * 16 };

  // ── Escena 1/9 · Listado ────────────────────────────────────────
  const listRowsA = LIST.rowH;
  const listA = {
    visible: f < T.morph[1],
    opacity: 1 - progress(f, T.morph[0], T.morph[0] + 22, easeOutCubic),
    header: reveal(f, T.headerReveal),
    search: reveal(f, T.searchReveal),
    rowAt: (i: number) => progress(f, T.tableReveal + i * T.rowStagger, T.tableReveal + i * T.rowStagger + 20, easeProduct),
    badges: progress(f, T.badgesReveal, T.badgesReveal + 26, easeProduct),
    skeleton: 1 - progress(f, T.tableReveal + 10, T.tableReveal + 60),
  };
  const listB = {
    visible: phaseB,
    opacity: progress(f, T.backToList[0] + 12, T.backToList[0] + 34, easeOutCubic),
    header: reveal(f, T.backToList[0] + 22, 22, 6),
    search: reveal(f, T.backToList[0] + 28, 22, 6),
    rowAt: (i: number) => progress(f, T.listRows + i * 2, T.listRows + i * 2 + 16, easeProduct),
    badges: progress(f, T.listRows + 8, T.listRows + 30, easeProduct),
    skeleton: progress(f, T.listSkeleton[0], T.listSkeleton[0] + 10) * (1 - progress(f, T.listRows - 4, T.listRows + 30)),
  };
  const listSrc = phaseB ? listB : listA;
  const newRowP = progress(f, T.newRow[0] + 20, T.newRow[1] + 14, easeProduct); // entra cuando ya hay lugar
  const list = {
    ...listSrc,
    phaseB,
    rowAt: listSrc.rowAt,
    hoverRow: (() => {
      const tableRect = { x: LIST.innerX, y: LIST.rowsY, w: LIST.innerW, h: listRowsA * 17 };
      if (phaseB || !inside(cursor, tableRect)) return -1;
      return Math.floor((cursor.y - LIST.rowsY) / listRowsA);
    })(),
    newBtn: {
      hover: hoverWindow(f, T.cursorToNew[1] - 10, T.clickNew + 12),
      scale: pressScale(f, T.clickNew),
    },
    newRow: phaseB
      ? {
          shift: progress(f, T.newRow[0], T.newRow[1], easeInOutCubic) * LIST.rowH,
          o: newRowP,
          y: (1 - newRowP) * -8,
          badge: progress(f, T.newRow[1] - 2, T.newRow[1] + 18, easeProduct),
          // Ciclo de vida: Borrador → Pendiente → Transmitido → Creado Completo
          status: (f >= T.status.completo ? "completo" : f >= T.status.transmitido ? "transmitido" : f >= T.status.pendiente ? "pendiente" : "borrador") as OrderStatus,
          // "pop" del chip en cada cambio de estado
          statusPop: Math.max(
            ...[T.status.pendiente, T.status.transmitido, T.status.completo].map((c) => pulse(f, c, c + 6, c + 10, c + 26, easeOutCubic)),
          ),
          statusIn: Math.min(
            1,
            ...[T.status.pendiente, T.status.transmitido, T.status.completo].filter((c) => f >= c).map((c) => progress(f, c, c + 14, easeProduct)),
          ),
          highlight: progress(f, T.newRow[0] + 8, T.newRow[1]) * (1 - progress(f, T.newRowHighlightOut[0], T.newRowHighlightOut[1], easeInOutCubic)),
        }
      : null,
  };

  // ── Escena 2 · Modal ────────────────────────────────────────────
  const modal = {
    visible: f >= T.modalOpen[0] && f < T.modalContentOut[1] + 1,
    contentOpacity: modalOpen * (1 - progress(f, T.modalContentOut[0], T.modalContentOut[1], easeOutCubic)),
    trad: {
      hover: hoverWindow(f, T.cursorToTrad[1] - 8, T.clickTrad + 20),
      scale: pressScale(f, T.clickTrad, 0.02),
    },
  };

  // ── Escena 3 · Información general ─────────────────────────────
  const formExit = 1 - progress(f, T.formExit[0], T.formExit[1], easeOutCubic);
  const formField = (i: number) => reveal(f, T.formReveal + i * 5, 24, 10);
  const ocTyped = clamp(Math.floor((f - T.typeOc) / T.typeEvery) + 1, 0, ORDER.purchaseOrder.length);
  const clientPanel = progress(f, T.clientOpen[0], T.clientOpen[1], easeProduct) * (1 - progress(f, T.clientClose[0], T.clientClose[1], easeOutCubic));
  const branchPanel = progress(f, T.branchOpen[0], T.branchOpen[1], easeProduct) * (1 - progress(f, T.branchClose[0], T.branchClose[1], easeOutCubic));
  const optionUnderCursor = (field: Rect, count: number, open: number) => {
    const pr = panelRect(field, count);
    if (open < 0.9 || !inside(cursor, pr)) return -1;
    const i = Math.floor((cursor.y - (pr.y + FORM.panelSearchH)) / FORM.optionH);
    return i >= 0 && i < count ? i : -1;
  };
  const caretOn = Math.floor(f / 32) % 2 === 0;
  const form = {
    visible: f >= T.formReveal && f < T.formExit[1],
    opacity: formExit,
    exitY: (1 - formExit) * -10,
    field: formField,
    oc: {
      focus: progress(f, T.clickOc, T.clickOc + 8) * (1 - progress(f, T.clickClient, T.clickClient + 8)),
      text: ORDER.purchaseOrder.slice(0, ocTyped),
      caret: f >= T.clickOc && f < T.clickClient && (f < T.typeOc + ORDER.purchaseOrder.length * T.typeEvery + 10 || caretOn),
    },
    client: {
      focus: progress(f, T.clickClient, T.clickClient + 8) * (1 - progress(f, T.clickBranch, T.clickBranch + 8)),
      panel: clientPanel,
      panelVisible: f >= T.clientOpen[0] && f < T.clientClose[1],
      skeleton: 1 - progress(f, T.clientOptions[0], T.clientOptions[0] + 10),
      optionAt: (i: number) => progress(f, T.clientOptions[0] + i * 2, T.clientOptions[0] + i * 2 + 14, easeProduct),
      hover: optionUnderCursor(FORM.client, CLIENT_OPTIONS.length, clientPanel),
      value: f >= T.clickClientOpt + 2 ? ORDER.client : "",
      valueIn: progress(f, T.clickClientOpt + 2, T.clickClientOpt + 18, easeProduct),
    },
    branch: {
      enabled: progress(f, T.branchEnable[0], T.branchEnable[1], easeInOutCubic),
      focus: progress(f, T.clickBranch, T.clickBranch + 8) * (1 - progress(f, T.clickBranchOpt + 10, T.clickBranchOpt + 24)),
      panel: branchPanel,
      panelVisible: f >= T.branchOpen[0] && f < T.branchClose[1],
      optionAt: (i: number) => progress(f, T.branchOpen[0] + 4 + i * 2, T.branchOpen[0] + i * 2 + 18, easeProduct),
      hover: optionUnderCursor(FORM.branch, BRANCH_OPTIONS.length, branchPanel),
      value: f >= T.clickBranchOpt + 2 ? ORDER.branch : "",
      valueIn: progress(f, T.clickBranchOpt + 2, T.clickBranchOpt + 18, easeProduct),
    },
    save: {
      enabled: progress(f, T.saveEnable[0], T.saveEnable[1], easeInOutCubic),
      hover: hoverWindow(f, T.cursorToSave[1] - 8, T.clickSave + 14),
      scale: pressScale(f, T.clickSave),
    },
  };

  // ── Escena 4/5 · Productos + Resumen del Pedido ─────────────────
  // Cantidades como eventos [frame, valor]. Discretas para inputs, suavizadas para montos.
  type QtyEvents = readonly (readonly [number, number])[];
  const EV_A: QtyEvents = [[T.commitA, LINE_A.qty], [T.minusA[0], LINE_A.qty - 1], [T.minusA[1], LINE_A.edited]];
  const EV_B: QtyEvents = [[T.commitB, LINE_B.qty], [T.clickTrashB, 0]];
  const EV_C: QtyEvents = T.plusC.map((fr, i) => [fr, i + 1] as const);
  const qtyAt = (ev: QtyEvents) => ev.reduce((v, [fr, val]) => (f >= fr ? val : v), 0);
  const qtySmooth = (ev: QtyEvents) =>
    ev.reduce((acc, [fr, val], i) => acc + (val - (i ? ev[i - 1][1] : 0)) * progress(f, fr, fr + VALUE_TWEEN, easeProduct), 0);
  const lastChange = (ev: QtyEvents) => ev.reduce((last, [fr]) => (f >= fr ? fr : last), -999);

  const lines = [
    { line: LINE_A, ev: EV_A },
    { line: LINE_B, ev: EV_B },
    { line: LINE_C, ev: EV_C },
  ];
  const total = lines.reduce((t, l) => t + PRODUCTS[l.line.index].psl * qtySmooth(l.ev), 0);
  const units = Math.round(lines.reduce((t, l) => t + qtySmooth(l.ev), 0));
  // Inválido (total < mínimo), con banda suave: ícono, aviso y CTA cambian al cruzar el mínimo.
  const invalid = clamp((ORDER.minAmount - total) / 1400 + 0.5);

  const rowOf = (row: number) => lines.find((l) => l.line.index === row);
  const tableQty = (row: number): string => {
    const l = rowOf(row);
    if (!l) return "0";
    if (row === LINE_A.index && f >= T.typeA && f < T.commitA) return String(LINE_A.qty);
    if (row === LINE_B.index && f >= T.typeB && f < T.commitB) return String(LINE_B.qty);
    return String(qtyAt(l.ev));
  };
  // Edición por teclado en la tabla (A y B): foco, selección del "0", caret.
  const typing = (row: number) => {
    const [click, type, commit] = row === LINE_A.index ? [T.clickQtyA, T.typeA, T.commitA] : row === LINE_B.index ? [T.clickQtyB, T.typeB, T.commitB] : [-1, -1, -1];
    if (click < 0 || f < click || f > commit + 12) return null;
    return {
      focus: progress(f, click, click + 8) * (1 - progress(f, commit, commit + 12)),
      selected: f < type,
      caret: f >= type && f < commit,
    };
  };
  const rowActive = (row: number) => {
    const l = rowOf(row);
    if (!l) return 0;
    const [first] = l.ev[0];
    const on = progress(f, first, first + 18, easeProduct);
    const off = row === LINE_B.index ? progress(f, T.clickTrashB, T.clickTrashB + 24, easeInOutCubic) : 0;
    return on * (1 - off);
  };
  const flashAt = (ev: QtyEvents) => Math.max(0, ...ev.map(([fr]) => pulse(f, fr, fr + 6, fr + 18, fr + 60)));
  const productsTableRect = { x: FORM.innerX, y: PRODUCTS_L.rowsY, w: FORM.innerW, h: PRODUCTS_L.rowH * PRODUCTS_L.visibleRows };

  const products = {
    visible: f >= T.productsHeader[0] && f < T.backToList[0] + 2,
    header: reveal(f, T.productsHeader[0], 26, 10),
    skeleton: progress(f, T.productsSkeleton[0], T.productsSkeleton[0] + 8) * (1 - progress(f, T.productsRows - 4, T.productsRows + 28)),
    rowAt: (i: number) => progress(f, T.productsRows + i * 3, T.productsRows + i * 3 + 20, easeProduct),
    qty: tableQty,
    typing,
    active: rowActive,
    flash: (row: number) => {
      const l = rowOf(row);
      return l ? flashAt(l.ev) : 0;
    },
    hoverRow: inside(cursor, productsTableRect) && f < T.focusIn[1] ? Math.floor((cursor.y - PRODUCTS_L.rowsY) / PRODUCTS_L.rowH) : -1,
    plus: {
      row: LINE_C.index,
      hover: hoverWindow(f, T.cursorToPlusC[1] - 6, T.plusC[2] + 10),
      scale: Math.min(...T.plusC.map((c) => pressScale(f, c, 0.12))),
    },
    // El número del input "sube" al cambiar.
    valueTick: (row: number) => {
      const l = rowOf(row);
      return l ? 1 - progress(f, lastChange(l.ev), lastChange(l.ev) + 12, easeOutCubic) : 0;
    },
    invalid,
    continueBtn: {
      enabled: 1 - invalid,
      glow: pulse(f, T.commitA + 8, T.commitA + 16, T.commitA + 22, T.commitA + 50, easeOutCubic),
      hover: hoverWindow(f, T.cursorToContinue[1] - 8, T.clickContinue + 14),
      scale: pressScale(f, T.clickContinue),
    },
    // Salida hacia el resumen: el resto de la tabla se desvanece.
    rest: 1 - progress(f, T.toSummary[0], T.toSummary[0] + 22, easeOutCubic),
    exit: toSummaryP,
  };

  const removeP = progress(f, T.removeB[0], T.removeB[1], easeInOutCubic);
  const cartItem = (k: number) => {
    const { line, ev } = lines[k];
    const first = ev[0][0];
    const appear = progress(f, first, first + 28, easeProduct);
    const removing = line === LINE_B ? removeP : 0;
    const change = lastChange(ev);
    return {
      product: PRODUCTS[line.index],
      qty: qtyAt(ev),
      subtotal: PRODUCTS[line.index].psl * qtySmooth(ev),
      size: appear * (1 - removing), // alto relativo (colapsa al eliminar)
      o: appear * (1 - progress(f, T.removeB[0], T.removeB[0] + 20, easeOutCubic) * (line === LINE_B ? 1 : 0)),
      x: (1 - appear) * 16 + removing * 24,
      flash: flashAt(ev),
      tick: change > first ? 1 - progress(f, change, change + 14, easeOutCubic) : 0,
      minus: line === LINE_A ? { hover: hoverWindow(f, T.cursorToMinusA[1] - 6, T.minusA[1] + 12), scale: Math.min(...T.minusA.map((c) => pressScale(f, c, 0.14))) } : null,
      trash: line === LINE_B ? { hover: hoverWindow(f, T.cursorToTrashB[1] - 6, T.clickTrashB + 20), scale: pressScale(f, T.clickTrashB, 0.14) } : null,
      // Tinte rojo muy suave mientras se elimina
      danger: line === LINE_B ? pulse(f, T.clickTrashB, T.clickTrashB + 6, T.removeB[1], T.removeB[1] + 4) : 0,
    };
  };
  const items = [cartItem(0), cartItem(1), cartItem(2)];
  const count = items.filter((it) => it.size > 0.5).length;
  const cart = {
    ...cartCard,
    units,
    boxes: units,
    total,
    invalid,
    // Validación: el pedido supera el monto mínimo → el check del total "late" una vez.
    validPulse: pulse(f, T.commitA + 6, T.commitA + 14, T.commitA + 20, T.commitA + 44, easeOutCubic),
    count,
    items,
    empty: clamp((0.3 - Math.max(...items.map((it) => it.size))) / 0.3),
    totalFlash: Math.max(0, ...lines.flatMap((l) => l.ev.map(([fr]) => pulse(f, fr, fr + 6, fr + 20, fr + 56)))),
    focus: progress(f, T.focusIn[0], T.focusIn[1], easeInOutCubic) * (1 - progress(f, T.focusOut[0], T.focusOut[1], easeInOutCubic)),
  };

  // ── Stepper ─────────────────────────────────────────────────────
  const steps: StepState[] = [
    { active: stepperIn, done: progress(f, T.step1Done[0], T.step1Done[1], easeProduct) },
    { active: progress(f, T.step2Active[0], T.step2Active[1], easeProduct), done: progress(f, T.step2Done[0], T.step2Done[1], easeProduct) },
    { active: progress(f, T.step3Active[0], T.step3Active[1], easeProduct), done: 0 },
  ];
  const stepper = {
    steps,
    // "Crear Pedido" pasa a "Editar Pedido" una vez guardado (como en el producto).
    editTitle: progress(f, T.step1Done[0] + 6, T.step1Done[1] + 6, easeInOutCubic),
    content: progress(f, T.stepperIn[0] + 10, T.stepperIn[1] + 6, easeProduct),
  };

  // ── Encabezado compartido (Volver + título de sección) ─────────
  const shared = {
    visible: f >= T.formReveal && f < T.backToList[1],
    back: reveal(f, T.formReveal, 24, 8),
    backOut: 1 - progress(f, T.backToList[0], T.backToList[0] + 18, easeOutCubic),
    titles: [
      { text: "Cliente", o: formField(0).o * formExit, y: formField(0).y + (1 - formExit) * -8 },
      {
        text: "Selección de Productos",
        o: progress(f, T.formExit[0] + 10, T.productsHeader[1], easeProduct) * (1 - progress(f, T.toSummary[0], T.toSummary[0] + 16)),
        y: (1 - progress(f, T.formExit[0] + 10, T.productsHeader[1], easeProduct)) * 8 - progress(f, T.toSummary[0], T.toSummary[0] + 16) * 8,
      },
      {
        text: "Resumen de Pedido",
        o: progress(f, T.toSummary[0] + 12, T.toSummary[0] + 36, easeProduct) * (1 - progress(f, T.backToList[0], T.backToList[0] + 16)),
        y: (1 - progress(f, T.toSummary[0] + 12, T.toSummary[0] + 36, easeProduct)) * 8,
      },
    ],
  };

  // ── Escena 7/8 · Resumen + envío ────────────────────────────────
  const sendingP = progress(f, T.sending[0], T.sending[0] + 8, easeOutCubic);
  const sentP = progress(f, T.sending[1], T.sending[1] + 10, easeOutCubic);
  const summary = {
    visible: f >= T.toSummary[0] && f < T.backToList[1],
    opacity: 1 - progress(f, T.backToList[0], T.backToList[0] + 18, easeOutCubic),
    badge: progress(f, T.toSummary[0] + 24, T.toSummary[0] + 44, easeProduct),
    info: progress(f, T.summaryInfo[0], T.summaryInfo[1], easeProduct),
    head: progress(f, T.toSummary[0] + 16, T.toSummary[0] + 40, easeProduct),
    rowMorph: (k: number) => progress(f, T.toSummary[0] + k * 5, T.toSummary[1] + k * 5, easeInOutQuart),
    rowFromY: (k: number) => PRODUCTS_L.rowsY + FINAL_LINES[k].index * PRODUCTS_L.rowH,
    rowToY: (k: number) => SUMMARY.rowsY + k * (SUMMARY.rowH + SUMMARY.rowGap),
    send: {
      appear: progress(f, T.toSummary[0] + 20, T.toSummary[1], easeProduct),
      hover: hoverWindow(f, T.cursorToSend[1] - 8, T.clickSend + 8) * (1 - sendingP),
      scale: pressScale(f, T.clickSend),
      loading: sendingP * (1 - sentP),
      sent: sentP,
      spin: (f - T.sending[0]) * 7,
    },
  };

  // Toasts: uno a la vez; entra deslizando desde la derecha y sale con fade.
  const toasts = T.toasts
    .map((t) => {
      const pin = progress(f, t.in, t.in + 24, easeProduct);
      const pout = progress(f, t.out, t.out + 20, easeInOutCubic);
      return { id: t.id, visible: f >= t.in && f < t.out + 20, o: pin * (1 - pout), x: (1 - pin) * 24 + pout * 12 };
    })
    .filter((t) => t.visible);

  return {
    frame: f,
    camera,
    cursor,
    cards: {
      list: { rect: CARD.list, opacity: listCardOpacity },
      main: { rect: mainRect, opacity: mainOpacity, scale: mainScale, lift: mainLift, radius: 12 },
      side,
      cart: cartCard,
    },
    backdrop,
    list,
    modal,
    form,
    products,
    cart,
    stepper,
    shared,
    summary,
    toasts,
  };
};

export type SceneState = ReturnType<typeof getSceneState>;
