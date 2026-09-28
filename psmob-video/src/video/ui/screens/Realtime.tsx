import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { color, radius, shadow } from "../../../design/psmob-tokens";
import { easeInOut, easeOut, osc, range } from "../../../lib/motion";
import { ar, CAT, catSrc, EXHIB } from "../../data";
import { AppHeader, BottomNav, SCREEN_W } from "../Phone";

// Escena 10: una sola interfaz que pasa por Indicadores → Exhibición → OSA con swipe interno.
// Los valores hacen count-up y luego se actualizan "en vivo" con un pulso.
export const RT = {
  swipe1: [52, 64] as [number, number],
  swipe2: [100, 112] as [number, number],
  live1: 36,
  live2: 84,
  live3: 124,
};

const Gauge: React.FC<{ value: number; size: number; track?: string; bar?: string; stroke?: number; target?: number }> = ({
  value,
  size,
  track = "rgba(255,255,255,0.18)",
  bar = "#4FC3F7",
  stroke = 9,
  target,
}) => {
  const r = size / 2 - stroke;
  const C = Math.PI * r; // semicírculo
  return (
    <svg width={size} height={size / 2 + stroke} viewBox={`0 0 ${size} ${size / 2 + stroke}`}>
      <path d={`M${stroke} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke} ${size / 2}`} fill="none" stroke={track} strokeWidth={stroke} strokeLinecap="round" />
      <path
        d={`M${stroke} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke} ${size / 2}`}
        fill="none"
        stroke={bar}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${C} ${C}`}
        strokeDashoffset={C * (1 - value / 100)}
      />
      {target !== undefined && (
        <circle cx={size / 2 - Math.cos((target / 100) * Math.PI) * r} cy={size / 2 - Math.sin((target / 100) * Math.PI) * r} r={stroke * 0.45} fill="#fff" />
      )}
    </svg>
  );
};

const Pulse: React.FC<{ f: number; at: number; children: React.ReactNode; radiusPx?: number }> = ({ f, at, children, radiusPx = 16 }) => {
  const k = range(f, [at, at + 18], [0, 1], easeOut);
  const on = f >= at && k < 1;
  return (
    <div style={{ position: "relative" }}>
      {children}
      {on && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: radiusPx,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: "45%",
              left: `${-50 + k * 160}%`,
              background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))",
            }}
          />
          <div style={{ position: "absolute", inset: 0, borderRadius: radiusPx, boxShadow: `inset 0 0 0 3px rgba(124,92,252,${0.9 * (1 - k)})` }} />
        </div>
      )}
    </div>
  );
};

const count = (f: number, [a, b]: [number, number], to: number, from = 0) => interpolate(f, [a, b], [from, to], { easing: easeOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const Indicadores: React.FC<{ f: number }> = ({ f }) => {
  const cards = [
    { k: "OSA", v: 64, live: 71, obj: 85 },
    { k: "Exhibición", v: 64, obj: 80 },
    { k: "Formularios", v: 89, obj: 85 },
    { k: "Cuota", v: 89, obj: 100 },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #1565C0, #1E3FC4)" }}>
      <AppHeader title="Indicadores" back right={["filter"]} transparent />
      <div style={{ display: "flex", gap: 16, justifyContent: "center", color: "#fff", fontSize: 12.5, opacity: 0.9, marginTop: 4 }}>
        <span>● Objetivos</span>
        <span>◠ General</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, padding: "16px 18px" }}>
        {cards.map((c, i) => {
          const v = count(f, [4 + i * 3, 30 + i * 3], c.v) + (c.live && f >= RT.live1 ? count(f, [RT.live1, RT.live1 + 14], c.live - c.v) : 0);
          return (
            <Pulse key={c.k} f={f} at={c.live ? RT.live1 : 1e9} radiusPx={20}>
              <div style={{ background: "rgba(10,20,90,0.35)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 20, padding: "16px 10px 14px", display: "flex", flexDirection: "column", alignItems: "center", color: "#fff" }}>
                <div style={{ position: "relative" }}>
                  <Gauge value={v} size={130} target={c.obj} bar={v >= c.obj ? "#69F0AE" : "#4FC3F7"} />
                  <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontSize: 30, fontWeight: 700 }}>
                    {Math.round(v)}
                    <span style={{ fontSize: 16 }}>%</span>
                  </div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, marginTop: 6 }}>{c.k}</div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
                  Objetivo <span style={{ color: "#69F0AE" }}>{c.obj}%</span>
                </div>
              </div>
            </Pulse>
          );
        })}
      </div>
      <div style={{ margin: "0 18px", background: "rgba(10,20,90,0.35)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 20, padding: 16, color: "#fff", display: "flex", alignItems: "center", gap: 14 }}>
        <Gauge value={count(f, [14, 40], 89)} size={110} bar="#69F0AE" target={100} />
        <div>
          <div style={{ fontSize: 26, fontWeight: 700 }}>{Math.round(count(f, [14, 40], 89))}%</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Incorporaciones</div>
        </div>
      </div>
    </div>
  );
};

const Exhibicion: React.FC<{ f: number }> = ({ f }) => {
  const g = count(f, [58, 80], 30) + (f >= RT.live2 ? count(f, [RT.live2, RT.live2 + 14], 4) : 0);
  return (
    <div style={{ position: "absolute", inset: 0, background: color.background }}>
      <div style={{ background: "linear-gradient(180deg, #1565C0, #1E3FC4)", paddingBottom: 18 }}>
        <AppHeader title="Exhibición" back right={["filter"]} transparent />
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "0 22px", color: "#fff" }}>
          <div style={{ position: "relative" }}>
            <Gauge value={g} size={150} bar="#4FC3F7" target={100} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontSize: 32, fontWeight: 700 }}>
              {Math.round(g)}
              <span style={{ fontSize: 16 }}>%</span>
            </div>
          </div>
          <div style={{ fontSize: 13.5, lineHeight: 1.8 }}>
            <div>
              Objetivo <b style={{ color: "#69F0AE" }}>100%</b>
            </div>
            <div>
              General <b>{Math.round(g)}%</b>
            </div>
          </div>
        </div>
      </div>
      <div style={{ margin: "-6px 16px 0", background: "#E3EAF5", borderRadius: 14, padding: 4, display: "flex" }}>
        {["Categoría", "Cliente y PDV"].map((t, i) => (
          <div key={t} style={{ flex: 1, textAlign: "center", padding: "9px 0", borderRadius: 11, background: i === 0 ? color.surface : "transparent", fontSize: 13.5, fontWeight: 600, color: i === 0 ? color.primaryDark : color.textSecondary }}>
            {t}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: 16 }}>
        {EXHIB.map((e, i) => {
          const upd = i === 3 && f >= RT.live2 ? count(f, [RT.live2, RT.live2 + 12], 1.28) : 0;
          const v = count(f, [60 + i * 2, 84 + i * 2], e.pct) + upd;
          return (
            <Pulse key={e.cat} f={f} at={i === 3 ? RT.live2 : 1e9}>
              <div style={{ background: color.surface, borderRadius: 16, boxShadow: shadow.card, padding: "10px 12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Img src={staticFile(catSrc(e.cat))} style={{ width: 54, height: 54 }} />
                <div style={{ fontSize: 12, color: color.textSecondary, marginTop: 2 }}>{CAT[e.cat].name}</div>
                <div style={{ fontSize: 19, fontWeight: 700, color: color.textPrimary }}>{ar(v)}%</div>
                <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#E3EAF5", marginTop: 6 }}>
                  <div style={{ width: `${v}%`, height: "100%", borderRadius: 3, background: color.primary }} />
                </div>
              </div>
            </Pulse>
          );
        })}
      </div>
    </div>
  );
};

const Osa: React.FC<{ f: number }> = ({ f }) => {
  const rows = [
    { k: "Limpieza hogar", v: 9.48, c: color.danger },
    { k: "Cuidado personal", v: 50.54, c: "#FBC02D" },
    { k: "Almacén", v: 76.56, c: color.success },
    { k: "Alimentos", v: 50.54, c: "#FBC02D" },
    { k: "Aderezos", v: 98.89, c: color.success },
  ];
  const g = count(f, [106, 124], 30) + (f >= RT.live3 ? count(f, [RT.live3, RT.live3 + 14], 6) : 0);
  return (
    <div style={{ position: "absolute", inset: 0, background: color.background }}>
      <AppHeader title="OSA" back right={["filter"]} />
      <div style={{ margin: 14, background: color.surface, borderRadius: 18, boxShadow: shadow.card, padding: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative" }}>
            <Gauge value={g} size={120} track="#E3EAF5" bar={color.primary} target={100} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontSize: 26, fontWeight: 700, color: color.textPrimary }}>{Math.round(g)}%</div>
          </div>
          <div style={{ fontSize: 13, color: color.textSecondary, lineHeight: 1.8 }}>
            <div>
              Objetivo <b style={{ color: color.successDark }}>100%</b>
            </div>
            <div>
              General <b style={{ color: color.textPrimary }}>{Math.round(g)}%</b>
            </div>
            <div style={{ fontSize: 12 }}>28/09/2026</div>
          </div>
        </div>
      </div>
      <div style={{ margin: "0 14px", background: color.surface, borderRadius: 18, boxShadow: shadow.card, padding: "12px 14px" }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: color.textPrimary, marginBottom: 8 }}>Por negocio y categoría</div>
        {rows.map((r, i) => {
          const v = count(f, [108 + i * 3, 130 + i * 3], r.v);
          return (
            <div key={r.k} style={{ padding: "9px 0", borderBottom: i < rows.length - 1 ? "1px solid #F0F0F0" : undefined }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: color.textPrimary }}>
                <span>{r.k}</span>
                <b>{ar(v)}%</b>
              </div>
              <div style={{ height: 7, borderRadius: 4, background: "#EEF1F5", marginTop: 6 }}>
                <div style={{ width: `${v}%`, height: "100%", borderRadius: 4, background: r.c }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const RealtimeFlow: React.FC<{ f: number }> = ({ f }) => {
  const s1 = range(f, RT.swipe1, [0, 1], easeInOut);
  const s2 = range(f, RT.swipe2, [0, 1], easeInOut);
  const x = -(s1 + s2) * SCREEN_W;
  const liveBlink = 0.5 + 0.5 * osc(f, 20, 1);
  // Dedo de swipe
  const swipe = (r: [number, number]) => {
    const k = range(f, [r[0] - 6, r[1]], [0, 1], easeInOut);
    if (f < r[0] - 8 || f > r[1] + 4) return null;
    return (
      <div style={{ position: "absolute", left: interpolate(k, [0, 1], [320, 80]) - 28, top: 560, width: 56, height: 56, borderRadius: 28, background: "rgba(255,255,255,0.5)", border: "3px solid rgba(255,255,255,0.95)", boxShadow: "0 6px 20px rgba(19,13,93,0.35)" }} />
    );
  };
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: SCREEN_W * 3, transform: `translateX(${x}px)` }}>
        {[Indicadores, Exhibicion, Osa].map((P, i) => (
          <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: i * SCREEN_W, width: SCREEN_W, overflow: "hidden" }}>
            <P f={f} />
          </div>
        ))}
      </div>
      {/* Chip "en vivo" sobre la app */}
      <div style={{ position: "absolute", left: "50%", top: 118, transform: "translateX(-50%)", background: "rgba(19,13,93,0.82)", color: "#fff", borderRadius: radius.pill, padding: "6px 12px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, boxShadow: shadow.modal, whiteSpace: "nowrap", opacity: f > 2 ? 1 : 0 }}>
        <span style={{ width: 8, height: 8, borderRadius: 4, background: "#69F0AE", opacity: liveBlink }} />
        En vivo · actualizado hace 1 s
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 92, display: "flex", justifyContent: "center", gap: 6 }}>
        {[0, 1, 2].map((i) => {
          const active = Math.round(s1 + s2) === i;
          return <div key={i} style={{ width: active ? 22 : 8, height: 8, borderRadius: 4, background: active ? color.accent : "rgba(120,120,160,0.4)" }} />;
        })}
      </div>
      <BottomNav items={[{ icon: "home", label: "Inicio" }, { icon: "users", label: "Equipo" }, { icon: "chart", label: "Indicadores" }, { icon: "notes", label: "Notas" }, { icon: "user", label: "Perfil" }]} active={2} />
      {swipe(RT.swipe1)}
      {swipe(RT.swipe2)}
    </div>
  );
};
