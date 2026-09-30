import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SCENES, SceneId, sceneStart } from "./timing";
import { TriangleWipe } from "./transitions/TriangleWipe";
import { Soundtrack } from "./Soundtrack";
import { SceneClock } from "./lib/sceneClock";
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

export type PSMobVideoProps = { showVO: boolean };

// `showVO` se mantiene por compatibilidad de props, pero el video no muestra texto de locución.
export const PSMobVideo: React.FC<PSMobVideoProps> = () => {
  const wipeAt = sceneStart("s06");
  return (
    <AbsoluteFill style={{ background: "#0A0736" }}>
      {SCENES.map((s) => {
        const C = COMPONENTS[s.id];
        return (
          <Sequence key={s.id} from={sceneStart(s.id)} durationInFrames={s.dur} name={s.id}>
            <SceneClock speed={(s.orig - s.trim) / s.dur} trim={s.trim}>
              <C />
            </SceneClock>
          </Sequence>
        );
      })}
      {/* Cambio de tono: wipe geométrico con triángulos de marca entre el escritorio y la solución */}
      <Sequence from={wipeAt - 14} durationInFrames={36} name="wipe-s05-s06">
        <TriangleWipe cover={14} />
      </Sequence>
      <Soundtrack />
    </AbsoluteFill>
  );
};
