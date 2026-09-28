// Toast de éxito de PrimeNG (severity success), discreto, arriba a la derecha.
import React from "react";
import { TOAST } from "../animation/layout";
import { SceneState } from "../animation/scene-state";
import { font, shadow } from "../design/tokens";
import { ORDER } from "../data/mock-data";
import { Icon } from "./ui";

export const Toast: React.FC<{ s: SceneState }> = ({ s }) => {
  const t = s.toast;
  if (!t.visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: TOAST.x,
        top: TOAST.y,
        width: TOAST.w,
        height: TOAST.h,
        boxSizing: "border-box",
        borderRadius: 6,
        borderLeft: "5px solid #1ea97c",
        background: "rgba(228, 248, 240, 0.98)",
        boxShadow: shadow.toast,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 16px",
        fontFamily: font,
        color: "#1ea97c",
        opacity: t.o,
        transform: `translateX(${t.x}px)`,
      }}
    >
      <Icon name="check-circle" size={20} />
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>Pedido creado</div>
        <div style={{ fontSize: 11.5, marginTop: 2, color: "#178b66" }}>
          Pedido #{ORDER.number} · {ORDER.client}
        </div>
      </div>
    </div>
  );
};
