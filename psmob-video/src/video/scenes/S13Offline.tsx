import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, pop, range } from "../../lib/motion";
import { camPath, LightStudio, toScreen } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { Toast } from "../ds/ui";
import { S } from "../ds/tokens";
import { QSLogo } from "../brand/QSLogo";
import { fillTri } from "../brand/loader";
import { Kinetic } from "../ui/Kinetic";
import { es } from "../../i18n/es";
import { ScanScreen, SummaryScreen } from "../screens/Scan";
import { DEPTH_N, DEV12, s12Cam, S12_DUR, S12World, T0 } from "./S12AiFred";

// Escena 13 — "Incluso sin conexión". La cámara continúa el acercamiento suave de la 12 (Nico entero en
// cuadro, el celular protagonista); el texto va a la izquierda sobre una placa clara para leerse sobre la
// góndola. Aviso positivo de modo sin conexión, resumen, Enviar → Enviando y el loading
// de marca que se expande despacio desde el botón hacia el centro.
export const LOGO = { w: 900, isoOffset: (124 / 1313) * 900 };
export const LOGO_H = (LOGO.w * 248) / 1313;
export const logoLeftCentered = 960 - LOGO.isoOffset;
export const LOADER_END = 0.75;
export const LOADER_SCALE_END = 1.2;

const SUM0 = 60;
const SUM_TS = 0.8;
const SUM_OFFSET = 10;
const LOAD: [number, number] = [116, 156];

const cam = (f: number): Cam =>
  camPath(f, [
    { f: 0, ...s12Cam(S12_DUR) },
    { f: 165, x: DEV12.x - 35, y: 540, zoom: 1.15 },
  ]);

export const S13Offline: React.FC = () => {
  const f = useCurrentFrame();
  const c = cam(f);
  const push = range(f, [SUM0, SUM0 + 14], [0, 1], easeInOut);
  const toast = pop(f, 16, { damping: 16, stiffness: 110 }) * (1 - push);
  const L = range(f, LOAD, [0, 1], easeInOut);
  const reveal = range(f, [LOAD[0], LOAD[1] + 6], [0, 1], easeInOut);
  const progress = range(f, [LOAD[0] - 6, 165], [0, LOADER_END], (t) => t);
  const devScreen = toScreen(c, DEPTH_N, DEV12);
  const btn = { x: devScreen.x, y: devScreen.y + 374 * DEV12.s * devScreen.z };
  const lx = interpolate(L, [0, 1], [btn.x, 960]);
  const ly = interpolate(L, [0, 1], [btn.y, 540]);
  const ls = interpolate(L, [0, 1], [0.05, LOADER_SCALE_END]);
  const content = (
    <>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-push * 30}%)` }}>
        <ScanScreen f={(S12_DUR - T0.scan) * 0.8 + f * 0.8} offline={range(f, [12, 22], [0, 1])} progress={f > 8 ? 100 : undefined} />
        {toast > 0.01 && (
          <div style={{ position: "absolute", left: S.lg, right: S.lg, top: 100, transform: `translateY(${(1 - toast) * -120}px)` }}>
            <Toast icon="cloud" title="Modo sin conexión" subtitle="Seguís trabajando · guardado localmente" />
          </div>
        )}
      </div>
      {push > 0 && (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - push) * 100}%)` }}>
          <SummaryScreen f={(f - SUM0) * SUM_TS + SUM_OFFSET} />
        </div>
      )}
    </>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <S12World f={S12_DUR} cam={c} device={content} deviceState={{ ...DEV12, o: 1 }} arOpacity={1 - range(f, [0, 30], [0, 1])} />
      <AbsoluteFill style={{ clipPath: `circle(${reveal * 1300}px at ${lx}px ${ly}px)` }}>
        <LightStudio f={f} accent={0.6} />
      </AbsoluteFill>
      {f >= LOAD[0] - 6 && (
        <div style={{ position: "absolute", left: lx - LOGO.isoOffset * ls, top: ly - (LOGO_H / 2) * ls, transform: `scale(${ls})`, transformOrigin: "0 0" }}>
          <QSLogo width={LOGO.w} word={0} tri={fillTri(progress, 0.16, range(f, [LOAD[0] - 6, LOAD[0] + 8], [0, 1]))} id="s13loader" />
        </div>
      )}
      <Kinetic f={f} text={es.video.kinetic.s13.text} at={16} out={98} x={130} y={500} accent={[2]} eyebrow={es.video.kinetic.s13.eyebrow} size={60} plate />
    </AbsoluteFill>
  );
};
