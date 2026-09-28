import React from "react";
import { dirDeg, Face, FaceFeatures, Grain, Hand, P, Phone, SkinT, sleevePath, tube } from "./kit";

// Nico · compañero de equipo. Misma familia visual que Caro: silueta más ancha,
// mandíbula más marcada, pelo cobrizo despeinado, camisa azul abierta sobre remera blanca.

export type NicoPose = "neutral" | "phone" | "stress";

const skin: SkinT = { base: "#FFC4A1", shade: "#EFA07E", deep: "#D98363", blush: "#FF9A88" };
const hair = { base: "#D8733C", dark: "#AE5529", light: "#F09A5E" };
const shirt = { base: "#2F66E4", shade: "#2250C2", light: "#4A7DF0" };
const tee = { base: "#F7F6FB", shade: "#E1DFEE" };
const pants = { base: "#20284A", shade: "#161C36" };

const HairBack: React.FC = () => <path d="M248,218 C236,248 242,274 258,288 L272,266 Z" fill={hair.base} />;

const HairFront: React.FC<{ sway: number }> = ({ sway }) => (
  <g transform={`rotate(${sway * 0.5},330,120)`}>
    <path
      d="M246,208 C234,150 264,98 318,90 C330,72 358,68 378,80 C402,86 422,110 420,144 C430,162 426,186 414,202 C408,186 398,176 386,170 C376,182 358,184 346,174 C332,186 310,186 298,174 C284,186 268,196 260,216 Z"
      fill={hair.base}
    />
    <path d="M300,96 C296,80 306,68 322,66 C338,66 342,80 334,90 Z" fill={hair.base} />
    <path d="M356,82 C360,68 374,62 388,66 C400,70 400,84 390,90 Z" fill={hair.base} />
    <path d="M418,146 C432,148 440,160 440,174 C432,168 424,168 418,170 Z" fill={hair.base} />
    <path d="M270,126 C254,126 244,116 246,104 C256,104 268,108 278,112 Z" fill={hair.base} />
    <g stroke={hair.dark} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.85}>
      <path d="M346,174 C348,162 354,154 362,148" />
      <path d="M298,174 C300,164 306,156 314,152" />
      <path d="M386,170 C394,158 404,152 414,150" />
    </g>
    <g stroke={hair.light} strokeWidth={5.5} strokeLinecap="round" fill="none">
      <path d="M276,128 C298,106 330,96 364,102" />
      <path d="M306,146 C322,132 344,126 368,130" opacity={0.75} />
    </g>
    <path d="M250,206 L262,200 L262,238 L252,240 Z" fill={hair.base} />
  </g>
);

const Head: React.FC<{ f: Face }> = ({ f }) => (
  <g>
    <ellipse cx={252} cy={224} rx={15} ry={20} fill={skin.base} />
    <path d="M249,216 C244,222 245,232 251,236" stroke={skin.deep} strokeWidth={3} strokeLinecap="round" fill="none" />
    <path
      d="M244,188 C244,134 282,104 326,104 C372,104 402,136 402,190 C402,232 396,264 380,288 C362,310 338,318 316,316 C286,314 260,296 252,268 C246,248 244,212 244,188 Z"
      fill={skin.base}
    />
    <path d="M252,268 C262,296 286,314 316,316 C294,318 268,306 256,286 Z" fill={skin.shade} opacity={0.6} />
    <FaceFeatures f={f} s={skin} eye="#1C1F4A" brow={hair.dark} browW={6.5} eyes={[[302, 206], [360, 204]]} />
  </g>
);

const Neck: React.FC = () => (
  <g>
    <path d="M284,282 L280,352 L352,352 L348,300 Z" fill={skin.base} />
    <path d="M282,300 C298,326 332,328 348,304 L350,338 C330,352 300,352 282,340 Z" fill={skin.shade} />
  </g>
);

const TEE =
  "M258,344 C226,350 196,360 180,378 C168,392 166,412 170,434 C180,472 188,504 190,544 C192,590 190,640 188,704 C236,716 300,720 340,718 C380,716 414,710 432,702 C430,640 428,590 430,544 C432,504 444,472 452,434 C456,412 452,392 442,378 C424,362 398,352 366,344 Z";
