import React from "react";
import { ink, LINE_W } from "../design/illustration";

type P = { x: number; y: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

export const polar = (o: P, deg: number, len: number): P => ({
  x: o.x + Math.cos(rad(deg)) * len,
  y: o.y + Math.sin(rad(deg)) * len,
});

// Cápsula con extremos redondeados y grosor variable (brazos, dedos, piernas).
export const limbPath = (a: P, b: P, w1: number, w2: number) => {
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  const nx = -Math.sin(ang);
  const ny = Math.cos(ang);
  const r1 = w1 / 2;
  const r2 = w2 / 2;
  const f = (n: number) => n.toFixed(2);
  return [
    `M${f(a.x + nx * r1)},${f(a.y + ny * r1)}`,
    `L${f(b.x + nx * r2)},${f(b.y + ny * r2)}`,
    `A${f(r2)},${f(r2)} 0 0 0 ${f(b.x - nx * r2)},${f(b.y - ny * r2)}`,
    `L${f(a.x - nx * r1)},${f(a.y - ny * r1)}`,
    `A${f(r1)},${f(r1)} 0 0 0 ${f(a.x + nx * r1)},${f(a.y + ny * r1)}`,
    "Z",
  ].join(" ");
};

export type ArmPose = { upper: number; fore: number };

// Brazo por cinemática directa: hombro → codo → muñeca.
export const armJoints = (shoulder: P, pose: ArmPose, l1: number, l2: number) => {
  const elbow = polar(shoulder, pose.upper, l1);
  const wrist = polar(elbow, pose.fore, l2);
  return { elbow, wrist };
};

export type HandShape = "open" | "grip" | "rest";

// Mano estilo pana: palma + dedos cápsula con separaciones en tono de piel más oscuro.
// Apunta hacia +x local; se rota con el antebrazo.
export const Hand: React.FC<{
  at: P;
  angle: number;
  shape: HandShape;
  skin: string;
  line: string;
  flip?: boolean;
  scale?: number;
}> = ({ at, angle, shape, skin, line, flip = false, scale = 1 }) => {
  const fingers =
    shape === "open"
      ? [
          { y: -14, len: 36 },
          { y: -4, len: 42 },
          { y: 6, len: 40 },
          { y: 15, len: 32 },
        ]
      : shape === "grip"
        ? [
            { y: -12, len: 20 },
            { y: -3, len: 22 },
            { y: 6, len: 21 },
            { y: 14, len: 18 },
          ]
        : [
            { y: -12, len: 26 },
            { y: -3, len: 30 },
            { y: 6, len: 29 },
            { y: 14, len: 24 },
          ];
  return (
    <g transform={`translate(${at.x},${at.y}) rotate(${angle}) scale(${scale},${flip ? -scale : scale})`}>
      <path d={limbPath({ x: -6, y: 0 }, { x: 22, y: 0 }, 40, 42)} fill={skin} />
      {fingers.map((fg, i) => (
        <path
          key={i}
          d={limbPath({ x: 18, y: fg.y }, { x: 18 + fg.len, y: fg.y + fg.y * 0.12 }, 11, 10)}
          fill={skin}
        />
      ))}
      {fingers.slice(0, 3).map((fg, i) => (
        <path
          key={`l${i}`}
          d={`M${24},${fg.y + 4.5} L${12 + fg.len},${fg.y + 5 + fg.y * 0.1}`}
          stroke={line}
          strokeWidth={LINE_W * 0.7}
          strokeLinecap="round"
          fill="none"
        />
      ))}
      <path d={limbPath({ x: 4, y: -16 }, { x: 22, y: -34 }, 13, 11)} fill={skin} />
    </g>
  );
};

export type Eyes = "open" | "closed" | "squeeze";
export type Mouth = "flat" | "ugh" | "o" | "smile" | "grin";

export type FaceState = {
  eyes: Eyes;
  lookX: number;
  lookY: number;
  blink: number;
  browL: number;
  browR: number;
  browLift: number;
  mouth: Mouth;
};

export const neutralFace: FaceState = {
  eyes: "open",
  lookX: 0,
  lookY: 0,
  blink: 0,
  browL: 0,
  browR: 0,
  browLift: 0,
  mouth: "smile",
};

// Rostro 3/4 mirando levemente hacia la izquierda del cuadro, con construcción pana:
// ojos punto, cejas gruesas cortas, nariz de una sola línea abierta, sin blush.
export const Face: React.FC<{ s: FaceState; skin: string; shade: string; line?: string }> = ({
  s,
  skin,
  shade,
  line = ink.line,
}) => {
  const eye = (cx: number) => {
    if (s.eyes === "squeeze")
      return (
        <path
          d={`M${cx - 12},${-2} L${cx},${4} L${cx + 12},${-2}`}
          stroke={line}
          strokeWidth={LINE_W * 1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );
    if (s.eyes === "closed" || s.blink > 0.85)
      return (
        <path
          d={`M${cx - 11},0 Q${cx},7 ${cx + 11},0`}
          stroke={line}
          strokeWidth={LINE_W * 1.3}
          strokeLinecap="round"
          fill="none"
        />
      );
    return (
      <ellipse
        cx={cx + s.lookX * 5}
        cy={s.lookY * 4}
        rx={7.5}
        ry={10 * Math.max(0.12, 1 - s.blink)}
        fill={line}
      />
    );
  };
  const brow = (cx: number, tilt: number, dir: 1 | -1) => (
    <path
      d={`M${cx - 20},${-36} Q${cx},${-46} ${cx + 20},${-38}`}
      transform={`translate(0,${-s.browLift}) rotate(${tilt * dir},${cx},${-40})`}
      stroke={line}
      strokeWidth={LINE_W * 2.6}
      strokeLinecap="round"
      fill="none"
    />
  );
  const mouth = () => {
    switch (s.mouth) {
      case "flat":
        return <path d="M-20,74 L14,72" stroke={line} strokeWidth={LINE_W * 1.3} strokeLinecap="round" />;
      case "ugh":
        return (
          <path
            d="M-24,76 Q-12,68 -2,75 Q8,82 18,72"
            stroke={line}
            strokeWidth={LINE_W * 1.3}
            strokeLinecap="round"
            fill="none"
          />
        );
      case "o":
        return (
          <g>
            <ellipse cx={-4} cy={76} rx={10} ry={12} fill={line} />
            <ellipse cx={-4} cy={83} rx={6} ry={4} fill={shade} />
          </g>
        );
      case "grin":
        return (
          <g>
            <path d="M-26,64 Q-4,98 22,64 Q-2,74 -26,64 Z" fill={line} />
            <path d="M-14,80 Q-3,88 10,80 Q-2,76 -14,80 Z" fill={shade} />
          </g>
        );
      default:
        return (
          <path
            d="M-22,68 Q-4,86 16,68"
            stroke={line}
            strokeWidth={LINE_W * 1.3}
            strokeLinecap="round"
            fill="none"
          />
        );
    }
  };
  return (
    <g>
      {/* oreja */}
      <ellipse cx={90} cy={8} rx={17} ry={25} fill={skin} />
      <path d="M92,-4 Q100,8 90,20" stroke={shade} strokeWidth={LINE_W * 1.2} fill="none" strokeLinecap="round" />
      {/* cara */}
      <path
        d="M-90,-58 C-92,-118 -46,-136 6,-136 C60,-136 94,-110 93,-48 L90,40 C88,92 50,126 4,129 C-40,126 -82,94 -87,42 Z"
        fill={skin}
      />
      {eye(-40)}
      {eye(34)}
      {brow(-40, s.browL, 1)}
      {brow(34, s.browR, -1)}
      {/* nariz: línea abierta pana */}
      <path
        d="M0,-2 L-14,40 Q-8,46 6,44"
        stroke={line}
        strokeWidth={LINE_W}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {mouth()}
    </g>
  );
};

// Cuello con la sombra bajo mandíbula típica de la referencia.
export const Neck: React.FC<{ skin: string; shade: string; h?: number }> = ({ skin, shade, h = 150 }) => (
  <g>
    <path d={`M-38,70 L38,70 L42,${70 + h} L-42,${70 + h} Z`} fill={skin} />
    <path d="M-38,92 Q2,150 40,92 L40,128 Q2,168 -38,128 Z" fill={shade} />
  </g>
);
