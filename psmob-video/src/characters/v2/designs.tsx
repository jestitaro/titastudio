import React from "react";
import { ink } from "../../design/illustration";
import { Build, Palette, Variant } from "./types";

export type HairProps = { pal: Palette; variant: Variant; sway: number };

export type Design = {
  id: string;
  name: string;
  role: string;
  pal: Palette;
  build: Build;
  HairBack: React.FC<HairProps>;
  HairFront: React.FC<HairProps>;
  browWeight: number;
};

// ───────────────────────── CARO ─────────────────────────
// Silueta: melena ondulada con volumen asimétrico (más masa del lado lejano),
// raya al costado, mechón que cae por delante del hombro lejano y puntas en rulo.

const CaroBack: React.FC<HairProps> = ({ pal, variant, sway }) => (
  <g transform={`rotate(${sway},300,120)`}>
    <path
      d="M300,70 C376,64 424,108 426,176 C446,196 444,226 434,248 C452,272 452,306 438,328 C456,352 454,392 436,414 C454,440 450,476 432,494 C440,512 430,528 414,530 C396,522 386,506 384,494 C368,512 340,508 332,490 L232,488 C222,512 190,520 172,506 C160,524 134,528 118,516 C112,500 118,486 128,478 C108,456 110,420 128,400 C106,376 108,340 126,320 C106,294 110,258 130,238 C118,214 122,190 136,172 C150,104 220,72 300,70 Z"
      fill={pal.hair}
    />
    {variant === "B" && (
      <g fill={pal.hairShade}>
        <path d="M152,300 C142,350 168,392 152,440 C148,470 162,490 178,500 C162,460 186,420 174,380 C164,346 178,320 168,290 Z" />
        <path d="M428,300 C444,340 422,380 438,420 C446,448 436,478 422,496 C426,460 412,430 420,396 C428,360 416,330 418,300 Z" />
        <path d="M238,490 C242,470 252,452 264,440 L322,440 C332,456 336,474 332,492 Z" />
      </g>
    )}
  </g>
);

const CaroFront: React.FC<HairProps> = ({ pal, variant, sway }) => (
  <g transform={`rotate(${sway * 0.4},300,110)`}>
    {/* cráneo cubierto + flequillo barrido desde la raya (lado cercano) hacia la sien lejana */}
    <path
      d="M400,206 C408,150 396,104 352,84 C304,64 240,78 212,120 C192,150 188,196 196,246 C200,270 206,290 214,306 C216,266 224,228 242,200 C266,166 304,150 344,150 C366,150 384,160 394,174 C398,184 400,196 400,206 Z"
      fill={pal.hair}
    />
    {/* raya: quiebre del mechón que cae hacia el frente */}
    {/* mechón lejano por delante del hombro, puntas en rulo */}
    <path
      d="M212,156 C186,208 196,260 182,312 C168,364 196,402 176,454 C168,476 178,498 198,502 C190,482 206,464 206,440 C208,402 192,364 206,320 C218,278 214,234 228,186 Z"
      fill={pal.hair}
      transform={`rotate(${sway * 1.2},212,160)`}
    />
    {variant === "B" ? (
      <g>
        <path d="M262,96 C296,80 336,80 366,96" stroke={pal.hairLight} strokeWidth={7} strokeLinecap="round" fill="none" />
        <path d="M222,150 C236,126 262,110 290,102" stroke={pal.hairLight} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.7} />
        <path d="M206,302 C196,342 210,372 196,412" stroke={pal.hairShade} strokeWidth={6} strokeLinecap="round" fill="none" transform={`rotate(${sway * 1.2},212,160)`} />
        <path d="M246,196 C262,176 284,164 310,158" stroke={pal.hairShade} strokeWidth={5} strokeLinecap="round" fill="none" />
      </g>
    ) : (
      <path d="M262,98 C296,82 336,82 366,98" stroke={pal.hairShade} strokeWidth={6} strokeLinecap="round" fill="none" />
    )}
  </g>
);

export const caro: Design = {
  id: "caro",
  name: "Caro",
  role: "Líder de equipo comercial",
  pal: {
    skin: ink.skin,
    skinShade: ink.skinShade,
    skinLine: ink.skinLine,
    hair: "#2F3FA8",
    hairShade: "#23308A",
    hairLight: "#4A5BD0",
    top: ink.purple,
    topShade: "#6440AE",
    bottom: "#3F6FE0",
    bottomShade: "#2F57BA",
  },
  build: { jaw: "soft", shoulderSpread: 0, neckWidth: 72, armScale: 0.92, neckline: "v" },
  HairBack: CaroBack,
  HairFront: CaroFront,
  browWeight: 0.9,
};

// ───────────────────────── COMPAÑERO (Nico) ─────────────────────────
// Silueta: jopo pelirrojo peinado hacia arriba y atrás, nuca corta, patilla marcada.
// Hombros más anchos, mandíbula cuadrada, cuello más grueso, cejas más pesadas.

const NicoBack: React.FC<HairProps> = ({ pal }) => (
  <path d="M372,186 C400,220 404,276 380,318 L356,300 C372,262 372,222 360,196 Z" fill={pal.hair} />
);

const NicoFront: React.FC<HairProps> = ({ pal, variant, sway }) => (
  <g>
    {/* casquete corto pegado al cráneo, línea de pelo recta con entradas */}
    <path
      d="M204,212 C194,142 224,82 300,76 C374,70 410,124 402,196 L396,230 C392,210 386,194 376,184 C356,180 338,184 318,176 C296,170 270,176 248,172 C230,184 216,200 210,226 Z"
      fill={pal.hair}
    />
    {/* jopo: sube desde la frente y se vuelca hacia adelante (lado de la mirada) */}
    <g transform={`rotate(${sway * 0.6},300,150)`}>
      <path
        d="M212,168 C200,118 222,78 264,64 C300,52 336,58 354,78 C330,74 304,80 286,92 C268,104 252,120 242,140 C232,152 224,162 220,176 Z"
        fill={pal.hair}
      />
      {variant === "B" ? (
        <g>
          <path d="M240,86 C258,70 286,62 318,62" stroke={pal.hairLight} strokeWidth={6} strokeLinecap="round" fill="none" />
          <path d="M226,126 C236,108 252,96 272,88" stroke={pal.hairLight} strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.7} />
          <path d="M286,92 C300,84 318,80 336,80" stroke={pal.hairShade} strokeWidth={4} strokeLinecap="round" fill="none" />
          <path d="M248,172 C262,160 280,156 298,158" stroke={pal.hairShade} strokeWidth={4} strokeLinecap="round" fill="none" />
        </g>
      ) : (
        <path d="M248,172 C262,160 280,156 298,158" stroke={pal.hairShade} strokeWidth={5} strokeLinecap="round" fill="none" />
      )}
    </g>
    {/* patilla corta */}
    <path d="M374,198 L385,202 L383,232 C379,235 375,233 373,229 Z" fill={pal.hair} />
  </g>
);

export const nico: Design = {
  id: "nico",
  name: "Nico",
  role: "Compañero de equipo",
  pal: {
    skin: "#FFC7A6",
    skinShade: "#F4A27C",
    skinLine: "#E08F68",
    hair: "#E0772F",
    hairShade: "#B85A1E",
    hairLight: "#F59A55",
    top: "#2E6BE6",
    topShade: "#2152B8",
    bottom: ink.line,
    bottomShade: "#1A2327",
  },
  build: { jaw: "square", shoulderSpread: 22, neckWidth: 86, armScale: 1.05, neckline: "crew" },
  HairBack: NicoBack,
  HairFront: NicoFront,
  browWeight: 1.15,
};
