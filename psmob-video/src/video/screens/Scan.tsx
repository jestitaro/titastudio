import React from "react";
import { interpolate } from "remotion";
import { easeOut, pop, range } from "../../lib/motion";
import { Button, Card, Chip, Header, ListRow, Screen, Tap, Thumb, Toast } from "../ds/ui";
import { C, FONT, R, S, T } from "../ds/tokens";
import { QSLogo } from "../brand/QSLogo";
import { fillTri } from "../brand/loader";
import { FACINGS, Gondola, TAGS } from "../ui/Gondola";
import { Icon, IconName } from "../ui/icons";
import { PROD } from "./data";

// Cámara de AiFred: feed de la góndola real del video, barrido, bounding boxes con etiquetas genéricas,
// precios reconocidos, planograma (OK / faltante / fuera de posición) y progreso.
export const SCAN = { boxes: 14, prices: 34, plano: 46, p50: 36, p100: 92 };
export const VIEW = { x: 2440, y: 150, s: 0.5, w: 390, h: 520 };

const inView = FACINGS.filter((p) => p.x > VIEW.x + 20 && p.x < VIEW.x + VIEW.w / VIEW.s - 20 && p.level < 3);
const tagsInView = TAGS.filter((t) => t.x > VIEW.x + 40 && t.x < VIEW.x + VIEW.w / VIEW.s - 40 && t.level < 3);
const LABEL = ["Cuidado personal", "Limpieza", "Almacén"];

export const ScanScreen: React.FC<{ f: number; offline?: number; progress?: number }> = ({ f, offline = 0, progress: pOverride }) => {
  const progress = pOverride ?? Math.round(interpolate(f, [2, SCAN.p50, SCAN.p50 + 14, SCAN.p100], [0, 50, 50, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const sweepY = ((f * 11) % (VIEW.h - 40)) + 20;
  const sheet = range(f, [SCAN.prices - 4, SCAN.prices + 8], [0, 1], easeOut);
  return (
    <Screen bg={C.camera}>
      <div style={{ position: "absolute", left: 0, top: 0, width: VIEW.w, height: VIEW.h + 100, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -VIEW.x * VIEW.s, top: -VIEW.y * VIEW.s + 90, transform: `scale(${VIEW.s})`, transformOrigin: "0 0" }}>
          <Gondola from={VIEW.x - 200} to={VIEW.x + 1000} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "rgba(11,16,38,0.25)" }} />
        {progress < 100 && <div style={{ position: "absolute", left: 0, right: 0, top: 90 + sweepY, height: 56, background: "linear-gradient(180deg, rgba(112,37,224,0), rgba(112,37,224,0.35))", borderBottom: "2px solid #B79CFF" }} />}
        {inView.map((p, i) => {
          const k = pop(f, SCAN.boxes + i * 0.9, { damping: 13, stiffness: 190, mass: 0.6 });
          if (k <= 0.01) return null;
          const bx = (p.x - VIEW.x) * VIEW.s;
          const by = (p.base - VIEW.y) * VIEW.s + 90;
          const w = p.w * VIEW.s + 2;
          const h = p.h * VIEW.s;
          const bad = p.kind !== "ok";
          const planoOn = f >= SCAN.plano + i * 0.5;
          const c = !planoOn ? "#B79CFF" : bad ? C.error : "#4ADE80";
          return (
            <div key={`${p.level}-${Math.round(p.x)}`} style={{ position: "absolute", left: bx - w / 2, top: by - h, width: w, height: h, border: `2px solid ${c}`, borderRadius: 4, transform: `scale(${0.85 + 0.15 * k})`, opacity: k, background: bad && planoOn ? "rgba(220,38,38,0.18)" : undefined }}>
              {planoOn && bad && (
                <div style={{ position: "absolute", left: "50%", top: -22, transform: "translateX(-50%)", whiteSpace: "nowrap" }}>
                  <Chip tone="error" solid icon={p.kind === "gap" ? "alert" : "x"}>
                    {p.kind === "gap" ? "Faltante" : "Fuera de posición"}
                  </Chip>
                </div>
              )}
            </div>
          );
        })}
        {tagsInView.map((t, i) => {
          const p = pop(f, SCAN.prices + i * 2, { damping: 11, stiffness: 180, mass: 0.6 });
          if (p <= 0.01) return null;
          return (
            <div key={`${t.level}-${t.x}`} style={{ position: "absolute", left: (t.x - VIEW.x) * VIEW.s, top: (t.y - VIEW.y) * VIEW.s + 96, transform: `translate(-50%, -50%) scale(${p})` }}>
              <Chip tone="success" solid icon="check">
                Precio OK
              </Chip>
            </div>
          );
        })}
        {[0, 1, 2].map((lv) => {
          const p = pop(f, SCAN.boxes + 6 + lv * 3, { damping: 12, stiffness: 170 });
          if (p <= 0.01) return null;
          return (
            <div key={lv} style={{ position: "absolute", left: S.md, top: (GONDOLA_TOP(lv) - VIEW.y) * VIEW.s + 90, transform: `scale(${p})`, transformOrigin: "0 0" }}>
              <Chip tone="violet" solid>
                {LABEL[lv]}
              </Chip>
            </div>
          );
        })}
      </div>
      {/* Barra superior */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 44, height: 48, display: "flex", alignItems: "center", gap: S.sm, padding: `0 ${S.lg}px` }}>
        <Chip tone="violet" solid icon="sparkle">
          {`AiFred · ${progress < 100 ? "reconociendo" : "listo"}`}
        </Chip>
        <div style={{ flex: 1 }} />
        {offline > 0 && (
          <div style={{ opacity: offline }}>
            <Chip tone="neutral" icon="offline">
              Sin conexión
            </Chip>
          </div>
        )}
        <Icon name="x" size={22} color="#fff" fill={false} />
      </div>
      {/* Progreso */}
      <div style={{ position: "absolute", left: 0, right: 0, top: VIEW.h + 100, height: 4, background: "rgba(255,255,255,0.15)" }}>
        <div style={{ width: `${progress}%`, height: "100%", background: C.violet }} />
      </div>
      <div style={{ position: "absolute", right: S.lg, top: VIEW.h + 72, ...T.cardTitle, color: "#fff" }}>{progress}%</div>
      {/* Panel de reconocidos */}
      <div style={{ position: "absolute", left: 0, right: 0, top: VIEW.h + 104, bottom: 0, background: C.surface, borderRadius: `${R.lg}px ${R.lg}px 0 0`, padding: `${S.md}px ${S.lg}px`, transform: `translateY(${(1 - sheet) * 80}px)`, opacity: sheet }}>
        <div style={{ ...T.cardTitle, marginBottom: S.xs }}>Reconocidos</div>
        {[PROD.detergente, PROD.lavandina].map((p, i) => (
          <ListRow key={p.ean} divider={i === 0} leading={<Thumb src={p.src} size={36} />} mono={p.ean} title={p.name} trailing={<Chip tone="info">{p.price}</Chip>} />
        ))}
      </div>
    </Screen>
  );
};
const GONDOLA_TOP = (lv: number) => [176, 408, 666][lv];

