// Tokens del design system PSMob. Aplican solo a la UI dentro del video
// (celulares, dashboards, formularios, chats, KPIs), no a personajes ni escenas.

export const color = {
  primary: "#2196F3",
  primaryDark: "#1976D2",
  primaryDarker: "#1565C0",
  primaryLight: "#E3F2FD",
  primaryGradient: "linear-gradient(180deg, #2196F3, #1976D2)",

  accent: "#7C5CFC",
  accentLight: "#EDE9FE",
  accentDarker: "#5B21B6",

  success: "#4CAF50",
  successDark: "#2E7D32",
  successLight: "#E8F5E9",
  warning: "#FF9800",
  warningDark: "#E65100",
  warningLight: "#FFF3E0",
  danger: "#F44336",
  dangerDark: "#B71C1C",
  dangerLight: "#FFEBEE",

  surface: "#FFFFFF",
  background: "#F5F5F5",
  border: "#E0E0E0",
  textPrimary: "#212121",
  textSecondary: "#616161",
  textDisabled: "#9E9E9E",
  textLink: "#2196F3",
  overlay: "rgba(0,0,0,0.6)",
  badge: "#F44336",
  badgeText: "#FFFFFF",
} as const;

export const font = {
  ui: "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'Roboto Mono', 'Courier New', monospace",
} as const;

export const fontSize = {
  xs: 10,
  sm: 11,
  base: 12,
  md: 13,
  lg: 14,
  xl: 16,
  "2xl": 18,
  "3xl": 22,
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 20,
  full: "50%",
} as const;

export const shadow = {
  card: "0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)",
  fab: "0 4px 12px rgba(124,92,252,0.40)",
  modal: "0 8px 32px rgba(0,0,0,0.18)",
  header: "0 2px 4px rgba(0,0,0,0.12)",
} as const;

// Medidas en px sobre el viewport de referencia de la app (~390px de ancho).
export const size = {
  viewportWidth: 390,
  header: 56,
  bottomNav: 60,
  fab: 56,
  badge: 18,
  avatarSm: 32,
  avatarMd: 40,
  thumbnail: 80,
  galleryGap: 4,
} as const;
