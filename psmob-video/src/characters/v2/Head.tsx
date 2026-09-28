import React from "react";
import { ink } from "../../design/illustration";
import { Build, Expression, Palette, Variant } from "./types";

// Cabeza 3/4 mirando a la izquierda del cuadro. Coordenadas de figura (cabeza ~300,230).
// Construcción: cráneo + mandíbula con mentón corrido hacia el lado de la mirada,
// oreja en la bisagra de la mandíbula, rasgos alineados sobre un eje facial desplazado.

const FACE: Record<Build["jaw"], string> = {
  soft: "M300,96 C362,96 394,140 392,208 L388,262 C386,302 362,338 324,358 C302,370 280,372 264,366 C238,356 216,330 210,298 C205,268 205,230 207,196 C210,130 244,96 300,96 Z",
  square:
    "M300,90 C366,90 398,138 396,210 L394,268 C392,312 372,344 334,362 C308,374 280,374 262,366 C236,356 212,330 207,294 C203,262 203,228 205,194 C208,126 242,90 300,90 Z",
};

const LINE = ink.line;

const Eye: React.FC<{ cx: number; cy: number; rx: number; e: Expression; variant: Variant; skin: string; far: boolean }> = ({
  cx,
  cy,
  rx,
  e,
  variant,
  skin,
  far,
}) => {
  const blink = e.blink ?? 0;
  if (e.eyes === "happy")
    return <path d={`M${cx - 11},${cy + 4} Q${cx},${cy - 10} ${cx + 11},${cy + 4}`} stroke={LINE} strokeWidth={4.5} strokeLinecap="round" fill="none" />;
  if (e.eyes === "closed" || blink > 0.85)
    return <path d={`M${cx - 11},${cy} Q${cx},${cy + 7} ${cx + 11},${cy}`} stroke={LINE} strokeWidth={4} strokeLinecap="round" fill="none" />;
  if (e.eyes === "squeeze") {
    const dir = far ? 1 : -1;
    return (
      <path
        d={`M${cx - 12 * dir},${cy - 7} L${cx + 8 * dir},${cy} L${cx - 12 * dir},${cy + 6}`}
        stroke={LINE}
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    );
  }
  const ry = 12 * (1 - blink * 0.9);
  const px = cx + e.lookX * 3.5;
  const py = cy + e.lookY * 3;
  const lidY = cy - ry + e.lid * ry * 1.1;
  return (
    <g>
      <ellipse cx={px} cy={py} rx={rx} ry={ry} fill={LINE} />
      {variant === "B" && <circle cx={px + 2.8} cy={py - 4.5} r={2.6} fill="#FFFFFF" />}
      {e.lid > 0 && <rect x={cx - rx - 6} y={cy - ry - 8} width={rx * 2 + 12} height={lidY - (cy - ry - 8)} fill={skin} />}
      {(variant === "B" || e.lid > 0) && (
        <path
          d={`M${cx - rx - 4},${lidY + 1} Q${cx},${lidY - 5} ${cx + rx + 4},${lidY + (far ? 2 : -1)}`}
          stroke={LINE}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
        />
      )}
    </g>
  );
};

// Ceja afinada: gruesa en el extremo interno, fina hacia afuera (en A, trazo uniforme).
const Brow: React.FC<{ cx: number; cy: number; e: Expression; variant: Variant; far: boolean; weight: number }> = ({
  cx,
  cy,
  e,
  variant,
  far,
  weight,
}) => {
  const inner = far ? 1 : -1; // hacia la nariz
  const ix = cx + 20 * inner;
  const ox = cx - 22 * inner;
  const iy = cy + e.browInner - e.browLift;
  const oy = cy + 2 + e.browOuter - e.browLift;
  const mx = (ix + ox) / 2;
  const my = Math.min(iy, oy) - 8;
  if (variant === "A")
    return <path d={`M${ox},${oy} Q${mx},${my} ${ix},${iy}`} stroke={LINE} strokeWidth={7 * weight} strokeLinecap="round" fill="none" />;
  const t = 9 * weight;
  return (
    <path
      d={`M${ox},${oy} Q${mx},${my - 2} ${ix},${iy - t / 2} Q${ix + 3 * inner},${iy + 1} ${ix},${iy + t / 2} Q${mx},${my + t * 0.55} ${ox},${oy + 2} Z`}
      fill={LINE}
      stroke={LINE}
      strokeWidth={2}
      strokeLinejoin="round"
    />
  );
};

