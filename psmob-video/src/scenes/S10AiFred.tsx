import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { neutralFace } from "../characters/parts";
import { Repositor, repoWrist } from "../characters/Repositor";
import { color } from "../design/psmob-tokens";
import { roboto } from "../design/fonts";
import { es } from "../i18n/es";
import { easeInOut, easeOut, osc, pop, range } from "../lib/motion";
import { aisle, BackAisle, Gondola, PRODUCT_SIZE, ProductKind, SHELF_Y, Slot } from "../props/Gondola";
import { OfflineBadge, RecognitionCard, Sparkle } from "../ui/RecognitionCard";
import { Subtitle } from "../ui/Subtitle";

// 10 · AiFred en la góndola — prueba breve (5 s de los 8 s de la escena).
export const S10_TEST_DURATION = 150;

const GONDOLA_X = 640;
const GONDOLA_W = 2300;
const PERSP = 1500;
const ANGLE = 34;

// Proyección de un punto de la góndola (rotada en Y, origen en su borde izquierdo a media altura).
const project = (x0: number, x: number, y: number) => {
  const a = (ANGLE * Math.PI) / 180;
  const k = PERSP / (PERSP + x * Math.sin(a));
  return { x: x0 + x * Math.cos(a) * k, y: 540 + (y - 540) * k };
};

// Planograma: patrón por estante, con un faltante y precios cada 2 productos.
const buildSlots = (): Slot[] => {
  const plan: { kind: ProductKind; gap: number }[][] = [
    [{ kind: "powder", gap: 124 }],
    [{ kind: "wash", gap: 104 }],
    [
      { kind: "ketchup", gap: 80 },
      { kind: "mayo", gap: 88 },
    ],
    [{ kind: "powder", gap: 124 }],
  ];
  const prices: Record<ProductKind, string> = {
    wash: es.s10.products[0].price,
    powder: es.s10.products[1].price,
    ketchup: es.s10.products[2].price,
    mayo: "$1.870,00",
  };
  const slots: Slot[] = [];
  plan.forEach((row, shelf) => {
    let x = 70;
    let i = 0;
    while (x < GONDOLA_W - 70) {
      const p = row[i % row.length];
      const missing = shelf === 2 && i >= 11 && i <= 12;
      slots.push({ kind: missing ? null : p.kind, x, shelf, price: i % 2 === 0 ? prices[p.kind] : undefined });
      x += p.gap;
      i++;
    }
  });
  return slots;
};
const SLOTS = buildSlots();

const nameOf: Partial<Record<ProductKind, string>> = {
  wash: es.s10.products[0].name,
  powder: es.s10.products[1].name,
  ketchup: es.s10.products[2].name,
};

