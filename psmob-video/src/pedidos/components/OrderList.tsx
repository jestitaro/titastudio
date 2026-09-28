// Listado de pedidos (pantalla inicial y de cierre).
import React from "react";
import { CARD, LIST } from "../animation/layout";
import { SceneState } from "../animation/scene-state";
import { c, font } from "../design/tokens";
import { money, ORDER, OrderRow, ORDERS } from "../data/mock-data";
import { Abs, Badge, Button, Icon, mix, Sk } from "./ui";

const HEAD = ["Fecha", "Numero de Pedido", "Cliente", "Sucursal", "Total", "Estado", "Acciones"];
const SORTABLE = [true, true, false, false, false, false, false];
const colX = (i: number) => LIST.cols.slice(0, i).reduce((a, b) => a + b, 0);

const NEW_ORDER: OrderRow = {
  date: ORDER.date,
  number: ORDER.number,
  client: ORDER.client,
  branch: ORDER.branch,
  total: 0, // se completa en render con el total del pedido
  status: "borrador",
};

const cell = (i: number, children: React.ReactNode, align: "left" | "center" = "left") => (
  <div
    key={i}
    style={{
      position: "absolute",
      left: colX(i) + (align === "left" ? 12 : 0),
      width: LIST.cols[i] - (align === "left" ? 12 : 0),
      top: 0,
      height: LIST.rowH,
      display: "flex",
      alignItems: "center",
      justifyContent: align === "center" ? "center" : "flex-start",
      whiteSpace: "nowrap",
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

const Row: React.FC<{
  row: OrderRow;
  y: number;
  reveal: number;
  skeleton: number;
  badge: number;
  hover?: boolean;
  highlight?: number;
  isNew?: boolean;
}> = ({ row, y, reveal, skeleton, badge, hover, highlight = 0, isNew }) => {
  const bg = highlight > 0 ? mix("#ffffff", c.primary50, highlight) : hover ? c.hover : "transparent";
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: LIST.innerW, height: LIST.rowH, background: bg, borderBottom: `1px solid ${c.rowLine}` }}>
      {skeleton > 0.01 ? (
        <div style={{ position: "absolute", inset: 0, opacity: skeleton }}>
          {cell(0, <Sk w={74} h={10} />)}
          {cell(1, <Sk w={34} h={10} />)}
          {cell(2, <Sk w={170} h={10} />)}
          {cell(3, <Sk w={140} h={10} />)}
          {cell(4, <Sk w={80} h={10} />)}
          {cell(5, <Sk w={96} h={16} r={6} />, "center")}
          {cell(6, <Sk w={66} h={22} r={6} />, "center")}
        </div>
      ) : null}
      <div style={{ position: "absolute", inset: 0, opacity: reveal, transform: `translateY(${(1 - reveal) * 6}px)`, fontSize: 12.5, color: c.text }}>
        {cell(0, row.date)}
        {cell(1, row.number)}
        {cell(2, row.client)}
        {cell(3, row.branch)}
        {cell(4, money(row.total))}
        {cell(
          5,
          <div style={{ position: "relative" }}>
            <Sk w={96} h={16} r={6} style={{ position: "absolute", left: "50%", top: 2, marginLeft: -48, opacity: 1 - badge }} />
            <Badge status={row.status} style={{ opacity: badge, transform: `scale(${0.9 + 0.1 * badge})` }} />
          </div>,
          "center",
        )}
        {cell(
          6,
          <Button
            label={isNew ? "Editar" : "Detalle"}
            icon={isNew ? "pencil" : "eye"}
            variant="outlined"
            height={24}
            fontSize={11.5}
            style={{ padding: "0 10px", gap: 5 }}
          />,
          "center",
        )}
      </div>
    </div>
  );
};

