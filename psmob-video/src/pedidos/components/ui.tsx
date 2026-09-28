// Primitivas visuales de QuartzSales (PrimeNG Lara): botón, input, select, badge, ícono.
// Reproducen el lenguaje de las capturas; los estados llegan como números 0..1.
import React from "react";
import { useCurrentFrame } from "remotion";
import { badge as badgeColors, c, font, radius } from "../design/tokens";
import { OrderStatus, STATUS_LABEL } from "../data/mock-data";

// Mezcla lineal de dos colores hex (#rrggbb). Devuelve hex para poder encadenar mezclas.
export const mix = (a: string, b: string, t: number) => {
  const k = Math.min(1, Math.max(0, t));
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, "0")).join("");
};

export const Icon: React.FC<{ name: string; size?: number; color?: string; style?: React.CSSProperties }> = ({
  name,
  size = 12,
  color,
  style,
}) => <i className={`pi pi-${name}`} style={{ fontSize: size, color, lineHeight: 1, ...style }} />;

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
      {children}
      {icon && !children ? <Icon name={icon} size={fontSize - 1} /> : null}
      <span>{label}</span>
    </div>
  );
};

export const Badge: React.FC<{ status: OrderStatus; style?: React.CSSProperties; size?: number }> = ({ status, style, size = 10.5 }) => {
  const col = badgeColors[status];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 7px",
        borderRadius: radius.badge,
        background: col.bg,
        color: col.fg,
        fontFamily: font,
        fontSize: size,
        fontWeight: 700,
        whiteSpace: "nowrap",
        lineHeight: 1.45,
        ...style,
      }}
    >
      {STATUS_LABEL[status]}
    </span>
  );
};

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