const LEFT =
  "M258,344 C226,350 196,360 180,378 C168,392 166,412 170,434 C180,472 188,504 190,544 C192,590 190,640 188,704 L270,712 C266,620 264,520 272,440 L282,384 Z";
const RIGHT =
  "M366,344 C398,352 424,362 442,378 C452,392 456,412 452,434 C444,472 432,504 430,544 C428,590 430,640 432,702 L356,712 C360,620 362,520 352,440 L342,384 Z";

const Body: React.FC<{ uid: string }> = ({ uid }) => (
  <g>
    <path d="M192,690 C188,760 184,840 180,940 L302,940 L312,800 L322,940 L442,940 C438,840 436,760 432,690 Z" fill={pants.base} />
    <path d="M410,700 C416,780 420,860 422,940 L442,940 C438,840 436,760 432,690 Z" fill={pants.shade} />
    <path d="M312,720 L312,800" stroke={pants.shade} strokeWidth={4} strokeLinecap="round" />
    <path d={TEE} fill={tee.base} />
    <path d="M330,430 C340,520 340,620 336,716 L352,716 C356,620 358,520 350,440 Z" fill={tee.shade} />
    <path d="M276,344 C290,370 334,370 350,344 L358,352 C338,384 288,384 268,354 Z" fill={tee.shade} />
    <clipPath id={`${uid}-r`}>
      <path d={RIGHT} />
    </clipPath>
    <path d={LEFT} fill={shirt.base} />
    <path d={RIGHT} fill={shirt.base} />
    <g clipPath={`url(#${uid}-r)`}>
      <path d="M396,372 C448,400 456,470 444,540 C436,600 432,660 432,710 L394,710 C400,640 408,560 402,480 C400,440 398,404 396,372 Z" fill={shirt.shade} />
    </g>
    <path d="M254,440 C262,540 258,640 262,710 L272,712 C266,620 264,520 272,440 Z" fill={shirt.shade} />
    {/* solapas */}
    <path d="M282,384 L262,348 L246,398 L270,444 Z" fill={shirt.shade} />
    <path d="M342,384 L362,346 L380,394 L354,444 Z" fill={shirt.shade} />
    <path d="M282,384 L266,354 L254,396 L272,432 Z" fill={shirt.light} />
    <path d="M342,384 L358,352 L372,392 L352,432 Z" fill={shirt.light} />
  </g>
);

