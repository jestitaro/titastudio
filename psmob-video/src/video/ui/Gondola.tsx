import React from "react";
import { Img, staticFile } from "remotion";
import { FONT_MONO } from "../ds/tokens";

// Góndola de supermercado solo con los productos provistos (PNG, sin marcas). Cada producto conserva su
// tamaño real relativo: la altura sale de su medida aproximada en cm, no del estante. Por nivel:
// cuidado personal chico / cuidado personal y limpieza liviana / limpieza / bidones.
// Incluye un faltante y un producto fuera de posición en la zona que escanea Nico.

type Sku = { src: string; ar: number; cm: number };
const P = (src: string, ar: number, cm: number): Sku => ({ src: `productos/${src}.png`, ar, cm });
const SKU = {
  rollon: P("rollon-rosa", 0.45, 10),
  crema: P("set-crema-rosa", 1.02, 9),
  tubo: P("tubo-crema-celeste", 0.43, 17),
  aerosol: P("aerosol-celeste", 0.29, 18),
  dispensador: P("dispensador-jabon-celeste", 0.52, 17),
  pump: P("jabon-pump-violeta", 0.35, 19),
  shampoo: P("shampoo-violeta", 0.3, 22),
  aerosolVerde: P("aerosol-verde", 0.38, 20),
  lavavajillas: P("lavavajillas-amarillo", 0.49, 24),
  bano: P("limpiador-bano-celeste", 0.41, 25),
  spray: P("spray-celeste", 0.5, 26),
  detergente: P("detergente-liquido-celeste", 0.56, 30),
  bidon: P("bidon-limpiador-amarillo", 0.45, 31),
};
type SkuKey = keyof typeof SKU;
const PX_CM = 7; // escala única para todos los productos
const skuH = (k: SkuKey) => SKU[k].cm * PX_CM;

export const GONDOLA = { top: 120, bases: [300, 530, 790, 1062], width: 5400, bottom: 1144 };

// Patrón por nivel (producto, frentes, precio); se repite hasta completar el ancho de la góndola.
const PATTERN: [SkuKey, number, string][][] = [
  [
    ["rollon", 4, "$ 1.760,00"],
    ["tubo", 3, "$ 2.450,00"],
    ["crema", 2, "$ 4.120,50"],
    ["aerosol", 4, "$ 2.310,00"],
    ["dispensador", 3, "$ 1.890,00"],
    ["pump", 3, "$ 2.890,00"],
  ],
  [
    ["shampoo", 4, "$ 3.410,50"],
    ["aerosolVerde", 3, "$ 2.100,00"],
    ["lavavajillas", 4, "$ 1.320,00"],
    ["bano", 3, "$ 1.650,00"],
  ],
  [
    ["spray", 4, "$ 1.980,00"],
    ["detergente", 3, "$ 5.032,00"],
    ["lavavajillas", 3, "$ 1.320,00"],
  ],
  [
    ["bidon", 4, "$ 1.543,00"],
    ["detergente", 3, "$ 5.032,00"],
  ],
];

// Fallas de planograma: la zona que escanea Nico (coords locales de la góndola).
export const SCAN_ZONE = { from: 2060, to: 2800 };
const GAP_X = { level: 1, x: 2330 };
const WRONG_X = { level: 2, x: 2600, sku: "shampoo" as SkuKey };

export type Facing = { level: number; x: number; base: number; w: number; h: number; sku: SkuKey; kind: "ok" | "gap" | "wrong"; group: number };
export type PriceTag = { level: number; x: number; y: number; price: string };

