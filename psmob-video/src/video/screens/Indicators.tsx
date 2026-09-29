import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { easeInOut, easeOut, osc, range } from "../../lib/motion";
import { Bar, BottomNav, Card, Chip, Gauge, Header, Hero, KpiGaugeCard, ListRow, Screen, SegBar, Segmented, Sheet, Thumb } from "../ds/ui";
import { C, R, S, SH, T } from "../ds/tokens";
import { APP_W } from "../ds/Device";
import { Icon, IconName } from "../ui/icons";
import { ar, PROD, TODAY } from "./data";

// Indicadores → Exhibición → OSA (capturas 5-1, 6, 7): azul único, hero con gauge,
// hoja con selector arriba, cards cuadradas iguales. Valores con count-up y actualización en vivo.
export const IND = { swipe1: [44, 56] as [number, number], swipe2: [86, 98] as [number, number], live1: 30, live2: 72, live3: 112 };

const cnt = (f: number, r: [number, number], to: number, from = 0) => interpolate(f, r, [from, to], { easing: easeOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const Pulse: React.FC<{ f: number; at: number; children: React.ReactNode }> = ({ f, at, children }) => {
  const k = range(f, [at, at + 16], [0, 1], easeOut);
  const on = f >= at && k < 1;
  return (
    <div style={{ position: "relative" }}>
      {children}
      {on && (
        <div style={{ position: "absolute", inset: 0, borderRadius: R.card, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, width: "45%", left: `${-50 + k * 160}%`, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.5), rgba(255,255,255,0))" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: R.card, boxShadow: `inset 0 0 0 3px rgba(112,37,224,${0.9 * (1 - k)})` }} />
        </div>
      )}
    </div>
  );
};

const HeroGauge: React.FC<{ value: number; date?: boolean }> = ({ value, date }) => (
  <div style={{ display: "flex", alignItems: "center", gap: S.lg }}>
    <div style={{ position: "relative" }}>
      <Gauge value={value} size={150} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontSize: 32, fontWeight: 700 }}>
        {Math.round(value)}
        <span style={{ fontSize: 16 }}>%</span>
      </div>
      {date && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: S.xs }}>
          <span style={{ ...T.caption, border: "1px solid rgba(255,255,255,0.4)", borderRadius: R.pill, padding: "2px 8px" }}>{TODAY}</span>
        </div>
      )}
    </div>
    <div style={{ width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.25)" }} />
    <div style={{ ...T.caption, fontWeight: 600, lineHeight: 2 }}>
      <div>
        Objetivo <span style={{ color: C.successBar }}>100%</span>
      </div>
      <div>
        General <span>{Math.round(value)}%</span>
      </div>
    </div>
    <div style={{ marginLeft: "auto", alignSelf: "flex-start" }}>
      <Icon name="info" size={22} color="#fff" fill={false} />
    </div>
  </div>
);

const Indicadores: React.FC<{ f: number }> = ({ f }) => {
  const cards = [
    { k: "OSA", v: 64, live: 71, obj: 85 },
    { k: "Exhibición", v: 64, obj: 80 },
    { k: "Formularios", v: 89, obj: 85 },
    { k: "Cuota", v: 89, obj: 100 },
    { k: "Incorporaciones", v: 89, obj: 100 },
    { k: "Visitas", v: 92, obj: 95 },
  ];
  return (
    <Screen bg={C.primary}>
      <Header title="Indicadores" actions={["filter"]} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: S.md, padding: `${S.sm}px ${S.lg}px` }}>
        {cards.map((c, i) => {
          const v = cnt(f, [2 + i * 2, 26 + i * 2], c.v) + (c.live && f >= IND.live1 ? cnt(f, [IND.live1, IND.live1 + 12], c.live - c.v) : 0);
          return (
            <Pulse key={c.k} f={f} at={c.live ? IND.live1 : 1e9}>
              <KpiGaugeCard label={c.k} value={v} target={c.obj} />
            </Pulse>
          );
        })}
      </div>
    </Screen>
  );
};

const EXHIB = [
  { src: "categorias/Aderezos.png", name: "Aderezos", pct: 50.74 },
  { src: "categorias/Deos.png", name: "Deos y fragancias", pct: 73.55 },
  { src: "categorias/JabonTocador.png", name: "Jabón de tocador", pct: 53.03 },
  { src: "categorias/JabonRopa.png", name: "Jabón para la ropa", pct: 67.82 },
  { src: "categorias/Suavizantes.png", name: "Suavizantes", pct: 70.92 },
  { src: "categorias/Lavavajillas.png", name: "Lavavajillas", pct: 58.24 },
];

const Exhibicion: React.FC<{ f: number }> = ({ f }) => {
  const g = cnt(f, [50, 70], 30) + (f >= IND.live2 ? cnt(f, [IND.live2, IND.live2 + 12], 4) : 0);
  return (
    <Screen>
      <Header title="Exhibición" actions={["filter"]} />
      <Hero>
        <HeroGauge value={g} />
      </Hero>
      <Sheet>
        <Segmented items={["Categoría", "Cliente y PDV"]} active={0} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: S.md, marginTop: S.lg }}>
          {EXHIB.map((e, i) => {
            const v = cnt(f, [52 + i * 2, 74 + i * 2], e.pct) + (i === 3 && f >= IND.live2 ? cnt(f, [IND.live2, IND.live2 + 10], 1.28) : 0);
            return (
              <Pulse key={e.name} f={f} at={i === 3 ? IND.live2 : 1e9}>
                <Card style={{ padding: S.md, display: "flex", flexDirection: "column", alignItems: "center", gap: S.xs }}>
                  <Img src={staticFile(e.src)} style={{ width: 48, height: 48 }} />
                  <div style={{ ...T.caption, color: C.text2 }}>{e.name}</div>
                  <div style={{ ...T.sectionTitle, fontWeight: 700 }}>
                    {ar(v)}
                    <span style={{ fontSize: 12 }}>%</span>
                  </div>
                  <div style={{ width: "100%" }}>
                    <Bar value={v} />
                  </div>
                </Card>
              </Pulse>
            );
          })}
        </div>
      </Sheet>
    </Screen>
  );
};

