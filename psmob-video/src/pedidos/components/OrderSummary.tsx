// Paso 3 · Resumen de pedido + envío. Las filas nacen de las filas de la tabla de productos
// (misma geometría de columnas), así el cambio de paso se lee como continuidad espacial.
import React from "react";
import { FORM, PRODUCTS_L, qtyInput, SUMMARY } from "../animation/layout";
import { SceneState } from "../animation/scene-state";
import { c, font } from "../design/tokens";
import { LINE_A, LINE_B, money, ORDER, orderTotal, PRODUCTS } from "../data/mock-data";
import { StatusDot } from "./CartSummary";
import { colX, ProductValues, QtyBox } from "./ProductTable";
import { Abs, Badge, Button, Icon, mix } from "./ui";

const Sep = () => <span style={{ color: c.textStrong, margin: "0 12px" }}>|</span>;

export const OrderSummary: React.FC<{ s: SceneState }> = ({ s }) => {
  const S = s.summary;
  if (!S.visible) return null;
  const units = LINE_A.qty + LINE_B.qty;
  const lines = [LINE_A, LINE_B];
  const infoY = (1 - S.info) * 8;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: font, color: c.textStrong, opacity: S.opacity }}>
      {/* Badge de estado junto al título */}
      <Abs x={FORM.innerX + 172} y={SUMMARY.titleY - 10} style={{ opacity: S.badge, transform: `scale(${0.85 + 0.15 * S.badge})`, transformOrigin: "left center" }}>
        <Badge status="borrador" />
      </Abs>

      {/* Caja de información del pedido */}
      <Abs
        x={SUMMARY.info.x}
        y={SUMMARY.info.y}
        w={SUMMARY.info.w}
        h={SUMMARY.info.h}
        style={{
          border: `1px solid ${c.border}`,
          borderRadius: 10,
          boxSizing: "border-box",
          opacity: S.info,
          transform: `translateY(${infoY}px)`,
          clipPath: `inset(0 0 ${(1 - S.info) * 60}% 0 round 10px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 12,
            top: 10,
            left: 12,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            fontSize: 12.5,
            paddingBottom: 8,
            borderBottom: `1px solid ${c.rowLine}`,
          }}
        >
          <Icon name="tag" size={11} style={{ marginRight: 6 }} /> Unidades: {units}
          <Sep />
          <Icon name="box" size={11} style={{ marginRight: 6 }} /> Cajas: {units}
          <Sep />
          <span style={{ fontWeight: 700, marginRight: 8 }}>Total</span>
          <StatusDot invalid={0} />
          <span style={{ marginLeft: 6 }}>{money(orderTotal())}</span>
        </div>
        <div style={{ position: "absolute", left: 22, top: 56, display: "flex", alignItems: "center", fontSize: 12.5 }}>
          <Icon name="file" size={12} color={c.primary} style={{ marginRight: 6 }} />
          Número de Orden de Compra: <b style={{ marginLeft: 5 }}>{ORDER.purchaseOrder}</b>
          <Sep />
          <Icon name="building" size={12} color={c.primary} style={{ marginRight: 6 }} />
          Cliente: <b style={{ marginLeft: 5 }}>{ORDER.client}</b>
          <Sep />
          <Icon name="sitemap" size={12} color={c.primary} style={{ marginRight: 6 }} />
          Sucursal: <b style={{ marginLeft: 5 }}>{ORDER.branch}</b>
        </div>
      </Abs>

      {/* Cabecera */}
      <Abs x={FORM.innerX} y={SUMMARY.headY} w={FORM.innerW} h={24} style={{ opacity: S.head, fontSize: 12, fontWeight: 600 }}>
        {["Producto", "UxB", "Pres.", "PSL", "Desc. %", "P/Desc.%", "", "Cantidad"].map((h, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: colX(i) + (i === 0 ? 8 : 0),
              width: PRODUCTS_L.cols[i],
              display: "flex",
              justifyContent: i === 0 ? "flex-start" : "center",
            }}
          >
            {h}
          </div>
        ))}
      </Abs>

      {/* Filas: tabla → tarjetas */}
      {lines.map((line, k) => {
        const m = S.rowMorph(k);
        const y = S.rowFromY(k) + (S.rowToY(k) - S.rowFromY(k)) * m;
        const h = PRODUCTS_L.rowH + (SUMMARY.rowH - PRODUCTS_L.rowH) * m;
        const qx = qtyInput(line.index).x - FORM.innerX;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: FORM.innerX,
              top: y,
              width: FORM.innerW,
              height: h,
              boxSizing: "border-box",
              borderRadius: 10 * m,
              border: `1px solid ${mix("#ffffff", c.border, m)}`,
              background: "#fff",
              boxShadow: m > 0 && m < 1 ? `0 ${6 * Math.sin(Math.PI * m)}px ${18 * Math.sin(Math.PI * m)}px rgba(15, 23, 42, ${0.08 * Math.sin(Math.PI * m)})` : "none",
            }}
          >
            <ProductValues p={PRODUCTS[line.index]} h={h - 2} />
            <QtyBox x={qx} y={(h - 2 - 24) / 2} width={PRODUCTS_L.qtyW} value={String(line.qty)} />
            <Icon name="trash" size={12} color={c.danger} style={{ position: "absolute", right: 18, top: (h - 2) / 2 - 6, opacity: m }} />
          </div>
        );
      })}

      {/* Enviar Pedido */}
      <Abs x={SUMMARY.send.x} y={SUMMARY.send.y} style={{ opacity: S.send.appear }}>
        <Button
          label=""
          hover={S.send.hover}
          scale={S.send.scale}
          height={SUMMARY.send.h}
          style={{ width: SUMMARY.send.w, position: "relative", background: mix(c.primaryHover, c.primary, 0.3 * (1 - S.send.hover)) }}
        >
          {/* Idle */}
          <span style={{ position: "absolute", display: "flex", gap: 7, alignItems: "center", opacity: 1 - S.send.loading - S.send.sent, transform: `translateY(${-S.send.loading * 6}px)` }}>
            <Icon name="send" size={12} /> Enviar Pedido
          </span>
          {/* Loading */}
          <span style={{ position: "absolute", display: "flex", gap: 8, alignItems: "center", opacity: S.send.loading, transform: `translateY(${(1 - S.send.loading) * 6 - S.send.sent * 6}px)` }}>
            <svg width="13" height="13" viewBox="0 0 16 16" style={{ transform: `rotate(${S.send.spin}deg)` }}>
              <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
              <path d="M8 2a6 6 0 0 1 6 6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Enviando…
          </span>
          {/* Enviado */}
          <span style={{ position: "absolute", display: "flex", gap: 7, alignItems: "center", opacity: S.send.sent, transform: `translateY(${(1 - S.send.sent) * 6}px)` }}>
            <Icon name="check" size={12} /> Enviado
          </span>
        </Button>
      </Abs>
    </div>
  );
};
