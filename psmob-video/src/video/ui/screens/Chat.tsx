import React from "react";
import { color, radius, shadow } from "../../../design/psmob-tokens";
import { easeInOut, easeOut, pop, range } from "../../../lib/motion";
import { TEAM } from "../../data";
import { Icon } from "../icons";

// Chat de equipo como bottom sheet que sube sobre la pantalla anterior.
export const CHAT = { sheet: [4, 22] as [number, number], incoming: 26, typing: [44, 62] as [number, number], outgoing: 62, read: 84 };

const MiniChart: React.FC = () => (
  <svg width="100%" height="54" viewBox="0 0 200 54">
    {[26, 34, 22, 40, 30, 46, 38].map((h, i) => (
      <rect key={i} x={6 + i * 27} y={54 - h} width={16} height={h} rx={3} fill={i === 5 ? "#7C5CFC" : "#BBDEFB"} />
    ))}
  </svg>
);

export const ChatSheet: React.FC<{ f: number; closeAt?: number }> = ({ f, closeAt }) => {
  const open = range(f, CHAT.sheet, [0, 1], easeOut) * (closeAt === undefined ? 1 : 1 - range(f, [closeAt, closeAt + 12], [0, 1], easeInOut));
  const pin = pop(f, CHAT.incoming, { damping: 10, stiffness: 170, mass: 0.6 });
  const pout = pop(f, CHAT.outgoing, { damping: 9, stiffness: 190, mass: 0.6 });
  const typing = f >= CHAT.typing[0] && f < CHAT.typing[1];
  const c1 = range(f, [CHAT.outgoing + 8, CHAT.outgoing + 14], [0, 1]);
  const c2 = range(f, [CHAT.outgoing + 14, CHAT.outgoing + 20], [0, 1]);
  const read = f >= CHAT.read;
  const caro = TEAM[1];
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "rgba(19,13,93,0.45)", opacity: open }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 700,
          transform: `translateY(${(1 - open) * 720}px)`,
          background: "#EEF1F7",
          borderRadius: "24px 24px 0 0",
          boxShadow: shadow.modal,
          overflow: "hidden",
        }}
      >
        <div style={{ background: color.surface, padding: "10px 18px 14px", borderBottom: `1px solid ${color.border}` }}>
          <div style={{ width: 44, height: 5, borderRadius: 3, background: "#CFD8DC", margin: "0 auto 12px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex" }}>
              {TEAM.slice(0, 3).map((t, i) => (
                <div key={t.initials} style={{ width: 36, height: 36, borderRadius: 18, background: t.color, color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: i ? -10 : 0, boxShadow: "0 0 0 2px #fff" }}>
                  {t.initials}
                </div>
              ))}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 600, color: color.textPrimary }}>Equipo Norte</div>
              <div style={{ fontSize: 12.5, color: color.success }}>5 integrantes · en línea</div>
            </div>
            <Icon name="x" size={22} color={color.textSecondary} fill={false} />
          </div>
        </div>
        <div style={{ padding: "18px 14px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ alignSelf: "center", fontSize: 12, color: color.textSecondary, background: "#E1E6EF", padding: "4px 12px", borderRadius: radius.pill }}>Hoy</div>
          {f >= CHAT.incoming && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end", transformOrigin: "0% 100%", transform: `scale(${pin})` }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: caro.color, color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {caro.initials}
              </div>
              <div style={{ maxWidth: 270, background: color.surface, borderRadius: "18px 18px 18px 4px", boxShadow: shadow.card, padding: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: caro.color, marginBottom: 6 }}>Caro</div>
                <div style={{ background: "#F5F7FB", borderRadius: 10, padding: "8px 10px", marginBottom: 8 }}>
                  <MiniChart />
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                    <Icon name="chart" size={16} color={color.accent} />
                    <span style={{ fontSize: 12, color: color.textSecondary }}>Reporte OSA · 28/09/2026</span>
                  </div>
                </div>
                <div style={{ fontSize: 16, color: color.textPrimary, padding: "0 4px" }}>¿Viste los datos que te envié?</div>
              </div>
            </div>
          )}
          {typing && (
            <div style={{ alignSelf: "flex-end", background: color.primaryLight, borderRadius: "18px 18px 4px 18px", padding: "14px 18px", display: "flex", gap: 6 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 9, height: 9, borderRadius: 5, background: color.primaryDark, opacity: 0.35 + 0.65 * Math.max(0, Math.sin((f - CHAT.typing[0]) * 0.5 - i * 0.9)) }} />
              ))}
            </div>
          )}
          {f >= CHAT.outgoing && (
            <div
              style={{
                alignSelf: "flex-end",
                background: color.primary,
                color: "#fff",
                borderRadius: "18px 18px 4px 18px",
                padding: "12px 14px 8px 16px",
                transformOrigin: "100% 100%",
                transform: `scale(${pout})`,
                display: "flex",
                alignItems: "flex-end",
                gap: 10,
              }}
            >
              <div style={{ fontSize: 16 }}>¡Los revisaré ahora!</div>
              <div style={{ fontSize: 11.5, opacity: 0.85 }}>10:42</div>
              <svg width="24" height="15" viewBox="0 0 26 16">
                {[
                  ["M2 8.5 6 12.5 13 4", c1],
                  ["M10 11 11.5 12.5 18.5 4", c2],
                ].map(([d, k], i) => (
                  <path key={i} d={String(d)} fill="none" stroke={read ? "#B3E5FC" : "rgba(255,255,255,0.7)"} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Number(k)} />
                ))}
              </svg>
            </div>
          )}
          {read && <div style={{ alignSelf: "flex-end", fontSize: 12, color: color.textSecondary, opacity: range(f, [CHAT.read, CHAT.read + 8], [0, 1]) }}>Leído</div>}
        </div>
        <div style={{ position: "absolute", left: 12, right: 12, bottom: 22, height: 52, borderRadius: 26, background: color.surface, boxShadow: shadow.card, display: "flex", alignItems: "center", padding: "0 8px 0 18px", gap: 10 }}>
          <div style={{ flex: 1, fontSize: 15, color: color.textDisabled }}>Escribí un mensaje…</div>
          <div style={{ width: 38, height: 38, borderRadius: 19, background: color.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="send" size={20} color="#fff" fill={false} />
          </div>
        </div>
      </div>
    </>
  );
};