export const { FACINGS, TAGS } = (() => {
  const facings: Facing[] = [];
  const tags: PriceTag[] = [];
  PATTERN.forEach((pattern, level) => {
    let x = 40;
    let group = 0;
    while (x < GONDOLA.width - 200) {
      const [key, n, price] = pattern[group % pattern.length];
      const h = skuH(key);
      const w = SKU[key].ar * h;
      const start = x;
      for (let i = 0; i < n; i++) {
        facings.push({ level, x: x + w / 2, base: GONDOLA.bases[level], w, h, sku: key, kind: "ok", group });
        x += w + 8;
      }
      tags.push({ level, x: (start + x - 8) / 2, y: GONDOLA.bases[level] + 16, price });
      x += 26;
      group++;
    }
  });
  const nearest = (level: number, x: number) => facings.filter((p) => p.level === level).reduce((a, b) => (Math.abs(b.x - x) < Math.abs(a.x - x) ? b : a));
  nearest(GAP_X.level, GAP_X.x).kind = "gap";
  const w = nearest(WRONG_X.level, WRONG_X.x);
  w.kind = "wrong";
  w.sku = WRONG_X.sku;
  w.h = skuH(WRONG_X.sku);
  w.w = SKU[WRONG_X.sku].ar * w.h;
  return { FACINGS: facings, TAGS: tags };
})();

// Parte superior de cada nivel (el producto más alto), para ubicar rótulos.
export const LEVEL_TOP = GONDOLA.bases.map((b, lv) => Math.min(...FACINGS.filter((p) => p.level === lv).map((p) => p.base - p.h)));

const Product: React.FC<{ f: Facing }> = ({ f }) => {
  const s = SKU[f.sku];
  return <Img src={staticFile(s.src)} style={{ position: "absolute", left: f.x - f.w / 2, top: f.base - f.h, width: f.w, height: f.h }} />;
};

export const Gondola: React.FC<{ from?: number; to?: number }> = ({ from = -200, to = 5000 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: GONDOLA.width, height: 1200 }}>
    {/* Estructura */}
    <div style={{ position: "absolute", left: 0, top: GONDOLA.top, width: GONDOLA.width, height: GONDOLA.bases[3] - GONDOLA.top + 20, background: "linear-gradient(180deg, #E7EBF4, #D9DFEC)" }} />
    {Array.from({ length: Math.ceil(GONDOLA.width / 1000) + 1 }).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: i * 1000 - 8, top: GONDOLA.top - 60, width: 16, height: GONDOLA.bases[3] - GONDOLA.top + 90, background: "#C5CDDF" }} />
    ))}
    <div style={{ position: "absolute", left: -20, top: GONDOLA.top - 64, width: GONDOLA.width + 40, height: 60, borderRadius: 12, background: "#1D4ED8" }} />
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={`s${i}`} style={{ position: "absolute", left: 300 + i * 1000, top: GONDOLA.top - 50, width: 220, height: 32, borderRadius: 16, background: "rgba(255,255,255,0.22)" }} />
    ))}
    {FACINGS.filter((p) => p.kind !== "gap" && p.x > from && p.x < to).map((p, i) => (
      <Product key={`${p.level}-${Math.round(p.x)}`} f={p} />
    ))}
    <div style={{ position: "absolute", left: -20, top: GONDOLA.bases[3] + 38, width: GONDOLA.width + 40, height: 44, background: "linear-gradient(180deg, #8E9AB8, #6F7C9E)" }} />
    {GONDOLA.bases.map((y, level) => (
      <React.Fragment key={y}>
        <div style={{ position: "absolute", left: -20, top: y, width: GONDOLA.width + 40, height: 10, background: "#B9C3D8" }} />
        <div style={{ position: "absolute", left: -20, top: y + 10, width: GONDOLA.width + 40, height: 28, background: "#F6F8FC", borderTop: "2px solid #A9B5CE" }} />
        {TAGS.filter((t) => t.level === level && t.x > from && t.x < to).map((t) => (
          <div key={t.x} style={{ position: "absolute", left: t.x - 50, top: t.y - 4, width: 100, height: 22, borderRadius: 4, background: "#FFF6CC", border: "1.5px solid #E9C43A", fontFamily: FONT_MONO, fontSize: 13, fontWeight: 500, color: "#1E293B", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {t.price}
          </div>
        ))}
      </React.Fragment>
    ))}
  </div>
);
