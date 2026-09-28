import React from "react";
import { color, fontWeight, radius, shadow } from "../design/psmob-tokens";
import { roboto } from "../design/fonts";

// Card de notificación PSMob (card de lista + badge/chip de estado), escalada ×1.6
// desde el viewport mobile para que sea legible en 1080p.
const K = 1.6;

export type NotifIcon = "form" | "pin" | "route";

const Icon: React.FC<{ kind: NotifIcon; tint: string }> = ({ kind, tint }) => (
  <svg width={22 * K} height={22 * K} viewBox="0 0 24 24" fill="none">
    {kind === "form" && (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" fill={tint} opacity={0.3} />
        <rect x="5" y="3" width="14" height="18" rx="2" stroke={tint} strokeWidth="1.8" />
        <path d="M8.5 9h7M8.5 13h7M8.5 17h4" stroke={tint} strokeWidth="1.8" strokeLinecap="round" />
      </>
    )}
    {kind === "pin" && (
      <>
        <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" fill={tint} opacity={0.3} />
        <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" stroke={tint} strokeWidth="1.8" />
        <circle cx="12" cy="10" r="2.6" fill={tint} />
      </>
    )}
    {kind === "route" && (
      <>
        <circle cx="6" cy="18" r="3" fill={tint} opacity={0.3} stroke={tint} strokeWidth="1.8" />
        <circle cx="18" cy="6" r="3" fill={tint} opacity={0.3} stroke={tint} strokeWidth="1.8" />
        <path d="M8.5 16.5 15.5 7.5" stroke={tint} strokeWidth="1.8" strokeDasharray="2.5 2.5" strokeLinecap="round" />
      </>
    )}
  </svg>
);

export const NotificationCard: React.FC<{
  icon: NotifIcon;
  title: string;
  subtitle?: string;
  badge?: number;
  chip?: string;
  tone?: "primary" | "danger" | "warning";
  width?: number;
}> = ({ icon, title, subtitle, badge, chip, tone = "primary", width = 380 }) => {
  const tint = tone === "danger" ? color.danger : tone === "warning" ? color.warningDark : color.primaryDark;
  const tintBg = tone === "danger" ? color.dangerLight : tone === "warning" ? color.warningLight : color.primaryLight;
  return (
    <div
      style={{
        width,
        display: "flex",
        alignItems: "center",
        gap: 12 * K,
        padding: `${12 * K}px ${14 * K}px`,
        background: color.surface,
        borderRadius: radius.lg * K,
        boxShadow: shadow.modal,
        fontFamily: roboto,
      }}
    >
      <div
        style={{
          width: 40 * K,
          height: 40 * K,
          borderRadius: "50%",
          background: tintBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon kind={icon} tint={tint} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14 * K,
            fontWeight: fontWeight.semibold,
            color: color.textPrimary,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 12 * K, color: color.textSecondary, marginTop: 3 * K, whiteSpace: "nowrap" }}>
            {subtitle}
          </div>
        )}
        {chip && (
          <div
            style={{
              display: "inline-block",
              marginTop: 5 * K,
              padding: `${3 * K}px ${9 * K}px`,
              borderRadius: radius.pill * K,
              background: color.warningLight,
              color: color.warningDark,
              fontSize: 11 * K,
              fontWeight: fontWeight.medium,
            }}
          >
            {chip}
          </div>
        )}
      </div>
      {badge !== undefined && (
        <div
          style={{
            minWidth: 22 * K,
            height: 22 * K,
            padding: `0 ${6 * K}px`,
            borderRadius: 11 * K,
            background: color.badge,
            color: color.badgeText,
            fontSize: 12 * K,
            fontWeight: fontWeight.bold,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {badge}
        </div>
      )}
    </div>
  );
};