export const OrderList: React.FC<{ s: SceneState; total: number }> = ({ s, total }) => {
  const L = s.list;
  if (!L.visible) return null;
  const nr = L.newRow;
  const rows = ORDERS.slice(0, 17);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: L.opacity, fontFamily: font }}>
      {/* Header: título + Nuevo Pedido */}
      <Abs x={LIST.innerX} y={LIST.headerY} h={32} style={{ display: "flex", alignItems: "center", gap: 10, opacity: L.header.o, transform: `translateY(${L.header.y}px)` }}>
        <span style={{ fontSize: 17, fontWeight: 600, color: c.textStrong }}>Pedidos</span>
      </Abs>
      <Abs x={LIST.newBtn.x} y={LIST.newBtn.y} style={{ opacity: L.header.o, transform: `translateY(${L.header.y}px)` }}>
        <Button label="Nuevo Pedido" icon="plus" hover={L.newBtn.hover} scale={L.newBtn.scale} height={LIST.newBtn.h} style={{ width: LIST.newBtn.w }} />
      </Abs>
      {/* Header skeleton */}
      <Abs x={LIST.innerX} y={LIST.headerY} style={{ opacity: 1 - L.header.o, display: "flex", gap: 10, alignItems: "center", height: 32 }}>
        <Sk w={62} h={14} />
        <Sk w={124} h={32} r={6} />
      </Abs>

      {/* Buscador */}
      <Abs x={LIST.search.x} y={LIST.search.y} style={{ opacity: L.search.o, transform: `translateY(${L.search.y}px)`, display: "flex" }}>
        <div
          style={{
            width: LIST.search.w - 32,
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
            background: "#fff",
          }}
        >
          Buscar
        </div>
        <div style={{ width: 32, height: 32, background: c.primary, borderRadius: "0 6px 6px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="search" size={12} color="#fff" />
        </div>
      </Abs>
      <Abs x={LIST.search.x} y={LIST.search.y} style={{ opacity: 1 - L.search.o }}>
        <Sk w={LIST.search.w} h={32} r={6} />
      </Abs>

      {/* Filtros + Exportar */}
      <Abs x={CARD.list.x + CARD.list.w - 20 - 140} y={LIST.headerY} style={{ opacity: L.search.o, transform: `translateY(${L.search.y}px)` }}>
        <Button label="Mostrar Filtros" variant="outlined" height={30} fontSize={12.5} style={{ width: 140 }}>
          <Icon name="filter-fill" size={11} />
        </Button>
      </Abs>
      <Abs x={CARD.list.x + CARD.list.w - 20 - 130} y={LIST.headerY + 42} style={{ opacity: L.search.o, transform: `translateY(${L.search.y}px)` }}>
        <Button label="Exportar a excel" variant="secondary" height={28} fontSize={12} style={{ width: 130 }}>
          <Icon name="file-excel" size={11} color={c.muted} />
        </Button>
      </Abs>

      {/* Cabecera de tabla */}
      <Abs x={LIST.innerX} y={LIST.tableHeadY} w={LIST.innerW} h={32} style={{ borderBottom: `1px solid ${c.rowLine}`, opacity: L.search.o }}>
        {HEAD.map((h, i) => (
          <div
            key={h}
            style={{
              position: "absolute",
              left: colX(i),
              width: LIST.cols[i],
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              fontSize: 12.5,
              fontWeight: 600,
              color: c.textStrong,
            }}
          >
            {h}
            {SORTABLE[i] ? <Icon name="sort-alt" size={10} color={c.muted} /> : null}
          </div>
        ))}
      </Abs>

      {/* Filas */}
      <Abs x={LIST.innerX} y={LIST.rowsY} w={LIST.innerW} h={CARD.list.y + CARD.list.h - LIST.rowsY - 12} style={{ overflow: "hidden" }}>
        {rows.map((r, i) => {
          const rv = L.rowAt(i);
          return (
            <Row
              key={r.number}
              row={r}
              y={i * LIST.rowH + (nr ? nr.shift : 0)}
              reveal={rv}
              skeleton={L.skeleton * (1 - rv)}
              badge={Math.min(rv, L.badges)}
              hover={L.hoverRow === i}
            />
          );
        })}
        {nr && nr.o > 0 ? (
          <div style={{ position: "absolute", left: 0, top: 0, width: LIST.innerW, height: LIST.rowH, opacity: nr.o, transform: `translateY(${nr.y}px)` }}>
            <Row row={{ ...NEW_ORDER, total }} y={0} reveal={1} skeleton={0} badge={nr.badge} highlight={nr.highlight} isNew />
          </div>
        ) : null}
      </Abs>
    </div>
  );
};
