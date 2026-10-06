// Tokens de QuartzSales (Apollo · Angular/PrimeNG, tema Lara violeta). Compartidos por todos los videos.
// Valores muestreados de las capturas del flujo de pedidos.
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "primeicons/primeicons.css";

export const font = "'Poppins', sans-serif";

export const c = {
  ground: "#eef1f7", // surface-ground del layout
  card: "#ffffff",
  border: "#dee2e8", // surface-border (cards, inputs)
  borderInput: "#cbd2dc",
  rowLine: "#e5e9f0",
  hover: "#f1f4f9", // surface-100
  disabledBg: "#dfe5ed",
  text: "#334155", // text-color
  textStrong: "#1e293b",
  muted: "#64748b",
  faint: "#94a3b8",

  primary: "#7f47ec",
  primaryHover: "#6d31e0",
  primaryDisabled: "#c9aff7",
  primary50: "#f4effe",
  primary100: "#ebe3fd",
  primaryRing: "rgba(127, 71, 236, 0.22)",

  success: "#16c55a",
  successText: "#15803d",
  warn: "#e08a00",
  warnBg: "#fefce8",
  warnBorder: "#f5e7a3",
  warnText: "#c27803",
  danger: "#ef4444",

  skeleton: "#e9edf3",
  skeletonHi: "#f4f6f9",
};

// Tonos de badge (tag de PrimeNG). Cada video mapea sus estados a estos tonos.
export const badge = {
  success: { bg: "#d4f8e5", fg: "#157a4b" },
  warn: { bg: "#fdf0c6", fg: "#b45309" },
  rose: { bg: "#fce4ef", fg: "#be185d" },
  danger: { bg: "#fde2e2", fg: "#b91c1c" },
  info: { bg: "#ede5fd", fg: "#6d28d9" },
  neutral: { bg: "#eef1f6", fg: "#334155" },
} as const;

export const radius = { card: 12, control: 6, badge: 6 };

export const shadow = {
  card: "0 1px 2px rgba(15, 23, 42, 0.03), 0 2px 8px rgba(15, 23, 42, 0.03)",
  overlay: "0 12px 32px rgba(15, 23, 42, 0.14), 0 2px 6px rgba(15, 23, 42, 0.06)",
  toast: "0 8px 24px rgba(15, 23, 42, 0.10)",
};
