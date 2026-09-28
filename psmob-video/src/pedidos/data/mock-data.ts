// Datos ficticios. Se mantienen iguales durante toda la historia.
// Formatos tomados de las capturas: moneda $1,234.56 y fecha DD/MM/YYYY.

export type OrderStatus = "completo" | "parcial" | "rechazado" | "noCreado" | "transmitido" | "borrador";

export type OrderRow = {
  date: string;
  number: number;
  client: string;
  branch: string;
  total: number;
  status: OrderStatus;
};

export type Product = {
  code: string;
  name: string;
  uxb: number;
  pres: string;
  psl: number;
};

export const ORDER = {
  purchaseOrder: "OC-20486",
  client: "NOVA RETAIL S.A.",
  branch: "Sucursal Centro",
  date: "28/09/2026",
  number: 195,
  minAmount: 10000,
};

export const STATUS_LABEL: Record<OrderStatus, string> = {
  completo: "Creado Completo",
  parcial: "Creado Parcialmente",
  rechazado: "Rechazado",
  noCreado: "No Creado",
  transmitido: "Transmitido",
  borrador: "Borrador",
};

export const ORDERS: OrderRow[] = [
  { date: "24/09/2026", number: 194, client: "ALTAMAR DISTRIBUCIONES S.R.L.", branch: "Sucursal Norte", total: 48250.0, status: "parcial" },
  { date: "24/09/2026", number: 193, client: "ALTAMAR DISTRIBUCIONES S.R.L.", branch: "Casa Central", total: 12640.5, status: "completo" },
  { date: "24/09/2026", number: 192, client: "GRUPO LITORAL S.A.", branch: "Depósito Sur", total: 31905.2, status: "completo" },
  { date: "24/09/2026", number: 191, client: "GRUPO LITORAL S.A.", branch: "Sucursal Puerto", total: 22480.0, status: "completo" },
  { date: "24/09/2026", number: 190, client: "DELTA FARMA S.A.", branch: "Sucursal Oeste", total: 76320.75, status: "parcial" },
  { date: "24/09/2026", number: 189, client: "DELTA FARMA S.A.", branch: "Casa Central", total: 18990.0, status: "completo" },
  { date: "23/09/2026", number: 188, client: "MERIDIANO LOGÍSTICA S.A.", branch: "Centro de Distribución 2", total: 54210.4, status: "completo" },
  { date: "23/09/2026", number: 187, client: "MERIDIANO LOGÍSTICA S.A.", branch: "Sucursal Norte", total: 9870.0, status: "rechazado" },
  { date: "23/09/2026", number: 186, client: "CUMBRE COMERCIAL S.R.L.", branch: "Sucursal Parque", total: 27415.9, status: "noCreado" },
  { date: "23/09/2026", number: 185, client: "CUMBRE COMERCIAL S.R.L.", branch: "Depósito Sur", total: 15360.0, status: "noCreado" },
  { date: "23/09/2026", number: 184, client: "NOVA RETAIL S.A.", branch: "Sucursal Oeste", total: 41780.3, status: "transmitido" },
  { date: "22/09/2026", number: 183, client: "BOREAL INSUMOS S.A.", branch: "Casa Central", total: 36540.0, status: "completo" },
  { date: "22/09/2026", number: 182, client: "BOREAL INSUMOS S.A.", branch: "Sucursal Puerto", total: 11205.6, status: "parcial" },
  { date: "22/09/2026", number: 181, client: "PAMPA MAYORISTA S.R.L.", branch: "Sucursal Norte", total: 63880.0, status: "completo" },
  { date: "22/09/2026", number: 180, client: "PAMPA MAYORISTA S.R.L.", branch: "Depósito Sur", total: 20145.25, status: "transmitido" },
  { date: "21/09/2026", number: 179, client: "ALTAMAR DISTRIBUCIONES S.R.L.", branch: "Casa Central", total: 17490.0, status: "completo" },
  { date: "21/09/2026", number: 178, client: "GRUPO LITORAL S.A.", branch: "Sucursal Oeste", total: 28760.8, status: "noCreado" },
  { date: "21/09/2026", number: 177, client: "DELTA FARMA S.A.", branch: "Sucursal Parque", total: 45020.0, status: "completo" },
];

export const CLIENT_OPTIONS = [
  "ALTAMAR DISTRIBUCIONES S.R.L.",
  "BOREAL INSUMOS S.A.",
  "NOVA RETAIL S.A.",
  "CUMBRE COMERCIAL S.R.L.",
  "DELTA FARMA S.A.",
  "GRUPO LITORAL S.A.",
];
export const CLIENT_INDEX = 2;

export const BRANCH_OPTIONS = ["Sucursal Centro", "Sucursal Norte", "Depósito Sur"];
export const BRANCH_INDEX = 0;

export const PRODUCTS: Product[] = [
  { code: "7790010000011 | 7790010000011", name: "PRODUCTO DEMO A", uxb: 1, pres: "UN", psl: 2450 },
  { code: "7790010000028 | 7790010000028", name: "PRODUCTO DEMO B", uxb: 1, pres: "UN", psl: 1890 },
  { code: "7790010000035 | 7790010000035", name: "PRODUCTO DEMO C", uxb: 1, pres: "UN", psl: 3120.5 },
  { code: "7790010000042 | 7790010000042", name: "PRODUCTO DEMO D", uxb: 1, pres: "UN", psl: 875 },
  { code: "7790010000059 | 7790010000059", name: "PRODUCTO DEMO E", uxb: 1, pres: "UN", psl: 1240.75 },
  { code: "7790010000066 | 7790010000066", name: "PRODUCTO DEMO F", uxb: 1, pres: "UN", psl: 4980 },
  { code: "7790010000073 | 7790010000073", name: "PRODUCTO DEMO G", uxb: 1, pres: "UN", psl: 690.4 },
  { code: "7790010000080 | 7790010000080", name: "PRODUCTO DEMO H", uxb: 1, pres: "UN", psl: 2015 },
  { code: "7790010000097 | 7790010000097", name: "PRODUCTO DEMO I", uxb: 1, pres: "UN", psl: 1560 },
  { code: "7790010000103 | 7790010000103", name: "PRODUCTO DEMO J", uxb: 1, pres: "UN", psl: 3375.2 },
  { code: "7790010000110 | 7790010000110", name: "PRODUCTO DEMO K", uxb: 1, pres: "UN", psl: 940 },
  { code: "7790010000127 | 7790010000127", name: "PRODUCTO DEMO L", uxb: 1, pres: "UN", psl: 2780 },
  { code: "7790010000134 | 7790010000134", name: "PRODUCTO DEMO M", uxb: 1, pres: "UN", psl: 1325.6 },
  { code: "7790010000141 | 7790010000141", name: "PRODUCTO DEMO N", uxb: 1, pres: "UN", psl: 5210 },
  { code: "7790010000158 | 7790010000158", name: "PRODUCTO DEMO O", uxb: 1, pres: "UN", psl: 760 },
];

// Líneas del pedido: índice de producto + cantidad final.
export const LINE_A = { index: 0, qty: 6 };
export const LINE_B = { index: 1, qty: 5 };

export const orderTotal = () => PRODUCTS[LINE_A.index].psl * LINE_A.qty + PRODUCTS[LINE_B.index].psl * LINE_B.qty;

export const money = (v: number) =>
  "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
