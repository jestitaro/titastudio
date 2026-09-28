// Sidebar derecho con el stepper de creación de pedido.
import React from "react";
import { STEPPER } from "../animation/layout";
import { SceneState, StepState } from "../animation/scene-state";
import { c, font, shadow } from "../design/tokens";
import { mix } from "./ui";

const LABELS = ["Información General", "Selección de Productos", "Resumen de Pedido"];

const StepCircle: React.FC<{ n: number; st: StepState }> = ({ n, st }) => {
  const a = st.active * (1 - st.done);
  const fill = st.done > 0 ? mix(c.primary, c.success, st.done) : c.primary;
  const filled = Math.max(st.active, st.done);
  return (
    <div style={{ position: "relative", width: 24, height: 24 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 12,
          border: `1px solid ${mix("#c3cad5", fill, filled)}`,
          background: filled > 0 ? fill : "#fff",
          opacity: 1,
          transform: `scale(${1 + 0.12 * Math.sin(Math.PI * st.done)})`,
          boxSizing: "border-box",
        }}
      />
      {/* Número (se desvanece al completar) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          color: mix("#aab3c0", "#ffffff", a),
          opacity: 1 - st.done,
        }}
      >
        {n}
      </div>
      {/* Check dibujado */}
      <svg width="24" height="24" viewBox="0 0 24 24" style={{ position: "absolute", inset: 0 }}>
        <path
          d="M7.2 12.4l3.2 3.1 6.4-6.6"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="16"
          strokeDashoffset={16 * (1 - st.done)}
        />
      </svg>
    </div>
  );
};

export const Stepper: React.FC<{ s: SceneState }> = ({ s }) => {
  const side = s.cards.side;
  if (side.opacity <= 0) return null;
  const { rect } = side;
  const st = s.stepper;
  return (
    <div
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        background: c.card,
        borderRadius: 12,
        boxShadow: shadow.card,
        opacity: side.opacity,
        transform: `translateX(${side.x}px)`,
        fontFamily: font,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: STEPPER.innerX - rect.x, top: STEPPER.titleY - rect.y, width: STEPPER.innerW, opacity: st.content }}>
        <div style={{ position: "relative", height: 22 }}>
          <div style={{ position: "absolute", fontSize: 15.5, fontWeight: 600, color: c.textStrong, opacity: 1 - st.editTitle }}>Crear Pedido</div>
          <div style={{ position: "absolute", fontSize: 15.5, fontWeight: 600, color: c.textStrong, opacity: st.editTitle }}>Editar Pedido</div>
        </div>
        <div style={{ fontSize: 11.5, color: c.muted, lineHeight: 1.25, marginTop: 2 }}>Modifique los datos generales de su pedido</div>
      </div>
      {st.steps.map((step, i) => {
        const a = step.active * (1 - step.done);
        const y = STEPPER.stepsY + i * (STEPPER.stepH + STEPPER.stepGap) - rect.y;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: STEPPER.innerX - rect.x,
              top: y,
              width: STEPPER.innerW,
              height: STEPPER.stepH,
              boxSizing: "border-box",
              borderRadius: 6,
              border: `1px solid ${mix("#e8ecf1", c.primary, a)}`,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "0 12px",
              opacity: st.content,
              transform: `translateY(${(1 - st.content) * (6 + i * 4)}px)`,
            }}
          >
            <StepCircle n={i + 1} st={step} />
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: step.done > 0 ? mix(c.primary, c.textStrong, step.done) : mix(c.muted, c.primary, a),
              }}
            >
              {LABELS[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
};
