import React from "react";
import { easeInOut, easeOut, pop, range } from "../../lib/motion";
import { Badge, Button, Card, Chip, Header, Input, ListRow, Screen, SectionTitle, Tap, Thumb } from "../ds/ui";
import { C, R, S, T } from "../ds/tokens";
import { APP_W } from "../ds/Device";
import { Expand, Through } from "../ds/transitions";
import { Icon } from "../ui/icons";
import { PDVS, PROD } from "./data";

// Captura de datos: Formularios → tap → Carga (Con stock / Quiebre) → Enviar → check → Quiebres.
export const FT = {
  cardTap: 8,
  toForm: [12, 22] as [number, number],
  marks: [28, 36, 44],
  sendTap: 54,
  success: [58, 70] as [number, number],
  toBreaks: [72, 82] as [number, number],
};
export const MARKS: (0 | 1)[] = [0, 1, 0];
const ITEMS = [PROD.detergente, PROD.lavavajillas, PROD.lavandina];

const FORMS = [
  { freq: "Bimestral", title: "Relevamiento de precios", last: "21/09/2026 16:27", limit: "31/10/2026" },
  { freq: "Semanal", title: "Quiebres Limpieza Hogar", last: "25/09/2026 15:38", limit: "02/10/2026" },
  { freq: "Semanal", title: "Exhibición Cuidado Personal", last: "25/09/2026 16:28", limit: "02/10/2026" },
];

const FormsList: React.FC<{ f: number }> = ({ f }) => (
  <Screen>
    <Header title="Formularios" actions={["filter"]}>
      <Input value="Mayorista Central" onBlue icon="store" />
    </Header>
    <div style={{ padding: `0 ${S.lg}px` }}>
      <SectionTitle right={<Badge n={3} />}>Planificados</SectionTitle>
      {FORMS.map((fm, i) => (
        <Card key={fm.title} selected={i === 1 && f >= FT.cardTap} style={{ marginBottom: S.md, padding: S.md, display: "flex", alignItems: "center", gap: S.sm }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: S.sm }}>
              <Chip tone="neutral">{fm.freq}</Chip>
              <span style={{ ...T.cardTitle }}>{fm.title}</span>
            </div>
            <div style={{ ...T.caption, color: C.text2, marginTop: S.sm }}>Última captura: {fm.last}</div>
            <div style={{ ...T.caption, color: C.text2, marginTop: 2, display: "flex", alignItems: "center", gap: S.xs }}>
              <Icon name="calendar" size={13} color={C.text2} fill={false} /> F. Límite · {fm.limit}
            </div>
          </div>
          <Icon name="chevron" size={20} color={C.text3} fill={false} />
        </Card>
      ))}
    </div>
    <Tap f={f} at={FT.cardTap} x={250} y={335} />
  </Screen>
);

const StockToggle: React.FC<{ f: number; at: number; value: 0 | 1 }> = ({ f, at, value }) => {
  const on = f >= at;
  const p = pop(f, at, { damping: 10, stiffness: 200, mass: 0.5 });
  return (
    <div style={{ display: "flex", gap: S.xs }}>
      {["Con stock", "Quiebre"].map((l, i) => {
        const active = on && value === i;
        return (
          <div key={l} style={{ transform: active ? `scale(${0.9 + 0.1 * p})` : undefined }}>
            <Chip tone={active ? (i === 0 ? "success" : "error") : "neutral"} solid={active} icon={active ? (i === 0 ? "check" : "x") : undefined}>
              {l}
            </Chip>
          </div>
        );
      })}
    </div>
  );
};

