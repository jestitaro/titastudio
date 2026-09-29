import React from "react";
import { Img, staticFile } from "remotion";
import { FONT_MONO } from "../ds/tokens";
import { Bag, Box, Doypack, Jar, Squeeze } from "./Packs";

// Góndola de supermercado simplificada con packaging genérico (sin marcas, sin textos).
// Niveles: cuidado personal / limpieza / almacén / bultos. Incluye un faltante y un producto fuera de posición.

type Sku =
  | { t: "png"; src: string; ar: number; hue?: number }
  | { t: "jar"; body: string; lid: string }
  | { t: "doy"; body: string; cap?: string }
  | { t: "sq"; body: string; cap: string }
  | { t: "box"; body: string; band: string }
  | { t: "bag"; body: string };

const P = (src: string, ar: number, hue?: number): Sku => ({ t: "png", src: `productos/${src}.png`, ar, hue });
const SKU = {
  shampoo: P("shampoo-violeta", 0.3),
  shampooTeal: P("shampoo-violeta", 0.3, 290),
  pump: P("jabon-pump-violeta", 0.35),
  aerosol: P("aerosol-celeste", 0.29),
  aerosolPink: P("aerosol-celeste", 0.29, 130),
  rollon: P("rollon-rosa", 0.45),
  tubo: P("tubo-crema-celeste", 0.43),
  crema: P("set-crema-rosa", 1.03),
  detergente: P("detergente-liquido-celeste", 0.56),
  detergentePink: P("detergente-liquido-celeste", 0.56, 140),
  bidon: P("bidon-limpiador-amarillo", 0.45),
  lavavajillas: P("lavavajillas-amarillo", 0.5),
  lavavajillasGreen: P("lavavajillas-amarillo", 0.5, 60),
  spray: P("spray-celeste", 0.5),
  bano: P("limpiador-bano-celeste", 0.41),
  aerosolVerde: P("aerosol-verde", 0.38),
  dispensador: P("dispensador-jabon-celeste", 0.52),
  salsa: { t: "jar", body: "#E4574B", lid: "#F2C94C" } as Sku,
  pickles: { t: "jar", body: "#8DB36B", lid: "#E9E4D4" } as Sku,
  ketchup: { t: "sq", body: "#E24B3B", cap: "#FFFFFF" } as Sku,
  mostaza: { t: "sq", body: "#F2C84B", cap: "#E24B3B" } as Sku,
  mayo: { t: "doy", body: "#F4E7B8", cap: "#3C7BE0" } as Sku,
  salsaDoy: { t: "doy", body: "#E57A4E", cap: "#fff" } as Sku,
  boxBlue: { t: "box", body: "#5B8DEF", band: "#FFFFFF" } as Sku,
  boxViolet: { t: "box", body: "#9A7BE8", band: "#FFF4D6" } as Sku,
  boxGreen: { t: "box", body: "#5CB88A", band: "#FFFFFF" } as Sku,
  bagOrange: { t: "bag", body: "#F29A55" } as Sku,
  bagYellow: { t: "bag", body: "#F5CF5C" } as Sku,
};
type SkuKey = keyof typeof SKU;
const aspect = (s: Sku) => (s.t === "png" ? s.ar : s.t === "jar" ? 100 / 130 : s.t === "doy" ? 100 / 150 : s.t === "sq" ? 70 / 160 : s.t === "box" ? 110 / 150 : 110 / 130);

export const GONDOLA = { top: 120, bases: [372, 612, 842, 1062], heights: [196, 204, 176, 192], width: 5400 };

