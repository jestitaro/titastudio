export type Pt = { x: number; y: number };

const f = (n: number) => n.toFixed(1);

export const add = (a: Pt, b: Pt): Pt => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a: Pt, b: Pt): Pt => ({ x: a.x - b.x, y: a.y - b.y });
export const mul = (a: Pt, k: number): Pt => ({ x: a.x * k, y: a.y * k });
export const lerp = (a: Pt, b: Pt, t: number): Pt => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
export const len = (a: Pt) => Math.hypot(a.x, a.y);
export const norm = (a: Pt): Pt => {
  const l = len(a) || 1;
  return { x: a.x / l, y: a.y / l };
};
// Normal a la izquierda del sentido de avance (y hacia abajo en SVG).
export const perp = (a: Pt): Pt => ({ x: -a.y, y: a.x });
export const angleDeg = (a: Pt) => (Math.atan2(a.y, a.x) * 180) / Math.PI;

// Curva suave (Catmull-Rom → Bézier) que pasa por todos los puntos.
export const smooth = (pts: Pt[], move = true) => {
  let d = move ? `M${f(pts[0].x)},${f(pts[0].y)}` : `L${f(pts[0].x)},${f(pts[0].y)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${f(c1.x)},${f(c1.y)} ${f(c2.x)},${f(c2.y)} ${f(p2.x)},${f(p2.y)}`;
  }
  return d;
};

// Silueta de brazo con perfil anatómico simplificado:
// deltoides → bíceps → codo angosto → antebrazo ancho arriba → muñeca fina.
export const armOutline = (S: Pt, E: Pt, W: Pt, scale = 1) => {
  const u = norm(sub(E, S));
  const v = norm(sub(W, E));
  const nu = perp(u);
  const nv = perp(v);
  const ne = norm(add(nu, nv));
  const w = (n: number) => (n * scale) / 2;
  const stations: { p: Pt; n: Pt; w: number }[] = [
    { p: S, n: nu, w: w(64) },
    { p: lerp(S, E, 0.3), n: nu, w: w(60) },
    { p: lerp(S, E, 0.7), n: nu, w: w(52) },
    { p: E, n: ne, w: w(44) },
    { p: lerp(E, W, 0.25), n: nv, w: w(50) },
    { p: lerp(E, W, 0.7), n: nv, w: w(40) },
    { p: W, n: nv, w: w(34) },
  ];
  const left = stations.map((s) => add(s.p, mul(s.n, s.w)));
  const right = stations.map((s) => add(s.p, mul(s.n, -s.w))).reverse();
  const rw = stations[stations.length - 1].w;
  const rs = stations[0].w;
  return `${smooth(left)} A${f(rw)},${f(rw)} 0 0 0 ${f(right[0].x)},${f(right[0].y)} ${smooth(right, false).replace(/^L[^C]*/, "")} A${f(rs)},${f(rs)} 0 0 1 ${f(left[0].x)},${f(left[0].y)} Z`;
};

// Manga corta que envuelve el tramo superior del brazo, con ruedo.
export const sleeveOutline = (S: Pt, E: Pt, reach: number, ease: number, scale = 1) => {
  const u = norm(sub(E, S));
  const n = perp(u);
  const start = add(S, mul(u, -4));
  const end = lerp(S, E, reach);
  const w0 = (35 + ease) * scale;
  const w1 = (31 + ease) * scale;
  const a = add(start, mul(n, w0));
  const b = add(end, mul(n, w1));
  const c = add(end, mul(n, -w1));
  const d = add(start, mul(n, -w0));
  const bulge = add(lerp(b, c, 0.5), mul(u, 6));
  return {
    shape: `M${f(a.x)},${f(a.y)} L${f(b.x)},${f(b.y)} Q${f(bulge.x)},${f(bulge.y)} ${f(c.x)},${f(c.y)} L${f(d.x)},${f(d.y)} Z`,
    hem: { from: b, to: c, mid: bulge },
    axis: u,
  };
};
