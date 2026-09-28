import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { roboto } from "../design/fonts";
import { range } from "../lib/motion";

// Subtítulo de referencia de la locución (solo para revisión, se apaga por prop).
export const Subtitle: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const o = range(frame, [4, 14], [0, 1]) * range(frame, [durationInFrames - 8, durationInFrames], [1, 0]);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 44 }}>
      <div
        style={{
          opacity: o,
          fontFamily: roboto,
          fontWeight: 500,
          fontSize: 30,
          color: "#FFFFFF",
          background: "rgba(11,8,56,0.72)",
          padding: "10px 22px",
          borderRadius: 12,
          maxWidth: 1400,
          textAlign: "center",
          lineHeight: 1.35,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
