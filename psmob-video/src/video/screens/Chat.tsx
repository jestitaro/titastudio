import React from "react";
import { pop, range } from "../../lib/motion";
import { Chip, Header, Screen, Segmented } from "../ds/ui";
import { C, R, S, SH, T } from "../ds/tokens";
import { Icon, IconName } from "../ui/icons";
import { PDVS } from "./data";

// Chat por PDV (captura de corrección 5): header azul con el PDV, selector General / Ejecución,
// burbujas con tag PDV, audio, hora y doble check.
// Diálogo de la escena 8 (los mismos textos que los globos que se ven entre los personajes).
export const CONVO = [
  { from: "caro", text: "¿Viste los datos que te envié?", time: "10:40" },
  { from: "nico", text: "¡Sí! Los reviso ahora", time: "10:41" },
  { from: "caro", text: "Sumá fotos de la góndola, porfa", time: "10:41" },
  { from: "nico", text: "Dale, te las mando desde el PDV", time: "10:42" },
] as const;

export const CHAT = { incoming: 6, typing: [26, 44] as [number, number], reply: 44, read: 62, attach: [74, 100] as [number, number] };

const PdvTag = () => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 3, background: C.primary, color: "#fff", borderRadius: R.pill, padding: "2px 7px", ...T.badge, fontSize: 10 }}>
    <Icon name="pin" size={10} color="#fff" fill={false} sw={2.4} /> PDV
  </span>
);

const Checks: React.FC<{ k1: number; k2: number; read: boolean }> = ({ k1, k2, read }) => (
  <svg width="20" height="12" viewBox="0 0 26 16">
    {[
      ["M2 8.5 6 12.5 13 4", k1],
      ["M10 11 11.5 12.5 18.5 4", k2],
    ].map(([d, k], i) => (
      <path key={i} d={String(d)} fill="none" stroke={read ? C.primary : C.text3} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Number(k)} />
    ))}
  </svg>
);

const Bubble: React.FC<{ mine?: boolean; p: number; children: React.ReactNode; time: string; checks?: React.ReactNode }> = ({ mine, p, children, time, checks }) => (
  <div
    style={{
      alignSelf: mine ? "flex-end" : "flex-start",
      maxWidth: 290,
      background: mine ? C.primarySoft : "#EEF2F7",
      borderRadius: mine ? `${R.card}px ${R.card}px ${R.sm / 2}px ${R.card}px` : `${R.card}px ${R.card}px ${R.card}px ${R.sm / 2}px`,
      padding: `${S.sm + 2}px ${S.md}px`,
      transformOrigin: mine ? "100% 100%" : "0% 100%",
      transform: `scale(${p})`,
      opacity: Math.min(1, p * 2),
    }}
  >
    <div style={{ ...T.body, color: C.text }}>{children}</div>
    <div style={{ display: "flex", alignItems: "center", gap: S.sm, marginTop: S.xs }}>
      <PdvTag />
      <div style={{ flex: 1 }} />
      <span style={{ ...T.caption, fontSize: 11, color: C.text2 }}>{time}</span>
      {checks}
    </div>
  </div>
);

export const ChatScreen: React.FC<{ f: number; mine: "caro" | "nico" }> = ({ f, mine }) => {
  const nicoView = mine === "nico";
  const k1 = range(f, [CHAT.reply + 6, CHAT.reply + 12], [0, 1]);
  const k2 = range(f, [CHAT.reply + 12, CHAT.reply + 18], [0, 1]);
  const read = f >= CHAT.read;
  const sheet = range(f, CHAT.attach, [0, 1]) > 0 ? pop(f, CHAT.attach[0], { damping: 16, stiffness: 140 }) * (1 - range(f, [CHAT.attach[1] - 6, CHAT.attach[1]], [0, 1])) : 0;
  return (
    <Screen bg={C.surface}>
      <Header title={PDVS[0].name} actions={[]} />
      <div style={{ padding: `${S.md}px ${S.lg}px` }}>
        <Segmented items={["General", "Ejecución"]} active={1} violet icons={["search", "clock"]} />
      </div>
      <div style={{ padding: `0 ${S.lg}px`, display: "flex", flexDirection: "column", gap: S.md }}>
        <div style={{ alignSelf: "center" }}>
          <Chip tone="neutral">Hoy</Chip>
        </div>
        {/* La conversación que Caro y Nico acaban de tener (escena 8) */}
        {CONVO.map((m, i) => {
          const last = i === CONVO.length - 1;
          const own = (m.from === "nico") === nicoView;
          return (
            <Bubble key={i} mine={own} p={1} time={m.time} checks={own ? <Checks k1={last ? k1 : 1} k2={last ? k2 : 1} read={last ? read : true} /> : undefined}>
              {m.text}
            </Bubble>
          );
        })}
      </div>
      {/* Barra de entrada */}
      <div style={{ position: "absolute", left: S.lg, right: S.lg, bottom: S.xl, display: "flex", gap: S.sm, alignItems: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: R.pill, background: C.violet, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="plus" size={22} color="#fff" fill={false} />
        </div>
        <div style={{ flex: 1, height: 44, borderRadius: R.pill, border: `1.5px solid ${C.border}`, display: "flex", alignItems: "center", padding: `0 ${S.lg}px`, ...T.body, color: C.text3 }}>Escribí un mensaje…</div>
      </div>
      {/* Hoja de adjuntos (como en la app) */}
      {sheet > 0.01 && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: "#141A33", borderRadius: `${R.lg}px ${R.lg}px 0 0`, padding: `${S.xl}px ${S.lg}px ${S.xxl}px`, transform: `translateY(${(1 - sheet) * 100}%)`, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", rowGap: S.lg, boxShadow: SH.float }}>
          {(
            [
              ["notes", "Documento"],
              ["grid", "Imagen"],
              ["camera", "Tomar foto"],
              ["checklist", "Tarea"],
              ["route", "Ruteo"],
              ["form", "Formulario"],
            ] as [IconName, string][]
          ).map(([ic, l]) => (
            <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: S.xs }}>
              <div style={{ width: 44, height: 44, borderRadius: R.pill, background: C.violet, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={ic} size={22} color="#fff" fill={false} />
              </div>
              <div style={{ ...T.caption, color: "#fff" }}>{l}</div>
            </div>
          ))}
        </div>
      )}
    </Screen>
  );
};
