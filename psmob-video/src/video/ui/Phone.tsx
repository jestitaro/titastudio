import React from "react";
import { color, radius, shadow } from "../../design/psmob-tokens";
import { roboto } from "../lib/fonts";
import { Icon, IconName } from "./icons";

// Celular frontal y derecho (regla del brief: nunca en perspectiva).
export const SCREEN_W = 390;
export const SCREEN_H = 844;
const BEZEL = 13;
export const PHONE_OUTER_W = SCREEN_W + BEZEL * 2;
export const PHONE_OUTER_H = SCREEN_H + BEZEL * 2;

export const Phone: React.FC<{
  children: React.ReactNode;
  x: number; // centro
  y: number;
  scale: number;
  shadowO?: number;
  bezelO?: number; // 0 = solo pantalla (cuando la UI ocupa todo el cuadro)
}> = ({ children, x, y, scale, shadowO = 1, bezelO = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: PHONE_OUTER_W,
      height: PHONE_OUTER_H,
      transform: `translate(-50%, -50%) scale(${scale})`,
      borderRadius: 62,
      padding: BEZEL,
      background: `rgba(20,18,58,${bezelO})`,
      boxShadow: `0 ${50 / Math.max(scale, 0.4)}px ${110 / Math.max(scale, 0.4)}px rgba(19,13,93,${0.32 * shadowO}), inset 0 0 0 2px rgba(80,76,140,${bezelO})`,
    }}
  >
    <div
      style={{
        position: "relative",
        width: SCREEN_W,
        height: SCREEN_H,
        borderRadius: 50,
        overflow: "hidden",
        background: color.background,
        fontFamily: roboto,
      }}
    >
      {children}
      <div style={{ position: "absolute", top: 11, left: SCREEN_W / 2 - 52, width: 104, height: 28, borderRadius: 14, background: "#14123A", opacity: bezelO }} />
    </div>
  </div>
);

export const StatusBar: React.FC<{ dark?: boolean }> = ({ dark }) => {
  const c = dark ? color.textPrimary : "#fff";
  return (
    <div style={{ height: 48, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 30px 0", fontSize: 15, fontWeight: 600, color: c }}>
      <span>9:41</span>
      <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
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

export const AppHeader: React.FC<{ title: string; back?: boolean; menu?: boolean; right?: IconName[]; transparent?: boolean }> = ({
  title,
  back,
  menu,
  right = [],
  transparent,
}) => (
  <div style={{ background: transparent ? "transparent" : color.primaryGradient }}>
    <StatusBar />
    <div style={{ height: 56, display: "flex", alignItems: "center", gap: 14, padding: "0 18px", color: "#fff" }}>
      {back && <Icon name="back" color="#fff" size={24} fill={false} />}
      {menu && <Icon name="menu" color="#fff" size={24} fill={false} />}
      <div style={{ fontSize: 20, fontWeight: 600, flex: 1 }}>{title}</div>
      {right.map((r) => (
        <Icon key={r} name={r} color="#fff" size={24} fill={false} />
      ))}
    </div>
  </div>
);

export const BottomNav: React.FC<{ items: { icon: IconName; label: string; badge?: number }[]; active: number; activeProgress?: number }> = ({
  items,
  active,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 84,
      background: color.surface,
      borderTop: `1px solid ${color.border}`,
      display: "flex",
      paddingBottom: 18,
    }}
  >
    {items.map((it, i) => {
      const on = i === active;
      const c = on ? color.accent : color.textDisabled;
      return (
        <div key={it.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, position: "relative" }}>
          <Icon name={it.icon} size={25} color={c} fill={on} />
          <div style={{ fontSize: 11.5, color: c, fontWeight: on ? 600 : 400 }}>{it.label}</div>
          {it.badge ? (
            <div
              style={{
                position: "absolute",
                top: 8,
                left: "56%",
                minWidth: 18,
                height: 18,
                borderRadius: 9,
                background: color.badge,
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 4px",
              }}
            >
              {it.badge}
            </div>
          ) : null}
        </div>
      );
    })}
  </div>
);

export const Chip: React.FC<{ tone: "active" | "info" | "done" | "warn" | "tag" | "danger" | "grey"; children: React.ReactNode; size?: number; dot?: boolean }> = ({
  tone,
  children,
  size = 12,
  dot,
}) => {
  const m = {
    active: [color.successDark, "#fff"],
    info: [color.primaryLight, color.primaryDarker],
    done: [color.successLight, color.successDark],
    warn: [color.warningLight, color.warningDark],
    tag: [color.accentLight, color.accentDarker],
    danger: [color.dangerLight, color.dangerDark],
    grey: ["#ECEFF1", color.textSecondary],
  }[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 10px",
        borderRadius: radius.pill,
        background: m[0],
        color: m[1],
        fontSize: size,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {dot && <span style={{ width: 7, height: 7, borderRadius: 4, background: tone === "active" ? "#A5F3A9" : m[1] }} />}
      {children}
    </span>
  );
};

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: color.surface, borderRadius: radius.lg, boxShadow: shadow.card, padding: 16, ...style }}>{children}</div>
);

// Indicador de tap: círculo que entra, presiona y deja ripple.
export const Tap: React.FC<{ f: number; at: number; x: number; y: number; enter?: number; hold?: number }> = ({ f, at, x, y, enter = 10, hold = 10 }) => {
  if (f < at - enter || f > at + hold + 10) return null;
  const inP = Math.min(1, Math.max(0, (f - (at - enter)) / enter));
  const out = Math.min(1, Math.max(0, (at + hold + 10 - f) / 8));
  const press = f >= at && f < at + 5 ? 0.8 : 1;
  const rip = Math.min(1, Math.max(0, (f - at) / 14));
  return (
    <>
      {f >= at && rip < 1 && (
        <div
          style={{
            position: "absolute",
            left: x - 60 * rip - 10,
            top: y - 60 * rip - 10,
            width: 20 + 120 * rip,
            height: 20 + 120 * rip,
            borderRadius: "50%",
            background: color.accent,
            opacity: 0.28 * (1 - rip),
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: x - 28,
          top: y - 28 + (1 - inP) * 40,
          width: 56,
          height: 56,
          borderRadius: 28,
          background: "rgba(255,255,255,0.5)",
          border: "3px solid rgba(255,255,255,0.95)",
          boxShadow: "0 6px 20px rgba(19,13,93,0.35)",
          transform: `scale(${press})`,
          opacity: Math.min(inP, out),
        }}
      />
    </>
  );
};

export const NAV_MAIN: { icon: IconName; label: string }[] = [
  { icon: "home", label: "Inicio" },
  { icon: "users", label: "Equipo" },
  { icon: "pin", label: "Visitas" },
  { icon: "form", label: "Forms" },
  { icon: "user", label: "Perfil" },
];
