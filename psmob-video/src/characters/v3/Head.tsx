import React from "react";
import { Expr, Look } from "./types";

// Cabeza 3/4 mirando a la DERECHA del cuadro (lenguaje de la hoja canónica):
// sin contornos, ojos ovalados con brillo, cejas finas del color del pelo,
// nariz en volumen del lado lejano, rubor suave, boca con dientes cuando sonríe.

export const FACE = {
  soft: "M236,208 C236,150 276,112 322,112 C372,112 402,152 402,206 C402,242 398,272 390,298 C380,330 358,356 328,364 C302,370 274,364 258,348 C242,330 236,304 236,278 Z",
  square:
    "M234,200 C234,142 276,106 324,106 C374,106 404,146 404,200 C404,236 400,268 392,296 C382,332 358,358 326,366 C298,372 272,364 258,348 C240,328 234,300 234,272 Z",
};

export const Head: React.FC<{ e: Expr; look: Look; jaw: "soft" | "square"; browW?: number }> = ({ e, look, jaw, browW = 5.5 }) => {
  const { skin } = look;
  const blink = e.blink ?? 0;
  const eye = (cx: number, cy: number, rx: number, ry: number) => {
    if (e.eyes === "happy")
      return <path d={`M${cx - rx - 3},${cy + 3} Q${cx},${cy - ry} ${cx + rx + 3},${cy + 3}`} stroke={look.eye} strokeWidth={4.5} strokeLinecap="round" fill="none" />;
    if (e.eyes === "closed" || blink > 0.85)
      return <path d={`M${cx - rx - 2},${cy} Q${cx},${cy + 6} ${cx + rx + 2},${cy}`} stroke={look.eye} strokeWidth={4} strokeLinecap="round" fill="none" />;
    const px = cx + e.lookX * 3;
    const py = cy + e.lookY * 3;
    const h = ry * (1 - blink * 0.9);
    return (
      <g>
        <ellipse cx={px} cy={py} rx={rx} ry={h} fill={look.eye} />
        <circle cx={px + rx * 0.35} cy={py - h * 0.4} r={rx * 0.32} fill="#FFFFFF" />
      </g>
    );
  };
  const brow = (x1: number, y1: number, x2: number, y2: number, inner: "start" | "end") => {
    const dyIn = e.brow * 1.2;
    const lift = -e.browLift;
    const ax = x1;
    const ay = y1 + lift + (inner === "start" ? dyIn : -dyIn * 0.3);
    const bx = x2;
    const by = y2 + lift + (inner === "end" ? dyIn : -dyIn * 0.3);
    return <path d={`M${ax},${ay} Q${(ax + bx) / 2},${Math.min(ay, by) - 5} ${bx},${by}`} stroke={look.brow} strokeWidth={browW} strokeLinecap="round" fill="none" />;
  };
  const mouth = () => {
    switch (e.mouth) {
      case "smile":
        return <path d="M318,312 Q338,328 356,308" stroke="#B5484E" strokeWidth={4.5} strokeLinecap="round" fill="none" />;
      case "smileOpen":
        return (
          <g>
            <path d="M314,304 Q338,338 362,300 Q338,310 314,304 Z" fill="#8E2F3B" />
            <path d="M318,306 Q338,313 358,302 L356,309 Q338,318 320,312 Z" fill="#FFFFFF" />
            <path d="M326,322 Q338,330 350,319 Q338,316 326,322 Z" fill="#E86A6F" />
          </g>
        );
      case "laugh":
        return (
          <g>
            <path d="M310,300 Q338,350 366,294 Q338,308 310,300 Z" fill="#8E2F3B" />
            <path d="M315,302 Q338,311 361,297 L359,305 Q338,317 318,310 Z" fill="#FFFFFF" />
            <path d="M322,326 Q338,338 354,322 Q338,318 322,326 Z" fill="#E86A6F" />
          </g>
        );
      case "worried":
        return <path d="M322,318 Q334,310 350,316" stroke="#B5484E" strokeWidth={4.5} strokeLinecap="round" fill="none" />;
      case "stress":
        return (
          <g>
            <path d="M318,312 Q336,300 356,310 Q358,326 348,332 Q334,336 322,330 Q314,322 318,312 Z" fill="#8E2F3B" />
            <path d="M320,312 Q336,304 354,311 L352,317 Q336,312 322,318 Z" fill="#FFFFFF" />
          </g>
        );
      default:
        return <path d="M322,314 Q336,320 350,312" stroke="#B5484E" strokeWidth={4} strokeLinecap="round" fill="none" />;
    }
  };
  return (
    <g>
      {/* oreja del lado cercano (izquierda) */}
      <ellipse cx={240} cy={262} rx={18} ry={24} fill={skin.base} />
      <path d="M236,252 C230,258 230,270 238,276" stroke={skin.deep} strokeWidth={3.5} strokeLinecap="round" fill="none" />
      <path d={FACE[jaw]} fill={skin.base} />
      {/* sombra suave bajo la oreja y la mandíbula */}
      <path d="M242,290 C250,322 270,346 300,356 C278,356 256,340 246,316 Z" fill={skin.shade} opacity={0.55} />
      {/* rubor */}
      <ellipse cx={296} cy={292} rx={17} ry={9} fill={skin.blush} opacity={0.35 + e.blush * 0.3} />
      <ellipse cx={380} cy={292} rx={8} ry={7} fill={skin.blush} opacity={0.3 + e.blush * 0.3} />
      {eye(298, 246, 9.5, 12.5)}
      {eye(364, 244, 8, 11.5)}
      {brow(284, 222, 312, 218, "end")}
      {brow(350, 218, 374, 222, "start")}
      {/* nariz: volumen del lado lejano */}
      <path d="M368,254 C374,266 384,280 384,288 C378,294 366,292 358,288 C366,284 372,276 368,254 Z" fill={skin.shade} />
      {mouth()}
    </g>
  );
};
