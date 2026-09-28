import React from "react";
import { ink } from "../../design/illustration";
import { Design } from "./designs";
import { armOutline, sleeveOutline } from "./geometry";
import { Hand, Phone, WrapFingers } from "./Hands";
import { Head } from "./Head";
import { ArmPose, Expression, Pose, Variant } from "./types";

// Figura de medio cuerpo (hasta cadera). viewBox base 600×900.
// Orden de capas: pelo trasero → brazo lejano → cuello → pantalón → torso → cabeza →
// pelo delantero → brazo cercano → celular y dedos.

const LINE = ink.line;

const Torso: React.FC<{ d: Design; variant: Variant; pose: Pose }> = ({ d, variant, pose }) => {
  const s = d.build.shoulderSpread;
  const { pal } = d;
  const body = `M264,396 C236,418 ${200 - s},424 ${184 - s},440 C${166 - s},458 ${164 - s},500 ${172 - s * 0.6},548 C${186 - s * 0.4},600 ${214 - s * 0.6},640 ${210 - s * 0.4},690 C208,716 206,732 204,744 Q250,756 300,752 Q352,758 404,744 C402,730 400,712 ${396 + s * 0.4},690 C${392 + s * 0.6},640 ${416 + s * 0.4},600 ${428 + s * 0.6},550 C${438 + s},500 ${440 + s},462 ${426 + s},444 C${406 + s},426 368,418 340,392 Z`;
  const raisedNear = pose.near.E.y < 420;
  return (
    <g>
      {/* pantalón */}
      <path d="M200,726 Q300,738 408,726 C420,780 432,830 434,880 L438,1140 L314,1140 L303,906 L297,906 L286,1140 L164,1140 L170,880 C172,830 186,780 200,726 Z" fill={pal.bottom} />
      <path d="M200,726 Q300,738 408,726 L410,752 Q300,764 198,752 Z" fill={pal.bottomShade} />
      {variant === "B" && (
        <g stroke={pal.bottomShade} strokeWidth={4} strokeLinecap="round" fill="none">
          <path d="M300,760 C302,810 304,840 298,880" />
          <path d="M212,770 C238,782 254,800 260,824" />
          <path d="M396,770 C368,782 352,800 346,824" />
        </g>
      )}
      <path d={body} fill={pal.top} />
      {/* planos de sombra de la tela */}
      {variant === "B" ? (
        <g fill={pal.topShade}>
          <path d={`M${184 - s},440 C${166 - s},458 ${164 - s},500 ${172 - s * 0.6},548 C182,630 196,700 204,744 L238,748 C222,660 206,570 ${214 - s * 0.5},470 Z`} />
          <path d={`M${428 + s * 0.6},550 C420,630 410,700 404,744 L384,748 C394,680 404,620 ${412 + s * 0.5},${raisedNear ? 470 : 520} Z`} opacity={0.8} />
          <path d="M250,560 C276,586 330,588 356,562 C330,574 280,574 250,560 Z" opacity={0.9} />
        </g>
      ) : (
        <path d={`M${184 - s},440 C${166 - s},458 ${164 - s},500 ${172 - s * 0.6},548 C182,630 196,700 204,744 L226,746 C214,660 204,570 ${210 - s * 0.5},470 Z`} fill={pal.topShade} />
      )}
      {/* pliegues con intención: tiran hacia el brazo que trabaja y hacia el remetido */}
      <g stroke={LINE} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.5}>
        <path d="M236,736 L242,752 M270,738 L272,754 M334,738 L332,754 M368,736 L364,752" />
        <path d="M410,500 C386,540 362,560 336,572" />
        {variant === "B" && raisedNear && <path d="M404,470 C380,500 360,520 344,530" />}
        {variant === "B" && !raisedNear && <path d="M398,600 C388,620 384,640 386,660" />}
      </g>
      {/* escote */}
      {d.build.neckline === "v" ? (
        <g>
          <path d="M270,398 Q294,452 302,478 Q314,446 334,396 Z" fill={pal.skin} />
          {variant === "B" && <path d="M280,404 Q300,440 304,456 Q312,436 324,402 Z" fill={pal.skinShade} opacity={0.35} />}
          <path d="M266,396 Q292,452 302,480 Q316,446 338,392" stroke={pal.topShade} strokeWidth={9} strokeLinejoin="round" fill="none" />
          <path d="M266,396 Q292,452 302,480 Q316,446 338,392" stroke={LINE} strokeWidth={2.5} strokeLinejoin="round" fill="none" opacity={0.6} />
        </g>
      ) : (
        <g>
          <path d="M262,394 C284,424 322,424 346,390 L356,402 C326,440 282,440 252,406 Z" fill={pal.topShade} />
          <path d="M252,406 C282,440 326,440 356,402" stroke={LINE} strokeWidth={2.5} fill="none" opacity={0.5} />
        </g>
      )}
    </g>
  );
};

