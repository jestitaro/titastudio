// Carrito lateral: Total, Unidades, Cajas y líneas del pedido.
import React from "react";
import { CART } from "../animation/layout";
import { SceneState } from "../animation/scene-state";
import { c, font, shadow } from "../design/tokens";
import { money } from "../data/mock-data";
import { Icon, mix } from "./ui";

export const StatusDot: React.FC<{ invalid: number; size?: number }> = ({ invalid, size = 13 }) => (
  <div style={{ position: "relative", width: size, height: size }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: size, background: c.success, opacity: 1 - invalid, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name="check" size={size * 0.55} color="#fff" style={{ fontWeight: 700 }} />
    </div>
    <div style={{ position: "absolute", inset: 0, borderRadius: size, background: c.warn, opacity: invalid, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: size * 0.7, fontWeight: 700 }}>
      !
    </div>
  </div>
);

export const CartSummary: React.FC<{ s: SceneState }> = ({ s }) => {
  const C = s.cart;
  if (C.opacity <= 0) return null;
  const { rect } = C;
  let y = CART.itemsY - rect.y;
  return (
    <div
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        background: c.card,
        borderRadius: 12,
        boxShadow: shadow.card,
        opacity: C.opacity,
        transform: `translateY(${C.y}px)`,
        fontFamily: font,
        color: c.textStrong,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: CART.innerX - rect.x, width: CART.innerW, top: CART.totalY - rect.y }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 8, borderBottom: `1px solid ${c.rowLine}` }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Total</span>
          <StatusDot invalid={C.invalid} />
          <div style={{ flex: 1 }} />
          <span
            style={{
              fontSize: 14,
              fontVariantNumeric: "tabular-nums",
              color: mix(c.textStrong, c.primary, Math.min(1, C.totalFlash)),
            }}
          >
            {money(C.total)}
          </span>
          <Icon name="chevron-up" size={10} color={c.faint} style={{ marginLeft: 10 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 12.5, fontVariantNumeric: "tabular-nums" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="tag" size={11} /> Unidades: {C.units}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="box" size={11} /> Cajas: {C.boxes}
          </span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: CART.itemsY - rect.y + 4,
          textAlign: "center",
          fontSize: 12.5,
          color: c.text,
          opacity: C.empty,
        }}
      >
        Carrito Vacio
      </div>

      {C.items.map((it, i) => {
        const top = y;
        y += CART.itemH * it.p;
        if (it.p <= 0.001) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: CART.innerX - rect.x - 8,
              width: CART.innerW + 16,
              top,
              height: (CART.itemH - 6) * it.p,
              overflow: "hidden",
              opacity: it.p,
              transform: `translateX(${(1 - it.p) * 14}px)`,
              borderRadius: 6,
              background: mix("#ffffff", c.primary50, it.flash),
            }}
          >
            <div style={{ position: "absolute", left: 8, top: 8, fontSize: 10, fontWeight: 700 }}>{it.product.name}</div>
            <div style={{ position: "absolute", left: 8, top: 26, display: "flex", alignItems: "center", width: CART.innerW }}>
              <div
                style={{
                  width: 110,
                  height: 22,
                  border: `1px solid ${c.borderInput}`,
                  borderRadius: 5,
                  fontSize: 11.5,
                  padding: "0 7px",
                  display: "flex",
                  alignItems: "center",
                  boxSizing: "border-box",
                }}
              >
                {it.qty}
              </div>
              <span style={{ marginLeft: 22, fontSize: 10.5, fontWeight: 700 }}>{money(it.product.psl)}</span>
              <div style={{ flex: 1 }} />
              <Icon name="trash" size={11} color={c.danger} />
            </div>
            <div style={{ position: "absolute", left: 8, right: 8, bottom: -3, height: 1, background: c.rowLine }} />
          </div>
        );
      })}
    </div>
  );
};
