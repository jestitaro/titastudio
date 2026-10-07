// Toasts de PrimeNG (success / info), discretos, arriba a la derecha. Uno a la vez:
// creado → pendiente de aprobación → aprobado (con avatar del aprobador) → ERP → confirmado.
import React from "react";
import { TOAST } from "../animation/layout";
import { SceneState } from "../animation/scene-state";
import { font, shadow } from "../../qs-kit/design/tokens";
import { TOASTS } from "../data/mock-data";
import { Centered, Icon } from "../../qs-kit/ui/primitives";

const TONE = {
  success: { bar: "#1ea97c", bg: "rgba(228, 248, 240, 0.98)", fg: "#1ea97c", sub: "#178b66" },
  info: { bar: "#3b82f6", bg: "rgba(233, 241, 255, 0.98)", fg: "#2563eb", sub: "#3b5fb6" },
};

export const Toast: React.FC<{ s: SceneState }> = ({ s }) => (
  <>
    {s.toasts.map((t) => {
      const content = TOASTS[t.id];
      const tone = TONE[content.tone];
      return (
        <div
          key={t.id}
          style={{
            position: "absolute",
            left: TOAST.x,
            top: TOAST.y,
            width: TOAST.w,
            height: TOAST.h,
            boxSizing: "border-box",
            borderRadius: 6,
            borderLeft: `5px solid ${tone.bar}`,
            background: tone.bg,
            boxShadow: shadow.toast,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 16px",
            fontFamily: font,
            color: tone.fg,
            opacity: t.o,
            transform: `translateX(${t.x}px)`,
          }}
        >
          {content.avatar ? (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                flexShrink: 0,
                background: "#7f47ec",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Centered>{content.avatar}</Centered>
            </div>
          ) : (
            <Icon name={content.icon ?? "info-circle"} size={20} />
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{content.title}</div>
            <div style={{ fontSize: 11.5, marginTop: 2, color: tone.sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{content.detail}</div>
          </div>
        </div>
      );
    })}
  </>
);
