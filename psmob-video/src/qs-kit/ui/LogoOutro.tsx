// Cierre de marca para todos los videos: la interfaz se desvanece y aparece el logo
// oficial de QuartzSales centrado sobre blanco. Todo derivado del frame.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { easeInOutCubic, easeProduct, progress } from "../motion/easing";

export type OutroTiming = {
  uiOut: readonly [number, number]; // fundido de la interfaz
  logoIn: readonly [number, number]; // entrada del logo
};

// Opacidad de la interfaz durante el cierre (1 → 0).
export const outroUiOpacity = (frame: number, t: OutroTiming) => 1 - progress(frame, t.uiOut[0], t.uiOut[1], easeInOutCubic);

export const LogoOutro: React.FC<{ frame: number; timing: OutroTiming; width?: number }> = ({ frame, timing, width = 640 }) => {
  const bg = progress(frame, timing.uiOut[0], timing.uiOut[1], easeInOutCubic);
  if (bg <= 0) return null;
  const p = progress(frame, timing.logoIn[0], timing.logoIn[1], easeProduct);
  return (
    <AbsoluteFill style={{ background: `rgba(255, 255, 255, ${bg})`, alignItems: "center", justifyContent: "center" }}>
      <Img
        src={staticFile("logo-qs-fullcolor.svg")}
        style={{ width, height: width * (248 / 1313), opacity: p, transform: `translateY(${(1 - p) * 14}px) scale(${0.96 + 0.04 * p})` }}
      />
    </AbsoluteFill>
  );
};
