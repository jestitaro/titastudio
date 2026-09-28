// Paso 2 · Selección de productos, versión con mejoras de UX:
// filas de 52 px, thumbnails reales, nombre + metadata liviana, precios alineados a la derecha
// y stepper de cantidad [− n +]. Misma identidad visual (Lara violeta, Poppins, PrimeIcons).
import React from "react";
import { Img } from "remotion";
import { FORM, productColX, PRODUCTS_L, qtyStepper } from "../animation/layout";
import { SceneState } from "../animation/scene-state";
import { c, font } from "../design/tokens";
import { FINAL_LINES, money, ORDER, Product, PRODUCTS } from "../data/mock-data";
import { productImage } from "../data/catalog";
import { Abs, Button, Caret, Icon, mix, Sk } from "./ui";

type Align = "left" | "center" | "right";
const HEAD: { label: string; sort?: boolean; align: Align }[] = [
  { label: "Producto", sort: true, align: "left" },
  { label: "UxB", align: "center" },
  { label: "Pres.", align: "center" },
  { label: "PSL", align: "right" },
  { label: "Desc. %", align: "center" },
  { label: "P/Desc.", align: "right" },
  { label: "Cantidad", align: "center" },
];
export const colX = productColX;
const CELL_PAD = 16;

export const Thumb: React.FC<{ p: Product; w?: number; h?: number }> = ({ p, w = 36, h = 40 }) => (
  <div style={{ width: w, height: h, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#f3f5f9" }}>
    <Img src={productImage(p)} style={{ width: w, height: h, objectFit: "cover", display: "block" }} />
  </div>
);

export const ProductCell: React.FC<{ p: Product }> = ({ p }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: CELL_PAD }}>
    <Thumb p={p} />
    <div style={{ lineHeight: 1.3, minWidth: 0 }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: c.textStrong }}>{p.name}</div>
      <div style={{ fontSize: 10.5, color: c.faint, marginTop: 1 }}>
        {p.sku} · EAN {p.ean}
      </div>
    </div>
  </div>
);

const cell = (i: number, children: React.ReactNode, align: Align, h: number) => (
  <div
    key={i}
    style={{
      position: "absolute",
      left: colX(i),
      width: PRODUCTS_L.cols[i],
      top: 0,
      height: h,
      display: "flex",
      alignItems: "center",
      justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
      paddingRight: align === "right" ? CELL_PAD : 0,
      boxSizing: "border-box",
      whiteSpace: "nowrap",
      fontVariantNumeric: "tabular-nums",
    }}
  >
    {children}
  </div>
);

export const ProductValues: React.FC<{ p: Product; h?: number }> = ({ p, h = PRODUCTS_L.rowH }) => (
  <>
    {cell(0, <ProductCell p={p} />, "left", h)}
    {cell(1, <span style={{ fontSize: 12, color: c.text }}>{p.uxb}</span>, "center", h)}
    {cell(2, <span style={{ fontSize: 12, color: c.text }}>{p.pres}</span>, "center", h)}
    {cell(3, <span style={{ fontSize: 12.5, color: c.text }}>{money(p.psl)}</span>, "right", h)}
    {cell(4, <span style={{ fontSize: 11.5, color: c.faint }}>—</span>, "center", h)}
    {cell(5, <span style={{ fontSize: 12.5, fontWeight: 600, color: c.textStrong }}>{money(p.psl)}</span>, "right", h)}
  </>
);

