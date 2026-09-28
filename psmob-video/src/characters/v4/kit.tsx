import React from "react";

// Kit de ilustración editorial: tubos orgánicos (brazos con curva), manos simplificadas
// y grano. Todo sin contornos: las piezas del mismo color se superponen sin costura.

export type P = [number, number];

const catmull = (pts: P[], samples: number): P[] => {
  const out: P[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    for (let s = 0; s < samples; s++) {
      const t = s / samples;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};

// Silueta de un miembro que sigue una línea curva, con ancho variable y puntas redondas.
export const tube = (pts: P[], widths: number[]) => {
  const c = catmull(pts, 10);
  const n = c.length;
  const wAt = (i: number) => {
    const t = (i / (n - 1)) * (widths.length - 1);
    const a = Math.floor(t);
    const b = Math.min(widths.length - 1, a + 1);
    return widths[a] + (widths[b] - widths[a]) * (t - a);
  };
  const L: P[] = [];
  const R: P[] = [];
  for (let i = 0; i < n; i++) {
    const p = c[i];
    const q = c[Math.min(n - 1, i + 1)];
    const o = c[Math.max(0, i - 1)];
    const dx = q[0] - o[0];
    const dy = q[1] - o[1];
    const l = Math.hypot(dx, dy) || 1;
    const nx = -dy / l;
    const ny = dx / l;
    const w = wAt(i) / 2;
    L.push([p[0] + nx * w, p[1] + ny * w]);
    R.push([p[0] - nx * w, p[1] - ny * w]);
  }
  const f = (v: number) => v.toFixed(1);
  const we = wAt(n - 1) / 2;
  const ws = wAt(0) / 2;
  let d = `M${f(L[0][0])},${f(L[0][1])}`;
  for (let i = 1; i < n; i++) d += ` L${f(L[i][0])},${f(L[i][1])}`;
  d += ` A${f(we)},${f(we)} 0 0 0 ${f(R[n - 1][0])},${f(R[n - 1][1])}`;
  for (let i = n - 2; i >= 0; i--) d += ` L${f(R[i][0])},${f(R[i][1])}`;
  d += ` A${f(ws)},${f(ws)} 0 0 0 ${f(L[0][0])},${f(L[0][1])} Z`;
  return d;
};

// Manga de tela: extremo del hombro plano (queda escondido en el torso) y ruedo curvo.
export const sleevePath = (a: P, b: P, wa: number, wb: number, hemBulge = 8) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l = Math.hypot(dx, dy) || 1;
  const u = [dx / l, dy / l];
  const n = [-u[1], u[0]];
  const A = [a[0] - u[0] * 10, a[1] - u[1] * 10];
  const p1 = [A[0] + n[0] * wa / 2, A[1] + n[1] * wa / 2];
  const p2 = [b[0] + n[0] * wb / 2, b[1] + n[1] * wb / 2];
  const p3 = [b[0] - n[0] * wb / 2, b[1] - n[1] * wb / 2];
  const p4 = [A[0] - n[0] * wa / 2, A[1] - n[1] * wa / 2];
  const m = [b[0] + u[0] * hemBulge, b[1] + u[1] * hemBulge];
  const c = [(p1[0] + p2[0]) / 2 + n[0] * 4, (p1[1] + p2[1]) / 2 + n[1] * 4];
  const c2 = [(p3[0] + p4[0]) / 2 - n[0] * 4, (p3[1] + p4[1]) / 2 - n[1] * 4];
  const f = (v: number) => v.toFixed(1);
  return `M${f(p1[0])},${f(p1[1])} Q${f(c[0])},${f(c[1])} ${f(p2[0])},${f(p2[1])} Q${f(m[0] + n[0] * 0)},${f(m[1])} ${f(p3[0])},${f(p3[1])} Q${f(c2[0])},${f(c2[1])} ${f(p4[0])},${f(p4[1])} Z`;
};

export const dirDeg = (a: P, b: P) => (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;

export type SkinT = { base: string; shade: string; deep: string; blush: string };

export type HandKind = "relaxed" | "grab" | "point" | "palmUp" | "hold";

// Manos editoriales: forma de mitón con pulgar, un corte de dedos y volumen en sombra.
// Local: muñeca en (0,0), la mano crece hacia +y. `flip` espeja el pulgar.
export const Hand: React.FC<{ kind: HandKind; at: P; angle: number; s: SkinT; flip?: boolean; scale?: number }> = ({
  kind,
  at,
  angle,
  s,
  flip = false,
  scale = 1.15,
}) => (
  <g transform={`translate(${at[0]},${at[1]}) rotate(${angle - 90}) scale(${flip ? -scale : scale},${scale})`}>
    {kind === "relaxed" && (
      <>
        <path d="M-14,-4 C-17,16 -17,38 -11,54 C-7,66 8,68 13,58 C18,46 18,20 14,-4 Z" fill={s.base} />
        <path d="M6,-4 C14,20 14,44 8,64 C12,62 13,58 13,58 C18,46 18,20 14,-4 Z" fill={s.shade} />
        <path d="M-13,12 C-24,22 -26,36 -19,42 C-15,44 -11,38 -9,28 Z" fill={s.base} />
        <path d="M2,36 L4,58" stroke={s.deep} strokeWidth={2.4} strokeLinecap="round" />
      </>
    )}
    {kind === "grab" && (
      <>
        <path d="M-18,-4 C-22,16 -22,34 -16,44 L18,44 C22,32 22,14 16,-4 Z" fill={s.base} />
        {[-12, -3, 6, 15].map((x, i) => (
          <line key={x} x1={x} y1={40} x2={x + (i - 1.5) * 2} y2={i === 0 || i === 3 ? 70 : 78} stroke={s.base} strokeWidth={10.5} strokeLinecap="round" />
        ))}
        <line x1={-16} y1={10} x2={-30} y2={32} stroke={s.base} strokeWidth={12} strokeLinecap="round" />
        <path d="M8,-4 C16,14 18,30 16,44 L18,44 C22,32 22,14 16,-4 Z" fill={s.shade} />
      </>
    )}
    {kind === "point" && (
      <>
        <path d="M-15,-4 C-18,14 -18,30 -12,40 C-4,48 10,48 14,38 C18,26 17,10 14,-4 Z" fill={s.base} />
        <line x1={6} y1={34} x2={10} y2={80} stroke={s.base} strokeWidth={11} strokeLinecap="round" />
        <path d="M-10,30 Q0,38 12,30" stroke={s.deep} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        <line x1={-12} y1={12} x2={-4} y2={32} stroke={s.shade} strokeWidth={12} strokeLinecap="round" />
      </>
    )}
    {kind === "palmUp" && (
      <>
        <path d="M-15,-4 C-18,16 -17,36 -10,52 C-4,62 10,62 14,52 C18,38 18,18 14,-4 Z" fill={s.base} />
        <path d="M-8,10 C-2,24 2,38 2,50" stroke={s.shade} strokeWidth={8} strokeLinecap="round" fill="none" />
        <path d="M14,6 C26,14 30,28 26,36 C22,40 16,34 14,26 Z" fill={s.base} />
      </>
    )}
    {kind === "hold" && (
      <>
        <path d="M-16,-4 C-20,14 -20,30 -14,40 C-6,48 10,48 16,38 C20,26 19,10 16,-4 Z" fill={s.base} />
        <path d="M-12,22 Q2,28 16,22 M-13,32 Q0,38 14,32" stroke={s.deep} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        <path d="M8,-4 C16,12 18,26 16,38 C20,26 19,10 16,-4 Z" fill={s.shade} />
      </>
    )}
  </g>
);

export const Phone: React.FC<{ c: P; rot: number; w?: number; h?: number }> = ({ c, rot, w = 64, h = 120 }) => (
  <g transform={`translate(${c[0]},${c[1]}) rotate(${rot})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill="#232A63" />
    <rect x={-w / 2 + 4} y={-h / 2 + 4} width={w - 8} height={h - 8} rx={9} fill="#2E3A85" />
    <rect x={-w / 2 + 4} y={-h / 2 + 4} width={8} height={h - 8} rx={4} fill="#4452A8" opacity={0.6} />
    <circle cx={w / 2 - 14} cy={-h / 2 + 14} r={4} fill="#1A2050" />
  </g>
);

// Grano editorial sutil, solo dentro de la silueta del personaje.
export const Grain: React.FC<{ id: string }> = ({ id }) => (
  <filter id={id} x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="n" />
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.09 0" result="g" />
    <feComposite in="g" in2="SourceGraphic" operator="in" result="gi" />
    <feMerge>
      <feMergeNode in="SourceGraphic" />
      <feMergeNode in="gi" />
    </feMerge>
  </filter>
);

// ───────── Rostro editorial 3/4 a la derecha ─────────

export type Face = {
  mouth: "soft" | "open" | "worried" | "stress" | "o";
  lookX?: number;
  lookY?: number;
  brow?: number; // − preocupación
  browLift?: number;
  eyes?: "open" | "happy";
  blush?: number;
  blink?: number;
};

export const FaceFeatures: React.FC<{
  f: Face;
  s: SkinT;
  eye: string;
  brow: string;
  browW: number;
  eyes: [P, P];
}> = ({ f, s, eye, brow, browW, eyes }) => {
  const lx = (f.lookX ?? 0) * 3;
  const ly = (f.lookY ?? 0) * 3;
  const b = f.blink ?? 0;
  const bd = f.brow ?? 0;
  const bl = f.browLift ?? 0;
  const E = (c: P, rx: number) =>
    f.eyes === "happy" || b > 0.85 ? (
      <path
        d={f.eyes === "happy" ? `M${c[0] - 9},${c[1] + 3} Q${c[0]},${c[1] - 8} ${c[0] + 9},${c[1] + 3}` : `M${c[0] - 8},${c[1]} Q${c[0]},${c[1] + 5} ${c[0] + 8},${c[1]}`}
        stroke={eye}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
      />
    ) : (
      <g>
        <ellipse cx={c[0] + lx} cy={c[1] + ly} rx={rx} ry={9.5 * (1 - b * 0.9)} fill={eye} />
        <circle cx={c[0] + lx + 2.4} cy={c[1] + ly - 3.4} r={2.3} fill="#FFFFFF" />
      </g>
    );
  const [ne, fe] = eyes;
  return (
    <g>
      <ellipse cx={ne[0] - 4} cy={ne[1] + 32} rx={16} ry={8} fill={s.blush} opacity={0.38 + (f.blush ?? 0) * 0.3} />
      <ellipse cx={fe[0] + 14} cy={fe[1] + 32} rx={8} ry={6} fill={s.blush} opacity={0.32 + (f.blush ?? 0) * 0.3} />
      {E(ne, 7)}
      {E(fe, 6.3)}
      <path
        d={`M${ne[0] - 12},${ne[1] - 20 - bl - bd * 0.3} Q${ne[0]},${ne[1] - 27 - bl} ${ne[0] + 12},${ne[1] - 22 - bl + bd}`}
        stroke={brow}
        strokeWidth={browW}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M${fe[0] - 10},${fe[1] - 22 - bl + bd} Q${fe[0]},${fe[1] - 27 - bl} ${fe[0] + 10},${fe[1] - 20 - bl - bd * 0.3}`}
        stroke={brow}
        strokeWidth={browW}
        strokeLinecap="round"
        fill="none"
      />
      {/* nariz: volumen del lado lejano */}
      <path d={`M${fe[0] + 14},${fe[1] + 8} C${fe[0] + 20},${fe[1] + 20} ${fe[0] + 24},${fe[1] + 30} ${fe[0] + 22},${fe[1] + 36} C${fe[0] + 16},${fe[1] + 40} ${fe[0] + 8},${fe[1] + 38} ${fe[0] + 4},${fe[1] + 34} C${fe[0] + 12},${fe[1] + 30} ${fe[0] + 16},${fe[1] + 22} ${fe[0] + 14},${fe[1] + 8} Z`} fill={s.shade} />
      <g transform={`translate(${(ne[0] + fe[0]) / 2 + 4},${ne[1] + 58})`}>
        {f.mouth === "soft" && <path d="M-15,-2 Q0,11 15,-4" stroke="#B04A55" strokeWidth={4} strokeLinecap="round" fill="none" />}
        {f.mouth === "open" && (
          <g>
            <path d="M-19,-6 Q0,24 19,-8 Q0,0 -19,-6 Z" fill="#8C2D3A" />
            <path d="M-15,-5 Q0,1 15,-7 L14,-2 Q0,6 -14,0 Z" fill="#FFFFFF" />
            <path d="M-8,10 Q0,15 8,9 Q0,6 -8,10 Z" fill="#E4676E" />
          </g>
        )}
        {f.mouth === "worried" && <path d="M-12,4 Q0,-4 13,3" stroke="#B04A55" strokeWidth={4} strokeLinecap="round" fill="none" />}
        {f.mouth === "stress" && (
          <g>
            <path d="M-15,-2 Q0,-10 15,-2 Q16,12 6,15 Q-6,17 -13,10 Q-17,4 -15,-2 Z" fill="#8C2D3A" />
            <path d="M-13,-1 Q0,-8 13,-1 L12,4 Q0,-1 -12,5 Z" fill="#FFFFFF" />
          </g>
        )}
        {f.mouth === "o" && <ellipse cx={0} cy={4} rx={8} ry={10} fill="#8C2D3A" />}
      </g>
    </g>
  );
};
