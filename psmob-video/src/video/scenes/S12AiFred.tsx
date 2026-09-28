import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { color } from "../../design/psmob-tokens";
import { easeInOut, osc, pop, range } from "../../lib/motion";
import { Char, Layer, POSE, posePoint, QS, toScreen } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { nunito } from "../lib/fonts";
import { Icon, IconName } from "../ui/icons";
import { Phone, SCREEN_H } from "../ui/Phone";
import { FACINGS, Shelf, SHELF } from "../ui/Shelf";
import { ScanScreen } from "../ui/screens/Scan";

// Escena 12 — AiFred. Travelling lateral por la góndola (parallax en 4 planos) → Nico escaneando con
// realidad aumentada sobre los productos → zoom fuerte a su celular → el celular vectorial nace ahí,
// se endereza y ocupa el cuadro con la cámara de reconocimiento.
const NICO = { x: 2950, feet: 1190, scale: 0.64 };
const PHONE_W = (() => {
  const p = posePoint(POSE.nicoCelular, NICO.scale, { x: 275, y: 460 });
  return { x: NICO.x + p.x, y: NICO.feet + p.y };
})();
const T = { pan: [0, 108] as [number, number], ar: [96, 150] as [number, number], zoom: [138, 182] as [number, number], scan: 150 };
export const S12_PHONE = { x: 1250, y: 540, s: 1 };

const cam = (f: number): Cam => {
  const pan = range(f, T.pan, [0, 1], easeInOut);
  const z = range(f, T.zoom, [0, 1], easeInOut);
  return {
    x: interpolate(pan, [0, 1], [760, 2640]) + z * (PHONE_W.x - 2640),
    y: 540 + z * (PHONE_W.y - 540),
    zoom: 1 + z * 1.1,
  };
};

// Tienda de fondo (plano lejano): luces de techo y góndolas lejanas.
const Store: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: -2000, top: -800, width: 8000, height: 2600, background: "linear-gradient(180deg, #EEF0FA 0%, #E4E7F5 55%, #D9DDEE 100%)" }} />
    {Array.from({ length: 14 }).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: -600 + i * 420, top: -40, width: 260, height: 26, borderRadius: 13, background: "#FFFFFF", boxShadow: "0 0 60px 20px rgba(255,255,255,0.9)" }} />
    ))}
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={`g${i}`} style={{ position: "absolute", left: -600 + i * 560, top: 180, width: 420, height: 620, borderRadius: 16, background: "#D6DBEE" }} />
    ))}
  </>
);

