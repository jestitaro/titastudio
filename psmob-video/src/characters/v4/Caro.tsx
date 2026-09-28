import React from "react";
import { dirDeg, Face, FaceFeatures, Grain, Hand, P, Phone, SkinT, sleevePath, tube } from "./kit";

// Caro · líder de equipo comercial. Ilustración editorial por pose (no rig de piezas):
// cada pose se dibuja completa con siluetas continuas; se anima con respiración,
// balanceo de pelo, parpadeo, mirada y cambios de pose por fundido/morph.

export type CaroPose = "neutral" | "phone" | "stress";

const skin: SkinT = { base: "#FFC7A6", shade: "#F3A384", deep: "#DE8565", blush: "#FF9C8E" };
const hair = { base: "#3034B8", dark: "#22258E", light: "#5561DD" };
const top = { base: "#8B57DF", shade: "#7443C9" };
const jean = { base: "#3F70E6", shade: "#2F59C6" };

const HairBack: React.FC<{ sway: number }> = ({ sway }) => (
  <g transform={`rotate(${sway},320,140)`}>
    <path
      d="M320,92 C252,86 212,126 206,178 C188,196 194,222 184,242 C166,262 174,290 176,306 C156,326 162,356 172,372 C154,394 160,424 176,438 C166,460 184,478 206,476 C222,476 236,464 242,452 L394,452 C402,468 424,478 444,472 C462,466 466,448 458,436 C474,420 474,392 460,376 C476,356 472,328 458,312 C470,292 468,266 452,250 C460,228 452,206 438,192 C432,128 390,94 320,92 Z"
      fill={hair.base}
    />
    <g stroke={hair.light} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.65}>
      <path d="M196,236 C208,270 186,300 196,336 C204,366 186,396 196,424" />
      <path d="M452,262 C462,292 446,322 456,352 C464,380 450,410 456,436" />
    </g>
  </g>
);

const HairFront: React.FC<{ sway: number }> = ({ sway }) => (
  <g transform={`rotate(${sway * 0.35},320,110)`}>
    <path
      d="M246,216 C236,152 272,100 330,98 C388,96 422,138 420,194 C420,218 414,240 404,256 C400,226 392,200 378,184 C360,164 332,158 308,164 C286,170 266,188 258,214 Z"
      fill={hair.base}
    />
    <path d="M374,104 C322,104 274,130 258,180 C254,196 254,214 256,230 C268,198 292,176 324,164 C344,158 362,154 378,152 Z" fill={hair.base} />
    <path d="M378,152 C360,154 340,160 320,168 C300,178 284,192 272,210 C290,184 320,164 360,154 Z" fill={hair.dark} />
    <g stroke={hair.light} strokeWidth={5.5} strokeLinecap="round" fill="none">
      <path d="M288,118 C314,106 350,106 380,118" />
      <path d="M272,150 C292,134 318,126 344,126" opacity={0.75} />
    </g>
  </g>
);

const Head: React.FC<{ f: Face }> = ({ f }) => (
  <g>
    <ellipse cx={254} cy={222} rx={14} ry={19} fill={skin.base} />
    <path d="M251,214 C246,220 247,230 253,234" stroke={skin.deep} strokeWidth={3} strokeLinecap="round" fill="none" />
    <circle cx={255} cy={246} r={5} fill="#F2B544" />
    <path
      d="M248,190 C248,138 284,112 324,112 C368,112 398,142 398,192 C398,232 390,262 374,284 C358,304 336,314 316,312 C288,310 264,294 254,266 C249,250 248,214 248,190 Z"
      fill={skin.base}
    />
    <path d="M254,266 C264,294 288,310 316,312 C296,314 272,302 260,284 Z" fill={skin.shade} opacity={0.6} />
    <FaceFeatures f={f} s={skin} eye="#1C1F4A" brow={hair.dark} browW={4.5} eyes={[[302, 208], [358, 206]]} />
  </g>
);

const NeckChest: React.FC = () => (
  <g>
    <path d="M292,280 L290,330 C284,338 274,344 262,348 L322,424 L362,346 C352,340 346,330 344,300 Z" fill={skin.base} />
    <path d="M290,296 C302,320 330,322 344,302 L344,334 C328,348 304,348 290,336 Z" fill={skin.shade} />
  </g>
);

const TORSO =
  "M262,346 C232,352 206,362 192,380 C182,394 180,412 184,432 C194,470 202,500 204,540 C206,580 206,612 204,648 C240,660 300,664 338,662 C376,660 408,654 424,646 C420,610 420,572 422,540 C426,500 436,470 442,432 C444,410 440,392 430,380 C414,364 390,356 362,346 L322,424 Z";

const Torso: React.FC<{ uid: string }> = ({ uid }) => (
  <g>
    <clipPath id={`${uid}-t`}>
      <path d={TORSO} />
    </clipPath>
    <path d={TORSO} fill={top.base} />
    <g clipPath={`url(#${uid}-t)`} fill={top.shade}>
      <path d="M384,380 C430,400 446,470 432,540 C426,590 424,630 424,660 L390,660 C396,600 404,540 398,470 C394,430 390,404 384,380 Z" />
      <path d="M238,540 C272,560 330,562 372,540 C340,572 268,572 238,540 Z" />
      <path d="M230,640 C280,650 360,650 410,640 L412,664 L230,664 Z" />
    </g>
  </g>
);

const Jeans: React.FC = () => (
  <g>
    <path d="M206,632 C202,700 196,800 190,940 L304,940 L312,780 L320,940 L428,940 C424,800 424,700 422,632 Z" fill={jean.base} />
    <path d="M396,640 C404,720 408,820 410,940 L428,940 C424,800 424,700 422,632 Z" fill={jean.shade} />
    <path d="M312,660 L312,780" stroke={jean.shade} strokeWidth={4} strokeLinecap="round" />
    <path d="M204,632 C260,646 364,646 422,632 L423,656 C364,670 260,670 204,656 Z" fill="#242B7C" />
  </g>
);

