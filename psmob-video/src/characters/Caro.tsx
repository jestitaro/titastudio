import React from "react";
import { useCurrentFrame } from "remotion";
import { cast, ink, LINE_W } from "../design/illustration";
import { blink, osc } from "../lib/motion";
import { ArmPose, armJoints, Face, FaceState, Hand, HandShape, limbPath, Neck } from "./parts";

// Caro · protagonista, líder de equipo comercial.
// Identidad de escenas.zip (pelo ondulado azul, remera violeta escote V),
// construcción del sistema pana (proporciones, cara, manos, planos flat).
// Encuadre de medio cuerpo. viewBox 800×1000, cabeza centrada en (400,380).

export type CaroProps = {
  face: FaceState;
  arm: ArmPose; // brazo derecho de Caro (izquierda del cuadro)
  hand: HandShape;
  headTilt?: number;
  shoulderLift?: number;
  sway?: number; // energía extra del pelo (reacciones)
  blinkOffset?: number;
};

const SHOULDER = { x: 262, y: 640 };
const HEAD = { x: 400, y: 380 };

export const Caro: React.FC<CaroProps> = ({
  face,
  arm,
  hand,
  headTilt = 0,
  shoulderLift = 0,
  sway = 0,
  blinkOffset = 0,
}) => {
  const frame = useCurrentFrame();
  const c = cast.caro;

  // Respiración: el torso se expande y los hombros suben apenas.
  const breath = osc(frame, 84, 1);
  const chest = 1 + breath * 0.012;
  const lift = breath * 4 + shoulderLift;
  const headBob = breath * 3 + shoulderLift * 0.8;
  const hairSway = osc(frame, 70, 1.6, 10) + sway;
  const b = blink(frame, 102, blinkOffset);

  const { elbow, wrist } = armJoints({ x: SHOULDER.x, y: SHOULDER.y - lift }, arm, 200, 215);
  const sleeveEnd = {
    x: SHOULDER.x + (elbow.x - SHOULDER.x) * 0.5,
    y: SHOULDER.y - lift + (elbow.y - SHOULDER.y + lift) * 0.5,
  };

  return (
    <svg viewBox="0 0 800 1000" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* Pelo trasero */}
      <g transform={`translate(${HEAD.x},${HEAD.y - headBob}) rotate(${headTilt * 0.6 + hairSway * 0.5},0,-120)`}>
        <path
          d="M-20,-176 C70,-186 140,-140 142,-66 C172,-36 150,4 166,34 C188,72 156,104 176,142 C194,180 160,214 176,244 C130,262 90,236 70,214 L-80,214 C-110,244 -160,256 -186,236 C-166,206 -196,176 -176,140 C-196,100 -160,70 -178,34 C-194,-4 -150,-38 -160,-76 C-160,-146 -96,-176 -20,-176 Z"
          fill={c.hair}
        />
        <path
          d="M-150,20 C-132,60 -162,96 -142,150 C-130,180 -150,200 -140,220 M138,40 C158,80 130,120 152,170"
          stroke={c.hairShade}
          strokeWidth={LINE_W * 2.4}
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Brazo izquierdo de Caro (derecha del cuadro), caído */}
      <path d={limbPath({ x: 610, y: 700 - lift }, { x: 628, y: 1010 }, 60, 56)} fill={ink.skin} />

      {/* Cuello y escote */}
      <g transform={`translate(${HEAD.x},${HEAD.y - headBob})`}>
        <Neck skin={ink.skin} shade={ink.skinShade} h={200} />
      </g>
      <path d={`M326,${596 - lift} L400,${676 - lift} L474,${596 - lift} L400,${560 - lift} Z`} fill={ink.skin} />

      {/* Torso */}
      <g transform={`translate(400,1000) scale(${chest},${chest}) translate(-400,-1000) translate(0,${-lift * 0.6})`}>
        <path
          d="M205,730 C208,650 250,612 330,592 L400,666 L470,592 C550,612 592,650 595,730 L612,1010 L188,1010 Z"
          fill={c.shirt}
        />
        {/* manga derecha del cuadro */}
        <path d="M540,606 C592,614 618,660 628,740 L566,752 C560,700 554,650 540,606 Z" fill={c.shirt} />
        <path d="M566,752 L628,740" stroke={ink.line} strokeWidth={LINE_W} strokeLinecap="round" opacity={0.55} />
        {/* sombra flat bajo el pecho y pliegues finos */}
        <path d="M330,592 L400,666 L470,592" stroke={ink.line} strokeWidth={LINE_W} fill="none" strokeLinejoin="round" />
        <path
          d="M300,760 C330,800 360,820 380,830 M520,720 C510,780 500,820 505,860"
          stroke={ink.line}
          strokeWidth={LINE_W * 0.8}
          strokeLinecap="round"
          fill="none"
          opacity={0.45}
        />
      </g>

      {/* Cabeza */}
      <g transform={`translate(${HEAD.x},${HEAD.y - headBob}) rotate(${headTilt},0,110)`}>
        <Face s={{ ...face, blink: face.eyes === "open" ? b : 0 }} skin={ink.skin} shade={ink.skinShade} />
        {/* Flequillo ondulado y mechón lateral */}
        <g transform={`rotate(${hairSway * 0.35},0,-130)`}>
          <path
            d="M-104,-44 C-122,-140 -30,-172 40,-158 C98,-148 124,-100 106,-36 C96,-86 58,-116 6,-110 C-46,-106 -82,-78 -104,-44 Z"
            fill={c.hair}
          />
          <path
            d="M-96,-66 C-120,-10 -100,44 -118,100 C-92,78 -84,22 -86,-40 Z"
            fill={c.hair}
            transform={`rotate(${hairSway * 0.8},-96,-60)`}
          />
          <path
            d="M-70,-118 C-30,-140 30,-140 70,-112"
            stroke={c.hairShade}
            strokeWidth={LINE_W * 2}
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </g>

      {/* Brazo derecho de Caro (izquierda del cuadro), animable */}
      <path d={limbPath({ x: SHOULDER.x, y: SHOULDER.y - lift }, elbow, 64, 56)} fill={ink.skin} />
      <path d={limbPath(elbow, wrist, 56, 46)} fill={ink.skin} />
      <path d={limbPath({ x: SHOULDER.x + 18, y: SHOULDER.y - lift - 6 }, sleeveEnd, 104, 84)} fill={c.shirt} />
      <Hand at={wrist} angle={arm.fore} shape={hand} skin={ink.skin} line={ink.skinLine} flip scale={1.35} />
    </svg>
  );
};
