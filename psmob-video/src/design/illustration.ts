// Sistema de ilustración extraído de los 4 SVG de referencia (Storyset "pana").
// El "contorno" en la referencia no es stroke: son paths rellenos en `line`.
// Acá lo aproximamos con strokes finos del mismo color y remates redondeados.

export const ink = {
  line: "#263238",
  slate: "#455A64",
  purple: "#7E57C2",
  purpleShade: "rgba(0,0,0,0.18)",
  skin: "#FFBF9D",
  skinShade: "#FF9A6C",
  skinLine: "#EB996E",
  skinDark: "#C9835C",
  skinDarkShade: "#A86644",
  grey100: "#F5F5F5",
  grey200: "#EBEBEB",
  grey300: "#E0E0E0",
  white: "#FFFFFF",
} as const;

// Identidad de personajes (de escenas.zip) dibujada con la construcción pana.
export const cast = {
  caro: {
    hair: "#2F3FA8",
    hairShade: "#23308A",
    shirt: ink.purple,
  },
  repositor: {
    hair: ink.line,
    vest: ink.slate,
    shirt: "#3C9FF1",
  },
} as const;

// Branding QuartzSales / PSMob para fondos y acentos narrativos.
export const brand = {
  navy: "#130D5D",
  violet: "#7025E0",
  sky: "#3C9FF1",
  night: "#0B0838",
} as const;

// Línea fina de la referencia expresada en unidades de los viewBox de personaje.
export const LINE_W = 3;
