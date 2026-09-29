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
import { DEV_WORLD, s12Cam, S12World } from "./S12AiFred";

// Escena 13 — "Incluso sin conexión". Sin corte: la cámara continúa desde la 12 con un push-in suave al
// celular (protagonista), Nico queda detrás. Aviso positivo de modo sin conexión, resumen, Enviar →
// Enviando → el loading de marca se expande desde la pantalla hacia el centro (conecta con el cierre).
export const LOGO = { w: 900, isoOffset: (124 / 1313) * 900 };
export const LOGO_H = (LOGO.w * 248) / 1313;
export const logoLeftCentered = 960 - LOGO.isoOffset;
export const LOADER_END = 0.8;
export const LOADER_SCALE_END = 1.25; // la escena 14 arranca con este zoom y abre a 1

const DEPTH_N = 1.1;
const SUM0 = 36;
const SUM_OFFSET = 18;
const LOAD: [number, number] = [76, 106];

// Encuadre final del push-in: celular a ~0,95 de escala, centrado a la derecha.
const PUSH = (() => {
  const zl = 0.98 / DEV_WORLD.s;
  const z = 1 + (zl - 1) / DEPTH_N;
  const fx = DEV_WORLD.x - 220 / zl;
  const fy = DEV_WORLD.y;
  return { x: 960 + (fx - 960) / DEPTH_N, y: 540 + (fy - 540) / DEPTH_N, zoom: z };
})();

const cam = (f: number): Cam =>
  camPath(f, [
    { f: 0, ...s12Cam(240) },
    { f: 70, ...PUSH },
    { f: 120, x: PUSH.x, y: PUSH.y, zoom: PUSH.zoom * 1.04 },
  ]);

export const S13Offline: React.FC = () => {
  const f = useCurrentFrame();
  const c = cam(f);
  const push = range(f, [SUM0, SUM0 + 10], [0, 1], easeInOut);
  const toast = pop(f, 14, { damping: 14, stiffness: 150 }) * (1 - push);
  const L = range(f, LOAD, [0, 1], easeInOut);
  const reveal = range(f, [LOAD[0] - 2, LOAD[1] + 4], [0, 1], easeInOut);
  const progress = range(f, [LOAD[0] - 6, 120], [0, LOADER_END], (t) => t);
  const devScreen = toScreen(c, DEPTH_N, DEV_WORLD);
  const btn = { x: devScreen.x, y: devScreen.y + 380 * DEV_WORLD.s * devScreen.z };
  const lx = interpolate(L, [0, 1], [btn.x, 960]);
  const ly = interpolate(L, [0, 1], [btn.y, 540]);
  const ls = interpolate(L, [0, 1], [0.05, LOADER_SCALE_END]);
  const content = (
    <>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-push * 30}%)` }}>
        <ScanScreen f={68 + f} offline={range(f, [10, 18], [0, 1])} progress={f > 6 ? 100 : undefined} />
        {toast > 0.01 && (
          <div style={{ position: "absolute", left: S.lg, right: S.lg, top: 100, transform: `translateY(${(1 - toast) * -120}px)` }}>
            <Toast icon="cloud" title="Modo sin conexión" subtitle="Seguís trabajando · guardado localmente" />
          </div>
        )}
      </div>
      {push > 0 && (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - push) * 100}%)` }}>
          <SummaryScreen f={f - SUM0 + SUM_OFFSET} />
        </div>
      )}
    </>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <S12World f={239} cam={c} device={content} deviceState={{ ...DEV_WORLD, o: 1 }} />
      {/* Expansión limpia hacia el fondo de marca, desde el loader */}
      <AbsoluteFill style={{ clipPath: `circle(${reveal * 1300}px at ${lx}px ${ly}px)` }}>
        <LightStudio f={f} accent={0.6} />
      </AbsoluteFill>
      {f >= LOAD[0] - 6 && (
        <div style={{ position: "absolute", left: lx - LOGO.isoOffset * ls, top: ly - (LOGO_H / 2) * ls, transform: `scale(${ls})`, transformOrigin: "0 0" }}>
          <QSLogo width={LOGO.w} word={0} tri={fillTri(progress, 0.16, range(f, [LOAD[0] - 6, LOAD[0] + 6], [0, 1]))} id="s13loader" />
        </div>
      )}
      <Kinetic f={f} text={es.video.kinetic.s13.text} at={10} out={68} x={110} y={500} accent={[2]} eyebrow={es.video.kinetic.s13.eyebrow} size={60} />
    </AbsoluteFill>
  );
};
