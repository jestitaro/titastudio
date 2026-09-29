import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, easeOut, pop, range } from "../../lib/motion";
import { Closeup, closeupScreen, LightStudio } from "../lib/stage";
import { Device, PngScreen } from "../ds/Device";
import { Toast } from "../ds/ui";
import { S } from "../ds/tokens";
import { QSLogo } from "../brand/QSLogo";
import { fillTri } from "../brand/loader";
import { Kinetic } from "../ui/Kinetic";
import { es } from "../../i18n/es";
import { ScanScreen, SummaryScreen } from "../screens/Scan";
import { S12_PHONE, S12World } from "./S12AiFred";

// Escena 13 — "Incluso sin conexión". El celular de la escena 12 aterriza en la mano de Nico (primer plano).
// Modo sin conexión como feedback positivo, la validación sigue, Enviar → Enviando → el loading de marca
// sale de su pantalla y ocupa el centro (conecta con el cierre).
export const LOGO = { w: 900, isoOffset: (124 / 1313) * 900 };
export const LOGO_H = (LOGO.w * 248) / 1313;
export const logoLeftCentered = 960 - LOGO.isoOffset;
export const LOADER_END = 0.8; // progreso del loader al terminar la escena

const CU = { right: 1960, top: -3, scale: 1 };
const SCR = closeupScreen("nico", CU.right, CU.top, CU.scale);
const LAND: [number, number] = [0, 16];
const SUM0 = 40; // inicio del resumen (push interno)
const SUM_OFFSET = 18; // desfase del reloj interno del resumen
const LOAD: [number, number] = [76, 104];

export const S13Offline: React.FC = () => {
  const f = useCurrentFrame();
  const land = range(f, LAND, [0, 1], easeInOut);
  const cuIn = range(f, [0, 14], [0, 1], easeOut);
  const push = range(f, [SUM0, SUM0 + 10], [0, 1], easeInOut);
  const toast = pop(f, 18, { damping: 14, stiffness: 150 }) * (1 - push);
  const L = range(f, LOAD, [0, 1], easeInOut);
  const cuOut = range(f, [LOAD[0] + 4, LOAD[1]], [0, 1], easeInOut);
  const reveal = range(f, [LOAD[0] - 2, LOAD[1] + 6], [0, 1], easeInOut);
  const progress = range(f, [LOAD[0] - 6, 120], [0, LOADER_END], (t) => t);
  const lx = interpolate(L, [0, 1], [SCR.x + SCR.w / 2, 960]);
  const ly = interpolate(L, [0, 1], [SCR.y + SCR.h * 0.84, 540]);
  const ls = interpolate(L, [0, 1], [0.12, 1]);
  const content = (
    <>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-push * 30}%)` }}>
        <ScanScreen f={90 + f} offline={range(f, [14, 22], [0, 1])} progress={f > 8 ? 100 : undefined} />
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
      <S12World f={239} />
      <AbsoluteFill style={{ clipPath: `circle(${reveal * 1300}px at ${lx}px ${ly}px)` }}>
        <LightStudio f={f} accent={0.6} />
      </AbsoluteFill>
      {cuOut < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: cuIn * (1 - cuOut), transform: `translateX(${(1 - cuIn) * 300 + cuOut * 120}px)`, filter: cuOut > 0 ? `blur(${cuOut * 10}px)` : undefined }}>
          <Closeup who="nico" right={CU.right} top={CU.top} scale={CU.scale} />
          {land >= 1 && (
            <PngScreen x={SCR.x} y={SCR.y} w={SCR.w} h={SCR.h} radius={SCR.r}>
              {content}
            </PngScreen>
          )}
        </div>
      )}
      {land < 1 && (
        <Device x={interpolate(land, [0, 1], [S12_PHONE.x, SCR.x + SCR.w / 2])} y={interpolate(land, [0, 1], [S12_PHONE.y, SCR.y + SCR.h / 2])} scale={interpolate(land, [0, 1], [S12_PHONE.s, SCR.w / 390])}>
          {content}
        </Device>
      )}
      {f >= LOAD[0] - 6 && (
        <div style={{ position: "absolute", left: lx - LOGO.isoOffset * ls, top: ly - (LOGO_H / 2) * ls, transform: `scale(${ls})`, transformOrigin: "0 0" }}>
          <QSLogo width={LOGO.w} word={0} tri={fillTri(progress, 0.16, range(f, [LOAD[0] - 6, LOAD[0] + 6], [0, 1]))} id="s13loader" />
        </div>
      )}
      <Kinetic f={f} text={es.video.kinetic.s13.text} at={10} out={70} x={110} y={500} accent={[2]} eyebrow={es.video.kinetic.s13.eyebrow} size={60} />
    </AbsoluteFill>
  );
};
