import React from "react";
import { Character } from "./Figure";
import { Expr, Pose } from "./types";

// ───────────────────────── CARO ─────────────────────────

const caroHair = { base: "#2D30B6", dark: "#1F228C", light: "#4E58DA" };
const caroSkin = { base: "#FFC6A5", shade: "#F4A383", deep: "#E08766", blush: "#FF9C8E" };

const CaroBack: React.FC<{ sway: number }> = ({ sway }) => (
  <g transform={`rotate(${sway},320,120)`}>
    <path
      d="M318,92 C240,88 180,128 168,186 C146,204 150,236 138,258 C114,280 124,312 132,330 C104,350 110,386 122,404 C98,428 104,464 118,480 C100,502 110,528 136,532 C156,534 176,522 188,504 L418,504 C432,524 460,530 480,516 C496,504 494,486 484,472 C502,450 498,418 482,402 C500,378 494,344 476,330 C494,306 490,276 470,258 C476,232 470,212 462,202 C458,132 398,96 318,92 Z"
      fill={caroHair.base}
    />
    <g stroke={caroHair.dark} strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.9}>
      <path d="M206,300 C222,340 200,384 216,432 C224,458 214,480 206,494" />
      <path d="M438,300 C452,336 434,372 448,410 C456,436 448,462 440,480" />
    </g>
    <g stroke={caroHair.light} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.6}>
      <path d="M152,246 C172,288 140,330 160,372 C176,406 150,444 166,484" />
      <path d="M462,246 C478,286 454,326 472,366 C484,396 468,430 476,458" />
    </g>
  </g>
);

const CaroFront: React.FC<{ sway: number }> = ({ sway }) => (
  <g transform={`rotate(${sway * 0.4},320,110)`}>
    <path
      d="M238,236 C226,168 262,112 328,106 C384,102 418,136 420,190 C422,216 414,248 404,270 C400,236 392,208 378,190 C360,170 334,162 308,166 C284,170 264,186 252,210 C246,222 242,230 238,236 Z"
      fill={caroHair.base}
    />
    <path d="M358,110 C310,112 262,136 248,180 C244,196 244,214 248,232 C258,202 280,178 310,166 C330,158 348,152 364,148 Z" fill={caroHair.base} />
    <path d="M364,148 C348,152 330,158 310,166 C292,174 276,186 264,200 C282,176 312,158 350,148 Z" fill={caroHair.dark} />
    <g stroke={caroHair.light} strokeWidth={5.5} strokeLinecap="round" fill="none">
      <path d="M282,126 C312,114 352,114 384,126" />
      <path d="M266,156 C288,140 320,134 348,136" opacity={0.8} />
      <path d="M404,170 C410,196 408,222 402,246" opacity={0.7} />
    </g>
  </g>
);

