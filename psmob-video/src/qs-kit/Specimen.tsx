// Hoja de calibración del kit: renderiza textos grandes en cajas para medir el centrado
// óptico de Poppins y revisar primitivas. Composición "QS-Kit-Specimen" (1 frame).
import React from "react";
import { AbsoluteFill } from "remotion";
import { font } from "./design/tokens";

const Box: React.FC<{ x: number; text: string; weight: number }> = ({ x, text, weight }) => (
  <div style={{ position: "absolute", left: x, top: 100, width: 420, height: 200, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <span style={{ fontFamily: font, fontSize: 100, fontWeight: weight, lineHeight: 1, color: "#000", display: "block" }}>{text}</span>
  </div>
);

export const Specimen: React.FC = () => (
  <AbsoluteFill style={{ background: "#ff0000" }}>
    <Box x={20} text="123" weight={400} />
    <Box x={460} text="HDC" weight={700} />
    <Box x={900} text="xae" weight={500} />
  </AbsoluteFill>
);
