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
  cursorToOc: [392, 428] as const,
  clickOc: 434,
  typeOc: 444, // 1 carácter cada `typeEvery` frames
  typeEvery: 4,
  cursorToClient: [484, 522] as const,
  clickClient: 530,
  clientOpen: [532, 548] as const,
  clientSkeleton: [548, 590] as const,
  clientOptions: [588, 606] as const,
  cursorToClientOpt: [604, 642] as const,
  clickClientOpt: 656,
  clientClose: [658, 672] as const,
  branchEnable: [668, 698] as const,
  cursorToBranch: [688, 722] as const,
  clickBranch: 732,
  branchOpen: [734, 750] as const,
  cursorToBranchOpt: [752, 780] as const,
  clickBranchOpt: 792,
  branchClose: [794, 808] as const,
  saveEnable: [804, 830] as const,
  cursorToSave: [818, 858] as const,
  clickSave: 874,

  // ── Escena 4 · Selección de productos ──────────────────────────
  formExit: [876, 900] as const,
  step1Done: [882, 910] as const,
  step2Active: [894, 920] as const,
  productsHeader: [896, 928] as const,
  cartIn: [904, 944] as const,
  productsSkeleton: [906, 960] as const,
  productsRows: 952, // stagger por fila
  cursorToQtyA: [982, 1024] as const,
  clickQtyA: 1034,
  typeA: 1048,
  cursorToCheckA: [1054, 1080] as const,
  clickCheckA: 1090,
  cartUpdateA: [1094, 1136] as const,
  cursorToQtyB: [1172, 1214] as const,
  clickQtyB: 1226,
  typeB: 1240,
  cursorToCheckB: [1246, 1270] as const,
  clickCheckB: 1282,
  cartUpdateB: [1286, 1328] as const,
  cursorRest: [1300, 1352] as const,

  // ── Escena 5 · Validación ──────────────────────────────────────
  validationDown: [1372, 1410] as const,
  validationUp: [1472, 1508] as const,

  // ── Escena 6 · Continuar ───────────────────────────────────────
  cursorToContinue: [1508, 1548] as const,
  clickContinue: 1562,

  // ── Escena 7 · Resumen ─────────────────────────────────────────
  step2Done: [1566, 1594] as const,
  step3Active: [1578, 1604] as const,
  toSummary: [1566, 1622] as const, // filas de tabla → tarjetas de resumen
  summaryInfo: [1596, 1640] as const,
  cursorToSend: [1698, 1750] as const,
  clickSend: 1766,

  // ── Escena 8 · Envío ───────────────────────────────────────────
  sending: [1768, 1808] as const, // ≈ 670 ms
  toast: [1808, 1832] as const,

  // ── Escena 9 · Cierre ──────────────────────────────────────────
  backToList: [1828, 1872] as const, // card de resumen → card de listado
  listSkeleton: [1852, 1892] as const,
  listRows: 1886,
  newRow: [1922, 1956] as const,
  newRowHighlightOut: [1990, 2050] as const,
  toastOut: [1940, 1962] as const,
  cursorOut: [1840, 1900] as const,
  end: 2100,
} as const;

export const DURATION = T.end; // 35 s @ 60 fps
