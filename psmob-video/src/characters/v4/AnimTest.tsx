import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import { blink, osc } from "../../lib/motion";
import { Caro, faceFor as caroFace } from "./Caro";
import { Nico, faceFor as nicoFace } from "./Nico";

// Prueba de animabilidad: vida continua (respiración, parpadeo, pelo, cabeza)
// y cambio de pose con anticipación + fundido corto entre ilustraciones.
const SWITCH = 70;

export const AnimTestV4: React.FC = () => {
  const frame = useCurrentFrame();
  const breath = osc(frame, 80, 1);
  const sway = osc(frame, 64, 2.2);
  const k = interpolate(frame, [SWITCH - 3, SWITCH + 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pop = spring({ frame: frame - SWITCH, fps: 30, config: { damping: 10, stiffness: 160 } });
  const squash = frame < SWITCH ? 1 - interpolate(frame, [SWITCH - 8, SWITCH], [0, 0.03], { extrapolateLeft: "clamp" }) : 0.97 + pop * 0.03;
  const character = (which: "caro" | "nico", x: number) => {
    const C = which === "caro" ? Caro : Nico;
    const faces = which === "caro" ? caroFace : nicoFace;
    const b = blink(frame, 96, which === "caro" ? 0 : 40);
    const from = "neutral" as const;
    const to = which === "caro" ? ("phone" as const) : ("stress" as const);
    const tilt = osc(frame, 120, 1.5, which === "caro" ? 0 : 30);
    return (
      <div style={{ position: "absolute", left: x, top: 60, width: 640, height: 940, transform: `scale(${2 - squash},${squash})`, transformOrigin: "50% 100%" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 1 - k }}>
          <C pose={from} uid={`${which}-a`} breath={breath} sway={sway} face={{ ...faces[from], blink: b }} headTilt={(which === "caro" ? -3 : 2) + tilt} />
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: k }}>
          <C pose={to} uid={`${which}-b`} breath={breath} sway={sway} face={{ ...faces[to], blink: b }} />
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ background: "#F1F0FA" }}>
      {character("caro", 260)}
      {character("nico", 1020)}
    </AbsoluteFill>
  );
};
