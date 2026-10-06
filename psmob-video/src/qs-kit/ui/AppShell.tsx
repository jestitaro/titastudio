// Layout de Apollo: sidebar de navegación + topbar con breadcrumb. Constante en todo el video:
// es el ancla espacial que hace que el flujo se lea como "dentro del producto".
import React from "react";
import { Img, staticFile } from "remotion";
import { SHELL, VIEW } from "../motion/viewport";
import { c, font } from "../design/tokens";
import { Icon } from "./primitives";

// Menú lateral actual de Apollo, por secciones. Cada video marca el ítem activo.
export type NavItem = { label: string; caret?: boolean };
export type NavSection = { title: string; items: NavItem[] };

export const APOLLO_NAV: NavSection[] = [
  { title: "SISTEMA", items: [{ label: "Parametrización", caret: true }, { label: "Seguridad", caret: true }] },
  { title: "PEDIDOS", items: [{ label: "Pedidos" }, { label: "Pedidos Pendientes" }] },
  { title: "CLIENTES", items: [{ label: "Clientes" }] },
  {
    title: "PRODUCTOS",
    items: [{ label: "Productos" }, { label: "Gestor de Descuentos" }, { label: "Productos Deshabilitados por Cliente" }, { label: "Importador" }],
  },
];

// Logo oficial QuartzSales full color (public/logo-qs-fullcolor.svg, 1313×248).
const Logo: React.FC = () => <Img src={staticFile("logo-qs-fullcolor.svg")} style={{ width: 148, height: 148 * (248 / 1313), display: "block" }} />;

export const Sidebar: React.FC<{ nav?: NavSection[]; active: string }> = ({ nav = APOLLO_NAV, active }) => (
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
    <div style={{ paddingLeft: 4 }}>
      <Logo />
    </div>
    <div style={{ marginTop: 26 }}>
      {nav.map((sec) => (
        <div key={sec.title} style={{ marginTop: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: c.primary, letterSpacing: 0.3, height: 22, display: "flex", alignItems: "center" }}>{sec.title}</div>
          {sec.items.map((n) => (
            <div
              key={n.label}
              style={{
                minHeight: 30,
                padding: "5px 18px 5px 0",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 12.5,
                lineHeight: 1.3,
                color: c.textStrong,
                fontWeight: n.label === active ? 600 : 400,
              }}
            >
              <span>{n.label}</span>
              {n.caret ? <Icon name="angle-down" size={11} color={c.muted} /> : null}
            </div>
          ))}
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

// breadcrumb: secciones intermedias + página actual (la última va en violeta).
export const Topbar: React.FC<{ crumbs: string[]; avatar?: string }> = ({ crumbs, avatar = "PP" }) => (
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
    {crumbs.slice(0, -1).map((cr) => (
      <React.Fragment key={cr}>
        <Icon name="folder" size={12} color={c.faint} />
        <span style={{ fontWeight: 500 }}>{cr}</span>
        <span style={{ color: c.muted }}>/</span>
      </React.Fragment>
    ))}
    <span style={{ color: c.primary, fontWeight: 500 }}>{crumbs[crumbs.length - 1]}</span>
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
      {avatar}
    </div>
  </div>
);
