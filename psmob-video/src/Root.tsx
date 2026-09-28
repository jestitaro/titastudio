import "./index.css";
import { AbsoluteFill, Composition } from "remotion";
import { Caro } from "./characters/Caro";
import { neutralFace } from "./characters/parts";
import { Repositor } from "./characters/Repositor";
import { S01Headache, S01_DURATION } from "./scenes/S01Headache";
import { S10AiFred, S10_TEST_DURATION } from "./scenes/S10AiFred";

const CharacterSheet: React.FC = () => (
  <AbsoluteFill style={{ background: "#FFFFFF", flexDirection: "row" }}>
    <div style={{ width: 640, height: 800, marginTop: 140 }}>
      <Caro face={neutralFace} arm={{ upper: 100, fore: 92 }} hand="rest" />
    </div>
    <div style={{ width: 640, height: 800, marginTop: 140 }}>
      <Caro
        face={{ ...neutralFace, eyes: "squeeze", browL: 14, browR: 14, mouth: "ugh" }}
        arm={{ upper: 235, fore: 321 }}
        hand="open"
        headTilt={-6}
      />
    </div>
    <div style={{ width: 640, height: 800, marginTop: 140 }}>
      <Repositor face={{ ...neutralFace, lookX: 1, lookY: 0.5 }} arm={{ upper: 28, fore: -48 }} phoneGlow={0.5} />
    </div>
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="S01-Headache" component={S01Headache} durationInFrames={S01_DURATION} fps={30} width={1920} height={1080} defaultProps={{ showSubtitles: true }} />
      <Composition id="S10-AiFred-Test" component={S10AiFred} durationInFrames={S10_TEST_DURATION} fps={30} width={1920} height={1080} defaultProps={{ showSubtitles: true }} />
      <Composition id="CharacterSheet" component={CharacterSheet} durationInFrames={60} fps={30} width={1920} height={1080} />
    </>
  );
};
