import React from "react";
import { interpolate } from "remotion";
import { color, fontWeight, radius, shadow } from "../../../design/psmob-tokens";
import { easeInOut, easeOut, pop, range } from "../../../lib/motion";
import { PDV, TEAM } from "../../data";
import { robotoMono } from "../../lib/fonts";
import { Icon } from "../icons";
import { AppHeader, BottomNav, Chip, NAV_MAIN, SCREEN_H, SCREEN_W, Tap } from "../Phone";

// Una sola experiencia de UI para las escenas 6–7:
// visita activa → scroll → "Mi equipo hoy" (slots que se llenan por magnetización) → tap en "Ruta de hoy"
// → la card de ruta se expande a pantalla completa y las rutas se despliegan.
export const ORG = {
  scrollTeam: [18, 40] as [number, number],
  magnet: [34, 70] as [number, number], // los avatares externos llegan a sus slots en este rango
  scrollRoute: [72, 92] as [number, number],
  tapRoute: 98,
  expand: [102, 124] as [number, number],
  routes: [112, 158] as [number, number],
};

// Slots del equipo en coordenadas de pantalla (para que la escena calcule los destinos del imán).
const TEAM_TOP = 420;
export const teamSlot = (i: number, scroll: number) => ({ x: 52 + i * 71, y: TEAM_TOP + 92 - scroll });
export const orgScroll = (f: number) => range(f, ORG.scrollTeam, [0, 170], easeInOut) + range(f, ORG.scrollRoute, [0, 250], easeInOut);
export const slotArrive = (f: number, i: number) => range(f, [ORG.magnet[0] + i * 6, ORG.magnet[0] + i * 6 + 18], [0, 1], easeInOut);

const Avatar: React.FC<{ t: (typeof TEAM)[number]; size?: number }> = ({ t, size = 54 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: t.color,
      color: "#fff",
      fontSize: size * 0.34,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 0 0 3px #fff",
    }}
  >
    {t.initials}
  </div>
);
export { Avatar };

// Mapa de ruteo simplificado (manzanas + avenidas) con rutas por integrante.
const ROUTES = [
  { color: "#1976D2", pts: [[60, 520], [120, 430], [110, 330], [190, 260], [260, 190]] },
  { color: "#7C5CFC", pts: [[60, 520], [170, 500], [250, 420], [330, 380]] },
  { color: "#2E7D32", pts: [[60, 520], [90, 610], [200, 640], [300, 600], [340, 520]] },
];
const pathLen = (pts: number[][]) => pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
const toD = (pts: number[][]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");

export const RouteMap: React.FC<{ f: number; w: number; h: number }> = ({ f, w, h }) => {
  const draw = (i: number) => range(f, [ORG.routes[0] + i * 8, ORG.routes[0] + i * 8 + 30], [0, 1], easeInOut);
  return (
    <svg width={w} height={h} viewBox="0 0 390 700" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
      <rect width="390" height="700" fill="#EEF2F8" />
      {Array.from({ length: 7 }).map((_, r) =>
        Array.from({ length: 5 }).map((__, c) => <rect key={`${r}-${c}`} x={c * 84 - 20} y={r * 110 - 10} width={70} height={92} rx={8} fill="#E1E7F1" />),
      )}
      <path d="M-20 250 L420 150" stroke="#FFFFFF" strokeWidth="18" />
      <path d="M150 -20 L230 720" stroke="#FFFFFF" strokeWidth="16" />
      <path d="M-20 560 L420 600" stroke="#FFFFFF" strokeWidth="14" />
      <path d="M300 0 C 260 220, 380 380, 320 720" stroke="#CFE3FA" strokeWidth="22" fill="none" />
      {ROUTES.map((r, i) => {
        const L = pathLen(r.pts);
        const k = draw(i);
        return (
          <g key={i}>
            <path d={toD(r.pts)} fill="none" stroke={r.color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - k)} opacity={0.9} />
            {r.pts.slice(1).map((p, j) => {
              const pj = pop(f, ORG.routes[0] + i * 8 + 8 + j * 6, { damping: 11, stiffness: 180, mass: 0.6 });
              return (
                <g key={j} transform={`translate(${p[0]} ${p[1]}) scale(${pj})`}>
                  <path d="M0 0 C -12 -14, -14 -30, 0 -34 C 14 -30, 12 -14, 0 0Z" fill={r.color} />
                  <circle cx="0" cy="-22" r="6" fill="#fff" />
                </g>
              );
            })}
          </g>
        );
      })}
      <circle cx="60" cy="520" r="11" fill="#fff" stroke="#130D5D" strokeWidth="4" />
    </svg>
  );
};

