(() => {
const LA = (window.LA = window.LA || {});
// Kit de dibujo line-art: cada pieza = máscara blanca + relleno de color desplazado + línea.
// Todo se genera como string SVG; las animaciones se registran después en scenes.js.

const PAL = {
  ink: "#1E2257",
  caroHair: "#3B3FC2",
  caroTop: "#8B57DF",
  skin: "#FFC7A6",
  skinN: "#FFC4A1",
  blush: "#FF9C8E",
  nicoHair: "#E07A3E",
  nicoShirt: "#2F66E4",
  tee: "#FFFFFF",
  phone: "#2E3A85",
  laptop: "#C9CCE0",
  desk: "#E7E2F3",
  gold: "#F2B544",
};

const OFF = [7, 6];

// Pieza completa. `line:false` deja solo relleno; `mask:false` deja ver lo de atrás.
const part = (d, color, { mask = true, line = true, off = OFF, id = "" } = {}) =>
  `<g${id ? ` id="${id}"` : ""}>` +
  (mask ? `<path class="mk" d="${d}"/>` : "") +
  (color ? `<path class="fl" d="${d}" fill="${color}" transform="translate(${off[0]},${off[1]})"/>` : "") +
  (line ? `<path class="ln" d="${d}" pathLength="1"/>` : "") +
  `</g>`;

const line = (d, w) => `<path class="ln" d="${d}" pathLength="1"${w ? ` style="stroke-width:${w}px"` : ""}/>`;

const dot = (x, y, r) => `<circle class="dot" cx="${x}" cy="${y}" r="${r}"/>`;

const blob = (x, y, r, color, op = 0.55) => `<circle class="fl" cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${op}"/>`;

// Grupo con pivote: el hijo con `id` rota/escala alrededor de (px,py).
const pivot = (id, px, py, inner, cls = "") =>
  `<g transform="translate(${px},${py})"><g id="${id}" class="${cls}"><g transform="translate(${-px},${-py})">${inner}</g></g></g>`;

// ───── geometría ─────

const catmull = (pts, samples) => {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    for (let s = 0; s < samples; s++) {
      const t = s / samples;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};

const f1 = (v) => v.toFixed(1);

// Brazo orgánico: silueta a lo largo de una curva con ancho variable.
const tube = (pts, widths) => {
  const c = catmull(pts, 8);
  const n = c.length;
  const wAt = (i) => {
    const t = (i / (n - 1)) * (widths.length - 1);
    const a = Math.floor(t);
    const b = Math.min(widths.length - 1, a + 1);
    return widths[a] + (widths[b] - widths[a]) * (t - a);
  };
  const L = [];
  const R = [];
  for (let i = 0; i < n; i++) {
    const q = c[Math.min(n - 1, i + 1)];
    const o = c[Math.max(0, i - 1)];
    const dx = q[0] - o[0];
    const dy = q[1] - o[1];
    const l = Math.hypot(dx, dy) || 1;
    const nx = -dy / l;
    const ny = dx / l;
    const w = wAt(i) / 2;
    L.push([c[i][0] + nx * w, c[i][1] + ny * w]);
    R.push([c[i][0] - nx * w, c[i][1] - ny * w]);
  }
  const we = wAt(n - 1) / 2;
  const ws = wAt(0) / 2;
  let d = `M${f1(L[0][0])},${f1(L[0][1])}`;
  for (let i = 1; i < n; i++) d += ` L${f1(L[i][0])},${f1(L[i][1])}`;
  d += ` A${f1(we)},${f1(we)} 0 0 0 ${f1(R[n - 1][0])},${f1(R[n - 1][1])}`;
  for (let i = n - 2; i >= 0; i--) d += ` L${f1(R[i][0])},${f1(R[i][1])}`;
  d += ` A${f1(ws)},${f1(ws)} 0 0 0 ${f1(L[0][0])},${f1(L[0][1])} Z`;
  return d;
};

// Manga de tela: arranque plano escondido en el torso y ruedo curvo.
const sleeve = (a, b, wa, wb) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l = Math.hypot(dx, dy) || 1;
  const u = [dx / l, dy / l];
  const n = [-u[1], u[0]];
  const A = [a[0] - u[0] * 12, a[1] - u[1] * 12];
  const p1 = [A[0] + (n[0] * wa) / 2, A[1] + (n[1] * wa) / 2];
  const p2 = [b[0] + (n[0] * wb) / 2, b[1] + (n[1] * wb) / 2];
  const p3 = [b[0] - (n[0] * wb) / 2, b[1] - (n[1] * wb) / 2];
  const p4 = [A[0] - (n[0] * wa) / 2, A[1] - (n[1] * wa) / 2];
  const m = [b[0] + u[0] * 9, b[1] + u[1] * 9];
  const fill = `M${f1(p1[0])},${f1(p1[1])} L${f1(p2[0])},${f1(p2[1])} Q${f1(m[0])},${f1(m[1])} ${f1(p3[0])},${f1(p3[1])} L${f1(p4[0])},${f1(p4[1])} Z`;
  // contorno abierto: sin el borde del hombro, que queda dentro del torso
  const outline = `M${f1(p1[0] + u[0] * 14)},${f1(p1[1] + u[1] * 14)} L${f1(p2[0])},${f1(p2[1])} Q${f1(m[0])},${f1(m[1])} ${f1(p3[0])},${f1(p3[1])} L${f1(p4[0] + u[0] * 14)},${f1(p4[1] + u[1] * 14)}`;
  return { fill, outline };
};

const angle = (a, b) => (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;

// Manos: mitón con pulgar. Local: muñeca en 0,0, crecen hacia +y.
const HANDS = {
  relaxed: {
    body: "M-13,-2 C-17,16 -17,34 -11,46 C-5,56 8,56 12,46 C16,34 16,14 13,-2 Z",
    thumb: "M-12,10 C-23,18 -24,30 -16,35 C-12,37 -9,30 -8,24",
    lines: ["M2,34 L3,50"],
  },
  grip: {
    body: "M-16,-2 C-20,14 -20,30 -12,38 C-2,46 12,44 16,34 C20,22 18,8 14,-2 Z",
    thumb: "",
    lines: ["M-11,20 Q0,25 15,19", "M-10,30 Q0,35 13,29"],
  },
};

const hand = (kind, at, deg, skin, flip = false, s = 1) => {
  const h = HANDS[kind];
  return (
    `<g transform="translate(${f1(at[0])},${f1(at[1])}) rotate(${f1(deg - 90)}) scale(${flip ? -s : s},${s})">` +
    (h.thumb ? part(h.thumb + " Z", skin, { line: false }) : "") +
    part(h.body, skin) +
    (h.thumb ? line(h.thumb) : "") +
    h.lines.map((l) => line(l, 3)).join("") +
    `</g>`
  );
};

const phone = (w = 50, h = 92, screen = true) =>
  part(`M${-w / 2 + 10},${-h / 2} L${w / 2 - 10},${-h / 2} Q${w / 2},${-h / 2} ${w / 2},${-h / 2 + 10} L${w / 2},${h / 2 - 10} Q${w / 2},${h / 2} ${w / 2 - 10},${h / 2} L${-w / 2 + 10},${h / 2} Q${-w / 2},${h / 2} ${-w / 2},${h / 2 - 10} L${-w / 2},${-h / 2 + 10} Q${-w / 2},${-h / 2} ${-w / 2 + 10},${-h / 2} Z`, PAL.phone) +
  (screen ? line(`M${-w / 2 + 12},${-h / 2 + 18} L${w / 2 - 12},${-h / 2 + 18}`, 3) + line(`M-8,${h / 2 - 10} L8,${h / 2 - 10}`, 3) : "");

// Garabato con "boiling": 3 variantes del mismo trazo con jitter determinista.
const rng = (seed) => {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

const smoothPath = (pts) => {
  const c = catmull(pts, 6);
  return "M" + c.map((p) => `${f1(p[0])},${f1(p[1])}`).join(" L");
};

const doodle = (id, strokes, seed = 1, jitter = 2.6) => {
  const variants = [0, 1, 2].map((v) => {
    const r = rng(seed * 31 + v * 7919);
    const ds = strokes.map((pts) => smoothPath(pts.map(([x, y]) => [x + (r() - 0.5) * 2 * jitter, y + (r() - 0.5) * 2 * jitter])));
    return `<g class="boil boil-${v}">${ds.map((d) => `<path d="${d}"/>`).join("")}</g>`;
  });
  return `<g id="${id}" class="doodle fillbox">${variants.join("")}</g>`;
};

// Arco como lista de puntos (para garabatos de ondas / vibración / wifi).
const arcPts = (cx, cy, r, a0, a1, steps = 6) => {
  const out = [];
  for (let i = 0; i <= steps; i++) {
    const a = ((a0 + ((a1 - a0) * i) / steps) * Math.PI) / 180;
    out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return out;
};

Object.assign(LA, { PAL, part, line, dot, blob, pivot, tube, sleeve, angle, hand, phone, doodle, arcPts });
})();
