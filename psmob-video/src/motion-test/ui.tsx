import React from "react";
import { interpolate } from "remotion";
import { color, fontWeight, radius, shadow } from "../design/psmob-tokens";
import { roboto } from "../design/fonts";
import { es } from "../i18n/es";
import { easeOut, pop, range } from "../lib/motion";

const t = es.motionTest;

// ——— Íconos de línea (trazo fino, estilo UI PSMob) ———
export type IconKind = "pin" | "chart" | "calendar" | "check" | "clock" | "alert" | "chat" | "box" | "route" | "form";

export const Icon: React.FC<{ kind: IconKind; size?: number; tint?: string; sw?: number }> = ({
  kind,
  size = 24,
  tint = color.primaryDark,
  sw = 1.8,
}) => {
  const s = { stroke: tint, strokeWidth: sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const f = { fill: tint, opacity: 0.18 };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {kind === "pin" && (
        <>
          <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" {...f} />
          <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" {...s} />
          <circle cx="12" cy="10" r="2.5" {...s} />
        </>
      )}
      {kind === "chart" && (
        <>
          <rect x="4" y="12" width="4" height="8" rx="1" {...f} />
          <rect x="10" y="7" width="4" height="13" rx="1" {...f} />
          <path d="M4 20V12h4v8M10 20V7h4v13M16 20v-5h4v5M3 20h18" {...s} />
        </>
      )}
      {kind === "calendar" && (
        <>
          <rect x="3.5" y="5" width="17" height="15" rx="2.5" {...f} />
          <rect x="3.5" y="5" width="17" height="15" rx="2.5" {...s} />
          <path d="M3.5 10h17M8 3v4M16 3v4" {...s} />
        </>
      )}
      {kind === "check" && (
        <>
          <circle cx="12" cy="12" r="9" {...f} />
          <circle cx="12" cy="12" r="9" {...s} />
          <path d="m8 12.3 2.7 2.7L16.2 9.5" {...s} />
        </>
      )}
      {kind === "clock" && (
        <>
          <circle cx="12" cy="12" r="9" {...f} />
          <circle cx="12" cy="12" r="9" {...s} />
          <path d="M12 7v5l3 2" {...s} />
        </>
      )}
      {kind === "alert" && (
        <>
          <path d="M12 3.5 21.5 20h-19L12 3.5Z" {...f} />
          <path d="M12 3.5 21.5 20h-19L12 3.5Z" {...s} />
          <path d="M12 10v4.5M12 17.2v.1" {...s} />
        </>
      )}
      {kind === "chat" && (
        <>
          <path d="M4 5h16v11H9l-5 4V5Z" {...f} />
          <path d="M4 5h16v11H9l-5 4V5Z" {...s} />
          <path d="M8 9.5h8M8 12.5h5" {...s} />
        </>
      )}
      {kind === "box" && (
        <>
          <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" {...f} />
          <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3ZM4 7.5l8 4.5 8-4.5M12 12v9" {...s} />
        </>
      )}
      {kind === "route" && (
        <>
          <circle cx="6" cy="18" r="2.6" {...s} />
          <circle cx="18" cy="6" r="2.6" {...s} />
          <path d="M8.2 16.2 15.8 7.8" {...s} strokeDasharray="2.4 2.6" />
        </>
      )}
      {kind === "form" && (
        <>
          <rect x="5" y="3" width="14" height="18" rx="2" {...f} />
          <rect x="5" y="3" width="14" height="18" rx="2" {...s} />
          <path d="M8.5 9h7M8.5 13h7M8.5 17h4" {...s} />
        </>
      )}
    </svg>
  );
};

// Tile flotante: ícono en superficie blanca redondeada (elemento de ambiente).
export const IconTile: React.FC<{ kind: IconKind; size?: number; tint?: string; bg?: string }> = ({
  kind,
  size = 72,
  tint = color.primaryDark,
  bg = color.surface,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: bg,
      boxShadow: "0 10px 30px rgba(33,56,99,0.12)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Icon kind={kind} size={size * 0.5} tint={tint} />
  </div>
);

export const Chip: React.FC<{ icon: IconKind; label: string; tint?: string; bg?: string }> = ({
  icon,
  label,
  tint = color.primaryDark,
  bg = color.surface,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 18px 10px 12px",
      borderRadius: 999,
      background: bg,
      boxShadow: "0 12px 32px rgba(33,56,99,0.14)",
      fontFamily: roboto,
      fontSize: 20,
      fontWeight: fontWeight.medium,
      color: color.textPrimary,
      whiteSpace: "nowrap",
    }}
  >
    <Icon kind={icon} size={26} tint={tint} />
    {label}
  </div>
);

