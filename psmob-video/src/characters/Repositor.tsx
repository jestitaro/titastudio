import React from "react";
import { useCurrentFrame } from "remotion";
import { cast, ink, LINE_W } from "../design/illustration";
import { blink, osc } from "../lib/motion";
import { ArmPose, armJoints, Face, FaceState, Hand, limbPath, Neck } from "./parts";

// Repositor · personaje nuevo generado con el mismo sistema que Caro:
// misma cabeza/cara (espejada para mirar a la derecha), mismas manos y cápsulas,
// pelo rulos cortos (como app-monetization), chaleco de trabajo slate, piel más oscura.
// Plano medio desde el muslo. viewBox 800×1000.

export const REPO_SHOULDER = { x: 430, y: 470 };
export const REPO_L1 = 165;
export const REPO_L2 = 160;

export const repoWrist = (pose: ArmPose, lift = 0) =>
  armJoints({ x: REPO_SHOULDER.x, y: REPO_SHOULDER.y - lift }, pose, REPO_L1, REPO_L2);

const HEAD = { x: 400, y: 250 };

const Curls: React.FC<{ color: string }> = ({ color }) => {
  const pts = [
    [-92, -40],
    [-100, -80],
    [-84, -118],
    [-50, -146],
    [-8, -158],
    [36, -152],
    [72, -128],
    [92, -92],
    [96, -54],
  ];
  return (
    <g fill={color}>
      <path d="M-96,-30 C-104,-130 -40,-150 6,-148 C66,-146 102,-110 98,-30 C80,-70 40,-92 0,-92 C-44,-92 -80,-70 -96,-30 Z" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={32 - (i % 2) * 4} />
      ))}
    </g>
  );
};

export const Repositor: React.FC<{
  face: FaceState;
  arm: ArmPose;
  phoneGlow: number;
}> = ({ face, arm, phoneGlow }) => {
  const frame = useCurrentFrame();
  const c = cast.repositor;
  const skin = ink.skinDark;
  const shade = ink.skinDarkShade;

  const breath = osc(frame, 80, 1, 20);
  const lift = breath * 3;
  const b = blink(frame, 88, 31);
  const { elbow, wrist } = repoWrist(arm, lift);

  return (
    <svg viewBox="0 0 800 1000" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* Brazo lejano, casi oculto */}
      <path d={limbPath({ x: 330, y: 500 - lift }, { x: 300, y: 760 }, 58, 50)} fill={shade} />

      {/* Piernas (pantalón pana #263238) */}
      <path d="M300,700 L500,700 L520,1010 L410,1010 L400,820 L380,1010 L280,1010 Z" fill={ink.line} />
      <path d="M400,760 L400,820" stroke={ink.slate} strokeWidth={LINE_W} strokeLinecap="round" />

      {/* Cuello */}
      <g transform={`translate(${HEAD.x},${HEAD.y - lift})`}>
        <Neck skin={skin} shade={shade} h={170} />
      </g>

      {/* Torso: remera + chaleco */}
      <g transform={`translate(0,${-lift * 0.6})`}>
        <path d="M300,480 C320,440 360,428 400,428 C440,428 486,440 506,482 L520,720 L290,720 Z" fill={c.shirt} />
        <path d="M300,480 C320,440 352,430 372,430 L392,720 L290,720 Z" fill={c.vest} />
        <path d="M506,482 C486,440 452,430 430,430 L420,720 L520,720 Z" fill={c.vest} />
        <path d="M372,430 L400,470 L430,430" stroke={ink.line} strokeWidth={LINE_W} fill="none" strokeLinejoin="round" />
        {/* bolsillo y costuras del chaleco */}
        <rect x={440} y={560} width={56} height={44} rx={6} fill="rgba(0,0,0,0.18)" />
        <path d="M444,570 L492,570" stroke={ink.line} strokeWidth={LINE_W * 0.8} opacity={0.5} />
        <path d="M392,500 L392,720 M420,500 L420,720" stroke={ink.line} strokeWidth={LINE_W * 0.8} opacity={0.35} />
        <rect x={286} y={700} width={238} height={26} rx={6} fill={ink.line} />
      </g>

      {/* Cabeza espejada: mira hacia la góndola */}
      <g transform={`translate(${HEAD.x},${HEAD.y - lift * 1.2}) scale(-1,1) rotate(${osc(frame, 120, 1.5)},0,110)`}>
        <g transform={`rotate(${osc(frame, 64, 1.2)},0,-120)`}>
          <Curls color={c.hair} />
        </g>
        <Face s={{ ...face, blink: face.eyes === "open" ? b : 0 }} skin={skin} shade={shade} />
        {/* patillas y sombra de pelo sobre la frente */}
        <path d="M-92,-40 C-96,-10 -92,10 -86,30 L-78,-20 Z" fill={c.hair} />
        <path d="M88,-40 C94,-10 92,0 90,10 L80,-30 Z" fill={c.hair} />
      </g>

      {/* Brazo cercano con el celular */}
      <path d={limbPath({ x: REPO_SHOULDER.x, y: REPO_SHOULDER.y - lift }, elbow, 58, 52)} fill={skin} />
      <path d={limbPath({ x: REPO_SHOULDER.x, y: REPO_SHOULDER.y - lift }, {
        x: REPO_SHOULDER.x + (elbow.x - REPO_SHOULDER.x) * 0.55,
        y: REPO_SHOULDER.y - lift + (elbow.y - REPO_SHOULDER.y + lift) * 0.55,
      }, 76, 68)} fill={c.shirt} />
      <path d={limbPath(elbow, wrist, 52, 44)} fill={skin} />
      <g transform={`translate(${wrist.x},${wrist.y}) rotate(${(arm.fore + 40) * 0.3})`}>
        {/* celular: cuerpo oscuro + borde de pantalla encendida */}
        <rect x={-30} y={-96} width={60} height={112} rx={10} fill={ink.line} />
        <rect x={-24} y={-90} width={48} height={100} rx={6} fill="#1B2A6B" />
        <rect x={-24} y={-90} width={48} height={100} rx={6} fill="#3C9FF1" opacity={0.35 + phoneGlow * 0.5} />
      </g>
      <Hand at={wrist} angle={arm.fore} shape="grip" skin={skin} line={shade} scale={1.2} />
    </svg>
  );
};
