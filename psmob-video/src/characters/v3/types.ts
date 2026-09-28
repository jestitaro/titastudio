import { Pt } from "../v2/geometry";

export type Eyes = "open" | "happy" | "closed";
export type Mouth = "neutral" | "smile" | "smileOpen" | "laugh" | "worried" | "stress";

export type Expr = {
  eyes: Eyes;
  lookX: number;
  lookY: number;
  brow: number; // − preocupación (interno arriba), + enojo
  browLift: number;
  mouth: Mouth;
  blush: number;
  blink?: number;
};

export type HandKind = "relaxed" | "point" | "holdPhone" | "onHead" | "hidden";

export type Arm = { S: Pt; E: Pt; W: Pt; hand: HandKind };

export type Pose = {
  name: string;
  near: Arm; // lado izquierdo del cuadro (más cerca de cámara)
  far: Arm;
  headTilt: number;
  headShift?: Pt;
  phone?: { c: Pt; rot: number };
  farArmFront?: boolean;
  stressMarks?: boolean;
};

export type Skin = { base: string; shade: string; deep: string; blush: string };

export type Look = {
  skin: Skin;
  eye: string;
  brow: string;
  hair: { base: string; dark: string; light: string };
};
