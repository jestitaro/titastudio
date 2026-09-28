import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, easeOut, osc, pop, range } from "../../lib/motion";
import { Char, Layer, LightStudio, Particles, POSE, QS } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { nunito } from "../lib/fonts";
import { Icon } from "../ui/icons";
import { Kinetic } from "../ui/Kinetic";
import { es } from "../../i18n/es";
import { Phone } from "../ui/Phone";
import { CHAT, ChatSheet } from "../ui/screens/Chat";
import { OrganizeScreen } from "../ui/screens/Organize";

// Escena 8 — "Optimiza la comunicación". El chat sube como sheet sobre el ruteo;
// Nico entra desde la izquierda como refuerzo narrativo (el equipo en campo).
export const S08_END = { x: 1010, y: 540, s: 0.95 };
export const NICO8 = { x: 470, feet: 1450, scale: 0.78 };

export const S08Chat: React.FC = () => {
  const f = useCurrentFrame();
  const k = range(f, [0, 24], [0, 1], easeInOut);
  const px = interpolate(k, [0, 1], [960, S08_END.x]);
  const ps = interpolate(k, [0, 1], [1.06, S08_END.s]);
  const nicoIn = range(f, [0, 28], [0, 1], easeOut);
  const cam: Cam = { x: 960 - (1 - nicoIn) * 120, y: 540, zoom: 1 };
  const read = pop(f, CHAT.read + 4, { damping: 11, stiffness: 160 });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightStudio f={f + 285} />
      <Layer cam={cam} depth={0.4}>
        <Particles f={f} n={30} seed="s08" color={QS.indigo} speed={0.3} size={[2, 5]} opacity={0.3} />
      </Layer>
      <Layer cam={cam} depth={1}>
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${interpolate(nicoIn, [0, 1], [-520, 0])}px)` }}>
          <Char pose={POSE.nicoCelular} x={NICO8.x} feetY={NICO8.feet} scale={NICO8.scale} />
        </div>
      </Layer>

      <Phone x={px} y={540} scale={ps}>
        <OrganizeScreen f={165} />
        <ChatSheet f={f} />
      </Phone>

      {/* Burbujas que salen del teléfono hacia el aire (eco de la conversación) */}
      {[
        { at: CHAT.incoming + 2, x: 1300, y: 250, icon: "chat" as const, c: QS.violet },
        { at: CHAT.outgoing + 2, x: 760, y: 190, icon: "send" as const, c: "#1976D2" },
      ].map((b, i) => {
        const p = pop(f, b.at, { damping: 12, stiffness: 150 });
        if (p <= 0.01) return null;
        return (
          <div key={i} style={{ position: "absolute", left: b.x, top: b.y + osc(f, 60, 8, i * 20), transform: `translate(-50%, -50%) scale(${p})` }}>
            <div style={{ width: 84, height: 84, borderRadius: 26, background: "#fff", boxShadow: "0 18px 40px rgba(19,13,93,0.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={b.icon} size={44} color={b.c} />
            </div>
          </div>
        );
      })}
      {read > 0.01 && (
        <div style={{ position: "absolute", left: S08_END.x + 250, top: 820, transform: `translate(-50%, -50%) scale(${read})`, background: "#fff", borderRadius: 999, padding: "10px 18px", boxShadow: "0 14px 30px rgba(19,13,93,0.16)", display: "flex", alignItems: "center", gap: 10, fontFamily: nunito, fontWeight: 800, fontSize: 20, color: QS.dark }}>
          <svg width="30" height="18" viewBox="0 0 26 16">
            <path d="M2 8.5 6 12.5 13 4M10 11 11.5 12.5 18.5 4" fill="none" stroke="#1976D2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Leído
        </div>
      )}

      <Kinetic f={f} text={es.video.kinetic.s08.text} at={20} out={108} x={1320} y={520} accent={[2]} eyebrow={es.video.kinetic.s08.eyebrow} />
    </AbsoluteFill>
  );
};
