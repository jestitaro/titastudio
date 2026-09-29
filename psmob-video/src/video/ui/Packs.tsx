import React from "react";

// Envases genéricos dibujados (sin marcas ni textos), con volumen suave para convivir con los PNG 3D.
// Todos se dibujan con la base en y = h (apoyados en el estante).

const shade = (id: string, c: string) => (
  <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
    <stop offset="0" stopColor={c} stopOpacity={0.75} />
    <stop offset="0.35" stopColor={c} />
    <stop offset="0.7" stopColor={c} />
    <stop offset="1" stopColor="#000" stopOpacity={0.12} />
  </linearGradient>
);

export const Jar: React.FC<{ w: number; h: number; body: string; lid: string; id: string }> = ({ w, h, body, lid, id }) => (
  <svg width={w} height={h} viewBox="0 0 100 130">
    <defs>{shade(`${id}b`, body)}</defs>
    <rect x="16" y="6" width="68" height="22" rx="5" fill={lid} />
    <rect x="16" y="22" width="68" height="6" fill="#000" opacity={0.08} />
    <path d="M12 38 Q12 28 24 28 H76 Q88 28 88 38 V118 Q88 128 76 128 H24 Q12 128 12 118Z" fill={`url(#${id}b)`} />
    <rect x="12" y="62" width="76" height="40" fill="#FFFDF7" opacity={0.9} />
    <rect x="22" y="36" width="8" height="84" rx="4" fill="#fff" opacity={0.35} />
  </svg>
);

export const Doypack: React.FC<{ w: number; h: number; body: string; id: string; cap?: string }> = ({ w, h, body, id, cap = "#fff" }) => (
  <svg width={w} height={h} viewBox="0 0 100 150">
    <defs>{shade(`${id}b`, body)}</defs>
    <path d="M14 20 Q50 12 86 20 L90 132 Q90 146 76 146 H24 Q10 146 10 132Z" fill={`url(#${id}b)`} />
    <rect x="62" y="6" width="16" height="16" rx="3" fill={cap} />
    <path d="M18 60 Q50 52 82 60 V104 Q50 112 18 104Z" fill="#FFFDF7" opacity={0.85} />
    <path d="M10 132 Q50 122 90 132" stroke="#000" strokeOpacity={0.1} strokeWidth={3} fill="none" />
    <rect x="22" y="26" width="7" height="100" rx="3.5" fill="#fff" opacity={0.3} />
  </svg>
);

export const Squeeze: React.FC<{ w: number; h: number; body: string; cap: string; id: string }> = ({ w, h, body, cap, id }) => (
  <svg width={w} height={h} viewBox="0 0 70 160">
    <defs>{shade(`${id}b`, body)}</defs>
    <path d="M26 4 H44 L46 18 H24Z" fill={cap} />
    <path d="M16 30 Q16 18 35 18 Q54 18 54 30 L58 120 Q60 150 35 152 Q10 150 12 120Z" fill={`url(#${id}b)`} />
    <ellipse cx="35" cy="84" rx="18" ry="26" fill="#FFFDF7" opacity={0.85} />
    <rect x="21" y="30" width="6" height="100" rx="3" fill="#fff" opacity={0.3} />
    <rect x="18" y="150" width="34" height="8" rx="3" fill={cap} />
  </svg>
);

export const Box: React.FC<{ w: number; h: number; body: string; band: string; id: string }> = ({ w, h, body, band, id }) => (
  <svg width={w} height={h} viewBox="0 0 110 150">
    <defs>{shade(`${id}b`, body)}</defs>
    <path d="M86 8 L104 16 V146 L86 146Z" fill={body} />
    <path d="M86 8 L104 16 V146 L86 146Z" fill="#000" opacity={0.18} />
    <rect x="6" y="8" width="80" height="138" rx="3" fill={`url(#${id}b)`} />
    <rect x="6" y="46" width="80" height="44" fill={band} opacity={0.9} />
    <circle cx="46" cy="118" r="14" fill="#fff" opacity={0.6} />
  </svg>
);

export const Bag: React.FC<{ w: number; h: number; body: string; id: string }> = ({ w, h, body, id }) => (
  <svg width={w} height={h} viewBox="0 0 110 130">
    <defs>{shade(`${id}b`, body)}</defs>
    <path d="M10 18 H100 L96 116 Q96 126 86 126 H24 Q14 126 14 116Z" fill={`url(#${id}b)`} />
    <path d="M10 10 H100 V20 H10Z" fill={body} />
    {Array.from({ length: 12 }).map((_, i) => (
      <line key={i} x1={14 + i * 7.5} y1={10} x2={14 + i * 7.5} y2={20} stroke="#000" strokeOpacity={0.12} strokeWidth={2} />
    ))}
    <rect x="26" y="48" width="58" height="42" rx="6" fill="#FFFDF7" opacity={0.85} />
  </svg>
);
