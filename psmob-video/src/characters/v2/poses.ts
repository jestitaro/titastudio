import { Expression, Pose } from "./types";

export const neutralExpr: Expression = {
  eyes: "open",
  lookX: 0,
  lookY: 0,
  lid: 0,
  browInner: 0,
  browOuter: 0,
  browLift: 0,
  mouth: "smileSoft",
};

export const expressions = {
  neutral: neutralExpr,
  smile: { ...neutralExpr, mouth: "smileOpen", browLift: 4, browInner: -2 } as Expression,
  grin: { ...neutralExpr, mouth: "grin", browLift: 5, browInner: -3 } as Expression,
  concern: { ...neutralExpr, mouth: "worried", lid: 0.22, browInner: -10, browOuter: 4, lookX: -0.4, lookY: 0.2 } as Expression,
  stress: { ...neutralExpr, eyes: "squeeze", mouth: "grimace", browInner: 10, browOuter: -2 } as Expression,
  awkward: { ...neutralExpr, mouth: "grimace", lid: 0.3, browInner: -9, browOuter: 3, lookX: 0.8, lookY: -0.3 } as Expression,
  phone: { ...neutralExpr, mouth: "smileSoft", lookX: 0.3, lookY: 1, lid: 0.35 } as Expression,
  phoneGrin: { ...neutralExpr, mouth: "grin", lookX: 0.6, lookY: 0.9, lid: 0.25, browLift: 3 } as Expression,
};

// ───────── Caro ─────────
export const caroPoses: Record<"neutral" | "phone" | "stress", Pose> = {
  neutral: {
    name: "Neutral",
    far: { S: { x: 198, y: 466 }, E: { x: 116, y: 596 }, W: { x: 206, y: 690 }, hand: "hidden" },
    near: { S: { x: 412, y: 464 }, E: { x: 438, y: 634 }, W: { x: 428, y: 800 }, hand: "relaxed", flipHand: true },
    headTilt: 4,
    bodyLean: -1,
    prop: null,
  },
  phone: {
    name: "Usando el celular",
    far: { S: { x: 198, y: 466 }, E: { x: 186, y: 642 }, W: { x: 262, y: 648 }, hand: "hidden" },
    near: { S: { x: 412, y: 464 }, E: { x: 446, y: 642 }, W: { x: 340, y: 648 }, hand: "hidden" },
    headTilt: 4,
    headShift: { x: -4, y: 8 },
    prop: "phoneTwoHands",
    phone: { c: { x: 300, y: 596 }, rot: -6 },
    farArmFront: true,
  },
  stress: {
    name: "Reacción / estrés",
    far: { S: { x: 198, y: 470 }, E: { x: 182, y: 640 }, W: { x: 200, y: 794 }, hand: "relaxed" },
    near: { S: { x: 412, y: 460 }, E: { x: 506, y: 352 }, W: { x: 404, y: 262 }, hand: "openBack", flipHand: true },
    headTilt: 5,
    bodyLean: -1.5,
    prop: null,
  },
};

// ───────── Nico ─────────
export const nicoPoses: Record<"neutral" | "phone" | "stress", Pose> = {
  neutral: {
    name: "Neutral",
    far: { S: { x: 178, y: 468 }, E: { x: 156, y: 636 }, W: { x: 172, y: 794 }, hand: "relaxed" },
    near: { S: { x: 432, y: 466 }, E: { x: 462, y: 632 }, W: { x: 400, y: 772 }, hand: "pocket" },
    headTilt: -2,
    bodyLean: 1,
    prop: null,
  },
  phone: {
    name: "Usando el celular",
    far: { S: { x: 178, y: 468 }, E: { x: 158, y: 636 }, W: { x: 172, y: 794 }, hand: "relaxed" },
    near: { S: { x: 432, y: 466 }, E: { x: 462, y: 636 }, W: { x: 392, y: 612 }, hand: "hidden" },
    headTilt: 5,
    headShift: { x: 4, y: 6 },
    prop: "phoneOneHand",
    phone: { c: { x: 356, y: 548 }, rot: 10 },
  },
  stress: {
    name: "Reacción / estrés",
    far: { S: { x: 178, y: 470 }, E: { x: 160, y: 640 }, W: { x: 176, y: 796 }, hand: "relaxed" },
    near: { S: { x: 432, y: 462 }, E: { x: 520, y: 326 }, W: { x: 384, y: 196 }, hand: "hidden" },
    headTilt: -6,
    prop: null,
    nearArmBehindHead: true,
  },
};
