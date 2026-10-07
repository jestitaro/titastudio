// Paso 3 · Resumen de pedido + envío. Las filas nacen de las filas de la tabla de productos
// (misma geometría de columnas), así el cambio de paso se lee como continuidad espacial.
import React from "react";
import { FORM, PRODUCTS_L, qtyStepper, SUMMARY } from "../animation/layout";
import { SceneState } from "../animation/scene-state";
import { c, font } from "../../qs-kit/design/tokens";
import { FINAL_LINES, money, ORDER, orderTotal, orderUnits, PRODUCTS } from "../data/mock-data";
import { colX, ProductValues, QtyStepper } from "./ProductTable";
import { Abs, Badge, Button, Centered, Icon, mix, StatusDot } from "../../qs-kit/ui/primitives";

const Sep = () => <span style={{ color: c.textStrong, margin: "0 12px" }}>|</span>;

export const OrderSummary: React.FC<{ s: SceneState }> = ({ s }) => {
  const S = s.summary;
  if (!S.visible) return null;
  const units = orderUnits();
  const lines = FINAL_LINES;
  const infoY = (1 - S.info) * 8;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: font, color: c.textStrong, opacity: S.opacity }}>
      {/* Badge de estado junto al título */}
      <Abs x={FORM.innerX + 172} y={SUMMARY.titleY - 12} h={24} style={{ display: "flex", alignItems: "center", opacity: S.badge, transform: `scale(${0.85 + 0.15 * S.badge})`, transformOrigin: "left center" }}>
        <Badge tone="neutral" label="Borrador" />
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
        {/* Todos los títulos a la izquierda, en el mismo x que su contenido */}
        {["Producto", "UxB", "Pres.", "PSL", "Desc. %", "P/Desc.", "Cantidad"].map((h, i) => (
          <div key={h} style={{ position: "absolute", left: colX(i) + 16, width: PRODUCTS_L.cols[i] - 16, color: c.muted, fontSize: 11.5 }}>
            {h}
          </div>
        ))}
      </Abs>

      {/* Filas: tabla → tarjetas */}
      {lines.map((line, k) => {
        const m = S.rowMorph(k);
        const y = S.rowFromY(k) + (S.rowToY(k) - S.rowFromY(k)) * m;
        const h = PRODUCTS_L.rowH + (SUMMARY.rowH - PRODUCTS_L.rowH) * m;
        const qx = qtyStepper(line.index).x - FORM.innerX;
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
            <div style={{ position: "absolute", left: qx, top: (h - 2 - PRODUCTS_L.stepH) / 2 }}>
              <QtyStepper value={String(line.qty)} active={1} />
            </div>
            <Icon name="trash" size={12} color={c.danger} style={{ position: "absolute", right: 12, top: (h - 2) / 2 - 6, opacity: m }} />
          </div>
        );
      })}

      {/* Enviar Pedido: superficie del botón + capas de estado (idle / enviando / enviado)
          superpuestas y centradas sobre el mismo rect. */}
      <Abs x={SUMMARY.send.x} y={SUMMARY.send.y} w={SUMMARY.send.w} h={SUMMARY.send.h} style={{ opacity: S.send.appear, transform: `scale(${S.send.scale})` }}>
        <Button label="" hover={S.send.hover} height={SUMMARY.send.h} style={{ width: SUMMARY.send.w, background: mix(c.primaryHover, c.primary, 0.3 * (1 - S.send.hover)) }} />
        {[
          { o: 1 - S.send.loading - S.send.sent, y: -S.send.loading * 6, content: <><Icon name="send" size={12} color="#fff" /><Centered>Enviar Pedido</Centered></> },
          {
            o: S.send.loading,
            y: (1 - S.send.loading) * 6 - S.send.sent * 6,
            content: (
              <>
                <svg width="13" height="13" viewBox="0 0 16 16" style={{ display: "block", transform: `rotate(${S.send.spin}deg)` }}>
                  <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                  <path d="M8 2a6 6 0 0 1 6 6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <Centered>Enviando…</Centered>
              </>
            ),
          },
          { o: S.send.sent, y: (1 - S.send.sent) * 6, content: <><Icon name="check" size={12} color="#fff" /><Centered>Enviado</Centered></> },
        ].map((layer, i) =>
          layer.o > 0.001 ? (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                color: "#fff",
                fontFamily: font,
                fontSize: 13,
                fontWeight: 500,
                opacity: layer.o,
                transform: `translateY(${layer.y}px)`,
              }}
            >
              {layer.content}
            </div>
          ) : null,
        )}
      </Abs>
    </div>
  );
};
