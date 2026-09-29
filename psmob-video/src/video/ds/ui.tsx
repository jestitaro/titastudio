import React from "react";
import { Img, staticFile } from "remotion";
import { Icon, IconName } from "../ui/icons";
import { C, FONT, FONT_MONO, H, R, S, SH, T } from "./tokens";

// Componentes de UI compartidos por TODAS las pantallas del video.
// Cada pantalla ocupa el 100% de su contenedor (el celular define el tamaño).

export const Screen: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = C.bg }) => (
  <div style={{ position: "absolute", inset: 0, background: bg, fontFamily: FONT, color: C.text, overflow: "hidden" }}>{children}</div>
);

export const StatusBar: React.FC<{ light?: boolean }> = ({ light = true }) => {
  const c = light ? "#fff" : C.text;
  return (
    <div style={{ height: H.status, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${S.xl}px`, fontSize: 14, fontWeight: 600, color: c }}>
      <span>9:41</span>
      <span style={{ display: "flex", gap: S.xs, alignItems: "center" }}>
        <span style={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
          {[5, 7, 9, 11].map((h) => (
            <span key={h} style={{ width: 3, height: h, borderRadius: 1, background: c }} />
          ))}
        </span>
        <span style={{ width: 22, height: 11, borderRadius: 3, border: `1.5px solid ${c}`, padding: 1 }}>
          <span style={{ display: "block", width: "75%", height: "100%", background: c, borderRadius: 1 }} />
        </span>
      </span>
    </div>
  );
};

const CircleBtn: React.FC<{ icon: IconName }> = ({ icon }) => (
  <div style={{ width: 36, height: 36, borderRadius: R.pill, background: "rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Icon name={icon} size={20} color="#fff" fill={false} />
  </div>
);

// Header azul: status bar + barra de 56px (back en círculo, título, acciones en círculo) + subbarra opcional.
export const Header: React.FC<{ title: string; back?: boolean; menu?: boolean; actions?: IconName[]; children?: React.ReactNode; upper?: boolean }> = ({
  title,
  back = true,
  menu,
  actions = [],
  children,
  upper,
}) => (
  <div style={{ background: C.primary, color: C.onPrimary }}>
    <StatusBar />
    <div style={{ height: H.header, display: "flex", alignItems: "center", gap: S.md, padding: `0 ${S.lg}px` }}>
      {back && <CircleBtn icon="back" />}
      {menu && <CircleBtn icon="menu" />}
      <div style={{ ...T.pageTitle, flex: 1, textTransform: upper ? "uppercase" : undefined, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
      {actions.map((a) => (
        <CircleBtn key={a} icon={a} />
      ))}
    </div>
    {children && <div style={{ padding: `0 ${S.lg}px ${S.md}px` }}>{children}</div>}
  </div>
);

// Zona azul bajo el header (indicadores) y hoja blanca que se superpone con radio grande.
export const Hero: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: C.primary, color: C.onPrimary, padding: `${S.sm}px ${S.xl}px ${S.xl + S.lg}px` }}>{children}</div>
);
export const Sheet: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: C.bg, borderRadius: `${R.lg}px ${R.lg}px 0 0`, marginTop: -S.xl, padding: `${S.lg}px ${S.lg}px 0`, position: "relative", ...style }}>{children}</div>
);

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; selected?: boolean }> = ({ children, style, selected }) => (
  <div
    style={{
      background: C.surface,
      borderRadius: R.card,
      boxShadow: SH.card,
      padding: S.lg,
      outline: selected ? `2px solid ${C.primary}` : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

export type Tone = "success" | "warning" | "error" | "info" | "violet" | "neutral";
const TONES: Record<Tone, [string, string]> = {
  success: [C.successSoft, C.success],
  warning: [C.warningSoft, C.warning],
  error: [C.errorSoft, C.error],
  info: [C.primarySoft, C.primary],
  violet: [C.violetSoft, C.violet],
  neutral: ["#EEF2F7", C.text2],
};

export const Chip: React.FC<{ tone: Tone; children: React.ReactNode; icon?: IconName; solid?: boolean }> = ({ tone, children, icon, solid }) => {
  const [bg, fg] = TONES[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: S.xs,
        padding: `${S.xs}px ${S.sm + 2}px`,
        borderRadius: R.pill,
        background: solid ? fg : bg,
        color: solid ? "#fff" : fg,
        ...T.badge,
        whiteSpace: "nowrap",
      }}
    >
      {icon && <Icon name={icon} size={13} color={solid ? "#fff" : fg} fill={false} sw={2.2} />}
      {children}
    </span>
  );
};

export const Badge: React.FC<{ n: number | string; style?: React.CSSProperties }> = ({ n, style }) => (
  <div
    style={{
      minWidth: 20,
      height: 20,
      padding: `0 ${S.xs + 2}px`,
      borderRadius: R.pill,
      background: C.error,
      color: "#fff",
      ...T.badge,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 0 0 2px #fff",
      ...style,
    }}
  >
    {n}
  </div>
);

export const Button: React.FC<{ children: React.ReactNode; variant?: "primary" | "violet" | "outline"; icon?: IconName; style?: React.CSSProperties; disabled?: boolean }> = ({
  children,
  variant = "primary",
  icon,
  style,
  disabled,
}) => {
  const bg = variant === "outline" ? "transparent" : variant === "violet" ? C.violet : C.primary;
  return (
    <div
      style={{
        height: H.button,
        borderRadius: R.sm,
        background: bg,
        border: variant === "outline" ? `1.5px solid ${C.border}` : "none",
        color: variant === "outline" ? C.text : "#fff",
        ...T.cardTitle,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: S.sm,
        opacity: disabled ? 0.45 : 1,
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={18} color={variant === "outline" ? C.text : "#fff"} fill={false} />}
      {children}
    </div>
  );
};

export const Input: React.FC<{ value: string; icon?: IconName; onBlue?: boolean }> = ({ value, icon = "search", onBlue }) => (
  <div
    style={{
      height: 40,
      borderRadius: R.sm,
      background: onBlue ? "rgba(255,255,255,0.16)" : C.surface,
      border: onBlue ? "none" : `1.5px solid ${C.border}`,
      display: "flex",
      alignItems: "center",
      gap: S.sm,
      padding: `0 ${S.md}px`,
      color: onBlue ? "#fff" : C.text,
      ...T.body,
      fontWeight: 500,
    }}
  >
    <Icon name={icon} size={18} color={onBlue ? "#fff" : C.text2} fill={false} />
    {value}
  </div>
);

export const Segmented: React.FC<{ items: string[]; active: number; violet?: boolean; icons?: IconName[] }> = ({ items, active, violet, icons }) => (
  <div style={{ display: "flex", background: C.surface, borderRadius: R.pill, padding: S.xs, boxShadow: SH.card }}>
    {items.map((it, i) => {
      const on = i === active;
      return (
        <div
          key={it}
          style={{
            flex: 1,
            height: 32,
            borderRadius: R.pill,
            background: on ? (violet ? C.violet : "#EEF2F7") : "transparent",
            color: on ? (violet ? "#fff" : C.text) : C.text2,
            ...T.cardTitle,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: S.xs,
          }}
        >
          {icons?.[i] && <Icon name={icons[i]} size={14} color={on ? (violet ? "#fff" : C.text) : C.text2} fill={false} />}
          {it}
        </div>
      );
    })}
  </div>
);

export const Avatar: React.FC<{ initials: string; color: string; size?: number; ring?: boolean }> = ({ initials, color, size = 36, ring = true }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: R.pill,
      background: color,
      color: "#fff",
      fontFamily: FONT,
      fontSize: size * 0.36,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: ring ? "0 0 0 2px #fff" : undefined,
      flexShrink: 0,
    }}
  >
    {initials}
  </div>
);

export const ListRow: React.FC<{ leading?: React.ReactNode; title: React.ReactNode; subtitle?: React.ReactNode; mono?: string; trailing?: React.ReactNode; divider?: boolean }> = ({
  leading,
  title,
  subtitle,
  mono,
  trailing,
  divider = true,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: S.md, padding: `${S.md}px 0`, borderBottom: divider ? `1px solid ${C.border}` : undefined }}>
    {leading}
    <div style={{ flex: 1, minWidth: 0 }}>
      {mono && <div style={{ ...T.caption, fontFamily: FONT_MONO, color: C.text2 }}>{mono}</div>}
      <div style={{ ...T.body, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
      {subtitle && <div style={{ ...T.caption, color: C.text2, marginTop: 2 }}>{subtitle}</div>}
    </div>
    {trailing}
  </div>
);

export const Thumb: React.FC<{ src?: string; icon?: IconName; size?: number }> = ({ src, icon = "box", size = 40 }) => (
  <div style={{ width: size, height: size, borderRadius: R.sm, background: "#EEF2F7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
    {src ? <Img src={staticFile(src)} style={{ height: size * 0.86, width: "auto" }} /> : <Icon name={icon} size={size * 0.55} color={C.primary} />}
  </div>
);

export type NavItem = { icon: IconName; label: string; badge?: number };
export const NAV_FIELD: NavItem[] = [
  { icon: "home", label: "Inicio" },
  { icon: "store", label: "Info PDV" },
  { icon: "pin", label: "Visitas" },
  { icon: "form", label: "Forms" },
  { icon: "chart", label: "Indicadores" },
];

export const BottomNav: React.FC<{ active: number; items?: NavItem[] }> = ({ active, items = NAV_FIELD }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: H.nav + 16, paddingBottom: 16, background: C.surface, borderTop: `1px solid ${C.border}`, display: "flex" }}>
    {items.map((it, i) => {
      const on = i === active;
      const c = on ? C.primary : C.text3;
      return (
        <div key={it.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: S.xs, position: "relative" }}>
          {on && <div style={{ position: "absolute", top: 0, width: 32, height: 3, borderRadius: 2, background: C.primary }} />}
          <Icon name={it.icon} size={24} color={c} fill={on} />
          <div style={{ ...T.caption, fontSize: 11, color: c, fontWeight: on ? 600 : 400 }}>{it.label}</div>
          {it.badge ? <Badge n={it.badge} style={{ position: "absolute", top: 6, left: "56%" }} /> : null}
        </div>
      );
    })}
  </div>
);

export const Fab: React.FC<{ icon?: IconName; bottom?: number }> = ({ icon = "plus", bottom = H.nav + 32 }) => (
  <div style={{ position: "absolute", right: S.lg, bottom, width: 56, height: 56, borderRadius: R.pill, background: C.violet, boxShadow: SH.float, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Icon name={icon} size={26} color="#fff" fill={false} />
  </div>
);

export const Toast: React.FC<{ icon: IconName; title: string; subtitle?: string; tone?: Tone }> = ({ icon, title, subtitle, tone = "violet" }) => {
  const [bg, fg] = TONES[tone];
  return (
    <div style={{ background: C.surface, borderRadius: R.card, boxShadow: SH.float, padding: S.md, display: "flex", alignItems: "center", gap: S.md }}>
      <div style={{ width: 40, height: 40, borderRadius: R.pill, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={22} color={fg} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ ...T.cardTitle, color: C.text }}>{title}</div>
        {subtitle && <div style={{ ...T.caption, color: C.text2 }}>{subtitle}</div>}
      </div>
    </div>
  );
};

// Gauge semicircular (patrón de las capturas): pista + arco de valor + punto verde en el objetivo.
export const Gauge: React.FC<{ value: number; size: number; onBlue?: boolean; stroke?: number }> = ({ value, size, onBlue = true, stroke = 8 }) => {
  const r = size / 2 - stroke;
  const len = Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;
  const a = Math.PI * (1 - Math.min(100, Math.max(0, value)) / 100);
  return (
    <svg width={size} height={size / 2 + stroke} viewBox={`0 0 ${size} ${size / 2 + stroke}`} style={{ display: "block" }}>
      <path d={`M${stroke} ${cy} A ${r} ${r} 0 0 1 ${size - stroke} ${cy}`} fill="none" stroke={onBlue ? "rgba(255,255,255,0.22)" : "#E2E8F0"} strokeWidth={stroke} strokeLinecap="round" />
      <path
        d={`M${stroke} ${cy} A ${r} ${r} 0 0 1 ${size - stroke} ${cy}`}
        fill="none"
        stroke={onBlue ? "#FCA5A5" : C.primary}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${len} ${len}`}
        strokeDashoffset={len * (1 - value / 100)}
      />
      <circle cx={cx + Math.cos(a) * r} cy={cy - Math.sin(a) * r} r={stroke * 0.7} fill={C.successBar} stroke={onBlue ? C.primary : "#fff"} strokeWidth={2} />
    </svg>
  );
};

// Card cuadrada de indicador sobre fondo azul (todas iguales, incluida Incorporaciones).
export const KpiGaugeCard: React.FC<{ label: string; value: number; target: number }> = ({ label, value, target }) => (
  <div style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.16)", borderRadius: R.card, padding: `${S.lg}px ${S.sm}px ${S.md}px`, display: "flex", flexDirection: "column", alignItems: "center", color: "#fff" }}>
    <div style={{ position: "relative" }}>
      <Gauge value={value} size={112} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 26, textAlign: "center", ...T.kpi }}>
        {Math.round(value)}
        <span style={{ fontSize: 14 }}>%</span>
      </div>
    </div>
    <div style={{ ...T.cardTitle, marginTop: S.sm }}>{label}</div>
    <div style={{ ...T.caption, color: C.onPrimary2, marginTop: 2 }}>
      Objetivo <b style={{ color: C.successBar }}>{target}%</b>
    </div>
  </div>
);

