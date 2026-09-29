import "../../design/fonts";
// Mini design system único para TODA la UI del video (celulares, dashboard, chips flotantes).
// Una familia tipográfica, una paleta, una escala de espaciado, 3 radios y una lógica de sombras.
// Fuente de verdad visual: capturas de corrección (azul único #1D4ED8).

export const FONT = "'Roboto', -apple-system, sans-serif";
export const FONT_MONO = "'Roboto Mono', monospace";

export const C = {
  primary: "#1D4ED8",
  primarySoft: "#DBEAFE",
  primaryBar: "#93C5FD",
  violet: "#7025E0", // QuartzSales
  violetSoft: "#EDE5FC",
  bg: "#F1F4F9",
  surface: "#FFFFFF",
  border: "#E2E8F0",
  text: "#1E293B",
  text2: "#64748B",
  text3: "#94A3B8",
  onPrimary: "#FFFFFF",
  onPrimary2: "rgba(255,255,255,0.72)",
  success: "#16A34A",
  successSoft: "#DCFCE7",
  successBar: "#86EFAC",
  warning: "#D97706",
  warningSoft: "#FEF3C7",
  warningBar: "#FDE047",
  error: "#DC2626",
  errorSoft: "#FEE2E2",
  errorBar: "#FCA5A5",
  dark: "#130D5D", // QS dark (wordmark, fondos de marca)
  camera: "#0B1026",
} as const;

// Tipografía: tamaños fijos (px sobre el viewport de 390px de ancho).
export const T = {
  pageTitle: { fontSize: 20, fontWeight: 600, lineHeight: 1.2 },
  sectionTitle: { fontSize: 16, fontWeight: 600, lineHeight: 1.25 },
  cardTitle: { fontSize: 14, fontWeight: 600, lineHeight: 1.3 },
  body: { fontSize: 14, fontWeight: 400, lineHeight: 1.4 },
  caption: { fontSize: 12, fontWeight: 400, lineHeight: 1.35 },
  kpi: { fontSize: 28, fontWeight: 700, lineHeight: 1 },
  badge: { fontSize: 11, fontWeight: 600, lineHeight: 1 },
} as const;

// Espaciado: 4 / 8 / 12 / 16 / 24 / 32
export const S = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

// Radios: pequeño (chips cuadrados, inputs, botones), card, grande (sheets/modales). Pill = forma.
export const R = { sm: 8, card: 16, lg: 24, pill: 999 } as const;

// Una sola lógica de sombra en dos niveles.
export const SH = {
  card: "0 1px 2px rgba(15,23,42,0.06), 0 4px 12px rgba(15,23,42,0.06)",
  float: "0 2px 4px rgba(15,23,42,0.08), 0 16px 40px rgba(15,23,42,0.16)",
} as const;

// Alturas fijas de la app.
export const H = { status: 44, header: 56, nav: 64, button: 48 } as const;
