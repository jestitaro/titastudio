import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { color } from "../../design/psmob-tokens";
import { easeInOut, osc, pop, range } from "../../lib/motion";
import { Char, Layer, LightStudio, Particles, POSE, QS } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { catSrc, PRODUCTS } from "../data";
import { Icon } from "../ui/icons";
import { Kinetic } from "../ui/Kinetic";
import { es } from "../../i18n/es";
import { Phone } from "../ui/Phone";
import { ChatSheet } from "../ui/screens/Chat";
import { FORM_T, FormsFlow, MARKS } from "../ui/screens/Forms";
import { OrganizeScreen } from "../ui/screens/Organize";
import { NICO8, S08_END } from "./S08Chat";

// Escena 9 — "Agiliza la captura de datos". Nico sale de cuadro, el celular cruza a la derecha
// y el flujo de formulario ocurre dentro de la app; los productos marcados saltan fuera del teléfono.
export const S09_END = { x: 1180, y: 540, s: 1 };

export const S09Capture: React.FC = () => {
  const f = useCurrentFrame();
  const k = range(f, [0, 20], [0, 1], easeInOut);
  const px = interpolate(k, [0, 1], [S08_END.x, S09_END.x]);
  const ps = interpolate(k, [0, 1], [S08_END.s, S09_END.s]);
  const nicoOut = range(f, [0, 18], [0, 1], easeInOut);
  const cam: Cam = { x: 960 + nicoOut * 120, y: 540, zoom: 1 };
  const successP = pop(f, FORM_T.success[0] + 2, { damping: 10, stiffness: 150 });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightStudio f={f + 405} />
      <Layer cam={cam} depth={0.4}>
        <Particles f={f} n={30} seed="s09" color={QS.indigo} speed={0.3} size={[2, 5]} opacity={0.3} />
      </Layer>
      {nicoOut < 1 && (
        <Layer cam={cam} depth={1}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${-nicoOut * 700}px)` }}>
            <Char pose={POSE.nicoCelular} x={NICO8.x} feetY={NICO8.feet} scale={NICO8.scale} />
          </div>
        </Layer>
      )}

      <Phone x={px} y={540} scale={ps}>
        <FormsFlow
          f={f}
          under={
            <>
              <OrganizeScreen f={165} />
              <ChatSheet f={120 + f} closeAt={120} />
            </>
          }
        />
      </Phone>

      {/* Cada producto marcado salta fuera del teléfono con su estado */}
      {FORM_T.marks.map((m, i) => {
        const p = pop(f, m + 2, { damping: 11, stiffness: 150, mass: 0.7 });
        if (p <= 0.01) return null;
        const pr = PRODUCTS[i];
        const bad = MARKS[i] === 1;
        const pos = [
          { x: 1560, y: 250 },
          { x: 1620, y: 520 },
          { x: 1550, y: 790 },
        ][i];
        const fade = 1 - range(f, [FORM_T.toBreaks[0], FORM_T.toBreaks[1]], [0, 1]);
        return (
          <div key={m} style={{ position: "absolute", left: pos.x, top: pos.y + osc(f, 70, 8, i * 25), transform: `translate(-50%, -50%) scale(${p * (0.6 + 0.4 * fade)})`, opacity: fade }}>
            <div style={{ position: "relative", width: 150, height: 150, borderRadius: 40, background: "#fff", boxShadow: "0 20px 44px rgba(19,13,93,0.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Img src={staticFile(catSrc(pr.cat))} style={{ width: 118, height: 118 }} />
              <div style={{ position: "absolute", right: -10, top: -10, width: 46, height: 46, borderRadius: 23, background: bad ? color.danger : color.success, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 4px #fff" }}>
                <Icon name={bad ? "x" : "check"} size={26} color="#fff" fill={false} sw={2.8} />
              </div>
            </div>
          </div>
        );
      })}
      {successP > 0.01 && (
        <div style={{ position: "absolute", left: S09_END.x - 300, top: 300, transform: `translate(-50%, -50%) scale(${successP * (1 - range(f, [FORM_T.toBreaks[0], FORM_T.toBreaks[1]], [0, 1]))})` }}>
          <div style={{ width: 110, height: 110, borderRadius: 55, background: color.success, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 40px rgba(46,125,50,0.35)" }}>
            <Icon name="check" size={70} color="#fff" fill={false} sw={2.4} />
          </div>
        </div>
      )}

      <Kinetic f={f} text={es.video.kinetic.s09.text} at={16} out={108} x={170} y={540} accent={[3, 4]} eyebrow={es.video.kinetic.s09.eyebrow} />
    </AbsoluteFill>
  );
};