const CaroBody: React.FC<{ uid: string }> = ({ uid }) => {
  const torso =
    "M270,404 C240,420 204,428 184,446 C166,462 162,500 168,540 C174,600 188,650 194,704 L406,704 C412,650 426,600 432,540 C438,500 434,462 416,446 C396,430 364,420 336,402 Z";
  return (
    <g>
      {/* jean */}
      <path d="M190,716 L410,716 C418,790 424,850 426,940 L312,940 L303,880 L297,880 L288,940 L174,940 C176,850 182,790 190,716 Z" fill="#3E6FE6" />
      <path d="M300,730 C302,800 304,840 300,880 M222,736 C246,748 262,768 266,792" stroke="#2F59C8" strokeWidth={5} strokeLinecap="round" fill="none" />
      <path d="M410,716 C418,790 424,850 426,940 L396,940 C394,860 392,790 384,720 Z" fill="#2F59C8" />
      {/* remera */}
      <clipPath id={`${uid}-torso`}>
        <path d={torso} />
      </clipPath>
      <path d={torso} fill="#8A55DE" />
      <g clipPath={`url(#${uid}-torso)`}>
        <path d="M362,430 C424,452 446,524 436,604 C430,652 418,690 408,706 L362,706 C382,640 390,560 374,482 Z" fill="#7442C8" />
        <path d="M232,562 C270,582 332,584 374,562 C344,596 262,596 232,562 Z" fill="#7442C8" opacity={0.8} />
        <path d="M200,470 C230,500 250,520 256,548 C236,524 214,504 196,494 Z" fill="#7442C8" opacity={0.7} />
        <path d="M210,690 C250,700 350,700 396,690 L400,706 L200,706 Z" fill="#7442C8" />
      </g>
      {/* escote V: la piel continúa desde el cuello */}
      <path d="M274,404 Q296,466 304,484 Q318,456 334,402 Z" fill="#FFC6A5" />
      <path d="M278,404 Q302,436 330,404 Z" fill="#F4A383" />
      {/* cinturón */}
      <path d="M190,694 Q300,708 410,694 L412,720 Q300,734 188,720 Z" fill="#232B7A" />
      <rect x={236} y={698} width={8} height={26} rx={3} fill="#1A2160" />
      <rect x={356} y={698} width={8} height={26} rx={3} fill="#1A2160" />
    </g>
  );
};

export const caro: Character = {
  id: "caro",
  name: "Caro",
  role: "Líder de equipo comercial",
  traits: ["Organizada", "Empática", "Proactiva", "Cercana"],
  look: { skin: caroSkin, eye: "#1B1F4B", brow: caroHair.dark, hair: caroHair },
  jaw: "soft",
  neck: { w: 60 },
  browW: 5,
  hair: { Back: CaroBack, Front: CaroFront },
  outfit: { sleeve: { reach: 0.58, ease: 12, color: "#8A55DE", shade: "#7442C8" }, Body: CaroBody },
  palette: [
    { label: "Remera", color: "#8A55DE" },
    { label: "Pelo", color: caroHair.base },
    { label: "Jean", color: "#3E6FE6" },
    { label: "Piel", color: caroSkin.base },
    { label: "Sombra piel", color: caroSkin.shade },
    { label: "Cinturón", color: "#232B7A" },
  ],
};

// ───────────────────────── NICO ─────────────────────────

const nicoHair = { base: "#D8733C", dark: "#B0562A", light: "#EE975C" };
const nicoSkin = { base: "#FFC3A0", shade: "#F09E7C", deep: "#DC8462", blush: "#FF9A88" };

const NicoBack: React.FC<{ sway: number }> = () => (
  <path d="M244,226 C230,262 236,294 254,310 L272,290 L262,236 Z" fill={nicoHair.base} />
);

const NicoFront: React.FC<{ sway: number }> = ({ sway }) => (
  <g transform={`rotate(${sway * 0.5},320,120)`}>
    {/* volumen desordenado con mechones redondeados que caen hacia adelante (derecha) */}
    <path
      d="M234,236 C216,180 230,124 272,98 C288,76 318,64 348,70 C380,68 410,88 416,120 C430,142 428,176 412,196 C406,180 398,170 388,164 C380,178 360,184 344,172 C330,186 306,186 292,172 C280,186 264,198 256,220 C250,230 242,236 234,236 Z"
      fill={nicoHair.base}
    />
    <path d="M286,80 C290,62 306,52 324,52 C318,60 316,68 318,76 Z" fill={nicoHair.base} />
    <path d="M352,70 C362,58 378,56 392,62 C382,66 376,72 374,80 Z" fill={nicoHair.base} />
    <path d="M412,120 C426,122 436,132 438,146 C428,140 420,140 414,142 Z" fill={nicoHair.base} />
    <path d="M388,164 C398,154 410,150 420,152 C414,160 410,170 410,182 Z" fill={nicoHair.base} />
    <g stroke={nicoHair.dark} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.85}>
      <path d="M344,172 C346,160 352,152 360,146" />
      <path d="M292,172 C294,162 300,154 308,150" />
    </g>
    <g stroke={nicoHair.light} strokeWidth={5.5} strokeLinecap="round" fill="none">
      <path d="M272,128 C294,104 328,92 364,98" />
      <path d="M300,148 C318,132 342,126 366,130" opacity={0.75} />
    </g>
    <path d="M244,222 L258,214 L258,250 L248,252 Z" fill={nicoHair.base} />
  </g>
);

