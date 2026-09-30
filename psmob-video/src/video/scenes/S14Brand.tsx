import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { useSceneFrame } from "../lib/sceneClock";
import { easeInOut, easeOut, range } from "../../lib/motion";
import { LightStudio, QS } from "../lib/stage";
import { FONT } from "../ds/tokens";
import { es } from "../../i18n/es";
import { QSLogo } from "../brand/QSLogo";
import { fillTri } from "../brand/loader";
import { LOADER_END, LOADER_SCALE_END, LOGO, LOGO_H, logoLeftCentered } from "./S13Offline";

// Escena 14 — cierre exclusivamente con QuartzSales. Los triángulos del loading se ensamblan en el
// isotipo; el símbolo se desplaza y el wordmark aparece por máscara. La frase final se integra al cierre.
const T = { assemble: [0, 40] as [number, number], slide: [36, 106] as [number, number], line: 112 };
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const LOGO_LEFT_FINAL = 960 - LOGO.w / 2;
const TOP = 540 - LOGO_H / 2 - 50;

export const S14Brand: React.FC = () => {
  const f = useSceneFrame();
  // Un solo movimiento continuo y lento: el isotipo termina de llenarse, después se aleja (zoom 1.2 → 1),
  // se desplaza y el wordmark aparece con la misma curva. Sin destellos ni rebotes.
  const assemble = range(f, T.assemble, [0, 1], easeInOut);
  const move = range(f, T.slide, [0, 1], easeInOutCubic);
  const left = interpolate(move, [0, 1], [logoLeftCentered, LOGO_LEFT_FINAL]);
  const top = interpolate(move, [0, 1], [540 - LOGO_H / 2, TOP]);
  const word = range(move, [0.2, 1], [0, 1], (t) => t);
  const wordShift = interpolate(word, [0, 1], [-60, 0]);
  const line = range(f, [T.line, T.line + 20], [0, 1], easeOut);
  const line2 = range(f, [T.line + 8, T.line + 28], [0, 1], easeOut);
  const settle = interpolate(move, [0, 1], [LOADER_SCALE_END, 1]);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightStudio f={f + 120} accent={0.6} />
      <AbsoluteFill style={{ transform: `scale(${settle})`, transformOrigin: "960px 540px" }}>
        <div style={{ position: "absolute", left, top }}>
          <QSLogo width={LOGO.w} tri={fillTri(LOADER_END + (1 - LOADER_END) * assemble)} word={word} wordShift={wordShift} id="s14" />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: TOP + LOGO_H + 56, textAlign: "center", fontFamily: FONT }}>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 34, fontWeight: 600, color: QS.dark, transform: `translateY(${(1 - line) * 110}%)` }}>{es.video.closing.line1}</div>
          </div>
          <div style={{ overflow: "hidden", marginTop: 4 }}>
            <div style={{ fontSize: 34, fontWeight: 600, color: QS.dark, transform: `translateY(${(1 - line2) * 110}%)` }}>
              {es.video.closing.line2} <span style={{ color: QS.violet }}>{es.video.closing.line2Accent}</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