// Card de alerta compacta (notificación PSMob).
export const AlertCard: React.FC<{
  title: string;
  subtitle: string;
  tone: string;
  icon?: IconKind;
  badge?: number;
  width?: number;
}> = ({ title, subtitle, tone, icon, badge, width = 330 }) => {
  const tint = tone === "danger" ? color.danger : tone === "warning" ? color.warningDark : color.primaryDark;
  const tintBg = tone === "danger" ? color.dangerLight : tone === "warning" ? color.warningLight : color.primaryLight;
  const ic: IconKind = icon ?? (tone === "danger" ? "alert" : tone === "warning" ? "form" : "route");
  return (
    <div
      style={{
        position: "relative",
        width,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        background: color.surface,
        borderRadius: radius.lg * 1.4,
        boxShadow: shadow.modal,
        fontFamily: roboto,
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 12,
          background: tintBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon kind={ic} size={26} tint={tint} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 19, fontWeight: fontWeight.medium, color: color.textPrimary, whiteSpace: "nowrap" }}>{title}</div>
        <div style={{ fontSize: 15, color: color.textSecondary, whiteSpace: "nowrap", marginTop: 2 }}>{subtitle}</div>
      </div>
      {badge !== undefined && (
        <div
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            minWidth: 30,
            height: 30,
            padding: "0 8px",
            borderRadius: 15,
            background: color.badge,
            color: color.badgeText,
            fontSize: 16,
            fontWeight: fontWeight.bold,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 0 3px #fff",
          }}
        >
          {badge}
        </div>
      )}
    </div>
  );
};

// Reloj de pared con agujas que corren (el tiempo se escapa).
export const Clock: React.FC<{ frame: number; size?: number; speed?: number; tint?: string }> = ({
  frame,
  size = 150,
  speed = 1,
  tint = color.textPrimary,
}) => {
  const min = frame * 14 * speed;
  const hour = frame * 1.2 * speed + 60;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="#fff" />
      <circle cx="50" cy="50" r="46" fill="none" stroke={tint} strokeWidth="4" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={50 + Math.sin(a) * 36}
            y1={50 - Math.cos(a) * 36}
            x2={50 + Math.sin(a) * 40}
            y2={50 - Math.cos(a) * 40}
            stroke={tint}
            strokeWidth={i % 3 === 0 ? 3 : 1.5}
            strokeLinecap="round"
          />
        );
      })}
      <line x1="50" y1="50" x2="50" y2="28" stroke={tint} strokeWidth="4.5" strokeLinecap="round" transform={`rotate(${hour} 50 50)`} />
      <line x1="50" y1="50" x2="50" y2="18" stroke={color.danger} strokeWidth="3" strokeLinecap="round" transform={`rotate(${min} 50 50)`} />
      <circle cx="50" cy="50" r="4" fill={color.danger} />
    </svg>
  );
};

// ——— Celular (pantalla animada aparte del PNG) ———
export const PHONE_W = 390;
export const PHONE_H = 800;
const BEZEL = 14;

export const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: PHONE_W + BEZEL * 2,
      height: PHONE_H + BEZEL * 2,
      padding: BEZEL,
      borderRadius: 58,
      background: "#1B2233",
      boxShadow: "0 40px 80px rgba(20,32,70,0.28), inset 0 0 0 2px #2E3850",
    }}
  >
    <div
      style={{
        position: "relative",
        width: PHONE_W,
        height: PHONE_H,
        borderRadius: 44,
        overflow: "hidden",
        background: color.background,
        fontFamily: roboto,
      }}
    >
      {children}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: PHONE_W / 2 - 50,
          width: 100,
          height: 26,
          borderRadius: 13,
          background: "#1B2233",
        }}
      />
    </div>
  </div>
);

