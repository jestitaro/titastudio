// Panel lateral "Resumen del Pedido": métricas, líneas editables (stepper + eliminar) y total.
// Es el destino del zoom clave del video: la jerarquía está pensada para leerse ampliada.
import React from "react";
import { CART } from "../animation/layout";
import { SceneState } from "../animation/scene-state";
import { c, font, shadow } from "../../qs-kit/design/tokens";
import { money } from "../data/mock-data";
import { QtyStepper, Thumb } from "./ProductTable";
import { Icon, mix } from "../../qs-kit/ui/primitives";

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

const Stat: React.FC<{ icon: string; label: string; value: number; flash: number }> = ({ icon, label, value, flash }) => (
  <div
    style={{
      flex: 1,
      height: CART.statsH,
      borderRadius: 8,
      background: mix("#f7f8fb", c.primary50, flash),
      border: `1px solid ${mix("#edf0f5", c.primary100, flash)}`,
      padding: "6px 12px",
      boxSizing: "border-box",
    }}
  >
    <div style={{ fontSize: 10.5, color: c.muted, display: "flex", alignItems: "center", gap: 5 }}>
      <Icon name={icon} size={9.5} /> {label}
    </div>
    <div style={{ fontSize: 15, fontWeight: 600, color: c.textStrong, fontVariantNumeric: "tabular-nums", marginTop: 1 }}>{value}</div>
  </div>
);

export const CartSummary: React.FC<{ s: SceneState }> = ({ s }) => {
  const C = s.cart;
  if (C.opacity <= 0) return null;
  const { rect } = C;
  const I = CART.item;
  const rx = (x: number) => x - rect.x;
  const ry = (y: number) => y - rect.y;
  let y = CART.itemsY;
  const flashTotal = Math.min(1, C.totalFlash);

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
        // En el zoom, un borde apenas más marcado ayuda a leer el panel como foco.
        boxShadow: `${shadow.card}, 0 0 0 ${C.focus}px ${mix("#ffffff", c.primary100, C.focus)}`,
        opacity: C.opacity,
        transform: `translateY(${C.y}px)`,
        fontFamily: font,
        color: c.textStrong,
        overflow: "hidden",
      }}
    >
      {/* Total (encabeza el panel, como en el producto) */}
      <div
        style={{
          position: "absolute",
          left: rx(CART.innerX),
          width: CART.innerW,
          top: ry(CART.totalY),
          height: 36,
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: `1px solid ${c.border}`,
          paddingBottom: 8,
        }}
      >
        <span style={{ fontSize: 14.5, fontWeight: 600 }}>Total</span>
        <StatusDot invalid={C.invalid} size={14} />
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 19, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: mix(c.textStrong, c.primary, flashTotal) }}>{money(C.total)}</span>
      </div>

      {/* Métricas */}
      <div style={{ position: "absolute", left: rx(CART.innerX), width: CART.innerW, top: ry(CART.statsY), display: "flex", gap: 10 }}>
        <Stat icon="tag" label="Unidades" value={C.units} flash={flashTotal * 0.8} />
        <Stat icon="box" label="Cajas" value={C.boxes} flash={flashTotal * 0.8} />
      </div>

      {/* Vacío */}
      <div style={{ position: "absolute", left: 0, right: 0, top: ry(CART.itemsY) + 36, textAlign: "center", opacity: C.empty }}>
        <Icon name="shopping-cart" size={20} color="#c9d0da" />
        <div style={{ fontSize: 12, color: c.muted, marginTop: 8 }}>Todavía no agregaste productos</div>
      </div>

      {/* Líneas */}
      {C.items.map((it) => {
        const top = y;
        y += CART.itemH * it.size;
        if (it.size <= 0.001) return null;
        const bg = mix(mix("#ffffff", c.primary50, it.flash), "#fef2f2", it.danger);
        return (
          <div
            key={it.product.sku}
            style={{
              position: "absolute",
              left: rx(CART.innerX) - 8,
              width: CART.innerW + 16,
              top: ry(top),
              height: CART.itemH * it.size,
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", inset: "0 0 4px 0", borderRadius: 10, background: bg, opacity: it.o, transform: `translateX(${it.x}px)` }}>
              <div style={{ position: "absolute", left: 8, top: 8 }}>
                <Thumb p={it.product} w={I.thumbW} h={I.thumbH} />
              </div>
              <div style={{ position: "absolute", left: 8 + I.textX, top: 8, right: 8 + I.trash + 8, lineHeight: 1.3 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.product.name}</div>
                <div style={{ fontSize: 10.5, color: c.faint }}>{money(it.product.psl)} c/u</div>
              </div>
              {/* Eliminar */}
              <div
                style={{
                  position: "absolute",
                  right: 8,
                  top: 6,
                  width: I.trash,
                  height: I.trash,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: mix("#ffffff", "#fee2e2", it.trash?.hover ?? 0),
                  transform: `scale(${it.trash?.scale ?? 1})`,
                }}
              >
                <Icon name="trash" size={11} color={mix("#f08a8a", c.danger, it.trash?.hover ?? 0)} />
              </div>
              <div style={{ position: "absolute", left: 8 + I.textX, top: I.stepY }}>
                <QtyStepper value={String(it.qty)} w={I.stepW} h={I.stepH} btn={I.stepBtn} active={1} tick={it.tick} minus={it.minus} fontSize={11.5} />
              </div>
              <div
                style={{
                  position: "absolute",
                  right: 8,
                  top: I.stepY,
                  height: I.stepH,
                  display: "flex",
                  alignItems: "center",
                  fontSize: 12.5,
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                  color: mix(c.textStrong, c.primary, it.tick),
                }}
              >
                {money(it.subtotal)}
              </div>
            </div>
            <div style={{ position: "absolute", left: 8, right: 8, bottom: 1, height: 1, background: c.rowLine, opacity: it.o }} />
          </div>
        );
      })}
    </div>
  );
};
