// Cursor de sistema (flecha / mano / I-beam) con feedback de click mínimo.
import React from "react";
import { SceneState } from "../animation/scene-state";

const Arrow = () => (
  <svg width="22" height="26" viewBox="0 0 22 26" style={{ position: "absolute", left: -3, top: -2 }}>
    <path d="M3 2v19.5l5-4.6 3.2 7.1 3.1-1.4-3.1-6.9h6.9z" fill="#111" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

const Hand = () => (
  <svg width="24" height="26" viewBox="0 0 24 26" style={{ position: "absolute", left: -8, top: -2 }}>
    <path
      d="M8.2 2.6c1 0 1.8.8 1.8 1.8v6.2c.3-.4.8-.6 1.4-.6 1 0 1.7.7 1.8 1.6.3-.4.8-.6 1.4-.6 1 0 1.7.7 1.8 1.6.3-.3.8-.5 1.3-.5 1 0 1.8.8 1.8 1.8v4.8c0 3.3-2.6 6-5.9 6h-2.3c-1.9 0-3.6-.9-4.7-2.4l-3.6-5c-.5-.8-.4-1.9.4-2.4.7-.5 1.7-.4 2.3.3l1.1 1.3V4.4c0-1 .8-1.8 1.8-1.8z"
      fill="#fff"
      stroke="#111"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path d="M11.4 14v4M14.6 14v4M17.8 14.6v3.4" stroke="#111" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const Beam = () => (
  <svg width="12" height="22" viewBox="0 0 12 22" style={{ position: "absolute", left: -6, top: -11 }}>
    <path d="M2.5 1.5h2.2c.7 0 1.3.6 1.3 1.3 0-.7.6-1.3 1.3-1.3h2.2M2.5 20.5h2.2c.7 0 1.3-.6 1.3-1.3 0 .7.6 1.3 1.3 1.3h2.2M6 2.8v16.4" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    <path d="M2.5 1.5h2.2c.7 0 1.3.6 1.3 1.3 0-.7.6-1.3 1.3-1.3h2.2M2.5 20.5h2.2c.7 0 1.3-.6 1.3-1.3 0 .7.6 1.3 1.3 1.3h2.2M6 2.8v16.4" fill="none" stroke="#111" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const Cursor: React.FC<{ s: SceneState }> = ({ s }) => {
  const k = s.cursor;
  if (k.opacity <= 0) return null;
  const ringR = 5 + 13 * k.ring;
  return (
    <div style={{ position: "absolute", left: k.x, top: k.y, opacity: k.opacity, pointerEvents: "none" }}>
      {k.ring > 0 && k.ring < 1 ? (
        <div
          style={{
            position: "absolute",
            left: -ringR,
            top: -ringR,
            width: ringR * 2,
            height: ringR * 2,
            borderRadius: ringR,
            border: "1.5px solid rgba(127, 71, 236, 0.55)",
            opacity: 1 - k.ring,
          }}
        />
      ) : null}
      <div style={{ position: "absolute", transform: `scale(${1 - 0.14 * k.press})`, transformOrigin: "0 0", filter: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.25))" }}>
        {k.kind === "pointer" ? <Hand /> : k.kind === "text" ? <Beam /> : <Arrow />}
      </div>
    </div>
  );
};