const StatusBar: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <div
    style={{
      height: 44,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 28px",
      fontSize: 14,
      fontWeight: fontWeight.medium,
      color: dark ? color.textPrimary : "#fff",
    }}
  >
    <span>10:41</span>
    <span style={{ display: "flex", gap: 5 }}>
      <span style={{ width: 16, height: 10, borderRadius: 2, border: `1.5px solid ${dark ? color.textPrimary : "#fff"}` }} />
    </span>
  </div>
);

const shimmer = (frame: number): React.CSSProperties => ({
  background: `linear-gradient(90deg, #E6E9EE 0%, #F2F4F7 40%, #E6E9EE 80%)`,
  backgroundSize: "300% 100%",
  backgroundPosition: `${100 - ((frame * 4) % 200)}% 0`,
});

const Bar: React.FC<{ w: number | string; h?: number; frame: number; style?: React.CSSProperties }> = ({ w, h = 12, frame, style }) => (
  <div style={{ width: w, height: h, borderRadius: h / 2, ...shimmer(frame), ...style }} />
);

// Lista de visitas: skeleton → contenido, tap, scroll y, al final, alertas que invaden la pantalla.
export const VisitListScreen: React.FC<{
  frame: number; // frame local de la pantalla
  revealAt: number;
  tapAt: number;
  scrollAt: number;
  alertsAt: number;
}> = ({ frame, revealAt, tapAt, scrollAt, alertsAt }) => {
  const scroll = range(frame, [scrollAt, scrollAt + 20], [0, 230]);
  const cardH = 96;
  const listTop = 44 + 64 + 64;

  // Indicador de dedo: entra, presiona, arrastra hacia arriba (scroll), se va.
  const fingerIn = range(frame, [tapAt - 12, tapAt - 1], [0, 1], easeOut);
  const press = frame >= tapAt && frame < tapAt + 5 ? 0.82 : 1;
  const fingerOut = range(frame, [scrollAt + 20, scrollAt + 28], [1, 0]);
  const tapY = listTop + 16 + cardH * 1 + cardH / 2;
  const fingerX = interpolate(fingerIn, [0, 1], [PHONE_W + 40, 250]);
  const fingerY = interpolate(fingerIn, [0, 1], [tapY + 180, tapY]) - range(frame, [scrollAt, scrollAt + 20], [0, 230]);
  const ripple = range(frame, [tapAt, tapAt + 16], [0, 1], easeOut);
  const selected = frame >= tapAt + 2;

  return (
    <>
      <div style={{ background: color.primaryGradient }}>
        <StatusBar />
        <div style={{ height: 64, display: "flex", alignItems: "center", padding: "0 22px", gap: 14, color: "#fff" }}>
          <div style={{ fontSize: 20, fontWeight: fontWeight.medium, flex: 1 }}>{t.listTitle}</div>
          <Icon kind="calendar" size={24} tint="#fff" />
        </div>
      </div>
      <div style={{ height: 64, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", background: color.surface, boxShadow: shadow.header }}>
        {t.listSummary.map((s, i) => (
          <div
            key={s}
            style={{
              padding: "7px 14px",
              borderRadius: radius.pill,
              background: i === 0 ? color.primaryLight : color.warningLight,
              color: i === 0 ? color.primaryDarker : color.warningDark,
              fontSize: 14,
              fontWeight: fontWeight.medium,
            }}
          >
            {s}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: listTop, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
        <div style={{ transform: `translateY(${-scroll}px)`, padding: "16px 14px" }}>
          {t.visits.map((v, i) => {
            const r = range(frame, [revealAt + i * 3, revealAt + i * 3 + 8], [0, 1]);
            const isSel = i === 1 && selected;
            return (
              <div
                key={v.pdv}
                style={{
                  position: "relative",
                  height: cardH - 10,
                  marginBottom: 10,
                  borderRadius: radius.lg,
                  background: isSel ? color.primaryLight : color.surface,
                  boxShadow: shadow.card,
                  overflow: "hidden",
                  outline: isSel ? `2px solid ${color.primary}` : undefined,
                }}
              >
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 14, padding: "0 16px", opacity: 1 - r }}>
                  <div style={{ width: 44, height: 44, borderRadius: 22, ...shimmer(frame) }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                    <Bar w="70%" frame={frame} />
                    <Bar w="45%" h={10} frame={frame} />
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "0 16px",
                    opacity: r,
                    transform: `translateY(${(1 - r) * 8}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      background: i === 1 ? color.accentLight : color.primaryLight,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon kind="pin" size={24} tint={i === 1 ? color.accent : color.primaryDark} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: fontWeight.medium, color: color.textPrimary }}>{v.pdv}</div>
                    <div style={{ fontSize: 13, color: color.textSecondary, marginTop: 3 }}>{v.addr}</div>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: fontWeight.medium,
                      padding: "5px 10px",
                      borderRadius: radius.pill,
                      background: i === 1 ? color.accentLight : color.warningLight,
                      color: i === 1 ? color.accentDarker : color.warningDark,
                    }}
                  >
                    {v.chip}
                  </div>
                </div>
                {i === 1 && ripple > 0 && ripple < 1 && (
                  <div
                    style={{
                      position: "absolute",
                      left: 250 - 14 - 200 * ripple,
                      top: cardH / 2 - 5 - 200 * ripple,
                      width: 400 * ripple,
                      height: 400 * ripple,
                      borderRadius: "50%",
                      background: color.primary,
                      opacity: 0.22 * (1 - ripple),
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tap indicator */}
      {fingerIn > 0 && fingerOut > 0 && (
        <div
          style={{
            position: "absolute",
            left: fingerX - 30,
            top: fingerY - 30,
            width: 60,
            height: 60,
            borderRadius: 30,
            background: "rgba(255,255,255,0.55)",
            border: "3px solid rgba(255,255,255,0.95)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
            transform: `scale(${press})`,
            opacity: Math.min(fingerIn, fingerOut),
          }}
        />
      )}

      {/* Alertas que caen desde arriba */}
      {frame >= alertsAt && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(33,33,33,0.35)",
              opacity: range(frame, [alertsAt, alertsAt + 10], [0, 1]),
            }}
          />
          {t.phoneAlerts.map((a, i) => {
            const p = pop(frame, alertsAt + i * 4);
            const tone = i === 0 ? color.danger : i === 1 ? color.warning : color.primary;
            return (
              <div
                key={a}
                style={{
                  position: "absolute",
                  left: 14,
                  right: 14,
                  top: 60 + i * 78,
                  height: 66,
                  borderRadius: radius.lg,
                  background: color.surface,
                  boxShadow: shadow.modal,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "0 14px",
                  transform: `translateY(${(1 - p) * -120}px)`,
                  opacity: Math.min(1, p * 2),
                  borderLeft: `5px solid ${tone}`,
                }}
              >
                <Icon kind={i === 0 ? "alert" : i === 1 ? "form" : "route"} size={26} tint={tone} />
                <div style={{ fontSize: 15, fontWeight: fontWeight.medium, color: color.textPrimary }}>{a}</div>
              </div>
            );
          })}
        </>
      )}
    </>
  );
};

// Chat: mensaje entrante, "escribiendo", respuesta con card de visita y doble check animado.
export const ChatScreen: React.FC<{ frame: number; inAt: number; typingAt: number; outAt: number; history?: boolean }> = ({
  frame,
  inAt,
  typingAt,
  outAt,
  history = false,
}) => {
  const c = t.chat;
  const pin = pop(frame, inAt);
  const typing = frame >= typingAt && frame < outAt;
  const pout = pop(frame, outAt);
  const check1 = range(frame, [outAt + 8, outAt + 14], [0, 1], easeOut);
  const check2 = range(frame, [outAt + 14, outAt + 20], [0, 1], easeOut);
  const read = range(frame, [outAt + 22, outAt + 28], [0, 1]);
  const cardDone = range(frame, [outAt + 22, outAt + 30], [0, 1]);

  return (
    <>
      <div style={{ background: color.surface, boxShadow: shadow.header }}>
        <StatusBar dark />
        <div style={{ height: 64, display: "flex", alignItems: "center", gap: 12, padding: "0 18px" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              background: color.accent,
              color: "#fff",
              fontWeight: fontWeight.medium,
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            C
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: fontWeight.medium, color: color.textPrimary }}>{c.name}</div>
            <div style={{ fontSize: 13, color: color.success }}>{c.status}</div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          top: history ? 136 : 150,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {history && (
          <>
            <div style={{ alignSelf: "center", fontSize: 12, color: color.textSecondary, padding: "4px 12px", borderRadius: radius.pill, background: "#E8ECF2" }}>
              {c.today}
            </div>
            <div
              style={{
                alignSelf: "flex-end",
                maxWidth: 260,
                padding: "10px 14px",
                borderRadius: "18px 18px 4px 18px",
                background: color.primaryLight,
                fontSize: 15,
                color: color.textPrimary,
              }}
            >
              {c.earlier}
              <span style={{ fontSize: 11, color: color.textSecondary, marginLeft: 8 }}>{c.earlierTime}</span>
            </div>
          </>
        )}
        <div
          style={{
            alignSelf: "flex-start",
            maxWidth: 280,
            padding: "12px 16px",
            borderRadius: "18px 18px 18px 4px",
            background: color.surface,
            boxShadow: shadow.card,
            fontSize: 16,
            color: color.textPrimary,
            transformOrigin: "0% 100%",
            transform: `scale(${pin})`,
            opacity: Math.min(1, pin * 2),
          }}
        >
          {c.incoming}
        </div>

        {typing && (
          <div
            style={{
              alignSelf: "flex-end",
              padding: "14px 18px",
              borderRadius: "18px 18px 4px 18px",
              background: color.primaryLight,
              display: "flex",
              gap: 6,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 5,
                  background: color.primaryDark,
                  opacity: 0.35 + 0.65 * Math.max(0, Math.sin((frame - typingAt) * 0.45 - i * 0.9)),
                }}
              />
            ))}
          </div>
        )}

        {frame >= outAt && (
          <div
            style={{
              alignSelf: "flex-end",
              width: 290,
              padding: 10,
              borderRadius: "18px 18px 4px 18px",
              background: color.primary,
              transformOrigin: "100% 100%",
              transform: `scale(${pout})`,
              opacity: Math.min(1, pout * 2),
            }}
          >
            <div
              style={{
                background: color.surface,
                borderRadius: 12,
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Icon kind="pin" size={24} tint={color.primaryDark} />
              <div style={{ flex: 1, fontSize: 14, fontWeight: fontWeight.medium, color: color.textPrimary }}>{c.cardTitle}</div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: fontWeight.medium,
                  padding: "4px 9px",
                  borderRadius: radius.pill,
                  background: cardDone > 0.5 ? color.successLight : color.warningLight,
                  color: cardDone > 0.5 ? color.successDark : color.warningDark,
                  transform: `scale(${1 + Math.sin(cardDone * Math.PI) * 0.15})`,
                }}
              >
                {cardDone > 0.5 ? c.cardChip : t.visits[0].chip}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, padding: "10px 6px 2px" }}>
              <div style={{ flex: 1, fontSize: 16, color: "#fff" }}>{c.outgoing}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{c.time}</div>
              <svg width="26" height="16" viewBox="0 0 26 16">
                <path
                  d="M2 8.5 6 12.5 13 4"
                  fill="none"
                  stroke={read > 0.5 ? "#fff" : "rgba(255,255,255,0.7)"}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={1 - check1}
                />
                <path
                  d="M10 11 11.5 12.5 18.5 4"
                  fill="none"
                  stroke={read > 0.5 ? "#fff" : "rgba(255,255,255,0.7)"}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={1 - check2}
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          left: 14,
          right: 14,
          bottom: 20,
          height: 50,
          borderRadius: 25,
          background: color.surface,
          boxShadow: shadow.card,
          display: "flex",
          alignItems: "center",
          padding: "0 8px 0 20px",
        }}
      >
        <Bar w="55%" h={10} frame={0} style={{ background: "#ECEFF1" }} />
        <div style={{ flex: 1 }} />
        <div style={{ width: 36, height: 36, borderRadius: 18, background: color.primary }} />
      </div>
    </>
  );
};