const FormLoad: React.FC<{ f: number }> = ({ f }) => {
  const done = FT.marks.filter((m) => f >= m).length;
  const ready = done === 3;
  const rows = [232, 312, 434];
  return (
    <Screen>
      <Header title="Carga de formularios" actions={["camera"]}>
        <div style={{ display: "flex", alignItems: "center", gap: S.sm, background: "rgba(255,255,255,0.16)", borderRadius: R.sm, padding: `${S.sm}px ${S.md}px` }}>
          <Chip tone="success" solid icon="clock">
            Visita activa
          </Chip>
          <span style={{ ...T.cardTitle, color: "#fff" }}>{PDVS[0].name}</span>
        </div>
      </Header>
      <div style={{ padding: `0 ${S.lg}px` }}>
        <SectionTitle right={<Chip tone={ready ? "success" : "info"}>{`${done}/3`}</Chip>}>Quiebres Limpieza Hogar</SectionTitle>
        {[
          { title: "Limpieza de ropa", items: [0, 1] },
          { title: "Limpiadores", items: [2] },
        ].map((sec) => (
          <Card key={sec.title} style={{ padding: `${S.xs}px ${S.md}px`, marginBottom: S.md }}>
            <div style={{ display: "flex", alignItems: "center", padding: `${S.sm}px 0`, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ ...T.cardTitle, flex: 1 }}>{sec.title}</div>
              <Icon name="camera" size={18} color={C.text2} fill={false} />
            </div>
            {sec.items.map((idx, j) => (
              <ListRow key={idx} divider={j < sec.items.length - 1} leading={<Thumb src={ITEMS[idx].src} />} mono={ITEMS[idx].ean} title={ITEMS[idx].name} subtitle={<StockToggle f={f} at={FT.marks[idx]} value={MARKS[idx]} />} />
            ))}
          </Card>
        ))}
      </div>
      <div style={{ position: "absolute", left: S.lg, right: S.lg, bottom: S.xl, display: "flex", gap: S.sm }}>
        <Button variant="outline" style={{ flex: 1 }}>
          Guardar borrador
        </Button>
        <Button variant="violet" style={{ flex: 1 }} disabled={!ready}>
          Enviar formulario
        </Button>
      </div>
      {FT.marks.map((m, i) => (
        <Tap key={m} f={f} at={m} x={MARKS[i] === 0 ? 110 : 190} y={rows[i]} />
      ))}
      <Tap f={f} at={FT.sendTap} x={290} y={796} />
    </Screen>
  );
};

const Success: React.FC<{ f: number }> = ({ f }) => {
  const k = range(f, FT.success, [0, 1], easeOut);
  const draw = range(f, [FT.success[0] + 3, FT.success[0] + 12], [0, 1], easeOut);
  return (
    <div style={{ position: "absolute", inset: 0, background: `rgba(255,255,255,${0.94 * k})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: S.lg }}>
      <svg width={120} height={120} viewBox="0 0 100 100" style={{ transform: `scale(${pop(f, FT.success[0], { damping: 9, stiffness: 180 })})` }}>
        <circle cx="50" cy="50" r="44" fill={C.success} />
        <path d="M30 51 44 65 71 37" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
      </svg>
      <div style={{ ...T.sectionTitle, opacity: k }}>Formulario enviado</div>
    </div>
  );
};

const Breaks: React.FC<{ f: number }> = ({ f }) => (
  <Screen>
    <Header title="Quiebres detectados" actions={["filter"]} />
    <div style={{ padding: S.lg }}>
      <Card style={{ padding: S.md, background: C.errorSoft, boxShadow: "none", display: "flex", alignItems: "center", gap: S.sm, marginBottom: S.md }}>
        <Icon name="alert" size={20} color={C.error} />
        <span style={{ ...T.cardTitle, color: C.error }}>3 productos sin stock en góndola</span>
      </Card>
      <Card style={{ padding: `0 ${S.md}px` }}>
        {[PROD.lavavajillas, PROD.shampoo, PROD.spray].map((p, i) => {
          const pp = pop(f, FT.toBreaks[1] + i * 3, { damping: 11, stiffness: 170, mass: 0.6 });
          return (
            <div key={p.ean} style={{ transform: `translateX(${(1 - pp) * 40}px)`, opacity: Math.min(1, pp * 2) }}>
              <ListRow divider={i < 2} leading={<Thumb src={p.src} />} mono={p.ean} title={p.name} subtitle={PDVS[i].name} trailing={<Chip tone="error">Quiebre</Chip>} />
            </div>
          );
        })}
      </Card>
    </div>
  </Screen>
);

// Navegación interna tipo push.
export const FormsFlow: React.FC<{ f: number }> = ({ f }) => {
  const b = range(f, FT.toForm, [0, 1], easeInOut);
  const c = range(f, FT.toBreaks, [0, 1], easeInOut);
  // La tarjeta tocada se expande hasta ser el formulario; después, fundido al resumen de quiebres.
  const form = (
    <>
      <FormLoad f={f} />
      {f >= FT.success[0] && <Success f={f} />}
    </>
  );
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Through p={c} a={<Expand p={b} from={{ x: 16, y: 300, w: APP_W - 32, h: 76, r: 16 }} a={<FormsList f={f} />} b={form} />} b={<Breaks f={f} />} />
    </div>
  );
};