// Manga arremangada: cuerpo de manga + puño doblado en un tono más oscuro.
const Sleeve: React.FC<{ pts: P[] }> = ({ pts }) => {
  const a = pts[0];
  const b = pts[pts.length - 1];
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const u: P = [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
  const c0: P = [b[0] - u[0] * 20, b[1] - u[1] * 20];
  return (
    <g>
      <path d={sleevePath(a, b, 78, 68, 4)} fill={shirt.base} />
      <path d={sleevePath(c0, [b[0] + u[0] * 4, b[1] + u[1] * 4], 72, 70, 6)} fill={shirt.shade} />
    </g>
  );
};

const Arm: React.FC<{ pts: P[]; w?: number[] }> = ({ pts, w = [54, 48, 42, 36, 31] }) => {
  // el tubo arranca dentro de la manga para que su punta nunca asome sobre el hombro
  const [a, b] = pts;
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  const start: P = [a[0] + ((b[0] - a[0]) / l) * 26, a[1] + ((b[1] - a[1]) / l) * 26];
  return <path d={tube([start, ...pts.slice(1)], w.slice(0, pts.length))} fill={skin.base} />;
};

const Pocket: React.FC<{ at: P; flip?: boolean }> = ({ at, flip }) => {
  const k = flip ? -1 : 1;
  return (
    <g>
      <path d={`M${at[0] - 28 * k},${at[1] - 8} Q${at[0]},${at[1] - 18} ${at[0] + 26 * k},${at[1] - 4} L${at[0] + 24 * k},${at[1] + 40} L${at[0] - 30 * k},${at[1] + 40} Z`} fill={pants.base} />
      <path d={`M${at[0] - 28 * k},${at[1] - 8} Q${at[0]},${at[1] - 18} ${at[0] + 26 * k},${at[1] - 4}`} stroke={pants.shade} strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  );
};

export const faceFor: Record<NicoPose, Face> = {
  neutral: { mouth: "soft", lookX: 0.2 },
  phone: { mouth: "open", lookX: 0.4, lookY: 0.9, blush: 0.4, browLift: 2 },
  stress: { mouth: "stress", brow: -7, browLift: 6, lookX: -0.3 },
};

export const Nico: React.FC<{
  pose: NicoPose;
  face?: Face;
  uid: string;
  sway?: number;
  breath?: number;
  headTilt?: number;
  viewBox?: string;
}> = ({ pose, face, uid, sway = 0, breath = 0, headTilt, viewBox = "0 0 640 940" }) => {
  const f = face ?? faceFor[pose];
  const tilt = headTilt ?? (pose === "phone" ? 8 : pose === "stress" ? -7 : 2);
  const dy = pose === "phone" ? 8 : pose === "stress" ? 8 : 0;
  const headT = `translate(0,${dy - breath * 3}) rotate(${tilt},316,316) translate(316,334) scale(1.1) translate(-316,-334)`;
  const head = (
    <g transform={headT}>
      <Head f={f} />
      <HairFront sway={sway} />
    </g>
  );
  const body = (children: React.ReactNode) => <g transform={`translate(0,${-breath * 2})`}>{children}</g>;

  let content: React.ReactNode;
  if (pose === "neutral") {
    const near: P[] = [[194, 410], [172, 500], [180, 600], [222, 752]];
    const far: P[] = [[430, 410], [454, 500], [446, 600], [402, 752]];
    content = (
      <>
        <g transform={headT}>
          <HairBack />
        </g>
        {body(
          <>
            <Neck />
            <Body uid={uid} />
            <Arm pts={near} w={[54, 48, 42, 36]} />
            <Arm pts={far} w={[54, 48, 42, 36]} />
            <Pocket at={[224, 762]} />
            <Pocket at={[400, 762]} flip />
            <Sleeve pts={[[198, 396], [178, 470], [174, 520]]} />
            <Sleeve pts={[[428, 396], [448, 470], [452, 520]]} />
          </>,
        )}
        {head}
      </>
    );
  } else if (pose === "phone") {
    const near: P[] = [[194, 410], [176, 500], [184, 590], [250, 580], [290, 540]];
    const far: P[] = [[430, 410], [448, 500], [442, 590], [378, 580], [338, 540]];
    content = (
      <>
        <g transform={headT}>
          <HairBack />
        </g>
        {body(
          <>
            <Neck />
            <Body uid={uid} />
            <Arm pts={far} />
            <Arm pts={near} />
            <Phone c={[314, 494]} rot={4} w={66} h={122} />
            <Hand kind="hold" at={near[4]} angle={dirDeg(near[3], near[4])} s={skin} flip />
            <Hand kind="hold" at={far[4]} angle={dirDeg(far[3], far[4])} s={skin} />
            <Sleeve pts={[[198, 396], [180, 466], [178, 516]]} />
            <Sleeve pts={[[428, 396], [446, 466], [446, 516]]} />
          </>,
        )}
        {head}
      </>
    );
  } else {
    const near: P[] = [[192, 404], [170, 494], [178, 574], [126, 590], [86, 578]];
    const far: P[] = [[432, 402], [454, 494], [446, 574], [498, 590], [538, 578]];
    content = (
      <>
        <g transform={headT}>
          <HairBack />
        </g>
        {body(
          <>
            <Neck />
            <Body uid={uid} />
            <Arm pts={near} />
            <Hand kind="palmUp" at={near[4]} angle={dirDeg(near[3], near[4])} s={skin} flip />
            <Arm pts={far} />
            <Hand kind="palmUp" at={far[4]} angle={dirDeg(far[3], far[4])} s={skin} />
            <Sleeve pts={[[196, 392], [176, 462], [172, 510]]} />
            <Sleeve pts={[[430, 390], [450, 462], [452, 510]]} />
          </>,
        )}
        {head}
        <g stroke="#1C1F4A" strokeWidth={4.5} strokeLinecap="round" opacity={0.75}>
          <path d="M470,110 L490,94" />
          <path d="M480,140 L506,136" />
          <path d="M452,86 L456,64" />
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
