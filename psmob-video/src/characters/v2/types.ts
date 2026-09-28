import { Pt } from "./geometry";

export type Variant = "A" | "B";

export type EyeState = "open" | "happy" | "squeeze" | "closed";
export type MouthState = "neutral" | "smileSoft" | "smileOpen" | "grin" | "worried" | "grimace" | "o";

export type Expression = {
  eyes: EyeState;
  lookX: number; // -1 izquierda … 1 derecha
  lookY: number; // -1 arriba … 1 abajo
  lid: number; // 0 abierto … 1 párpado caído (cansancio / preocupación)
  browInner: number; // + baja (enojo/concentración), − sube (preocupación)
  browOuter: number;
  browLift: number;
  mouth: MouthState;
  blink?: number;
};

export type HandKind = "relaxed" | "openBack" | "hidden" | "pocket";

export type ArmPose = {
  S: Pt;
  E: Pt;
  W: Pt;
  hand: HandKind;
  flipHand?: boolean;
};

export type Prop = "phoneTwoHands" | "phoneOneHand" | null;

export type Pose = {
  name: string;
  far: ArmPose;
  near: ArmPose;
  headTilt: number;
  headShift?: Pt;
  bodyLean?: number;
  prop: Prop;
  phone?: { c: Pt; rot: number };
  farArmFront?: boolean; // el brazo lejano pasa por delante del torso
  nearArmBehindHead?: boolean; // la mano queda detrás de la cabeza
};

export type Palette = {
  skin: string;
  skinShade: string;
  skinLine: string;
  hair: string;
  hairShade: string;
  hairLight: string;
  top: string;
  topShade: string;
  bottom: string;
  bottomShade: string;
};

export type Build = {
  jaw: "soft" | "square";
  shoulderSpread: number; // px extra por lado respecto de la base
  neckWidth: number;
  armScale: number;
  neckline: "v" | "crew";
};
