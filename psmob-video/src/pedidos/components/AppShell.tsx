// Layout de Apollo: sidebar de navegación + topbar con breadcrumb. Constante en todo el video:
// es el ancla espacial que hace que el flujo se lea como "dentro del producto".
import React from "react";
import { SHELL, VIEW } from "../animation/layout";
import { c, font } from "../design/tokens";
import { Icon } from "./ui";

const NAV: { label: string; caret?: boolean; active?: boolean }[] = [
  { label: "Pedidos" },
  { label: "Documentación" },
  { label: "Sistema", caret: true },
  { label: "Importador" },
  { label: "Clientes", caret: true },
  { label: "Productos", caret: true },
  { label: "Pedidos a Autorizar" },
  { label: "Pedidos", active: true },
  { label: "Pedidos Pendientes" },
  { label: "Gestor de Descuentos" },
];

const Logo: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path d="M12 2.5l7.8 4.5v9L12 20.5 4.2 16V7z" fill="none" stroke={c.primary} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M12 7.2l3.9 2.3v4.6L12 16.4l-3.9-2.3V9.5z" fill={c.primary} opacity="0.85" />
    </svg>
    <span style={{ fontFamily: font, fontWeight: 600, fontSize: 17, color: c.primary, letterSpacing: -0.2 }}>QuartzSales</span>
  </div>
);

export const Sidebar: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: SHELL.sidebarW,
      height: VIEW.h,
      background: "#ffffff",
      fontFamily: font,
      boxSizing: "border-box",
      padding: "30px 0 0 30px",
    }}
  >
    <div style={{ paddingLeft: 10 }}>
      <Logo />
    </div>
    <div style={{ marginTop: 38, fontSize: 10, fontWeight: 600, color: c.primary, letterSpacing: 0.3 }}>ADMINISTRACIÓN</div>
    <div style={{ marginTop: 10 }}>
      {NAV.map((n, i) => (
        <div
          key={i}
          style={{
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingRight: 30,
            fontSize: 12.5,
            color: c.textStrong,
            fontWeight: n.active ? 600 : 400,
          }}
        >
          <span>{n.label}</span>
          {n.caret ? <Icon name="angle-down" size={11} color={c.muted} /> : null}
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", bottom: 18, left: 16, fontSize: 9.5, color: c.muted }}>Versión: 2.1.0-20260911550114236</div>
  </div>
);

const Flag: React.FC = () => (
  <svg width="18" height="12" viewBox="0 0 18 12" style={{ borderRadius: 1.5 }}>
    <rect width="18" height="12" fill="#c60b1e" />
    <rect y="3" width="18" height="6" fill="#ffc400" />
  </svg>
);

export const Topbar: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: SHELL.sidebarW,
      top: 0,
      width: VIEW.w - SHELL.sidebarW,
      height: SHELL.topbarH,
      display: "flex",
      alignItems: "center",
      padding: "0 20px 0 30px",
      boxSizing: "border-box",
      fontFamily: font,
      fontSize: 12.5,
      color: c.text,
      gap: 12,
    }}
  >
    <Icon name="bars" size={15} color={c.muted} />
    <Icon name="home" size={14} color={c.primary} style={{ marginLeft: 8 }} />
    <span style={{ color: c.muted }}>/</span>
    <Icon name="folder" size={12} color={c.faint} />
    <span style={{ fontWeight: 500 }}>Administración</span>
    <span style={{ color: c.muted }}>/</span>
    <span style={{ color: c.primary, fontWeight: 500 }}>Pedidos</span>
    <div style={{ flex: 1 }} />
    <div
      style={{
        width: 70,
        height: 30,
        border: `1px solid ${c.border}`,
        borderRadius: 6,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 10px",
        boxSizing: "border-box",
      }}
    >
      <Flag />
      <Icon name="angle-down" size={11} color={c.muted} />
    </div>
    <div style={{ width: 30, height: 30, borderRadius: 15, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name="cog" size={13} color={c.muted} />
    </div>
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: 15,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: c.primary,
        fontWeight: 600,
        fontSize: 12,
      }}
    >
      aa
    </div>
  </div>
);