export const OrganizeScreen: React.FC<{ f: number; lit?: number }> = ({ f }) => {
  const scroll = orgScroll(f);
  const navActive = f >= ORG.magnet[0] - 4 ? 1 : 2;
  const expand = range(f, ORG.expand, [0, 1], easeInOut);
  const routeTop = TEAM_TOP + 250 - scroll;
  const cardRect = {
    x: interpolate(expand, [0, 1], [16, 0]),
    y: interpolate(expand, [0, 1], [routeTop, 104]),
    w: interpolate(expand, [0, 1], [SCREEN_W - 32, SCREEN_W]),
    h: interpolate(expand, [0, 1], [150, SCREEN_H - 104 - 84]),
  };
  const collapsedO = 1 - range(f, [ORG.expand[0], ORG.expand[0] + 8], [0, 1]);
  const title = f >= ORG.expand[0] + 6 ? "Ruteo del equipo" : navActive === 1 ? "Mi equipo" : "Visitas";
  const members = TEAM.length;
  const arrived = TEAM.filter((_, i) => slotArrive(f, i) >= 1).length;

  return (
    <div style={{ position: "absolute", inset: 0, background: color.primaryGradient }}>
      <AppHeader title={title} menu right={["calendar"]} transparent />
      <div style={{ position: "absolute", left: 0, right: 0, top: 104, bottom: 84, overflow: "hidden" }}>
        <div style={{ transform: `translateY(${-scroll}px)` }}>
          {/* Visita activa (pantalla de referencia 01_visita) */}
          <div style={{ margin: "10px 16px 0", background: color.surface, borderRadius: radius.lg, boxShadow: shadow.modal, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Chip tone="active" dot>
                Visita activa 15:03 hs
              </Chip>
              <span style={{ color: color.primary, fontWeight: 600, fontSize: 15 }}>Finalizar</span>
            </div>
            <div style={{ marginTop: 14, fontSize: 15, fontWeight: 600, color: color.textPrimary }}>
              {PDV.active.code} - {PDV.active.name}
            </div>
            <div style={{ fontSize: 12.5, color: color.textSecondary, marginTop: 4 }}>{PDV.active.addr}</div>
          </div>
          <div style={{ margin: "14px 16px 0", display: "flex", gap: 10 }}>
            {[
              ["8", "PDV hoy"],
              ["3", "completadas"],
              ["92%", "cumplimiento"],
            ].map(([v, l]) => (
              <div key={l} style={{ flex: 1, background: "rgba(255,255,255,0.14)", borderRadius: 12, padding: "10px 12px", color: "#fff" }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{v}</div>
                <div style={{ fontSize: 11.5, opacity: 0.85 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Hoja blanca con equipo + ruta */}
          <div style={{ marginTop: 20, background: color.background, borderRadius: "22px 22px 0 0", minHeight: 900, padding: "18px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 17, fontWeight: 600, color: color.textPrimary }}>Mi equipo hoy</div>
              <Chip tone={arrived === members ? "done" : "info"}>
                {arrived}/{members} en campo
              </Chip>
            </div>
            <div style={{ marginTop: 14, background: color.surface, borderRadius: radius.lg, boxShadow: shadow.card, padding: "16px 12px", height: 132 }}>
              <div style={{ position: "relative", height: 60 }}>
                {TEAM.map((t, i) => {
                  const k = slotArrive(f, i);
                  const pj = pop(f, ORG.magnet[0] + i * 6 + 16, { damping: 9, stiffness: 220, mass: 0.5 });
                  return (
                    <div key={t.initials} style={{ position: "absolute", left: 10 + i * 71, top: 0 }}>
                      <div style={{ width: 54, height: 54, borderRadius: 27, border: `2px dashed ${color.border}`, opacity: 1 - k }} />
                      {k >= 1 && (
                        <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${0.85 + 0.15 * pj})` }}>
                          <Avatar t={t} />
                        </div>
                      )}
                      <div style={{ position: "absolute", top: 60, width: 54, textAlign: "center", fontSize: 11.5, color: color.textSecondary }}>{t.name}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 26, height: 6, borderRadius: 3, background: "#ECEFF1", overflow: "hidden" }}>
                <div style={{ width: `${(arrived / members) * 100}%`, height: "100%", background: color.success }} />
              </div>
            </div>

            <div style={{ marginTop: 20, fontSize: 17, fontWeight: 600, color: color.textPrimary }}>Ruta de hoy</div>
            <div style={{ height: 160 }} />
            <div style={{ marginTop: 14, fontSize: 17, fontWeight: 600, color: color.textPrimary }}>Próximas visitas</div>
            {PDV.list.map((p) => (
              <div key={p.name} style={{ marginTop: 10, background: color.surface, borderRadius: radius.lg, boxShadow: shadow.card, padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
                <Icon name="pin" size={24} color={color.primaryDark} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: color.textPrimary }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: color.textSecondary }}>{p.addr}</div>
                </div>
                <Chip tone="info">Programado</Chip>
              </div>
            ))}
          </div>
        </div>

        {/* Card de ruta: colapsada dentro del scroll y luego expandida a pantalla completa */}
        <div
          style={{
            position: "absolute",
            left: cardRect.x,
            top: cardRect.y - 104,
            width: cardRect.w,
            height: cardRect.h,
            borderRadius: interpolate(expand, [0, 1], [radius.lg, 0]),
            overflow: "hidden",
            background: color.surface,
            boxShadow: shadow.card,
          }}
        >
          <div style={{ position: "absolute", inset: 0, opacity: 0.35 + 0.65 * expand }}>
            <RouteMap f={f} w={cardRect.w} h={cardRect.h} />
          </div>
          <div style={{ position: "absolute", inset: 0, background: `rgba(255,255,255,${0.82 * collapsedO})` }} />
          {collapsedO > 0 && (
            <div style={{ position: "absolute", inset: 0, padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", opacity: collapsedO }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name="route" size={26} color={color.accent} />
                <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: color.textPrimary }}>3 rutas · 12 PDV</div>
                <div style={{ transform: "rotate(90deg)" }}>
                  <Icon name="chevron" size={22} color={color.textSecondary} fill={false} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["#1976D2", "#7C5CFC", "#2E7D32"].map((c, i) => (
                  <div key={c} style={{ flex: 1, height: 8, borderRadius: 4, background: c, opacity: 0.7 - i * 0.1 }} />
                ))}
              </div>
              <div style={{ fontSize: 12, color: color.textSecondary, fontFamily: robotoMono }}>42,6 km · 7 h 20 min</div>
            </div>
          )}
          {expand > 0.6 && (
            <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, background: color.surface, borderRadius: radius.lg, boxShadow: shadow.modal, padding: 12, display: "flex", gap: 10, opacity: range(f, [ORG.expand[1], ORG.expand[1] + 8], [0, 1]), transform: `translateY(${(1 - range(f, [ORG.expand[1], ORG.expand[1] + 10], [0, 1], easeOut)) * 30}px)` }}>
              {TEAM.slice(0, 3).map((t, i) => (
                <div key={t.initials} style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 5, background: ["#1976D2", "#7C5CFC", "#2E7D32"][i] }} />
                  <div style={{ fontSize: 12.5, color: color.textPrimary, fontWeight: fontWeight.medium }}>{t.name}</div>
                  <div style={{ fontSize: 11.5, color: color.textSecondary }}>{[5, 4, 3][i]} PDV</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Tap f={f} at={ORG.tapRoute} x={300} y={routeTop - 104 + 40} />
      </div>
      <BottomNav items={NAV_MAIN.map((n, i) => ({ ...n, badge: i === 3 ? 2 : undefined }))} active={navActive} />
      <div
        style={{
          position: "absolute",
          right: 18,
          bottom: 100,
          width: 56,
          height: 56,
          borderRadius: 28,
          background: color.accent,
          boxShadow: shadow.fab,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 1 - expand,
        }}
      >
        <Icon name="plus" size={28} color="#fff" fill={false} />
      </div>
    </div>
  );
};
