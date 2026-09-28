import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { easeInOut, easeOut, range } from "../../lib/motion";
import { LightStudio, QS } from "../lib/stage";
import { nunito } from "../lib/fonts";
import { es } from "../../i18n/es";
import { QSLogo } from "../brand/QSLogo";
import { loaderTri } from "../brand/loader";
import { LOGO, LOGO_H, logoLeftCentered } from "./S13Offline";

// Escena 14 — cierre exclusivamente con QuartzSales. Los triángulos del loading se ensamblan en el
// isotipo; el símbolo se desplaza y el wordmark aparece por máscara. La frase final se integra al cierre.
const T = { assemble: [0, 36] as [number, number], slide: [38, 70] as [number, number], line: 72 };
const LOGO_LEFT_FINAL = 960 - LOGO.w / 2;
const TOP = 540 - LOGO_H / 2 - 50;

// Spin continuo desde la escena 13 (f*0.12 al final de s13 = 120 frames) que desacelera al ensamblarse.
const spinAt = (f: number) => {
  const base = 120 * 0.12;
  const k = range(f, T.assemble, [0, 1], (t) => t);
  return base + 0.12 * T.assemble[1] * (k - (k * k) / 2);
};

// Triángulos pequeños de fondo (eco del isotipo), muy sutiles.
const Shards: React.FC<{ f: number }> = ({ f }) => (
  <>
    {Array.from({ length: 16 }).map((_, i) => {
      const x = random(`sx${i}`) * 1920;
      const y = random(`sy${i}`) * 1080;
      if (Math.abs(x - 960) < 560 && Math.abs(y - 540) < 220) return null;
      const s = 14 + random(`ss${i}`) * 26;
      const o = range(f, [20 + i * 2, 50 + i * 2], [0, 1]) * 0.35;
      return (
        <svg key={i} width={s} height={s} viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y + Math.sin(f / 40 + i) * 8, opacity: o, transform: `rotate(${(i % 2) * 180 + f * 0.2 * (i % 3 ? 1 : -1)}deg)` }}>
          <path d="M12 3 21 19H3Z" fill={i % 2 ? "#B9A6F5" : "#A9CCF5"} />
        </svg>
      );
    })}
  </>
);

export const S14Brand: React.FC = () => {
  const f = useCurrentFrame();
  const assemble = range(f, T.assemble, [0, 1], easeInOut);
  const slide = range(f, T.slide, [0, 1], easeInOut);
  const left = interpolate(slide, [0, 1], [logoLeftCentered, LOGO_LEFT_FINAL]);
  const top = interpolate(slide, [0, 1], [540 - LOGO_H / 2, TOP]);
  const word = range(f, [T.slide[0] + 6, T.slide[1] + 4], [0, 1], easeOut);
  const wordShift = interpolate(word, [0, 1], [-140, 0]);
  const line = range(f, [T.line, T.line + 16], [0, 1], easeOut);
  const line2 = range(f, [T.line + 6, T.line + 22], [0, 1], easeOut);
  const settle = range(f, [T.line, 165], [1, 1.025], (t) => t);
  // Pulso de luz cuando el isotipo termina de ensamblarse.
  const flash = range(f, [T.assemble[1] - 4, T.assemble[1] + 2], [0, 1]) * (1 - range(f, [T.assemble[1] + 2, T.assemble[1] + 20], [0, 1]));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightStudio f={f + 120} accent={0.6} />
      <Shards f={f} />
      <AbsoluteFill style={{ transform: `scale(${settle})` }}>
        <div
          style={{
            position: "absolute",
            left: left + LOGO.isoOffset - 260,
            top: top + LOGO_H / 2 - 260,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "radial-gradient(closest-side, rgba(112,37,224,0.22), rgba(112,37,224,0))",
            opacity: flash,
          }}
        />
        <div style={{ position: "absolute", left, top }}>
          <QSLogo width={LOGO.w} tri={loaderTri(spinAt(f), assemble)} word={word} wordShift={wordShift} id="s14" />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: TOP + LOGO_H + 56, textAlign: "center", fontFamily: nunito }}>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 34, fontWeight: 700, color: QS.dark, transform: `translateY(${(1 - line) * 110}%)` }}>{es.video.closing.line1}</div>
          </div>
          <div style={{ overflow: "hidden", marginTop: 4 }}>
            <div style={{ fontSize: 34, fontWeight: 700, color: QS.dark, transform: `translateY(${(1 - line2) * 110}%)` }}>
              {es.video.closing.line2} <span style={{ color: QS.violet }}>{es.video.closing.line2Accent}</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