export const S10AiFred: React.FC<{ showSubtitles?: boolean }> = ({ showSubtitles = true }) => {
  const frame = useCurrentFrame();
  const copy = es.s10;

  // Travelling lateral: cada plano se desplaza según su profundidad.
  const truck = range(frame, [0, S10_TEST_DURATION], [0, -300], easeInOut);
  const far = truck * 0.35;
  const mid = truck;
  const fore = truck * 1.9;

  // El repositor avanza despacio con la cámara (paso implícito con bob).
  const walk = range(frame, [0, S10_TEST_DURATION], [0, 120], easeInOut);
  const bob = Math.abs(osc(frame, 36, 6));
  const repoLeft = 120 + walk;
  const repoTop = 110 + bob;
  const K = 760 / 800;

  // Brazo: levanta el celular y paneo suave acompañando el barrido.
  const raise = pop(frame, 2, { damping: 14, stiffness: 120 });
  const arm = {
    upper: interpolate(raise, [0, 1], [95, 28]) + osc(frame, 50, 1.5),
    fore: interpolate(raise, [0, 1], [95, -48]) + range(frame, [18, 96], [-6, 8]) + osc(frame, 40, 1.2),
  };
  const { wrist } = repoWrist(arm);
  const phone = { x: repoLeft + (wrist.x + 26) * K + mid, y: repoTop + (wrist.y - 58) * K };

  // Barrido de reconocimiento en coordenadas de góndola.
  const sweep = range(frame, [18, 96], [120, 1900], easeInOut);
  const sweepTop = project(GONDOLA_X + mid, sweep, 140);
  const sweepBot = project(GONDOLA_X + mid, sweep, 810);
  const beamOn = range(frame, [12, 22], [0, 1]) * range(frame, [96, 108], [1, 0]);

  const face = {
    ...neutralFace,
    lookX: 1,
    lookY: 0.5,
    browL: frame > 100 ? -6 : 2,
    browR: frame > 100 ? -6 : 2,
    browLift: frame > 100 ? 4 : 0,
    mouth: frame > 100 ? ("grin" as const) : ("smile" as const),
  };

  const cardP = pop(frame, 64, { damping: 13, stiffness: 120 });
  const cardFinal = { x: 1400, y: 170 };
  const cardX = interpolate(cardP, [0, 1], [phone.x, cardFinal.x]);
  const cardY = interpolate(cardP, [0, 1], [phone.y, cardFinal.y]);
  const badgeP = pop(frame, 106);

  return (
    <AbsoluteFill style={{ background: aisle.wall, overflow: "hidden" }}>
      {/* Plano lejano */}
      <AbsoluteFill style={{ transform: `translateX(${far}px)`, width: 2400 }}>
        <BackAisle />
      </AbsoluteFill>

      {/* Plano medio: góndola + repositor */}
      <div
        style={{
          position: "absolute",
          left: GONDOLA_X + mid,
          top: 0,
          width: GONDOLA_W,
          height: 1080,
          transform: `perspective(${PERSP}px) rotateY(${ANGLE}deg)`,
          transformOrigin: "0 540px",
        }}
      >
      <svg viewBox={`0 0 ${GONDOLA_W} 1080`} width={GONDOLA_W} height={1080} style={{ position: "absolute", overflow: "visible" }}>
        <g>
          <Gondola slots={SLOTS} width={GONDOLA_W} />
          {/* Detecciones: aparecen cuando pasa el barrido */}
          {SLOTS.map((s, i) => {
            if (s.shelf > 2 || s.x > 1920) return null;
            const passed = sweep - s.x;
            if (passed < 0) return null;
            const p = pop(frame, frame - passed / 22);
            const y = SHELF_Y[s.shelf];
            if (!s.kind) {
              return (
                <g key={i} opacity={Math.min(1, p * 1.4)}>
                  <rect x={s.x - 40} y={y - 150} width={80} height={146} rx={8} fill="rgba(244,67,54,0.12)" stroke={color.danger} strokeWidth={4} strokeDasharray="12 8" />
                  <g transform={`translate(${s.x + 44},${y - 170}) scale(${p})`} opacity={SLOTS[i - 1]?.kind ? 1 : 0}>
                    <rect x={-58} y={-18} width={116} height={32} rx={16} fill={color.danger} />
                    <text x={0} y={5} textAnchor="middle" fontFamily={roboto} fontWeight={600} fontSize={17} fill="#FFFFFF">
                      {copy.outOfStock}
                    </text>
                  </g>
                </g>
              );
            }
            const { w, h } = PRODUCT_SIZE[s.kind];
            const pad = 8 + (1 - p) * 20;
            const bx = s.x - w / 2 - pad;
            const by = y - h - pad;
            const bw = w + pad * 2;
            const bh = h + pad * 2;
            const c = 16;
            const showLabel = s.shelf === 1 && [0, 5].includes(Math.round(s.x / 104)) ? nameOf[s.kind] : s.shelf === 0 && i === 2 ? nameOf[s.kind] : null;
            return (
              <g key={i} opacity={Math.min(1, p * 1.6)}>
                <rect x={bx} y={by} width={bw} height={bh} rx={6} fill="rgba(33,150,243,0.10)" />
                <path
                  d={`M${bx},${by + c} V${by} H${bx + c} M${bx + bw - c},${by} H${bx + bw} V${by + c} M${bx + bw},${by + bh - c} V${by + bh} H${bx + bw - c} M${bx + c},${by + bh} H${bx} V${by + bh - c}`}
                  stroke={color.primary}
                  strokeWidth={4}
                  fill="none"
                  strokeLinecap="round"
                />
                {showLabel && (
                  <g transform={`translate(${s.x},${by - 18}) scale(${p})`}>
                    <rect x={-70} y={-16} width={140} height={28} rx={14} fill={color.primaryDark} />
                    <text x={0} y={4} textAnchor="middle" fontFamily={roboto} fontWeight={500} fontSize={14} fill="#FFFFFF">
                      {nameOf[s.kind]}
                    </text>
                  </g>
                )}
                {s.price && s.shelf > 0 && (
                  <g transform={`translate(${s.x + 40},${y + 34}) scale(${p})`}>
                    <circle r={12} fill={color.successDark} />
                    <path d="M-5,0 l3.5,3.5 l6.5,-7" stroke="#FFFFFF" strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>
      </div>

      <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", overflow: "visible" }}>
        {/* Haz del celular hacia la línea de barrido */}
        <defs>
          <linearGradient id="beam" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#3C9FF1" stopOpacity={0.55} />
            <stop offset="1" stopColor="#3C9FF1" stopOpacity={0.08} />
          </linearGradient>
        </defs>
        <g opacity={beamOn}>
          <path d={`M${phone.x},${phone.y - 18} L${sweepTop.x},${sweepTop.y} L${sweepBot.x},${sweepBot.y} L${phone.x},${phone.y + 18} Z`} fill="url(#beam)" />
          <line x1={sweepTop.x} y1={sweepTop.y} x2={sweepBot.x} y2={sweepBot.y} stroke="#3C9FF1" strokeWidth={22} strokeLinecap="round" opacity={0.35} />
          <line x1={sweepTop.x} y1={sweepTop.y} x2={sweepBot.x} y2={sweepBot.y} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />
        </g>
      </svg>

      <div style={{ position: "absolute", left: repoLeft + mid, top: repoTop, width: 760, height: 950 }}>
        <Repositor face={face} arm={arm} phoneGlow={beamOn} />
      </div>

      {/* Plano cercano: columna de góndola que cruza rápido */}
      <div
        style={{
          position: "absolute",
          left: 60 + fore,
          top: -40,
          width: 150,
          height: 1160,
          background: `linear-gradient(90deg, ${aisle.shelfEdge}, ${aisle.shelf})`,
          borderRadius: 16,
          boxShadow: "0 0 60px rgba(40,20,120,0.35)",
        }}
      />

      {/* UI PSMob */}
      {frame >= 64 && (
        <div
          style={{
            position: "absolute",
            left: cardX,
            top: cardY,
            transform: `scale(${interpolate(cardP, [0, 1], [0.15, 1])}) translateY(${osc(frame, 70, 4)}px)`,
            transformOrigin: "0 0",
            opacity: Math.min(1, cardP * 2),
          }}
        >
          <RecognitionCard
            start={64}
            total={24}
            items={[
              { ...copy.products[0], kind: "wash" },
              { ...copy.products[1], kind: "powder" },
              { ...copy.products[2], kind: "ketchup" },
            ]}
            labels={{
              assistant: copy.assistant,
              role: copy.assistantRole,
              scanning: copy.scanning,
              detected: copy.detected,
              priceOk: copy.priceOk,
            }}
          />
        </div>
      )}
      {frame >= 106 && (
        <div
          style={{
            position: "absolute",
            left: 1400,
            top: 84,
            transform: `translateY(${(1 - badgeP) * -30}px) scale(${interpolate(badgeP, [0, 1], [0.6, 1])})`,
            transformOrigin: "0 50%",
            opacity: Math.min(1, badgeP * 2),
          }}
        >
          <OfflineBadge label={copy.offline} slash={range(frame, [112, 126], [0, 1], easeOut)} />
        </div>
      )}

      {/* Destello de la IA sobre el celular al terminar el barrido */}
      {frame > 90 && frame < 120 && (
        <div
          style={{
            position: "absolute",
            left: phone.x - 30,
            top: phone.y - 90,
            transform: `scale(${range(frame, [90, 102], [0.2, 1.1], easeOut)}) rotate(${frame * 3}deg)`,
            opacity: range(frame, [104, 120], [1, 0], easeInOut),
          }}
        >
          <Sparkle size={60} tint={color.accent} />
        </div>
      )}

      {showSubtitles && <Subtitle text={es.vo.s10} />}
    </AbsoluteFill>
  );
};