const Mouth: React.FC<{ e: Expression; variant: Variant; pal: Palette }> = ({ e, variant, pal }) => {
  const sw = 4;
  switch (e.mouth) {
    case "smileSoft":
      return (
        <g>
          <path d="M252,326 Q276,344 300,322" stroke={LINE} strokeWidth={sw} strokeLinecap="round" fill="none" />
          {variant === "B" && <path d="M298,318 Q304,322 302,328" stroke={LINE} strokeWidth={2.5} strokeLinecap="round" fill="none" />}
        </g>
      );
    case "smileOpen":
      return (
        <g>
          <path d="M248,318 Q276,362 304,315 Q277,327 248,318 Z" fill={LINE} />
          <path d="M262,340 Q276,348 290,338 Q277,333 262,340 Z" fill={pal.skinShade} />
          {variant === "B" && <path d="M255,321 Q277,330 298,318 L296,325 Q277,335 258,327 Z" fill="#FFFFFF" />}
        </g>
      );
    case "grin":
      return (
        <g>
          <path d="M242,314 Q276,370 310,310 Q277,324 242,314 Z" fill={LINE} />
          <path d="M250,318 Q277,329 303,314 L300,324 Q277,337 254,327 Z" fill="#FFFFFF" />
          <path d="M264,346 Q277,354 292,344 Q278,340 264,346 Z" fill={pal.skinShade} />
        </g>
      );
    case "worried":
      return <path d="M254,338 Q262,328 274,332 Q286,336 296,328" stroke={LINE} strokeWidth={sw} strokeLinecap="round" fill="none" />;
    case "grimace":
      return (
        <g>
          <path d="M248,322 Q276,314 304,320 Q308,334 300,342 Q276,348 252,342 Q244,334 248,322 Z" fill={LINE} />
          <path d="M254,324 Q276,318 298,323 L297,333 Q276,338 255,333 Z" fill="#FFFFFF" />
          <path d="M255,329 L297,328" stroke={LINE} strokeWidth={2} />
        </g>
      );
    case "o":
      return (
        <g>
          <ellipse cx={274} cy={332} rx={10} ry={13} fill={LINE} />
          <ellipse cx={274} cy={339} rx={6} ry={4} fill={pal.skinShade} />
        </g>
      );
    default:
      return <path d="M258,330 Q276,334 294,328" stroke={LINE} strokeWidth={sw} strokeLinecap="round" fill="none" />;
  }
};

export const Head: React.FC<{ e: Expression; variant: Variant; pal: Palette; build: Build; browWeight?: number }> = ({
  e,
  variant,
  pal,
  build,
  browWeight = 1,
}) => {
  const smiling = e.mouth === "smileOpen" || e.mouth === "grin" || e.mouth === "smileSoft";
  return (
    <g>
      {/* oreja en la bisagra de la mandíbula */}
      <path d="M382,226 C400,214 414,232 408,256 C404,276 392,286 380,282 Z" fill={pal.skin} />
      <path d="M390,236 C400,238 402,254 394,266" stroke={pal.skinLine} strokeWidth={3.5} strokeLinecap="round" fill="none" />
      <path d={FACE[build.jaw]} fill={pal.skin} />
      {variant === "B" && (
        <>
          {/* plano de sombra del lado de la oreja y bajo el pómulo */}
          <path d="M386,228 C384,286 362,336 326,356 C350,330 368,296 372,232 Z" fill={pal.skinShade} opacity={0.35} />
          {smiling && <path d="M318,296 Q332,310 324,326" stroke={pal.skinLine} strokeWidth={3} strokeLinecap="round" fill="none" />}
        </>
      )}
      <Eye cx={240} cy={250} rx={7.5} e={e} variant={variant} skin={pal.skin} far />
      <Eye cx={316} cy={250} rx={8.5} e={e} variant={variant} skin={pal.skin} far={false} />
      <Brow cx={240} cy={214} e={e} variant={variant} far weight={browWeight} />
      <Brow cx={316} cy={214} e={e} variant={variant} far={false} weight={browWeight} />
      {/* nariz: línea abierta pana con quiebre de punta */}
      <path d="M280,236 C276,258 266,282 258,296 C262,305 274,306 284,301" stroke={LINE} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Mouth e={e} variant={variant} pal={pal} />
    </g>
  );
};
