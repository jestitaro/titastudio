import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { easeInOut, range } from "../../lib/motion";
import { Actor, camPath, Layer, LightStudio, POSE } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { Device } from "../ds/Device";
import { Expand } from "../ds/transitions";
import { Kinetic } from "../ui/Kinetic";
import { es } from "../../i18n/es";
import { FormsFlow, FT } from "../screens/Forms";
import { ChatScreen } from "../screens/Chat";
import { Gondola } from "../ui/Gondola";
import { chatClock, S08_DUR } from "./S08Chat";
import { CAM_NICO, NICO_DEV, NICO_W } from "./world";

// Escena 9 — "Agiliza la captura de datos". Arranca con el mismo encuadre que el final de la 8; el fondo
// pasa del estudio a la góndola con una cortina suave. Push-in al celular: el teléfono gana protagonismo
// (a la derecha, recto y frontal) y Nico se funde suavemente; el texto queda a la izquierda, sobre una
// placa clara, con tiempo real de lectura. El chat da paso al formulario y al check de enviado.
const FORMS0 = 30;
const FTS = 0.7;
const toForms = (f: number) => (f - FORMS0) * FTS;
const PHONE_CAM = { x: 1504, y: 470, zoom: 1.62 };

const cam = (f: number): Cam =>
  camPath(f, [
    { f: 0, ...CAM_NICO },
    { f: 24, ...CAM_NICO },
    { f: 100, ...PHONE_CAM },
    { f: 210, x: PHONE_CAM.x - 10, y: PHONE_CAM.y, zoom: PHONE_CAM.zoom - 0.05 },
  ]);

export const StoreBackdrop: React.FC<{ cam: Cam; blur?: number; offset?: number }> = ({ cam: c, blur = 6, offset = 1200 }) => (
  <>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #EEF0FA 0%, #E2E6F4 60%, #D3D9EC 100%)" }} />
    <Layer cam={c} depth={0.55} blur={blur}>
      <div style={{ position: "absolute", left: -offset, top: 40, transform: "scale(0.9)", transformOrigin: "0 0" }}>
        <Gondola from={offset - 600} to={offset + 3000} />
      </div>
      <div style={{ position: "absolute", left: -600, top: 1010, width: 3400, height: 500, background: "#C9D0E4" }} />
    </Layer>
  </>
);

export const S09Capture: React.FC = () => {
  const f = useCurrentFrame();
  const c = cam(f);
  const wipe = range(f, [0, 40], [0, 1], easeInOut);
  const nav = range(f, [FORMS0 - 12, FORMS0 + 10], [0, 1], (t) => t);
  const nico = 1 - range(f, [40, 88], [0, 1], easeInOut);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightStudio f={f + 510} />
      {/* Cortina suave: la góndola entra desde la derecha */}
      <AbsoluteFill style={{ WebkitMaskImage: `linear-gradient(to left, black ${wipe * 120 - 20}%, transparent ${wipe * 120}%)`, maskImage: `linear-gradient(to left, black ${wipe * 120 - 20}%, transparent ${wipe * 120}%)` }}>
        <StoreBackdrop cam={c} offset={2600} blur={8} />
      </AbsoluteFill>
      <Layer cam={c} depth={1}>
        {nico > 0.01 && (
          <div style={{ position: "absolute", inset: 0, opacity: nico }}>
            <Actor pose={POSE.nicoCelular} x={NICO_W.x} feetY={NICO_W.feet} scale={NICO_W.scale} f={f} />
          </div>
        )}
        <Device x={NICO_DEV.x} y={NICO_DEV.y} scale={NICO_DEV.s}>
          {/* Del chat al formulario: el adjunto "Formulario" de la hoja se expande hasta ser la pantalla */}
          <Expand p={nav} from={{ x: 150, y: 700, w: 90, h: 90, r: 20 }} a={<ChatScreen f={chatClock(S08_DUR + f)} mine="nico" />} b={<FormsFlow f={Math.min(toForms(f), FT.success[1] + 30)} />} />
        </Device>
      </Layer>
      <Kinetic f={f} text={es.video.kinetic.s09.text} at={62} out={180} x={130} y={520} accent={[3, 4]} eyebrow={es.video.kinetic.s09.eyebrow} size={60} plate />
    </AbsoluteFill>
  );
};