const OSA_ROWS: { k: string; sub: string; v: number; tone: [string, string]; icon: IconName }[] = [
  { k: "Limpieza hogar", sub: "3 categorías", v: 9.48, tone: [C.errorSoft, C.errorBar], icon: "alert" },
  { k: "Cuidado personal", sub: "3 categorías", v: 50.54, tone: [C.warningSoft, C.warningBar], icon: "chevron" },
  { k: "Belleza", sub: "3 categorías", v: 76.56, tone: [C.successSoft, C.successBar], icon: "check" },
  { k: "Alimentos", sub: "2 categorías", v: 50.54, tone: [C.warningSoft, C.warningBar], icon: "chevron" },
];

const Osa: React.FC<{ f: number }> = ({ f }) => {
  const g = cnt(f, [92, 108], 30) + (f >= IND.live3 ? cnt(f, [IND.live3, IND.live3 + 12], 6) : 0);
  return (
    <Screen>
      <Header title="OSA" actions={["filter"]} />
      <Hero>
        <HeroGauge value={g} date />
      </Hero>
      <Sheet>
        <Segmented items={["Consecutivos", "Loss Tree"]} active={0} />
        <Card style={{ padding: `0 ${S.md}px`, marginTop: S.md }}>
          {[PROD.shampoo, PROD.aerosol].map((p, i) => (
            <ListRow key={p.ean} leading={<Thumb src={p.src} size={36} />} mono={p.ean} title={p.name} trailing={<div style={{ textAlign: "right" }}><div style={{ ...T.caption, fontSize: 10, color: C.text2 }}>PDV</div><div style={{ ...T.sectionTitle }}>{[3, 5][i]}</div></div>} />
          ))}
          <div style={{ ...T.caption, color: C.primary, fontWeight: 600, textAlign: "center", padding: `${S.sm}px 0` }}>Ver los 14 quiebres ›</div>
        </Card>
        <Card style={{ padding: S.md, marginTop: S.md }}>
          <div style={{ ...T.cardTitle, marginBottom: S.xs }}>Por negocio y categoría</div>
          {OSA_ROWS.map((r, i) => {
            const v = cnt(f, [94 + i * 3, 116 + i * 3], r.v);
            return (
              <div key={r.k} style={{ padding: `${S.sm}px 0`, borderBottom: i < OSA_ROWS.length - 1 ? `1px solid ${C.border}` : undefined }}>
                <div style={{ display: "flex", alignItems: "center", gap: S.sm, marginBottom: S.sm }}>
                  <div style={{ width: 28, height: 28, borderRadius: R.sm, background: r.tone[0], display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={r.icon} size={16} color={r.tone[1] === C.successBar ? C.success : r.tone[1] === C.errorBar ? C.error : C.warning} fill={false} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...T.cardTitle }}>{r.k}</div>
                    <div style={{ ...T.caption, fontSize: 11, color: C.text2 }}>{r.sub}</div>
                  </div>
                  <div style={{ ...T.cardTitle, fontWeight: 700 }}>{ar(v)}%</div>
                </div>
                <SegBar value={v} color={r.tone[1]} />
              </div>
            );
          })}
        </Card>
      </Sheet>
    </Screen>
  );
};

export const IndicatorsFlow: React.FC<{ f: number }> = ({ f }) => {
  const s1 = range(f, IND.swipe1, [0, 1], easeInOut);
  const s2 = range(f, IND.swipe2, [0, 1], easeInOut);
  const x = -(s1 + s2) * APP_W;
  const swipe = (r: [number, number]) => {
    const k = range(f, [r[0] - 6, r[1]], [0, 1], easeInOut);
    if (f < r[0] - 8 || f > r[1] + 4) return null;
    return <div style={{ position: "absolute", left: interpolate(k, [0, 1], [330, 70]) - 26, top: 540, width: 52, height: 52, borderRadius: R.pill, background: "rgba(255,255,255,0.55)", border: "3px solid rgba(255,255,255,0.95)", boxShadow: SH.float }} />;
  };
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: APP_W * 3, transform: `translateX(${x}px)` }}>
        {[Indicadores, Exhibicion, Osa].map((P, i) => (
          <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: i * APP_W, width: APP_W, overflow: "hidden" }}>
            <P f={f} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: "50%", bottom: 92, transform: "translateX(-50%)" }}>
        <Chip tone="violet" solid icon="clock">
          <span style={{ opacity: 0.6 + 0.4 * osc(f, 20, 1) }}>En vivo · actualizado hace 1 s</span>
        </Chip>
      </div>
      <BottomNav active={4} />
      {swipe(IND.swipe1)}
      {swipe(IND.swipe2)}
    </div>
  );
};
