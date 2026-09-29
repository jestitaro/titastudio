import React from "react";
import { easeInOut, easeOut, pop, range } from "../../lib/motion";
import { Avatar, Badge, BottomNav, Card, Chip, Fab, Header, Screen, SectionTitle, Tap } from "../ds/ui";
import { Reveal } from "../ds/transitions";
import { C, R, S, SH, T } from "../ds/tokens";
import { Icon, IconName } from "../ui/icons";
import { PDVS, TEAM, TODAY } from "./data";

// ——— Inicio con tareas pendientes (escena 1: Caro ve todo lo que tiene que hacer) ———
const TASKS: { icon: IconName; title: string; sub: string; n: number; tone: string }[] = [
  { icon: "pin", title: "Visitas pendientes", sub: "8 PDV para hoy", n: 8, tone: C.primary },
  { icon: "form", title: "Formularios sin enviar", sub: "Relevamiento de góndola", n: 5, tone: C.warning },
  { icon: "alert", title: "Quiebres a revisar", sub: "3 categorías", n: 12, tone: C.error },
  { icon: "route", title: "Ruta modificada", sub: "3 PDV reasignados", n: 3, tone: C.violet },
  { icon: "dollar", title: "Precios a relevar", sub: "Limpieza y cuidado personal", n: 24, tone: C.warning },
];
export const TASK_AT = (i: number) => 6 + i * 9;

export const TasksScreen: React.FC<{ f: number }> = ({ f }) => (
  <Screen>
    <Header title="Inicio" back={false} menu actions={["bell"]} />
    <div style={{ padding: `0 ${S.lg}px` }}>
      <SectionTitle right={<Chip tone="neutral">{TODAY}</Chip>}>Pendientes de hoy</SectionTitle>
      {TASKS.map((t, i) => {
        const p = pop(f, TASK_AT(i), { damping: 12, stiffness: 170, mass: 0.6 });
        if (p <= 0.01) return null;
        return (
          <Card key={t.title} style={{ marginBottom: S.sm, padding: S.md, display: "flex", alignItems: "center", gap: S.md, transform: `translateY(${(1 - p) * 24}px)`, opacity: Math.min(1, p * 2) }}>
            <div style={{ width: 40, height: 40, borderRadius: R.sm, background: `${t.tone}1A`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={t.icon} size={22} color={t.tone} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.cardTitle }}>{t.title}</div>
              <div style={{ ...T.caption, color: C.text2 }}>{t.sub}</div>
            </div>
            <Badge n={t.n} />
          </Card>
        );
      })}
    </div>
    <BottomNav active={0} items={[{ icon: "home", label: "Inicio" }, { icon: "store", label: "Info PDV" }, { icon: "pin", label: "Visitas", badge: 8 }, { icon: "form", label: "Forms", badge: 5 }, { icon: "chart", label: "Indicadores" }]} />
  </Screen>
);

// ——— Visitas: lista (con asignación del equipo) ↔ mapa (ruteo de UN merchandiser por calles) ———
export const VIS = {
  assign: [14, 44] as [number, number], // avatares que se asignan a cada PDV
  toMap: 96, // tap en el toggle de mapa
  mapIn: [98, 112] as [number, number],
  route: [112, 160] as [number, number],
};

// Posición (pantalla) del slot de avatar de cada PDV en la lista, para la magnetización externa.
export const listSlot = (i: number) => ({ x: 342, y: 220 + i * 101 });