// Barra segmentada (3 tramos) como en OSA por negocio.
export const SegBar: React.FC<{ value: number; color: string }> = ({ value, color }) => (
  <div style={{ display: "flex", gap: 3, height: 6 }}>
    {[0, 1, 2].map((i) => {
      const segMin = i * 33.34;
      const fill = Math.max(0, Math.min(1, (value - segMin) / 33.34));
      return (
        <div key={i} style={{ flex: 1, borderRadius: 3, background: "#EEF2F7", overflow: "hidden" }}>
          <div style={{ width: `${fill * 100}%`, height: "100%", background: color }} />
        </div>
      );
    })}
  </div>
);

export const Bar: React.FC<{ value: number; color?: string }> = ({ value, color = C.primaryBar }) => (
  <div style={{ height: 6, borderRadius: 3, background: "#EEF2F7" }}>
    <div style={{ width: `${Math.min(100, value)}%`, height: "100%", borderRadius: 3, background: color }} />
  </div>
);

export const SectionTitle: React.FC<{ children: React.ReactNode; right?: React.ReactNode }> = ({ children, right }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: `${S.lg}px 0 ${S.sm}px` }}>
    <div style={{ ...T.sectionTitle, color: C.text }}>{children}</div>
    {right}
  </div>
);

// Indicador de tap: entra, presiona y deja ripple.
export const Tap: React.FC<{ f: number; at: number; x: number; y: number }> = ({ f, at, x, y }) => {
  const enter = 8;
  if (f < at - enter || f > at + 18) return null;
  const inP = Math.min(1, Math.max(0, (f - (at - enter)) / enter));
  const out = Math.min(1, Math.max(0, (at + 18 - f) / 8));
  const press = f >= at && f < at + 5 ? 0.8 : 1;
  const rip = Math.min(1, Math.max(0, (f - at) / 14));
  return (
    <>
      {f >= at && rip < 1 && <div style={{ position: "absolute", left: x - 10 - 60 * rip, top: y - 10 - 60 * rip, width: 20 + 120 * rip, height: 20 + 120 * rip, borderRadius: R.pill, background: C.primary, opacity: 0.25 * (1 - rip) }} />}
      <div
        style={{
          position: "absolute",
          left: x - 26,
          top: y - 26 + (1 - inP) * 30,
          width: 52,
          height: 52,
          borderRadius: R.pill,
          background: "rgba(255,255,255,0.55)",
          border: "3px solid rgba(255,255,255,0.95)",
          boxShadow: SH.float,
          transform: `scale(${press})`,
          opacity: Math.min(inP, out),
        }}
      />
    </>
  );
};
