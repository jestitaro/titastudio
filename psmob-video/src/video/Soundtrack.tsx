import React from "react";
import { Audio, interpolate, Sequence, staticFile } from "remotion";
import { VO } from "./vo";

// Locución (y música opcional, hoy desactivada). Si hay música, baja (ducking) mientras suena la voz.
const MUSIC = 0.55;
const DUCK = 0.22;

const musicVolume = (f: number) => {
  let v = MUSIC;
  for (const l of VO) {
    const k = interpolate(f, [l.from - 8, l.from, l.from + l.frames, l.from + l.frames + 12], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    v = Math.min(v, MUSIC - (MUSIC - DUCK) * k);
  }
  return v;
};

export const Soundtrack: React.FC<{ music?: boolean; voice?: boolean }> = ({ music = false, voice = true }) => (
  <>
    {music && <Audio src={staticFile("audio/music.mp3")} volume={musicVolume} />}
    {voice &&
      VO.map((l) => (
        <Sequence key={l.id} from={l.from} durationInFrames={l.frames} name={`vo-${l.id}`}>
          <Audio src={staticFile(`audio/vo/${l.id}.mp3`)} />
        </Sequence>
      ))}
  </>
);
