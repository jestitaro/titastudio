import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { range } from "../lib/motion";
import { SCENES, SceneId, sceneStart, VO } from "./timing";
import { VoRef } from "./lib/stage";
import { TriangleWipe } from "./transitions/TriangleWipe";
import { S01Overload } from "./scenes/S01Overload";
import { S05Desk } from "./scenes/S05Desk";
import { S06Reveal } from "./scenes/S06Reveal";
import { S07Organize } from "./scenes/S07Organize";
import { S08Chat } from "./scenes/S08Chat";
import { S09Capture } from "./scenes/S09Capture";
import { S10Realtime } from "./scenes/S10Realtime";
import { S11Dashboard } from "./scenes/S11Dashboard";
import { S12AiFred } from "./scenes/S12AiFred";
import { S13Offline } from "./scenes/S13Offline";
import { S14Brand } from "./scenes/S14Brand";

const COMPONENTS: Record<SceneId, React.FC> = {
  s01: S01Overload,
  s05: S05Desk,
  s06: S06Reveal,
  s07: S07Organize,
  s08: S08Chat,
  s09: S09Capture,
  s10: S10Realtime,
  s11: S11Dashboard,
  s12: S12AiFred,
  s13: S13Offline,
  s14: S14Brand,
};

const DARK_SCENES: SceneId[] = ["s01", "s05"];

// Whip-pan entre escenas que no comparten objeto de transición: la escena saliente se va con desenfoque
// de movimiento y la entrante llega desde el otro lado, en la misma dirección.
const WHIP_OUT: SceneId[] = ["s08", "s09", "s11"];
const WHIP_IN: SceneId[] = ["s09", "s10", "s12"];
const WHIP = 8;

const Whip: React.FC<{ id: SceneId; dur: number; children: React.ReactNode }> = ({ id, dur, children }) => {
  const f = useCurrentFrame();
  const out = WHIP_OUT.includes(id) ? range(f, [dur - WHIP, dur], [0, 1], (t) => t * t) : 0;
  const inn = WHIP_IN.includes(id) ? 1 - range(f, [0, WHIP], [0, 1], (t) => 1 - (1 - t) * (1 - t)) : 0;
  const x = -out * 900 + inn * 900;
  const blur = (out + inn) * 28;
  if (x === 0) return <>{children}</>;
  return <AbsoluteFill style={{ transform: `translateX(${x}px)`, filter: `blur(${blur}px)` }}>{children}</AbsoluteFill>;
};

const VoLayer: React.FC<{ id: SceneId }> = ({ id }) => {
  const f = useCurrentFrame();
  const line = VO[id].find((l) => f >= l.from && f < l.to);
  if (!line) return null;
  const o = range(f, [line.from, line.from + 6], [0, 1]) * range(f, [line.to - 6, line.to], [1, 0]);
  return <VoRef text={line.text} o={o} dark={DARK_SCENES.includes(id)} />;
};

export type PSMobVideoProps = { showVO: boolean };

export const PSMobVideo: React.FC<PSMobVideoProps> = ({ showVO }) => {
  const wipeAt = sceneStart("s06");
  return (
    <AbsoluteFill style={{ background: "#0A0736" }}>
      {SCENES.map((s) => {
        const C = COMPONENTS[s.id];
        return (
          <Sequence key={s.id} from={sceneStart(s.id)} durationInFrames={s.dur} name={s.id}>
            <Whip id={s.id} dur={s.dur}>
              <C />
            </Whip>
            {showVO && <VoLayer id={s.id} />}
          </Sequence>
        );
      })}
      {/* Cambio de tono: wipe geométrico con triángulos de marca entre el escritorio y la solución */}
      <Sequence from={wipeAt - 14} durationInFrames={36} name="wipe-s05-s06">
        <TriangleWipe cover={14} />
      </Sequence>
    </AbsoluteFill>
  );
};
