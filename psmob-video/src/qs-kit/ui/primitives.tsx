// Primitivas visuales de QuartzSales (PrimeNG Lara): botón, input, badge, ícono, skeleton.
// Kit compartido: no importar nada de un video puntual desde acá.
// Reproducen el lenguaje de las capturas; los estados llegan como números 0..1.
import React from "react";
import { useCurrentFrame } from "remotion";
import { badge as badgeColors, c, font, radius } from "../design/tokens";

// Mezcla lineal de dos colores hex (#rrggbb). Devuelve hex para poder encadenar mezclas.
export const mix = (a: string, b: string, t: number) => {
  const k = Math.min(1, Math.max(0, t));
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, "0")).join("");
};

// Poppins tiene métricas verticales asimétricas: centrar con line-height normal deja el texto
// corrido. Para textos que se centran en una caja (botones, chips, círculos) usar <Centered>:
// line-height 1 + corrección óptica medida (QS-Kit-Specimen: 1,5 % del cuerpo).
export const OPTICAL_Y = 0.015;
// En botones (texto en mayúscula y minúscula + ícono) hace falta un poco más:
// medido sobre "Detalle", el label quedaba 0,9 px arriba del centro y el ícono 0,4 px.
const BTN_LABEL_Y = 0.08;
const BTN_ICON_Y = 0.035;
export const Centered: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span style={{ display: "block", lineHeight: 1, transform: `translateY(${OPTICAL_Y}em)`, whiteSpace: "nowrap", ...style }}>{children}</span>
);

export const Icon: React.FC<{ name: string; size?: number; color?: string; style?: React.CSSProperties }> = ({
  name,
  size = 12,
  color,
  style,
}) => <i className={`pi pi-${name}`} style={{ fontSize: size, color, lineHeight: 1, display: "block", ...style }} />;

type BtnProps = {
  label: string;
  icon?: string;
  variant?: "primary" | "outlined" | "secondary";
  enabled?: number; // 0 disabled → 1 enabled
  hover?: number;
  scale?: number;
  height?: number;
  fontSize?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export const Button: React.FC<BtnProps> = ({
  label,
  icon,
  variant = "primary",
  enabled = 1,
  hover = 0,
  scale = 1,
  height = 32,
  fontSize = 13,
  style,
  children,
}) => {
  let bg = c.primary;
  let fg = "#ffffff";
  let border = c.primary;
  if (variant === "primary") {
    bg = mix(mix(c.primaryDisabled, c.primary, enabled), c.primaryHover, hover * enabled);
    border = bg;
  } else if (variant === "outlined") {
    bg = mix("#ffffff", c.primary50, hover);
    fg = c.primary;
    border = "#d9c8fb";
  } else {
    bg = mix("#ffffff", c.hover, hover);
    fg = c.text;
    border = c.border;
  }
  return (
    <div
      style={{
        height,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        padding: "0 12px",
        borderRadius: radius.control,
        background: bg,
        color: fg,
        border: `1px solid ${border}`,
        fontFamily: font,
        fontSize,
        fontWeight: 500,
        whiteSpace: "nowrap",
        transform: `scale(${scale})`,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {/* Ícono y label centrados sobre el centro real del botón (medido a píxel en el render). */}
      {children || icon ? (
        <span style={{ display: "flex", alignItems: "center", transform: `translateY(${BTN_ICON_Y}em)` }}>
          {children}
          {icon && !children ? <Icon name={icon} size={fontSize - 1} /> : null}
        </span>
      ) : null}
      {label ? <Centered style={{ transform: `translateY(${BTN_LABEL_Y}em)` }}>{label}</Centered> : null}
    </div>
  );
};

export type BadgeTone = keyof typeof badgeColors;
export const Badge: React.FC<{ tone: BadgeTone; label: string; style?: React.CSSProperties; size?: number }> = ({ tone, label, style, size = 10.5 }) => {
  const col = badgeColors[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: Math.round(size * 1.9),
        padding: "0 8px",
        boxSizing: "border-box",
        borderRadius: radius.badge,
        background: col.bg,
        color: col.fg,
        fontFamily: font,
        fontSize: size,
        fontWeight: 700,
        ...style,
      }}
    >
      <Centered>{label}</Centered>
    </span>
  );
};

// Indicador de validez (total del pedido): check verde o "!" naranja, dibujados en SVG
// para que queden centrados al píxel.
export const StatusDot: React.FC<{ invalid: number; size?: number }> = ({ invalid, size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ display: "block", flexShrink: 0 }}>
    <g opacity={1 - invalid}>
      <circle cx="8" cy="8" r="8" fill={c.success} />
      <path d="M4.6 8.3l2.2 2.2 4.6-4.8" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <g opacity={invalid}>
      <circle cx="8" cy="8" r="8" fill={c.warn} />
      <path d="M8 4.2v4.6" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="8" cy="11.6" r="1.1" fill="#fff" />
    </g>
  </svg>
);

type FieldProps = {
  width: number | string;
  height?: number;
  focus?: number;
  disabled?: number; // 1 = deshabilitado (fondo gris)
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

// Caja de input/select con focus ring de PrimeNG.
export const Field: React.FC<FieldProps> = ({ width, height = 34, focus = 0, disabled = 0, children, style }) => (
  <div
    style={{
      width,
      height,
      boxSizing: "border-box",
      borderRadius: radius.control,
      border: `1px solid ${mix(mix(c.borderInput, c.primary, focus), "#d3dae4", disabled)}`,
      boxShadow: focus > 0 ? `0 0 0 ${3 * focus}px ${c.primaryRing}` : "none",
      background: mix("#ffffff", c.disabledBg, disabled),
      display: "flex",
      alignItems: "center",
      padding: "0 10px",
      fontFamily: font,
      fontSize: 13,
      color: c.text,
      position: "relative",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Caret: React.FC<{ on: boolean; height?: number }> = ({ on, height = 15 }) => (
  <span style={{ display: "inline-block", width: 1.5, height, background: c.textStrong, marginLeft: 1, opacity: on ? 1 : 0 }} />
);

// Skeleton con shimmer determinista (posición derivada del frame).
export const Sk: React.FC<{ w: number | string; h: number; r?: number; style?: React.CSSProperties }> = ({ w, h, r = 4, style }) => {
  const frame = useCurrentFrame();
  const pos = ((frame * 1.6) % 240) - 60; // barrido lento, sin brillo fuerte
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        background: `linear-gradient(90deg, ${c.skeleton} 0%, ${c.skeleton} ${pos - 30}%, ${c.skeletonHi} ${pos}%, ${c.skeleton} ${pos + 30}%, ${c.skeleton} 100%)`,
        ...style,
      }}
    />
  );
};

// Posicionamiento absoluto en coordenadas lógicas.
export const Abs: React.FC<{ x: number; y: number; w?: number; h?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  x,
  y,
  w,
  h,
  style,
  children,
}) => <div style={{ position: "absolute", left: x, top: y, width: w, height: h, ...style }}>{children}</div>;

export const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily: font, fontSize: 11.5, color: c.textStrong, fontWeight: 400, ...style }}>{children}</div>
);
