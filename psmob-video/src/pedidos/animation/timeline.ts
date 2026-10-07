// Timeline única del video. Todos los timings viven acá (frames a 60 fps).
// Para reajustar el ritmo, se edita este archivo: los componentes no esconden tiempos.

export const FPS = 60;

export const T = {
  // ── Escena 1 · Listado ──────────────────────────────────────────
  intro: 0,
  headerReveal: 16, // título + Nuevo Pedido
  searchReveal: 26, // buscador + filtros
  tableReveal: 38, // filas (stagger por fila)
  rowStagger: 3,
  badgesReveal: 92, // estados
  cursorIn: 104,
  pushIn: [132, 204] as const,
  cursorToNew: [116, 196] as const,
  clickNew: 214,

  // ── Escena 2 · Tipo de pedido ───────────────────────────────────
  modalOpen: [224, 256] as const,
  cursorToTrad: [262, 306] as const,
  clickTrad: 322,
  modalContentOut: [326, 338] as const,
  morph: [330, 380] as const, // modal → card del formulario (shared layout)
  stepperIn: [346, 392] as const,

  // ── Escena 3 · Información general ─────────────────────────────
  formReveal: 372, // stagger de campos
  cursorToOc: [392, 424] as const,
  clickOc: 430,
  typeOc: 438, // 1 carácter cada `typeEvery` frames
  typeEvery: 3,
  cursorToClient: [470, 502] as const,
  clickClient: 508,
  clientOpen: [510, 524] as const,
  clientSkeleton: [524, 552] as const,
  clientOptions: [550, 566] as const,
  cursorToClientOpt: [562, 594] as const,
  clickClientOpt: 604,
  clientClose: [606, 618] as const,
  branchEnable: [614, 640] as const,
  cursorToBranch: [630, 658] as const,
  clickBranch: 666,
  branchOpen: [668, 682] as const,
  cursorToBranchOpt: [684, 706] as const,
  clickBranchOpt: 716,
  branchClose: [718, 730] as const,
  saveEnable: [726, 748] as const,
  cursorToSave: [738, 772] as const,
  clickSave: 784,

  // ── Escena 4 · Selección de productos ──────────────────────────
  // intro
  formExit: [786, 810] as const,
  step1Done: [792, 820] as const,
  step2Active: [804, 830] as const,
  productsHeader: [806, 838] as const,
  cartIn: [814, 854] as const,
  productsSkeleton: [816, 870] as const,
  productsRows: 862, // stagger por fila
  // selección: A se tipea (6), B se tipea (5), C sube con "+" (1→3)
  cursorToQtyA: [876, 912] as const,
  clickQtyA: 920,
  typeA: 932,
  commitA: 946, // la línea entra al Resumen del Pedido
  cursorToQtyB: [958, 990] as const,
  clickQtyB: 998,
  typeB: 1008,
  commitB: 1022,
  cursorToPlusC: [1036, 1070] as const,
  plusC: [1080, 1096, 1112] as const,

  // ── Escena 5 · Foco en el Resumen del Pedido (clave de cámara) ──
  focusIn: [1136, 1214] as const, // enfoque: pan + zoom hacia abajo a la derecha
  cursorToMinusA: [1186, 1226] as const,
  minusA: [1238, 1256] as const, // interacción: editar cantidad 6 → 5 → 4
  cursorToTrashB: [1270, 1304] as const,
  clickTrashB: 1318, // interacción: eliminar
  removeB: [1322, 1360] as const, // update: la línea colapsa y el resto sube
  focusHold: 1394, // fin de la lectura del resultado
  focusOut: [1394, 1470] as const, // alejamiento: vuelta a pantalla completa

  // ── Escena 6 · Continuar ───────────────────────────────────────
  cursorToContinue: [1440, 1486] as const,
  clickContinue: 1498,

  // ── Escena 7 · Resumen ─────────────────────────────────────────
  step2Done: [1502, 1530] as const,
  step3Active: [1514, 1540] as const,
  toSummary: [1502, 1558] as const, // filas de tabla → tarjetas de resumen
  summaryInfo: [1532, 1576] as const,
  cursorToSend: [1612, 1656] as const,
  clickSend: 1672,

  // ── Escena 8 · Envío ───────────────────────────────────────────
  sending: [1674, 1714] as const, // ≈ 670 ms
  toast: [1714, 1738] as const,

  // ── Escena 9 · Cierre ──────────────────────────────────────────
  backToList: [1734, 1778] as const, // card de resumen → card de listado
  listSkeleton: [1758, 1798] as const,
  listRows: 1792,
  newRow: [1828, 1862] as const,
  newRowHighlightOut: [1896, 1956] as const,
  toastOut: [1846, 1868] as const,
  cursorOut: [1746, 1806] as const,
  // ── Cierre de marca ────────────────────────────────────────────
  outro: { uiOut: [1990, 2032] as const, logoIn: [2024, 2066] as const },
  end: 2130,
} as const;

// Duración de las animaciones de valor (totales, unidades) tras cada cambio.
export const VALUE_TWEEN = 26;

export const DURATION = T.end; // 35,5 s @ 60 fps
