// Paso 2 · Selección de productos: tabla, edición de cantidad, validación y Continuar.
import React from "react";
import { FORM, PRODUCTS_L, qtyInput } from "../animation/layout";
import { SceneState } from "../animation/scene-state";
import { c, font } from "../design/tokens";
import { LINE_A, LINE_B, money, ORDER, Product, PRODUCTS } from "../data/mock-data";
import { Abs, Button, Caret, Icon, mix, Sk } from "./ui";

const HEAD: { label: string; sort?: boolean; info?: boolean }[] = [
  { label: "Producto", sort: true },
  { label: "UxB", sort: true },
  { label: "Pres.", sort: true },
  { label: "PSL" },
  { label: "Desc. %" },
  { label: "P/Desc. %" },
  { label: "", info: true },
  { label: "Cantidad" },
];
export const colX = (i: number) => PRODUCTS_L.cols.slice(0, i).reduce((a, b) => a + b, 0);

export const ImgThumb: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <div
    style={{
      width: size,
      height: size - 4,
      borderRadius: 3,
      background: "#d5dae2",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <Icon name="image" size={size * 0.52} color="#ffffff" />
  </div>
);

export const ProductCell: React.FC<{ p: Product }> = ({ p }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 6 }}>
    <ImgThumb />
    <div style={{ lineHeight: 1.25 }}>
      <div style={{ fontSize: 9.5, color: c.muted }}>{p.code}</div>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: c.textStrong }}>{p.name}</div>
    </div>
  </div>
);

