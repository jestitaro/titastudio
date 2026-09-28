import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { color, radius, shadow } from "../../design/psmob-tokens";
import { easeInOut, easeOut, pop, range } from "../../lib/motion";
import { LightStudio } from "../lib/stage";
import { QSLogo } from "../brand/QSLogo";
import { loaderTri } from "../brand/loader";
import { Icon } from "../ui/icons";
import { Kinetic } from "../ui/Kinetic";
import { es } from "../../i18n/es";
import { AppHeader, Phone, SCREEN_W, Tap } from "../ui/Phone";
import { ScanScreen } from "../ui/screens/Scan";
import { S12_PHONE, S12World } from "./S12AiFred";

// Escena 13 — "Incluso sin conexión". Aviso positivo (no error): el escaneo sigue, el formulario se
// guarda localmente, tap en Enviar → "Enviando…" → el spinner se vuelve el loading de marca
// (triángulos del isotipo) que crece al centro y conecta con el cierre.
export const LOGO = { w: 900, isoOffset: (124 / 1313) * 900 };
export const LOGO_H = (LOGO.w * 248) / 1313;
export const logoLeftCentered = 960 - LOGO.isoOffset;

const T = { toast: 10, summary: [34, 46] as [number, number], tap: 58, sending: 62, loader: [76, 100] as [number, number] };
const SCAN_OFFSET = 90; // continúa el escaneo de la escena 12

const Summary: React.FC<{ f: number }> = ({ f }) => {
  const sending = f >= T.sending;
  const spin = (f - T.sending) * 0.25;
  return (
    <div style={{ position: "absolute", inset: 0, background: color.background }}>
      <AppHeader title="Relevamiento de góndola" back />
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: color.primaryLight, color: color.primaryDarker, borderRadius: radius.md, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, fontWeight: 500 }}>
          <Icon name="cloud" size={22} color={color.primaryDark} />
          Guardado localmente · se sincroniza solo
        </div>
        {[
          ["Productos reconocidos", "48", "check", color.successDark],
          ["Precios validados", "46 / 48", "dollar", color.successDark],
          ["Planograma", "92%", "grid", color.accent],
          ["Quiebres", "2", "alert", color.danger],
        ].map(([l, v, ic, c], i) => {
          const p = pop(f, T.summary[1] + i * 3, { damping: 12, stiffness: 170, mass: 0.6 });
          return (
            <div key={l} style={{ background: color.surface, borderRadius: radius.lg, boxShadow: shadow.card, padding: "14px 14px", display: "flex", alignItems: "center", gap: 12, transform: `translateY(${(1 - p) * 20}px)`, opacity: Math.min(1, p * 2) }}>
              <Icon name={ic as never} size={26} color={c} />
              <div style={{ flex: 1, fontSize: 15, color: color.textPrimary }}>{l}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: color.textPrimary }}>{v}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 16, right: 16, bottom: 34, height: 54, borderRadius: 10, background: color.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontSize: 16, fontWeight: 600, boxShadow: shadow.fab }}>
        {sending ? (
          <>
            <div style={{ width: 22, height: 22 }}>
              <QSLogo width={22} isoOnly isoColor="#FFFFFF" id="btnload" tri={loaderTri(spin, 0)} />
            </div>
            Enviando…
          </>
        ) : (
          <>
            <Icon name="send" size={20} color="#fff" fill={false} /> Enviar formulario
          </>
        )}
      </div>
      <Tap f={f} at={T.tap} x={SCREEN_W / 2} y={783} />
    </div>
  );
};

export const S13Offline: React.FC = () => {
  const f = useCurrentFrame();
  const toast = range(f, [T.toast, T.toast + 12], [0, 1], easeOut) * (1 - range(f, [T.summary[0] + 6, T.summary[0] + 14], [0, 1]));
  const push = range(f, T.summary, [0, 1], easeInOut);
  const L = range(f, T.loader, [0, 1], easeInOut);
  // El celular se aleja mientras el loading de marca ocupa el centro; el fondo se abre en círculo.
  const phoneS = interpolate(L, [0, 1], [S12_PHONE.s, 0.35]);
  const phoneO = 1 - range(f, [T.loader[0] + 8, T.loader[1]], [0, 1]);
  const reveal = range(f, [T.loader[0] - 4, T.loader[1] + 6], [0, 1], easeInOut);
  const spin = f * 0.12;
  const loaderAppear = range(f, [T.loader[0] - 6, T.loader[0] + 14], [0, 1], easeOut);
  const loaderPos = { x: interpolate(L, [0, 1], [S12_PHONE.x, 960]), y: interpolate(L, [0, 1], [S12_PHONE.y + 390, 540]) };
  const loaderScale = interpolate(L, [0, 1], [0.1, 1]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#E4E7F5" }}>
      {/* Mismo fondo desenfocado con el que termina la escena 12 */}
      <S12World f={239} />
      {/* Apertura circular hacia el fondo limpio de marca */}
      <AbsoluteFill style={{ clipPath: `circle(${reveal * 1300}px at ${loaderPos.x}px ${loaderPos.y}px)` }}>
        <LightStudio f={f} accent={0.6} />
      </AbsoluteFill>

      {phoneO > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: phoneO }}>
          <Phone x={interpolate(L, [0, 1], [S12_PHONE.x, 960])} y={540} scale={phoneS}>
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${-push * SCREEN_W * 0.3}px)` }}>
              <ScanScreen f={f + SCAN_OFFSET} offline={range(f, [T.toast, T.toast + 8], [0, 1])} />
            </div>
            {push > 0 && (
              <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - push) * SCREEN_W}px)`, boxShadow: shadow.modal }}>
                <Summary f={f} />
              </div>
            )}
            {/* Toast positivo de modo sin conexión */}
            {toast > 0 && (
              <div style={{ position: "absolute", left: 14, right: 14, top: 96, transform: `translateY(${(1 - toast) * -120}px)`, background: "#fff", borderRadius: 16, boxShadow: shadow.modal, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, borderLeft: `5px solid ${color.accent}` }}>
                <div style={{ width: 40, height: 40, borderRadius: 20, background: color.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="cloud" size={24} color={color.accent} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: color.textPrimary }}>Modo sin conexión</div>
                  <div style={{ fontSize: 12.5, color: color.textSecondary }}>Seguís trabajando · guardado localmente</div>
                </div>
              </div>
            )}
          </Phone>
        </div>
      )}

      {loaderAppear > 0 && (
        <div style={{ position: "absolute", left: loaderPos.x - LOGO.isoOffset * loaderScale, top: loaderPos.y - (LOGO_H / 2) * loaderScale, transform: `scale(${loaderScale})`, transformOrigin: "0 0" }}>
          <QSLogo width={LOGO.w} word={0} tri={loaderTri(spin, 0, loaderAppear)} id="s13loader" />
        </div>
      )}

      <Kinetic f={f} text={es.video.kinetic.s13.text} at={8} out={70} x={170} y={540} accent={[2]} eyebrow={es.video.kinetic.s13.eyebrow} />
    </AbsoluteFill>
  );
};
