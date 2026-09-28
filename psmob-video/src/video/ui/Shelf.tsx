import React from "react";
import { Img, staticFile } from "remotion";
import { CatKey, catSrc } from "../data";
import { robotoMono } from "../lib/fonts";

// Góndola genérica: productos = íconos de categoría (sin marcas), precios en fleje, huecos (quiebres)
// y un producto fuera de posición para que AiFred los detecte.
export const SHELF = {
  top: 150,
  levels: [360, 560, 760, 960], // y de cada estante (base de los productos)
  slot: 128,
  productH: 150,
  x0: 60,
};

// Cada nivel: lista de grupos (categoría × frentes). "gap" = hueco; "wrong" = fuera de posición.
type Group = { cat: CatKey; n: number; price: string; gapAt?: number; wrongAt?: { at: number; cat: CatKey } };
export const LAYOUT: Group[][] = [
  [
    { cat: "deos", n: 3, price: "$ 2.310,00" },
    { cat: "cremas", n: 3, price: "$ 3.890,00" },
    { cat: "pelo", n: 3, price: "$ 4.120,50" },
    { cat: "dental", n: 3, price: "$ 1.760,00" },
    { cat: "jabonTocador", n: 3, price: "$ 980,00", wrongAt: { at: 0, cat: "salsas" } },
    { cat: "repelentes", n: 3, price: "$ 2.450,00" },
    { cat: "deos", n: 3, price: "$ 2.310,00" },
    { cat: "cremas", n: 3, price: "$ 3.890,00" },
  ],
  [
    { cat: "limpiadores", n: 3, price: "$ 1.980,00" },
    { cat: "lavavajillas", n: 3, price: "$ 1.320,00" },
    { cat: "suavizantes", n: 3, price: "$ 3.410,50", gapAt: 1 },
    { cat: "jabonRopa", n: 3, price: "$ 5.032,00", gapAt: 2 },
    { cat: "lavandinas", n: 3, price: "$ 1.543,00" },
    { cat: "limpiadores", n: 3, price: "$ 1.980,00" },
    { cat: "jabonRopa", n: 3, price: "$ 5.032,00", wrongAt: { at: 2, cat: "lavavajillas" } },
    { cat: "suavizantes", n: 3, price: "$ 3.410,50" },
  ],
  [
    { cat: "aderezos", n: 3, price: "$ 1.150,00" },
    { cat: "salsas", n: 3, price: "$ 1.480,00" },
    { cat: "misc", n: 3, price: "$ 890,00" },
    { cat: "aderezos", n: 3, price: "$ 1.150,00", gapAt: 0 },
    { cat: "salsas", n: 3, price: "$ 1.480,00" },
    { cat: "misc", n: 3, price: "$ 890,00" },
    { cat: "aderezos", n: 3, price: "$ 1.150,00" },
    { cat: "salsas", n: 3, price: "$ 1.480,00" },
  ],
];

export const groupX = (g: number) => SHELF.x0 + g * (3 * SHELF.slot + 24);
export const SHELF_W = groupX(8) + 40;

export type Facing = { level: number; group: number; i: number; x: number; y: number; cat: CatKey; kind: "ok" | "gap" | "wrong" };
export const FACINGS: Facing[] = LAYOUT.flatMap((row, level) =>
  row.flatMap((g, group) =>
    Array.from({ length: g.n }).map((_, i): Facing => {
      const kind = g.gapAt === i ? "gap" : g.wrongAt?.at === i ? "wrong" : "ok";
      return {
        level,
        group,
        i,
        x: groupX(group) + i * SHELF.slot + SHELF.slot / 2,
        y: SHELF.levels[level],
        cat: kind === "wrong" ? g.wrongAt!.cat : g.cat,
        kind,
      };
    }),
  ),
);

export const Shelf: React.FC<{ dim?: number }> = ({ dim = 0 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: SHELF_W, height: 1080 }}>
    {/* Fondo de góndola */}
    <div style={{ position: "absolute", left: 0, top: SHELF.top, width: SHELF_W, height: SHELF.levels[3] - SHELF.top, background: "linear-gradient(180deg, #E9EDF7, #DCE2F0)", borderRadius: "18px 18px 0 0" }} />
    {Array.from({ length: 9 }).map((_, g) => (
      <div key={g} style={{ position: "absolute", left: groupX(g) - 14, top: SHELF.top, width: 6, height: SHELF.levels[3] - SHELF.top, background: "#CDD5E6" }} />
    ))}
    <div style={{ position: "absolute", left: -20, top: SHELF.top - 60, width: SHELF_W + 40, height: 70, borderRadius: 14, background: "#463DE1" }} />
    {FACINGS.filter((p) => p.kind !== "gap").map((p) => (
      <Img
        key={`${p.level}-${p.group}-${p.i}`}
        src={staticFile(catSrc(p.cat))}
        style={{ position: "absolute", left: p.x - SHELF.productH / 2, top: p.y - SHELF.productH - 2, width: SHELF.productH, height: SHELF.productH }}
      />
    ))}
    {SHELF.levels.slice(0, 3).map((y, level) => (
      <React.Fragment key={y}>
        <div style={{ position: "absolute", left: -20, top: y, width: SHELF_W + 40, height: 12, background: "#C3CBE0" }} />
        <div style={{ position: "absolute", left: -20, top: y + 12, width: SHELF_W + 40, height: 30, background: "#F4F6FB", borderTop: "2px solid #AEB8D2" }} />
        {LAYOUT[level].map((g, gi) => (
          <div
            key={gi}
            style={{
              position: "absolute",
              left: groupX(gi) + 1.5 * SHELF.slot - 60,
              top: y + 15,
              width: 120,
              height: 24,
              borderRadius: 5,
              background: "#FFFFFF",
              border: "1.5px solid #FBC02D",
              fontFamily: robotoMono,
              fontSize: 14,
              fontWeight: 500,
              color: "#212121",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {g.price}
          </div>
        ))}
      </React.Fragment>
    ))}
    <div style={{ position: "absolute", left: -20, top: SHELF.levels[3] - 40, width: SHELF_W + 40, height: 160, background: "#B8C2D9" }} />
    {dim > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(10,7,54,${dim})` }} />}
  </div>
);
