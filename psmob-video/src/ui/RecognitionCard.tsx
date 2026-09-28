import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { color, fontWeight, radius, shadow } from "../design/psmob-tokens";
import { roboto, robotoMono } from "../design/fonts";
import { pop, range } from "../lib/motion";
import { ProductKind } from "../props/Gondola";

const K = 1.6;

// Chispa de asistente: la IA se expresa con un ícono de acento, nunca con un robot.
export const Sparkle: React.FC<{ size: number; tint: string }> = ({ size, tint }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 2c.6 4.6 2.8 7 7.4 7.6-4.6.6-6.8 3-7.4 7.6-.6-4.6-2.8-7-7.4-7.6C9.2 9 11.4 6.6 12 2Z" fill={tint} />
    <path d="M19 14.5c.3 2 1.2 3 3 3.2-1.8.3-2.7 1.2-3 3.3-.3-2.1-1.2-3-3-3.3 1.8-.2 2.7-1.2 3-3.2Z" fill={tint} opacity={0.6} />
  </svg>
);

const Thumb: React.FC<{ kind: ProductKind }> = ({ kind }) => {
  const fill = kind === "wash" ? "#7E57C2" : kind === "powder" ? "#3C9FF1" : kind === "ketchup" ? "#F4511E" : "#FFE08A";
  return (
    <div
      style={{
        width: 34 * K,
        height: 34 * K,
        borderRadius: radius.md * K,
        background: color.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <div style={{ width: 14 * K, height: 24 * K, borderRadius: 3 * K, background: fill }} />
    </div>
  );
};

export type RecognitionItem = { name: string; ean: string; price: string; kind: ProductKind };

// Bottom card de reconocimiento de PSMob: header azul, progreso, lista con EAN y precio.
export const RecognitionCard: React.FC<{
  start: number;
  items: RecognitionItem[];
  total: number;
  labels: { assistant: string; role: string; scanning: string; detected: string; priceOk: string };
}> = ({ start, items, total, labels }) => {
  const frame = useCurrentFrame();
  const progress = range(frame, [start + 6, start + 46], [0, 1]);
  const count = Math.round(progress * total);
  const done = pop(frame, start + 48);
  const ring = 2 * Math.PI * 9;
  return (
    <div
      style={{
        width: 470,
        background: color.surface,
        borderRadius: radius.xl * K,
        boxShadow: shadow.modal,
        overflow: "hidden",
        fontFamily: roboto,
      }}
    >
      <div
        style={{
          background: color.primaryGradient,
          padding: `${12 * K}px ${14 * K}px`,
          display: "flex",
          alignItems: "center",
          gap: 8 * K,
        }}
      >
        <Sparkle size={20 * K} tint="#FFFFFF" />
        <div style={{ color: "#FFFFFF", fontSize: 16 * K, fontWeight: fontWeight.semibold }}>{labels.assistant}</div>
        <div
          style={{
            marginLeft: "auto",
            background: color.accentLight,
            color: color.accentDarker,
            fontSize: 11 * K,
            fontWeight: fontWeight.medium,
            padding: `${3 * K}px ${9 * K}px`,
            borderRadius: radius.pill * K,
          }}
        >
          {labels.role}
        </div>
      </div>

      <div style={{ padding: `${12 * K}px ${14 * K}px ${6 * K}px`, display: "flex", alignItems: "center", gap: 10 * K }}>
        <svg width={24 * K} height={24 * K} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill="none" stroke={color.border} strokeWidth="2.5" />
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke={color.accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={ring}
            strokeDashoffset={ring * (1 - progress)}
            transform="rotate(-90 12 12)"
            opacity={1 - done}
          />
          <g opacity={done} transform={`translate(12 12) scale(${interpolate(done, [0, 1], [0.4, 1])}) translate(-12 -12)`}>
            <circle cx="12" cy="12" r="11" fill={color.successDark} />
            <path d="M7.5 12.3l3 3 6-6.3" stroke="#FFFFFF" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
        <div style={{ fontSize: 14 * K, color: color.textPrimary, fontWeight: fontWeight.semibold }}>
          {done > 0.5 ? (
            <>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{total}</span> {labels.detected}
            </>
          ) : (
            <>
              {labels.scanning} · <span style={{ fontVariantNumeric: "tabular-nums", color: color.accent }}>{count}</span>
            </>
          )}
        </div>
      </div>

      <div style={{ padding: `${4 * K}px ${10 * K}px ${10 * K}px` }}>
        {items.map((it, i) => {
          const p = pop(frame, start + 14 + i * 7);
          return (
            <div
              key={it.ean}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10 * K,
                padding: `${8 * K}px ${4 * K}px`,
                borderTop: i === 0 ? "none" : `1px solid ${color.border}`,
                opacity: Math.min(1, p * 1.5),
                transform: `translateY(${(1 - p) * 24}px)`,
              }}
            >
              <Thumb kind={it.kind} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: robotoMono, fontSize: 10 * K, color: color.textSecondary }}>{it.ean}</div>
                <div style={{ fontSize: 13 * K, color: color.textPrimary, fontWeight: fontWeight.medium, whiteSpace: "nowrap" }}>
                  {it.name}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12 * K, fontWeight: fontWeight.semibold, color: color.textPrimary }}>{it.price}</div>
                <div
                  style={{
                    marginTop: 2 * K,
                    display: "inline-block",
                    fontSize: 10 * K,
                    fontWeight: fontWeight.medium,
                    color: color.successDark,
                    background: color.successLight,
                    borderRadius: radius.pill * K,
                    padding: `${1 * K}px ${7 * K}px`,
                  }}
                >
                  {labels.priceOk}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Badge "Funciona sin conexión": nube tachada + pill violeta de acento.
export const OfflineBadge: React.FC<{ label: string; slash: number }> = ({ label, slash }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8 * K,
      padding: `${7 * K}px ${14 * K}px ${7 * K}px ${10 * K}px`,
      background: color.accent,
      color: "#FFFFFF",
      borderRadius: radius.pill * K,
      boxShadow: shadow.fab,
      fontFamily: roboto,
      fontSize: 13 * K,
      fontWeight: fontWeight.semibold,
      whiteSpace: "nowrap",
    }}
  >
    <svg width={20 * K} height={20 * K} viewBox="0 0 24 24" fill="none">
      <path
        d="M7 18h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.3 9.1 4.5 4.5 0 0 0 7 18Z"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M4 3.5 20.5 20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - slash} />
    </svg>
    {label}
  </div>
);