const Arm: React.FC<{ a: ArmPose; d: Design; variant: Variant; shade?: boolean }> = ({ a, d, variant, shade }) => {
  const { pal } = d;
  const sl = sleeveOutline(a.S, a.E, d.build.neckline === "crew" ? 0.55 : 0.45, d.build.neckline === "crew" ? 6 : 2, d.build.armScale);
  return (
    <g>
      <path d={armOutline(a.S, a.E, a.W, d.build.armScale)} fill={pal.skin} />
      {variant === "B" && (
        <path
          d={`M${a.E.x - 6},${a.E.y - 4} Q${a.E.x},${a.E.y + 2} ${a.E.x + 6},${a.E.y - 2}`}
          stroke={pal.skinLine}
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
        />
      )}
      <path d={sl.shape} fill={shade ? pal.topShade : pal.top} />
      {variant === "B" && (
        <path
          d={`M${sl.hem.from.x},${sl.hem.from.y} Q${sl.hem.mid.x},${sl.hem.mid.y} ${sl.hem.to.x},${sl.hem.to.y}`}
          stroke={pal.topShade}
          strokeWidth={7}
          strokeLinecap="round"
          fill="none"
        />
      )}
      <path
        d={`M${sl.hem.from.x},${sl.hem.from.y} Q${sl.hem.mid.x},${sl.hem.mid.y} ${sl.hem.to.x},${sl.hem.to.y}`}
        stroke={LINE}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
        opacity={0.55}
      />
      {a.hand === "pocket" && (
        <g>
          <path d={`M${a.W.x - 28},${a.W.y - 12} Q${a.W.x - 2},${a.W.y - 24} ${a.W.x + 22},${a.W.y - 14} L${a.W.x + 22},${a.W.y + 40} L${a.W.x - 30},${a.W.y + 40} Z`} fill={pal.bottom} />
          <path d={`M${a.W.x - 28},${a.W.y - 12} Q${a.W.x - 2},${a.W.y - 24} ${a.W.x + 22},${a.W.y - 14}`} stroke={pal.bottomShade} strokeWidth={5} strokeLinecap="round" fill="none" />
        </g>
      )}
      {(a.hand === "relaxed" || a.hand === "openBack") && (
        <Hand kind={a.hand} at={a.W} from={a.E} pal={pal} variant={variant} flip={a.flipHand} />
      )}
    </g>
  );
};

export const Figure: React.FC<{
  d: Design;
  variant: Variant;
  pose: Pose;
  e: Expression;
  sway?: number;
  breath?: number;
  viewBox?: string;
}> = ({ d, variant, pose, e, sway = 0, breath = 0, viewBox = "0 0 600 900" }) => {
  const { HairBack, HairFront, pal } = d;
  const headScale = variant === "B" ? 0.95 : 1;
  const headT = `translate(${pose.headShift?.x ?? 0},${(pose.headShift?.y ?? 0) - breath * 3}) rotate(${pose.headTilt},300,380) translate(300,380) scale(${headScale}) translate(-300,-380)`;
  const lean = `rotate(${pose.bodyLean ?? 0},300,900)`;
  const nw = d.build.neckWidth;
  const phoneW = 72;
  const phoneH = 136;

  const head = (
    <g transform={headT}>
      <Head e={e} variant={variant} pal={pal} build={d.build} browWeight={d.browWeight} />
      <HairFront pal={pal} variant={variant} sway={sway} />
    </g>
  );

  return (
    <svg viewBox={viewBox} width="100%" height="100%" style={{ overflow: "visible" }}>
      <g transform={lean}>
        <g transform={headT}>
          <HairBack pal={pal} variant={variant} sway={sway} />
        </g>

        {!pose.farArmFront && <Arm a={pose.far} d={d} variant={variant} shade />}

        {/* cuello con sombra de mandíbula */}
        <g transform={`translate(0,${-breath * 2})`}>
          <path d={`M${300 - nw / 2},326 L${300 - nw / 2 - 6},414 L${300 + nw / 2 + 10},414 L${300 + nw / 2 + 4},326 Z`} fill={pal.skin} />
          <path d={`M${300 - nw / 2},346 C290,380 322,378 ${300 + nw / 2 + 4},348 L${300 + nw / 2 + 6},390 C316,406 284,404 ${300 - nw / 2 - 2},388 Z`} fill={pal.skinShade} />
        </g>

        <g transform={`translate(300,900) scale(${1 + breath * 0.008}) translate(-300,-900)`}>
          <Torso d={d} variant={variant} pose={pose} />
        </g>

        {pose.farArmFront && <Arm a={pose.far} d={d} variant={variant} />}
        {pose.nearArmBehindHead && <Arm a={pose.near} d={d} variant={variant} />}

        {head}

        {!pose.nearArmBehindHead && <Arm a={pose.near} d={d} variant={variant} />}

        {pose.phone && (
          <g>
            <Phone c={pose.phone.c} rot={pose.phone.rot} w={phoneW} h={phoneH} />
            <g transform={`translate(${pose.phone.c.x},${pose.phone.c.y}) rotate(${pose.phone.rot})`}>
              {pose.prop === "phoneTwoHands" && (
                <>
                  <WrapFingers side={-1} y0={10} w={phoneW} pal={pal} variant={variant} />
                  <WrapFingers side={1} y0={14} w={phoneW} pal={pal} variant={variant} />
                </>
              )}
              {pose.prop === "phoneOneHand" && (
                <>
                  <WrapFingers side={-1} y0={-4} w={phoneW} pal={pal} variant={variant} />
                  <path d={`M${phoneW / 2 - 4},${phoneH / 2 - 6} C${phoneW / 2 + 10},20 ${phoneW / 2 + 6},-4 ${phoneW / 2 - 6},-24`} stroke={pal.skin} strokeWidth={17} strokeLinecap="round" fill="none" />
                  {variant === "B" && (
                    <path d={`M${phoneW / 2 + 2},10 Q${phoneW / 2 + 8},0 ${phoneW / 2 + 2},-12`} stroke={pal.skinLine} strokeWidth={2.2} strokeLinecap="round" fill="none" />
                  )}
                </>
              )}
            </g>
          </g>
        )}
      </g>
    </svg>
  );
};
