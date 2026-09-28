import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { color } from "../../design/psmob-tokens";
import { easeInOut, easeOut, osc, pop, range } from "../../lib/motion";
import { Layer, LightStudio, Particles, QS } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { nunito } from "../lib/fonts";
import { Icon } from "../ui/icons";
import { Kinetic } from "../ui/Kinetic";
import { es } from "../../i18n/es";
import { Phone, SCREEN_W } from "../ui/Phone";
import { FormsFlow } from "../ui/screens/Forms";
import { RealtimeFlow, RT } from "../ui/screens/Realtime";
import { S09_END } from "./S09Capture";

// Escena 10 — "Información en tiempo real". Una sola interfaz protagonista, frontal y derecha,
// que pasa por Indicadores → Exhibición → OSA con swipe interno. Chips de datos "en vivo" a su lado.
export const S10_END = { x: 760, y: 540, s: 1 };

const LiveChip: React.FC<{ f: number; at: number; label: string; value: string; up: string; x: number; y: number }> = ({ f, at, label, value, up, x, y }) => {
  const p = pop(f, at, { damping: 12, stiffness: 150 });
  if (p <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y + osc(f, 70, 6), transform: `translate(-50%, -50%) scale(${p})`, background: "#fff", borderRadius: 20, boxShadow: "0 18px 40px rgba(19,13,93,0.14)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, fontFamily: nunito }}>
      <div style={{ width: 46, height: 46, borderRadius: 14, background: color.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="chart" size={28} color={QS.violet} />
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#64748b" }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: QS.dark, lineHeight: 1.1 }}>
          {value} <span style={{ fontSize: 17, color: color.successDark }}>▲ {up}</span>
        </div>
      </div>
    </div>
  );
};

export const S10Realtime: React.FC = () => {
  const f = useCurrentFrame();
  const k = range(f, [0, 20], [0, 1], easeInOut);
  const px = interpolate(k, [0, 1], [S09_END.x, S10_END.x]);
  const cam: Cam = { x: 960 + (1 - k) * 60, y: 540, zoom: 1 };
  // Salida de la pantalla de quiebres (push interno) hacia los indicadores
  const push = range(f, [2, 16], [0, 1], easeOut);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightStudio f={f + 525} />
      <Layer cam={cam} depth={0.4}>
        <Particles f={f} n={30} seed="s10" color={QS.indigo} speed={0.3} size={[2, 5]} opacity={0.3} />
      </Layer>
      <Phone x={px} y={540} scale={S10_END.s}>
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - push) * SCREEN_W}px)` }}>
          <RealtimeFlow f={f} />
        </div>
        {push < 1 && (
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${-push * SCREEN_W * 0.3}px)`, opacity: 1 - push * 0.5 }}>
            <FormsFlow f={120} under={null} />
          </div>
        )}
      </Phone>
      <LiveChip f={f} at={RT.live1 + 2} label="OSA" value="71%" up="7 pts" x={1560} y={250} />
      <LiveChip f={f} at={RT.live2 + 2} label="Jabón para la ropa" value="69,10%" up="1,28" x={1620} y={820} />
      <Kinetic f={f} text={es.video.kinetic.s10.text} at={18} out={138} x={1110} y={520} accent={[3, 4]} eyebrow={es.video.kinetic.s10.eyebrow} />
    </AbsoluteFill>
  );
};