const col = (i: number, children: React.ReactNode, align: "center" | "left" = "center", h = PRODUCTS_L.rowH) => (
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
      justifyContent: align === "center" ? "center" : "flex-start",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

export const ProductValues: React.FC<{ p: Product; h?: number }> = ({ p, h }) => (
  <>
    {col(0, <ProductCell p={p} />, "left", h)}
    {col(1, <span style={{ fontSize: 10.5, fontWeight: 700 }}>{p.uxb}</span>, "center", h)}
    {col(2, <span style={{ fontSize: 10.5, fontWeight: 700 }}>{p.pres}</span>, "center", h)}
    {col(3, <span style={{ fontSize: 10.5, fontWeight: 700 }}>{money(p.psl)}</span>, "center", h)}
    {col(4, <span style={{ fontSize: 10.5, fontWeight: 700 }}>N/A</span>, "center", h)}
    {col(5, <span style={{ fontSize: 10.5, fontWeight: 700 }}>{money(p.psl)}</span>, "center", h)}
  </>
);

export const QtyBox: React.FC<{ value: string; width: number; focus?: number; selected?: boolean; caret?: boolean; x?: number; y?: number }> = ({
  value,
  width,
  focus = 0,
  selected,
  caret,
  x,
  y,
}) => (
  <div
    style={{
      position: x === undefined ? "relative" : "absolute",
      left: x,
      top: y,
      width,
      height: 24,
      boxSizing: "border-box",
      border: `1px solid ${mix(c.borderInput, c.primary, focus)}`,
      boxShadow: focus > 0 ? `0 0 0 ${2.5 * focus}px ${c.primaryRing}` : "none",
      borderRadius: 5,
      background: "#fff",
      display: "flex",
      alignItems: "center",
      padding: "0 7px",
      fontSize: 12,
      color: c.textStrong,
      overflow: "hidden",
    }}
  >
    <span style={{ background: selected ? "rgba(127, 71, 236, 0.22)" : "transparent", padding: "0 1px" }}>{value}</span>
    {caret ? <Caret on height={13} /> : null}
  </div>
);

export const ProductTable: React.FC<{ s: SceneState }> = ({ s }) => {
  const P = s.products;
  if (!P.visible) return null;
  const hdrO = P.header.o * P.rest;
  const hdr: React.CSSProperties = { opacity: hdrO, transform: `translateY(${P.header.y}px)` };
  const tableTop = PRODUCTS_L.rowsY;
  const selectedRows = [LINE_A.index, LINE_B.index];
  const summaryStarted = P.exit > 0;

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
            padding: "0 10px",
            boxSizing: "border-box",
            fontSize: 12.5,
            color: c.muted,
          }}
        >
          Buscar
        </div>
        <div style={{ width: 32, height: 32, background: c.primary, borderRadius: "0 6px 6px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="search" size={12} color="#fff" />
        </div>
      </Abs>
      <Abs
        x={PRODUCTS_L.chip.x}
        y={PRODUCTS_L.chip.y}
        w={PRODUCTS_L.chip.w}
        h={PRODUCTS_L.chip.h}
        style={{
          ...hdr,
          background: "#dde2e8",
          borderRadius: 6,
          fontSize: 11.5,
          color: c.muted,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        Todas las
        <br />
        marcas
      </Abs>

      {/* Cabecera */}
      <Abs x={FORM.innerX} y={PRODUCTS_L.headY} w={FORM.innerW} h={32} style={{ ...hdr, borderBottom: `1px solid ${c.rowLine}` }}>
        {HEAD.map((h, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: colX(i),
              width: PRODUCTS_L.cols[i],
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {h.label}
            {h.sort ? <Icon name="sort-alt" size={10} color={c.muted} /> : null}
            {h.info ? <Icon name="info-circle" size={11} color={c.textStrong} /> : null}
          </div>
        ))}
      </Abs>

      {/* Filas */}
      <Abs x={FORM.innerX} y={tableTop} w={FORM.innerW} h={PRODUCTS_L.rowH * PRODUCTS_L.visibleRows} style={{ overflow: "hidden" }}>
        {PRODUCTS.slice(0, PRODUCTS_L.visibleRows).map((p, i) => {
          const rv = P.rowAt(i);
          const isSel = selectedRows.includes(i);
          if (isSel && summaryStarted) return null; // la fila pasa a la tarjeta del resumen
          const edit = P.edit && P.edit.row === i ? P.edit : null;
          const flash = P.flash(i);
          const bg = flash > 0 ? mix(P.hoverRow === i ? c.hover : "#ffffff", c.primary50, flash) : P.hoverRow === i ? c.hover : "transparent";
          const qr = qtyInput(i);
          const qx = qr.x - FORM.innerX;
          const w = edit ? PRODUCTS_L.qtyW + (PRODUCTS_L.qtyEditW - PRODUCTS_L.qtyW) * edit.open : PRODUCTS_L.qtyW;
          return (
            <div
              key={p.code}
              style={{
                position: "absolute",
                left: 0,
                top: i * PRODUCTS_L.rowH,
                width: FORM.innerW,
                height: PRODUCTS_L.rowH,
                borderBottom: `1px solid ${c.rowLine}`,
                background: bg,
                opacity: isSel ? 1 : P.rest,
              }}
            >
              {/* Barra lateral de confirmación */}
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: c.primary, opacity: flash }} />
              <div style={{ position: "absolute", inset: 0, opacity: rv, transform: `translateY(${(1 - rv) * 5}px)` }}>
                <ProductValues p={p} />
                <QtyBox
                  x={qx}
                  y={(PRODUCTS_L.rowH - 24) / 2}
                  width={w}
                  value={P.qty(i)}
                  focus={P.qtyFocus(i)}
                  selected={edit?.selected}
                  caret={edit?.caret}
                />
                {edit ? (
                  <div
                    style={{
                      position: "absolute",
                      left: qx + PRODUCTS_L.qtyEditW + 6,
                      top: (PRODUCTS_L.rowH - 22) / 2,
                      display: "flex",
                      gap: 4,
                      opacity: edit.open,
                      transform: `translateX(${(1 - edit.open) * -6}px)`,
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: mix("#ffffff", "#dcfce7", edit.checkHover),
                        transform: `scale(${edit.checkScale})`,
                      }}
                    >
                      <Icon name="check" size={11} color={c.success} />
                    </div>
                    <div style={{ width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="times" size={11} color={c.danger} />
                    </div>
                  </div>
                ) : null}
              </div>
              {P.skeleton * (1 - rv) > 0.01 ? (
                <div style={{ position: "absolute", inset: 0, opacity: P.skeleton * (1 - rv) }}>
                  <Sk w={26} h={22} r={3} style={{ position: "absolute", left: 6, top: 7 }} />
                  <Sk w={[150, 130, 170, 120][i % 4]} h={9} style={{ position: "absolute", left: 40, top: 13 }} />
                  {[1, 2, 3, 4, 5].map((k) => (
                    <Sk key={k} w={k === 3 || k === 5 ? 64 : 26} h={9} style={{ position: "absolute", left: colX(k) + PRODUCTS_L.cols[k] / 2 - (k === 3 || k === 5 ? 32 : 13), top: 13 }} />
                  ))}
                  <Sk w={PRODUCTS_L.qtyW} h={22} r={5} style={{ position: "absolute", left: qx, top: 7 }} />
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
          50 <Icon name="chevron-down" size={10} color={c.muted} />
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
          transform: `translateX(${(1 - P.invalid) * 10}px) scale(${1 + 0.03 * P.warnPulse})`,
          background: c.warnBg,
          border: `1px solid ${mix(c.warnBorder, "#f0c14b", P.warnPulse)}`,
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
