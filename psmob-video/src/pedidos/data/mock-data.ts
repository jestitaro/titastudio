// Datos ficticios. Se mantienen iguales durante toda la historia.
// Formatos tomados de las capturas: moneda $1,234.56 y fecha DD/MM/YYYY.
import { CATALOG, CatalogItem } from "./catalog";
import type { BadgeTone } from "../../qs-kit/ui/primitives";

export type OrderStatus = "completo" | "parcial" | "rechazado" | "noCreado" | "transmitido" | "borrador";

export type OrderRow = {
  date: string;
  number: number;
  client: string;
  branch: string;
  total: number;
  status: OrderStatus;
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

export const STATUS_TONE: Record<OrderStatus, BadgeTone> = {
  completo: "success",
  parcial: "warn",
  rechazado: "rose",
  noCreado: "danger",
  transmitido: "info",
  borrador: "neutral",
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

// Catálogo con imágenes: ver catalog.ts.
export const PRODUCTS = CATALOG;
export type Product = CatalogItem;

// Líneas del pedido (índice en el catálogo). La historia en el Resumen del Pedido:
// A se carga con 6 y se edita a 4; B se agrega y después se elimina; C se sube a 3 con "+".
export const LINE_A = { index: 0, qty: 6, edited: 4 };
export const LINE_B = { index: 1, qty: 5 };
export const LINE_C = { index: 2, qty: 3 };

// Líneas finales que llegan al resumen y al listado.
export const FINAL_LINES = [
  { index: LINE_A.index, qty: LINE_A.edited },
  { index: LINE_C.index, qty: LINE_C.qty },
];
export const orderTotal = () => FINAL_LINES.reduce((t, l) => t + PRODUCTS[l.index].psl * l.qty, 0);
export const orderUnits = () => FINAL_LINES.reduce((t, l) => t + l.qty, 0);

export const money = (v: number) =>
  "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