const NicoBody: React.FC<{ uid: string }> = ({ uid }) => {
  const torso =
    "M266,404 C232,420 194,428 174,446 C156,462 152,500 158,540 C164,600 178,660 184,730 L416,730 C422,660 436,600 442,540 C448,500 444,462 426,446 C406,430 370,420 338,402 Z";
  const left = "M266,404 C232,420 194,428 174,446 C156,462 152,500 158,540 C164,600 178,660 184,730 L270,730 C266,640 262,540 270,470 L280,422 Z";
  const right = "M338,402 C370,420 406,430 426,446 C444,462 448,500 442,540 C436,600 422,660 416,730 L338,730 C342,640 346,540 338,470 L330,422 Z";
  return (
    <g>
      <path d="M186,720 L414,720 C420,790 424,850 426,940 L312,940 L303,880 L297,880 L288,940 L174,940 C176,850 180,790 186,720 Z" fill="#1F2745" />
      <path d="M300,736 C302,800 304,840 300,880" stroke="#161C33" strokeWidth={5} strokeLinecap="round" fill="none" />
      {/* remera blanca */}
      <path d={torso} fill="#F7F6FB" />
      <path d="M300,470 C306,560 304,650 300,730 L330,730 C334,640 336,560 330,470 Z" fill="#E6E4F0" />
      <path d="M268,404 C288,428 322,428 338,402 L344,410 C322,440 286,440 262,412 Z" fill="#E6E4F0" />
      {/* camisa abierta */}
      <clipPath id={`${uid}-l`}>
        <path d={left} />
      </clipPath>
      <clipPath id={`${uid}-r`}>
        <path d={right} />
      </clipPath>
      <path d={left} fill="#2F66E4" />
      <path d={right} fill="#2F66E4" />
      <g clipPath={`url(#${uid}-r)`}>
        <path d="M376,430 C436,452 456,524 446,604 C440,660 426,700 418,730 L376,730 C394,650 398,560 384,480 Z" fill="#2250C2" />
      </g>
      <g clipPath={`url(#${uid}-l)`}>
        <path d="M250,420 C262,520 256,640 262,730 L284,730 C274,640 276,520 272,440 Z" fill="#2250C2" />
        <path d="M190,470 C220,500 238,520 244,548 C224,524 204,506 186,496 Z" fill="#2250C2" opacity={0.7} />
      </g>
      {/* solapas del cuello de camisa */}
      <path d="M282,420 L258,402 L244,452 L270,476 Z" fill="#2250C2" />
      <path d="M328,420 L350,400 L366,448 L338,474 Z" fill="#2250C2" />
      <path d="M282,420 L262,408 L252,446 L272,466 Z" fill="#3E76EE" />
      <path d="M328,420 L346,406 L358,444 L338,464 Z" fill="#3E76EE" />
    </g>
  );
};

export const nico: Character = {
  id: "nico",
  name: "Nico",
  role: "Compañero de equipo",
  traits: ["Entusiasta", "Colaborativo", "Resolutivo", "Cercano"],
  look: { skin: nicoSkin, eye: "#1B1F4B", brow: nicoHair.dark, hair: nicoHair },
  jaw: "square",
  neck: { w: 68 },
  browW: 8,
  hair: { Back: NicoBack, Front: NicoFront },
  outfit: { sleeve: { reach: 0.92, ease: 3, color: "#2F66E4", shade: "#2250C2", cuff: "#2A5AD2" }, Body: NicoBody },
  palette: [
    { label: "Camisa", color: "#2F66E4" },
    { label: "Remera", color: "#F7F6FB" },
    { label: "Pelo", color: nicoHair.base },
    { label: "Piel", color: nicoSkin.base },
    { label: "Sombra piel", color: nicoSkin.shade },
    { label: "Pantalón", color: "#1F2745" },
  ],
};