// Realidad aumentada sobre la góndola real (antes del zoom).
const ArOverlay: React.FC<{ f: number }> = ({ f }) => {
  const near = FACINGS.filter((p) => p.x > 2050 && p.x < 2790 && p.level < 3);
  const sweep = range(f, [T.ar[0], T.ar[0] + 40], [0, 1], easeInOut);
  const sx = interpolate(sweep, [0, 1], [2790, 2050]);
  const o = 1 - range(f, [T.zoom[0] + 10, T.zoom[0] + 24], [0, 1]);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      {/* Haz de escaneo desde el celular de Nico hacia la góndola */}
      {f >= T.ar[0] && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
          <defs>
            <linearGradient id="beam" x1="1" x2="0" y1="0" y2="0">
              <stop offset="0" stopColor="#7C5CFC" stopOpacity="0.45" />
              <stop offset="1" stopColor="#7C5CFC" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`${PHONE_W.x},${PHONE_W.y} ${sx},${SHELF.top + 10} ${sx - 120},${SHELF.top + 10} ${sx - 120},${SHELF.levels[2]} ${sx},${SHELF.levels[2]}`} fill="url(#beam)" />
          <line x1={sx} x2={sx} y1={SHELF.top} y2={SHELF.levels[2] + 20} stroke="#B79CFF" strokeWidth={4} />
        </svg>
      )}
      {near.map((p) => {
        const passed = sx <= p.x;
        if (!passed) return null;
        const at = T.ar[0] + ((2790 - p.x) / 740) * 40;
        const k = pop(f, at, { damping: 12, stiffness: 190, mass: 0.6 });
        const bad = p.kind !== "ok";
        const c = bad ? color.danger : "#7C5CFC";
        return (
          <div key={`${p.level}-${p.group}-${p.i}`} style={{ position: "absolute", left: p.x - 58, top: p.y - SHELF.productH, width: 116, height: SHELF.productH - 6, border: `3px solid ${c}`, borderRadius: 10, transform: `scale(${0.85 + 0.15 * k})`, opacity: k, background: bad ? "rgba(244,67,54,0.12)" : "rgba(124,92,252,0.06)" }}>
            <div style={{ position: "absolute", left: -3, top: -26, background: c, color: "#fff", fontSize: 13, fontWeight: 700, padding: "3px 7px", borderRadius: "6px 6px 6px 0", whiteSpace: "nowrap", fontFamily: nunito }}>
              {bad ? (p.kind === "gap" ? "Quiebre" : "Fuera de lugar") : `${96 + ((p.x / 10) % 4) | 0}%`}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Insight: React.FC<{ f: number; at: number; icon: IconName; title: string; value: string; tone: string; x: number; y: number }> = ({ f, at, icon, title, value, tone, x, y }) => {
  const p = pop(f, at, { damping: 12, stiffness: 150 }) * (1 - range(f, [230, 240], [0, 1], easeInOut));
  if (p <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y + osc(f, 70, 6), transform: `translate(-50%, -50%) scale(${p})`, background: "#fff", borderRadius: 20, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 24px 50px rgba(19,13,93,0.25)", fontFamily: nunito }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: `${tone}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={28} color={tone} />
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#64748b" }}>{title}</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: QS.dark }}>{value}</div>
      </div>
    </div>
  );
};

// Mundo de la escena (tienda, góndola con AR, Nico, objetos en primer plano). Se exporta para que la
// escena 13 herede exactamente el mismo fondo desenfocado.
export const S12World: React.FC<{ f: number }> = ({ f }) => {
  const c = cam(f);
  const z = range(f, T.zoom, [0, 1], easeInOut);
  const worldBlur = z * 9;
  return (
    <>
      <Layer cam={c} depth={0.35} blur={2 + worldBlur * 0.6}>
        <Store />
      </Layer>
      <Layer cam={c} depth={1} blur={worldBlur}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 4000, height: 1080 }}>
          <Shelf />
          <ArOverlay f={f} />
        </div>
        <div style={{ position: "absolute", left: -400, top: SHELF.levels[3] + 110, width: 5000, height: 600, background: "linear-gradient(180deg, #CBD2E6, #BAC2DA)" }} />
      </Layer>
      <Layer cam={c} depth={1.04} blur={worldBlur}>
        <div style={{ position: "absolute", inset: 0, width: 4000, height: 1400 }}>
          <div style={{ position: "absolute", left: NICO.x - 190, top: NICO.feet - 30, width: 380, height: 60, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(19,13,93,0.22), rgba(19,13,93,0))" }} />
          <Char pose={POSE.nicoCelular} x={NICO.x} feetY={NICO.feet} scale={NICO.scale} />
        </div>
      </Layer>
      {/* Objetos que cruzan cámara en primer plano (cabecera de góndola y carrito desenfocados) */}
      <Layer cam={c} depth={1.7} blur={10}>
        {[1300, 2500].map((x) => (
          <div key={x} style={{ position: "absolute", left: x, top: 120, width: 190, height: 1300, borderRadius: 26, background: "linear-gradient(180deg, #463DE1 0 90px, #E9EDF7 90px)", opacity: 0.9 }} />
        ))}
      </Layer>

    </>
  );
};

export const S12AiFred: React.FC = () => {
  const f = useCurrentFrame();
  const c = cam(f);
  // El celular vectorial nace sobre el de Nico (con su inclinación) y se endereza al tomar protagonismo.
  const born = range(f, [T.zoom[0] + 14, T.zoom[1] + 6], [0, 1], easeInOut);
  const s0 = toScreen(c, 1.04, PHONE_W);
  const startScale = (120 * s0.z * 0.62) / SCREEN_H;
  const px = interpolate(born, [0, 1], [s0.x, S12_PHONE.x]);
  const py = interpolate(born, [0, 1], [s0.y, S12_PHONE.y]);
  const ps = interpolate(born, [0, 1], [startScale, S12_PHONE.s]);
  const rot = interpolate(born, [0, 0.6, 1], [-22, -4, 0]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#E4E7F5" }}>
      <S12World f={f} />

      {/* Chip AiFred mientras escanea en el mundo */}
      {f >= T.ar[0] && f < T.zoom[0] + 16 && (
        <div style={{ position: "absolute", left: 120, top: 110, transform: `scale(${pop(f, T.ar[0])})`, transformOrigin: "0 0", display: "flex", alignItems: "center", gap: 12, background: QS.dark, color: "#fff", padding: "14px 22px", borderRadius: 999, fontFamily: nunito, fontSize: 24, fontWeight: 800, boxShadow: "0 20px 40px rgba(19,13,93,0.3)", opacity: 1 - range(f, [T.zoom[0], T.zoom[0] + 14], [0, 1]) }}>
          <Icon name="sparkle" size={30} color="#B79CFF" />
          AiFred escaneando góndola
        </div>
      )}

      {f >= T.zoom[0] + 14 && (
        <div style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", left: px, top: py, transform: `rotate(${rot}deg)`, transformOrigin: "0 0" }}>
            <Phone x={0} y={0} scale={ps} shadowO={born}>
              <ScanScreen f={f - T.scan} />
            </Phone>
          </div>
        </div>
      )}

      <Insight f={f} at={196} icon="dollar" title="Precios validados" value="46 / 48" tone={color.successDark} x={520} y={300} />
      <Insight f={f} at={206} icon="grid" title="Planograma" value="92% OK" tone={QS.violet} x={470} y={520} />
      <Insight f={f} at={216} icon="alert" title="Quiebres detectados" value="2 productos" tone={color.danger} x={540} y={740} />
    </AbsoluteFill>
  );
};