// Stepper [− n +]. Estados como números 0..1.
export const QtyStepper: React.FC<{
  value: string;
  w?: number;
  h?: number;
  btn?: number;
  active?: number;
  focus?: number;
  selected?: boolean;
  caret?: boolean;
  tick?: number;
  minus?: { hover: number; scale: number } | null;
  plus?: { hover: number; scale: number } | null;
  fontSize?: number;
}> = ({ value, w = PRODUCTS_L.stepW, h = PRODUCTS_L.stepH, btn = PRODUCTS_L.stepBtn, active = 0, focus = 0, selected, caret, tick = 0, minus, plus, fontSize = 12.5 }) => {
  const zero = value === "0";
  const btnStyle = (hover: number, scale: number, disabled: boolean): React.CSSProperties => ({
    width: btn,
    height: h - 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: mix("#ffffff", c.primary50, hover),
    color: disabled ? "#c3cad5" : mix(c.muted, c.primary, Math.max(hover, active * 0.6)),
    transform: `scale(${scale})`,
  });
  return (
    <div
      style={{
        width: w,
        height: h,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        borderRadius: 8,
        border: `1px solid ${mix(mix(c.borderInput, "#c9b3f7", active), c.primary, focus)}`,
        boxShadow: focus > 0 ? `0 0 0 ${3 * focus}px ${c.primaryRing}` : "none",
        background: "#fff",
        overflow: "hidden",
      }}
    >
      <div style={btnStyle(minus?.hover ?? 0, minus?.scale ?? 1, zero)}>
        <Icon name="minus" size={fontSize - 3.5} />
      </div>
      <div
        style={{
          flex: 1,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderLeft: `1px solid ${c.rowLine}`,
          borderRight: `1px solid ${c.rowLine}`,
          fontSize,
          fontWeight: active > 0.5 ? 600 : 400,
          color: mix(zero ? c.faint : c.textStrong, c.primary, tick * 0.8),
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span style={{ background: selected ? "rgba(127, 71, 236, 0.22)" : "transparent", padding: "0 2px", transform: `translateY(${tick * 4}px)` }}>{value}</span>
        {caret ? <Caret on height={fontSize + 1} /> : null}
      </div>
      <div style={btnStyle(plus?.hover ?? 0, plus?.scale ?? 1, false)}>
        <Icon name="plus" size={fontSize - 3.5} />
      </div>
    </div>
  );
};

export const ProductTable: React.FC<{ s: SceneState }> = ({ s }) => {
  const P = s.products;
  if (!P.visible) return null;
  const hdrO = P.header.o * P.rest;
  const hdr: React.CSSProperties = { opacity: hdrO, transform: `translateY(${P.header.y}px)` };
  const summaryRows = FINAL_LINES.map((l) => l.index); // filas que pasan al resumen
  const summaryStarted = P.exit > 0;
  const RH = PRODUCTS_L.rowH;

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: font, color: c.textStrong }}>
      {/* Buscador + marcas */}
      <Abs x={PRODUCTS_L.search.x} y={PRODUCTS_L.search.y} style={{ ...hdr, display: "flex" }}>
        <div
          style={{
            width: PRODUCTS_L.search.w - 32,
            height: 32,
            border: `1px solid ${c.borderInput}`,
            borderRight: "none",
            borderRadius: "6px 0 0 6px",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            boxSizing: "border-box",
            fontSize: 12.5,
            color: c.muted,
          }}
        >
          Buscar por nombre, SKU o EAN
        </div>
        <div style={{ width: 32, height: 32, background: c.primary, borderRadius: "0 6px 6px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="search" size={12} color="#fff" />
        </div>
      </Abs>
      <Abs
        x={PRODUCTS_L.chip.x}
        y={PRODUCTS_L.chip.y + 4}
        h={28}
        style={{
          ...hdr,
          background: c.primary50,
          border: `1px solid ${c.primary100}`,
          borderRadius: 14,
          padding: "0 12px",
          fontSize: 11.5,
          fontWeight: 500,
          color: c.primary,
          display: "flex",
          alignItems: "center",
          gap: 6,
          whiteSpace: "nowrap",
        }}
      >
        <Icon name="tags" size={10} /> Todas las marcas
      </Abs>

      {/* Cabecera */}
      <Abs x={FORM.innerX} y={PRODUCTS_L.headY} w={FORM.innerW} h={32} style={{ ...hdr, borderBottom: `1px solid ${c.border}` }}>
        {HEAD.map((h, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: colX(i) + (h.align === "left" ? CELL_PAD : 0),
              width: PRODUCTS_L.cols[i] - (h.align === "left" ? CELL_PAD : 0),
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: h.align === "center" ? "center" : h.align === "right" ? "flex-end" : "flex-start",
              paddingRight: h.align === "right" ? CELL_PAD : 0,
              boxSizing: "border-box",
              gap: 8,
              fontSize: 11.5,
              fontWeight: 600,
              color: c.muted,
            }}
          >
            {h.label}
            {h.sort ? <Icon name="sort-alt" size={9} color={c.faint} /> : null}
          </div>
        ))}
      </Abs>

      {/* Filas */}
      <Abs x={FORM.innerX} y={PRODUCTS_L.rowsY} w={FORM.innerW} h={RH * PRODUCTS_L.visibleRows} style={{ overflow: "hidden" }}>
        {PRODUCTS.slice(0, PRODUCTS_L.visibleRows).map((p, i) => {
          const rv = P.rowAt(i);
          if (summaryRows.includes(i) && summaryStarted) return null; // la fila pasa a la tarjeta del resumen
          const active = P.active(i);
          const flash = P.flash(i);
          const hover = P.hoverRow === i ? 1 : 0;
          const bg = mix(mix(mix("#ffffff", c.hover, hover), "#faf7ff", active), c.primary50, flash);
          const typing = P.typing(i);
          const st = qtyStepper(i);
          return (
            <div
              key={p.sku}
              style={{
                position: "absolute",
                left: 0,
                top: i * RH,
                width: FORM.innerW,
                height: RH,
                borderBottom: `1px solid ${c.rowLine}`,
                boxSizing: "border-box",
                background: rv > 0.01 ? bg : "transparent",
                opacity: summaryRows.includes(i) ? 1 : P.rest,
              }}
            >
              {/* Acento lateral de fila seleccionada */}
              <div style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 3, borderRadius: 2, background: c.primary, opacity: Math.max(active, flash) * rv }} />
              <div style={{ position: "absolute", inset: 0, opacity: rv, transform: `translateY(${(1 - rv) * 6}px)` }}>
                <ProductValues p={p} />
                <div style={{ position: "absolute", left: st.x - FORM.innerX, top: (RH - PRODUCTS_L.stepH) / 2 }}>
                  <QtyStepper
                    value={P.qty(i)}
                    active={active}
                    focus={typing?.focus ?? 0}
                    selected={typing?.selected}
                    caret={typing?.caret}
                    tick={P.valueTick(i)}
                    plus={P.plus.row === i ? P.plus : null}
                  />
                </div>
              </div>
              {P.skeleton * (1 - rv) > 0.01 ? (
                <div style={{ position: "absolute", inset: 0, opacity: P.skeleton * (1 - rv) }}>
                  <Sk w={36} h={40} r={8} style={{ position: "absolute", left: CELL_PAD, top: 6 }} />
                  <Sk w={[150, 130, 170, 120][i % 4]} h={10} style={{ position: "absolute", left: CELL_PAD + 48, top: 14 }} />
                  <Sk w={110} h={8} style={{ position: "absolute", left: CELL_PAD + 48, top: 31 }} />
                  {[1, 2, 3, 5].map((k) => (
                    <Sk key={k} w={k >= 3 ? 64 : 22} h={9} style={{ position: "absolute", left: colX(k) + PRODUCTS_L.cols[k] / 2 - (k >= 3 ? 32 : 11), top: 21 }} />
                  ))}
                  <Sk w={PRODUCTS_L.stepW} h={PRODUCTS_L.stepH} r={8} style={{ position: "absolute", left: st.x - FORM.innerX, top: (RH - PRODUCTS_L.stepH) / 2 }} />
                </div>
              ) : null}
            </div>
          );
        })}
      </Abs>

      {/* Paginador */}
      <Abs x={FORM.innerX} y={PRODUCTS_L.pagerY} w={FORM.innerW} h={32} style={{ ...hdr, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, fontSize: 12, color: c.muted }}>
        <Icon name="angle-double-left" size={11} color={c.faint} />
        <Icon name="angle-left" size={11} color={c.faint} />
        <div style={{ width: 28, height: 28, borderRadius: 14, background: c.primary50, color: c.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>1</div>
        <span>2</span>
        <span>3</span>
        <Icon name="angle-right" size={11} />
        <Icon name="angle-double-right" size={11} />
        <div style={{ width: 64, height: 30, border: `1px solid ${c.borderInput}`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px", boxSizing: "border-box", color: c.textStrong }}>
          10 <Icon name="chevron-down" size={10} color={c.muted} />
        </div>
      </Abs>

      {/* Validación de monto mínimo + Continuar */}
      <Abs
        x={PRODUCTS_L.continueBtn.x - 12 - 262}
        y={PRODUCTS_L.continueBtn.y}
        w={262}
        h={PRODUCTS_L.continueBtn.h}
        style={{
          opacity: P.invalid * hdrO,
          transform: `translateX(${(1 - P.invalid) * 10}px)`,
          background: c.warnBg,
          border: `1px solid ${c.warnBorder}`,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
          fontSize: 12,
          color: c.warnText,
          boxSizing: "border-box",
        }}
      >
        <Icon name="exclamation-circle" size={12} color={c.warnText} />
        Monto mínimo de pedido: {money(ORDER.minAmount)}.
      </Abs>
      <Abs x={PRODUCTS_L.continueBtn.x} y={PRODUCTS_L.continueBtn.y} style={hdr}>
        <Button
          label="Continuar"
          icon="save"
          enabled={P.continueBtn.enabled}
          hover={P.continueBtn.hover}
          scale={P.continueBtn.scale}
          height={PRODUCTS_L.continueBtn.h}
          style={{ width: PRODUCTS_L.continueBtn.w }}
        />
      </Abs>
    </div>
  );
};