const ToggleRow: React.FC<{ map: boolean }> = ({ map }) => (
  <div style={{ display: "flex", alignItems: "center", gap: S.sm }}>
    <div style={{ ...T.cardTitle, flex: 1 }}>Todos los PDV</div>
    {(["grid", "route"] as IconName[]).map((ic, i) => {
      const on = (i === 1) === map;
      return (
        <div key={ic} style={{ width: 36, height: 36, borderRadius: R.pill, background: on ? "rgba(255,255,255,0.28)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={ic} size={20} color="#fff" fill={false} />
        </div>
      );
    })}
  </div>
);

const PdvCard: React.FC<{ p: (typeof PDVS)[number]; f: number; i: number; active?: boolean }> = ({ p, f, i, active }) => {
  const k = range(f, [VIS.assign[0] + i * 6 + 14, VIS.assign[0] + i * 6 + 20], [0, 1]);
  const t = TEAM[i % TEAM.length];
  return (
    <Card style={{ marginBottom: S.md, padding: S.md, display: "flex", gap: S.md }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...T.cardTitle }}>{p.name}</div>
        <div style={{ ...T.caption, color: C.text2, display: "flex", alignItems: "center", gap: S.xs, marginTop: 2 }}>
          <Icon name="pin" size={13} color={C.text2} fill={false} /> {p.km} · {p.addr}
        </div>
        <div style={{ display: "flex", gap: S.xs, marginTop: S.sm }}>
          {active ? (
            <Chip tone="success" solid icon="clock">
              Visita activa 15:03 hs
            </Chip>
          ) : (
            <Chip tone="neutral" icon="clock">
              Programado {p.time}
            </Chip>
          )}
        </div>
      </div>
      <div style={{ width: 40, height: 40, position: "relative", alignSelf: "center" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: R.pill, border: `2px dashed ${C.border}`, opacity: 1 - k }} />
        {k > 0 && (
          <div style={{ position: "absolute", inset: 0, transform: `scale(${0.8 + 0.2 * pop(f, VIS.assign[0] + i * 6 + 14, { damping: 9, stiffness: 220, mass: 0.5 })})` }}>
            <Avatar initials={t.initials} color={t.color} size={40} />
          </div>
        )}
      </div>
    </Card>
  );
};

// Mapa: grilla de calles levemente rotada; la ruta recorre SOLO calles (segmentos sobre la grilla).
const G = 88; // manzana
const ROT = -12;
const node = (cx: number, cy: number) => ({ x: 20 + cx * G, y: 30 + cy * G });
const ROUTE_NODES = [
  [1, 5],
  [1, 3],
  [3, 3],
  [3, 2],
  [4, 2],
  [4, 0],
];
const STOPS = [0, 2, 4, 5];
const ROUTE_PTS = ROUTE_NODES.map(([a, b]) => node(a, b));
const segLen = ROUTE_PTS.slice(1).map((p, i) => Math.hypot(p.x - ROUTE_PTS[i].x, p.y - ROUTE_PTS[i].y));
const TOTAL_LEN = segLen.reduce((a, b) => a + b, 0);
const alongRoute = (k: number) => {
  let d = k * TOTAL_LEN;
  for (let i = 0; i < segLen.length; i++) {
    if (d <= segLen[i]) {
      const t = d / segLen[i];
      return { x: ROUTE_PTS[i].x + (ROUTE_PTS[i + 1].x - ROUTE_PTS[i].x) * t, y: ROUTE_PTS[i].y + (ROUTE_PTS[i + 1].y - ROUTE_PTS[i].y) * t };
    }
    d -= segLen[i];
  }
  return ROUTE_PTS[ROUTE_PTS.length - 1];
};

const MapView: React.FC<{ f: number; h: number }> = ({ f, h }) => {
  const k = range(f, VIS.route, [0, 1], easeInOut);
  const me = alongRoute(k);
  const d = ROUTE_PTS.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ");
  return (
    <svg width={390} height={h} viewBox={`0 0 390 ${h}`} style={{ display: "block" }}>
      <rect width="390" height={h} fill="#EEF1F5" />
      <g transform={`rotate(${ROT} 195 ${h / 2}) translate(0 -20)`}>
        {Array.from({ length: 7 }).map((_, c) =>
          Array.from({ length: 9 }).map((__, r) => {
            const park = (c === 0 && r === 4) || (c === 5 && r === 1) || (c === 2 && r === 6);
            return <rect key={`${c}-${r}`} x={-60 + c * G + 6} y={-50 + r * G + 6} width={G - 12} height={G - 12} rx={6} fill={park ? "#CDEBC5" : "#E1E6EE"} />;
          }),
        )}
        <path d={`M-120 ${-10} L520 ${-160}`} stroke="#FCD34D" strokeWidth={22} />
        <path d={`M-120 ${-10} L520 ${-160}`} stroke="#FDE68A" strokeWidth={10} />
        <path d={d} fill="none" stroke={C.primary} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${k} 1`} />
        {STOPS.map((si, j) => {
          const p = ROUTE_PTS[si];
          const reached = k >= (j / (STOPS.length - 1)) * 0.999;
          const pp = pop(f, VIS.route[0] + j * 10, { damping: 11, stiffness: 180, mass: 0.6 });
          return (
            <g key={si} transform={`translate(${p.x} ${p.y}) rotate(${-ROT}) scale(${pp})`}>
              <path d="M0 0 C -14 -16, -17 -36, 0 -40 C 17 -36, 14 -16, 0 0Z" fill={reached ? C.primary : "#94A3B8"} />
              <text x={0} y={-22} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff" fontFamily="Roboto">
                {j + 1}
              </text>
            </g>
          );
        })}
        <g transform={`translate(${me.x} ${me.y}) rotate(${-ROT})`}>
          <circle r={18} fill={C.violet} opacity={0.18} />
          <circle r={12} fill={C.violet} stroke="#fff" strokeWidth={3} />
        </g>
      </g>
    </svg>
  );
};

export const VisitasScreen: React.FC<{ f: number }> = ({ f }) => {
  const m = range(f, VIS.mapIn, [0, 1], easeInOut);
  const map = f >= VIS.toMap;
  const cardIn = range(f, [VIS.mapIn[1], VIS.mapIn[1] + 12], [0, 1], easeOut);
  const stopIdx = Math.min(3, Math.floor(range(f, VIS.route, [0, 3.99], (t) => t)));
  const p = PDVS[stopIdx];
  return (
    <Screen>
      <Header title="Visitas" actions={["calendar", "filter"]}>
        <ToggleRow map={map} />
      </Header>
      <div style={{ position: "absolute", left: 0, right: 0, top: 152, bottom: 80, overflow: "hidden" }}>
        {/* Lista → mapa: el mapa se revela en círculo desde el botón de ruta del encabezado */}
        <Reveal
          p={m}
          at={{ x: 356, y: -34 }}
          a={
            <div style={{ position: "absolute", inset: 0, padding: S.lg }}>
              {PDVS.map((pv, i) => (
                <PdvCard key={pv.name} p={pv} f={f} i={i} active={i === 0} />
              ))}
            </div>
          }
          b={
          <div style={{ position: "absolute", inset: 0 }}>
            <MapView f={f} h={620} />
            <div style={{ position: "absolute", right: S.md, top: 260, display: "flex", flexDirection: "column", gap: S.sm }}>
              {(["search", "pin"] as IconName[]).map((ic) => (
                <div key={ic} style={{ width: 36, height: 36, borderRadius: R.pill, background: C.surface, boxShadow: SH.card, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={ic} size={18} color={C.primary} fill={false} />
                </div>
              ))}
            </div>
            <div style={{ position: "absolute", left: S.lg, right: S.lg, bottom: S.lg, transform: `translateY(${(1 - cardIn) * 140}px)` }}>
              <Card style={{ padding: S.md }}>
                <div style={{ display: "flex", alignItems: "center", gap: S.sm }}>
                  <Avatar initials={TEAM[0].initials} color={TEAM[0].color} size={28} ring={false} />
                  <div style={{ ...T.cardTitle, flex: 1 }}>{p.name}</div>
                  <Chip tone="info">{`Parada ${stopIdx + 1}/4`}</Chip>
                </div>
                <div style={{ ...T.caption, color: C.text2, marginTop: S.xs }}>
                  {p.km} · {p.addr}
                </div>
                <div style={{ display: "flex", gap: S.xs, marginTop: S.sm }}>
                  <Chip tone="neutral" icon="clock">
                    Programado {p.time}
                  </Chip>
                  <Chip tone="success" solid icon="check">
                    En ruta
                  </Chip>
                </div>
              </Card>
            </div>
          </div>
          }
        />
      </div>
      <BottomNav active={2} />
      {m < 1 && <Fab />}
      <Tap f={f} at={VIS.toMap} x={352} y={122} />
    </Screen>
  );
};