const ROWS: [SkuKey, number, string][][] = [
  [
    ["shampoo", 4, "$ 3.410,50"],
    ["pump", 3, "$ 2.890,00"],
    ["aerosol", 4, "$ 2.310,00"],
    ["rollon", 3, "$ 1.760,00"],
    ["tubo", 3, "$ 2.450,00"],
    ["crema", 2, "$ 4.120,50"],
    ["shampooTeal", 4, "$ 3.410,50"],
    ["aerosolPink", 4, "$ 2.310,00"],
    ["pump", 3, "$ 2.890,00"],
    ["tubo", 3, "$ 2.450,00"],
    ["shampoo", 4, "$ 3.410,50"],
    ["rollon", 3, "$ 1.760,00"],
    ["aerosol", 4, "$ 2.310,00"],
    ["crema", 2, "$ 4.120,50"],
    ["shampooTeal", 4, "$ 3.410,50"],
    ["pump", 3, "$ 2.890,00"],
  ],
  [
    ["detergente", 3, "$ 5.032,00"],
    ["bidon", 3, "$ 1.543,00"],
    ["lavavajillas", 4, "$ 1.320,00"],
    ["spray", 3, "$ 1.980,00"],
    ["bano", 3, "$ 1.650,00"],
    ["aerosolVerde", 4, "$ 2.100,00"],
    ["detergentePink", 3, "$ 5.032,00"],
    ["dispensador", 3, "$ 1.890,00"],
    ["lavavajillasGreen", 4, "$ 1.320,00"],
    ["detergente", 3, "$ 5.032,00"],
    ["bidon", 3, "$ 1.543,00"],
    ["spray", 3, "$ 1.980,00"],
    ["bano", 3, "$ 1.650,00"],
  ],
  [
    ["salsa", 4, "$ 1.480,00"],
    ["ketchup", 5, "$ 1.150,00"],
    ["mostaza", 5, "$ 990,00"],
    ["mayo", 4, "$ 1.650,00"],
    ["pickles", 3, "$ 1.890,00"],
    ["salsaDoy", 4, "$ 1.230,00"],
    ["salsa", 4, "$ 1.480,00"],
    ["ketchup", 5, "$ 1.150,00"],
    ["mayo", 4, "$ 1.650,00"],
    ["mostaza", 5, "$ 990,00"],
    ["pickles", 3, "$ 1.890,00"],
  ],
  [
    ["boxBlue", 3, "$ 6.890,00"],
    ["bagOrange", 3, "$ 3.240,00"],
    ["bidon", 4, "$ 1.543,00"],
    ["boxViolet", 3, "$ 7.120,00"],
    ["bagYellow", 3, "$ 2.980,00"],
    ["boxGreen", 3, "$ 6.450,00"],
    ["bidon", 4, "$ 1.543,00"],
    ["boxBlue", 3, "$ 6.890,00"],
    ["bagOrange", 3, "$ 3.240,00"],
    ["boxViolet", 3, "$ 7.120,00"],
  ],
];

export type Facing = { level: number; x: number; base: number; w: number; h: number; sku: SkuKey; kind: "ok" | "gap" | "wrong"; group: number };
export type PriceTag = { level: number; x: number; y: number; price: string };

// Fallas de planograma (en la zona que escanea Nico).
const GAP = { level: 1, group: 7, i: 1 };
const WRONG = { level: 0, group: 9, i: 1, sku: "salsa" as SkuKey };

export const { FACINGS, TAGS } = (() => {
  const facings: Facing[] = [];
  const tags: PriceTag[] = [];
  ROWS.forEach((row, level) => {
    let x = 40;
    const h = GONDOLA.heights[level];
    row.forEach(([key, n, price], group) => {
      const w = aspect(SKU[key]) * h;
      const start = x;
      for (let i = 0; i < n; i++) {
        const gap = GAP.level === level && GAP.group === group && GAP.i === i;
        const wrong = WRONG.level === level && WRONG.group === group && WRONG.i === i;
        facings.push({ level, x: x + w / 2, base: GONDOLA.bases[level], w, h, sku: wrong ? WRONG.sku : key, kind: gap ? "gap" : wrong ? "wrong" : "ok", group });
        x += w + 6;
      }
      tags.push({ level, x: (start + x - 6) / 2, y: GONDOLA.bases[level] + 16, price });
      x += 22;
    });
  });
  return { FACINGS: facings, TAGS: tags };
})();

const Product: React.FC<{ f: Facing; idx: number }> = ({ f, idx }) => {
  const s = SKU[f.sku];
  const wrongH = f.kind === "wrong" ? f.h * 0.78 : f.h;
  const w = aspect(s) * wrongH;
  const style: React.CSSProperties = { position: "absolute", left: f.x - w / 2, top: f.base - wrongH, width: w, height: wrongH };
  const id = `pk${idx}`;
  if (s.t === "png") return <Img src={staticFile(s.src)} style={{ ...style, filter: s.hue ? `hue-rotate(${s.hue}deg)` : undefined }} />;
  const inner =
    s.t === "jar" ? <Jar w={w} h={wrongH} body={s.body} lid={s.lid} id={id} /> : s.t === "doy" ? <Doypack w={w} h={wrongH} body={s.body} cap={s.cap} id={id} /> : s.t === "sq" ? <Squeeze w={w} h={wrongH} body={s.body} cap={s.cap} id={id} /> : s.t === "box" ? <Box w={w} h={wrongH} body={s.body} band={s.band} id={id} /> : <Bag w={w} h={wrongH} body={s.body} id={id} />;
  return <div style={style}>{inner}</div>;
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
      <Product key={`${p.level}-${Math.round(p.x)}`} f={p} idx={i} />
    ))}
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