const Sleeve: React.FC<{ pts: P[] }> = ({ pts }) => (
  <g>
    <path d={sleevePath(pts[0], pts[pts.length - 1], 72, 64)} fill={top.base} />
  </g>
);

const Arm: React.FC<{ pts: P[]; w?: number[] }> = ({ pts, w = [50, 44, 38, 33, 29] }) => {
  // el tubo arranca dentro de la manga para que su punta nunca asome sobre el hombro
  const [a, b] = pts;
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  const start: P = [a[0] + ((b[0] - a[0]) / l) * 26, a[1] + ((b[1] - a[1]) / l) * 26];
  return <path d={tube([start, ...pts.slice(1)], w.slice(0, pts.length))} fill={skin.base} />;
};

export const faceFor: Record<CaroPose, Face> = {
  neutral: { mouth: "soft", lookX: 0.2 },
  phone: { mouth: "open", lookX: 0.5, lookY: 0.9, blush: 0.4 },
  stress: { mouth: "stress", brow: -6, browLift: 4, lookX: -0.2 },
};

export const Caro: React.FC<{
  pose: CaroPose;
  face?: Face;
  uid: string;
  sway?: number;
  breath?: number;
  headTilt?: number;
  viewBox?: string;
}> = ({ pose, face, uid, sway = 0, breath = 0, headTilt, viewBox = "0 0 640 940" }) => {
  const f = face ?? faceFor[pose];
  const tilt = headTilt ?? (pose === "phone" ? 7 : pose === "stress" ? -5 : -3);
  const dy = pose === "phone" ? 8 : 0;
  const head = (
    <g transform={`translate(${pose === "phone" ? 6 : 0},${dy - breath * 3}) rotate(${tilt},316,310) translate(316,330) scale(1.1) translate(-316,-330)`}>
      <Head f={f} />
      <HairFront sway={sway} />
    </g>
  );
  const hairBack = (
    <g transform={`translate(${pose === "phone" ? 6 : 0},${dy - breath * 3}) rotate(${tilt},316,310) translate(316,330) scale(1.1) translate(-316,-330)`}>
      <HairBack sway={sway} />
    </g>
  );
  const body = (children: React.ReactNode) => (
    <g transform={`translate(0,${-breath * 2})`}>{children}</g>
  );

  let content: React.ReactNode;
  if (pose === "neutral") {
    const near: P[] = [[198, 410], [178, 500], [170, 590], [178, 700]];
    const far: P[] = [[424, 410], [468, 470], [496, 536], [456, 590], [420, 606]];
    content = (
      <>
        {hairBack}
        {body(
          <>
            <Arm pts={far} />
            <Hand kind="relaxed" at={far[4]} angle={dirDeg(far[3], far[4])} s={skin} />
            <Arm pts={near} w={[50, 44, 38, 31]} />
            <Hand kind="relaxed" at={near[3]} angle={dirDeg(near[2], near[3])} s={skin} flip />
            <NeckChest />
            <Torso uid={uid} />
            <Jeans />
            <Sleeve pts={[[206, 398], [188, 468], [182, 508]]} />
            <Sleeve pts={[[422, 398], [452, 452], [466, 482]]} />
          </>,
        )}
        {head}
      </>
    );
  } else if (pose === "phone") {
    const near: P[] = [[198, 410], [180, 500], [190, 582], [252, 588], [318, 546]];
    const far: P[] = [[424, 410], [446, 500], [442, 578], [404, 562], [384, 526]];
    content = (
      <>
        {hairBack}
        {body(
          <>
            <NeckChest />
            <Torso uid={uid} />
            <Jeans />
            <Arm pts={far} />
            <Phone c={[372, 474]} rot={-12} />
            <Hand kind="hold" at={far[4]} angle={dirDeg(far[3], far[4])} s={skin} />
            <Arm pts={near} />
            <Hand kind="point" at={near[4]} angle={dirDeg(near[3], near[4])} s={skin} flip />
            <Sleeve pts={[[206, 398], [188, 468], [184, 508]]} />
            <Sleeve pts={[[422, 398], [440, 462], [444, 502]]} />
          </>,
        )}
        {head}
      </>
    );
  } else {
    const near: P[] = [[204, 404], [154, 344], [130, 266], [180, 196], [236, 168]];
    const far: P[] = [[420, 402], [470, 338], [496, 262], [448, 190], [396, 162]];
    content = (
      <>
        {hairBack}
        {body(
          <>
            <NeckChest />
            <Torso uid={uid} />
            <Jeans />
          </>,
        )}
        {head}
        {body(
          <>
            <Arm pts={near} />
            <Hand kind="grab" at={near[4]} angle={dirDeg(near[3], near[4])} s={skin} flip />
            <Arm pts={far} />
            <Hand kind="grab" at={far[4]} angle={dirDeg(far[3], far[4])} s={skin} />
            <Sleeve pts={[[212, 396], [180, 364], [162, 336]]} />
            <Sleeve pts={[[416, 394], [446, 360], [462, 332]]} />
          </>,
        )}
        <g stroke="#1C1F4A" strokeWidth={4.5} strokeLinecap="round" opacity={0.75}>
          <path d="M520,150 L540,134" />
          <path d="M528,180 L554,176" />
          <path d="M504,124 L508,102" />
        </g>
      </>
    );
  }

  return (
    <svg viewBox={viewBox} width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs>
        <Grain id={`${uid}-grain`} />
      </defs>
      <g filter={`url(#${uid}-grain)`}>{content}</g>
    </svg>
  );
};