// Resumen offline: guardado local con feedback positivo, Enviar → Enviando (loader de marca).
export const SUM = { toast: 4, tap: 40, sending: 44 };

export const SummaryScreen: React.FC<{ f: number }> = ({ f }) => {
  const toast = pop(f, SUM.toast, { damping: 14, stiffness: 150 });
  const sending = f >= SUM.sending;
  const rows: [IconName, string, string, string][] = [
    ["check", "Productos reconocidos", "48", C.success],
    ["dollar", "Precios validados", "46 / 48", C.success],
    ["grid", "Planograma", "92%", C.violet],
    ["alert", "Faltantes y fuera de posición", "2", C.error],
  ];
  return (
    <Screen>
      <Header title="Relevamiento de góndola" />
      <div style={{ padding: S.lg }}>
        <div style={{ transform: `translateY(${(1 - toast) * -30}px)`, opacity: Math.min(1, toast * 2), marginBottom: S.md }}>
          <Toast icon="cloud" title="Modo sin conexión" subtitle="Guardado localmente · se sincroniza solo" tone="violet" />
        </div>
        <Card style={{ padding: `0 ${S.md}px` }}>
          {rows.map(([ic, l, v, c], i) => {
            const p = pop(f, 8 + i * 3, { damping: 12, stiffness: 170, mass: 0.6 });
            return (
              <div key={l} style={{ transform: `translateX(${(1 - p) * 30}px)`, opacity: Math.min(1, p * 2) }}>
                <ListRow divider={i < rows.length - 1} leading={<Icon name={ic} size={22} color={c} />} title={l} trailing={<span style={{ ...T.sectionTitle }}>{v}</span>} />
              </div>
            );
          })}
        </Card>
      </div>
      <div style={{ position: "absolute", left: S.lg, right: S.lg, bottom: S.xl }}>
        <Button variant="violet" icon={sending ? undefined : "send"}>
          {sending ? (
            <span style={{ display: "flex", alignItems: "center", gap: S.sm, fontFamily: FONT }}>
              <QSLogo width={22} isoOnly isoColor="#FFFFFF" id="sumload" tri={fillTri(((f - SUM.sending) % 24) / 24, 0.3)} />
              Enviando…
            </span>
          ) : (
            "Enviar formulario"
          )}
        </Button>
      </div>
      <Tap f={f} at={SUM.tap} x={195} y={796} />
    </Screen>
  );
};