// ───────────────────────── Expresiones y poses ─────────────────────────

const base: Expr = { eyes: "open", lookX: 0, lookY: 0, brow: 0, browLift: 0, mouth: "smile", blush: 0 };
export const exprs: Record<string, Expr> = {
  neutral: { ...base, mouth: "smile" },
  smile: { ...base, mouth: "smileOpen", browLift: 3, blush: 0.4 },
  laugh: { ...base, eyes: "happy", mouth: "laugh", browLift: 4, blush: 0.7 },
  concern: { ...base, mouth: "worried", brow: -5, lookX: -0.2, lookY: 0.2 },
  stress: { ...base, mouth: "stress", brow: -7, browLift: 4, lookX: -0.3 },
  phone: { ...base, mouth: "smileOpen", lookX: 0.6, lookY: 0.9, blush: 0.3 },
};

export const posesFor = (id: "caro" | "nico"): Record<"neutral" | "phone" | "stress", Pose> => {
  const nS = id === "caro" ? { x: 198, y: 470 } : { x: 186, y: 472 };
  const fS = id === "caro" ? { x: 404, y: 466 } : { x: 416, y: 468 };
  return {
    neutral: {
      name: "Neutral",
      near: { S: nS, E: { x: nS.x - (id === "nico" ? 40 : 26), y: 636 }, W: { x: nS.x - (id === "nico" ? 22 : 2), y: 794 }, hand: "relaxed" },
      far: { S: fS, E: { x: fS.x + (id === "nico" ? 40 : 26), y: 634 }, W: { x: fS.x + (id === "nico" ? 22 : 4), y: 792 }, hand: "relaxed" },
      headTilt: -2,
    },
    phone:
      id === "caro"
        ? {
            name: "Usando el celular",
            near: { S: nS, E: { x: 214, y: 646 }, W: { x: 322, y: 584 }, hand: "point" },
            far: { S: fS, E: { x: 444, y: 640 }, W: { x: 418, y: 596 }, hand: "holdPhone" },
            headTilt: 6,
            headShift: { x: 4, y: 6 },
            phone: { c: { x: 404, y: 540 }, rot: 16 },
          }
        : {
            name: "Usando el celular",
            near: { S: nS, E: { x: 168, y: 644 }, W: { x: 214, y: 604 }, hand: "holdPhone" },
            far: { S: fS, E: { x: 420, y: 654 }, W: { x: 300, y: 600 }, hand: "point" },
            headTilt: 8,
            headShift: { x: -6, y: 8 },
            phone: { c: { x: 206, y: 546 }, rot: -14 },
          },
    stress:
      id === "caro"
        ? {
            name: "Estrés / problema",
            near: { S: nS, E: { x: nS.x - 16, y: 644 }, W: { x: nS.x - 4, y: 802 }, hand: "relaxed" },
            far: { S: fS, E: { x: 512, y: 340 }, W: { x: 410, y: 180 }, hand: "onHead" },
            headTilt: -6,
            farArmFront: true,
            stressMarks: true,
          }
        : {
            name: "Estrés / problema",
            near: { S: nS, E: { x: 104, y: 336 }, W: { x: 228, y: 176 }, hand: "onHead" },
            far: { S: fS, E: { x: fS.x + 16, y: 640 }, W: { x: fS.x + 8, y: 800 }, hand: "relaxed" },
            headTilt: 5,
            stressMarks: true,
          },
  };
};
