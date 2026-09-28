(() => {
const LA = (window.LA = window.LA || {});
const { arcPts, doodle, line, part, PAL, phone, pivot, caro, nico } = LA;

// Escenas 1080×1080 con Caro (izquierda) y Nico (derecha, espejado) frente a frente.
// Todo el movimiento es Web Animations API con duración múltiplo de 4000 ms:
// el loop cierra exacto y `seek(ms)` controla cada animación por tiempo.

const LOOP = 4000;
const INTRO = 1500;
const EASE = "cubic-bezier(.45,0,.55,1)";

const CARO_AT = "translate(318,470) scale(1.35)";
const NICO_AT = "translate(762,470) scale(-1.35,1.35)";

// ───────── armado de cada escena ─────────

const phoneAt = (id, x, y, rot, w, h, inner = "") =>
  pivot(id, x, y, `<g transform="translate(${x},${y}) rotate(${rot})">${phone(w, h)}${inner}</g>`);

const vibration = (id) =>
  `<g id="${id}">` +
  doodle(`${id}-l`, [arcPts(0, 0, 40, 150, 210, 5), arcPts(0, 0, 56, 145, 215, 5)], 3) +
  doodle(`${id}-r`, [arcPts(0, 0, 40, -30, 30, 5), arcPts(0, 0, 56, -35, 35, 5)], 5) +
  doodle(`${id}-s`, [[[-18, -70], [-26, -86]], [[0, -74], [0, -92]], [[18, -70], [26, -86]]], 9) +
  `</g>`;

const SCENES = {
  celular: {
    title: "Celular",
    desc: "El celular de Caro vibra en ráfagas; Nico se asoma a mirar.",
    build() {
      const cPhone = phoneAt("caro-phone", 58, 58, -10, 50, 92, vibration("caro-vib"));
      const c = caro({
        back: { pts: [[-100, 46], [-118, 160], [-108, 272]], hand: "relaxed", flipHand: true },
        front: { pts: [[102, 40], [124, 168], [74, 116]], hand: "grip", beforeHand: cPhone, w: [44, 38, 32] },
        mouth: "grin",
      });
      const n = nico({
        back: { pts: [[-104, 46], [-122, 160], [-112, 272]], hand: "relaxed", flipHand: true },
        front: { pts: [[106, 44], [118, 176], [70, 150]], hand: "grip", beforeHand: phoneAt("nico-phone", 52, 100, 12, 48, 88), w: [46, 40, 34] },
        mouth: "smile",
      });
      return `<g transform="${CARO_AT}">${c}</g><g transform="${NICO_AT}">${n}</g>`;
    },
  },
  laptop: {
    title: "Laptop",
    desc: "Nico festeja con un fist pump; Caro acompaña el rebote y el wifi pulsa.",
    build() {
      const c = caro({
        back: { pts: [[-100, 46], [-118, 160], [-108, 272]], hand: "relaxed", flipHand: true },
        front: { pts: [[102, 40], [128, 186], [196, 262]], hand: "relaxed", w: [44, 38, 32] },
        mouth: "grin",
        happy: true,
      });
      const n = nico({
        back: { pts: [[-104, 42], [-168, -34], [-136, -166]], hand: "grip", pivot: true, layer: "top", w: [46, 40, 36], reach: 0.55 },
        front: { pts: [[106, 44], [128, 184], [178, 256]], hand: "relaxed", w: [46, 40, 34] },
        mouth: "grin",
        happy: true,
      });
      const desk =
        part("M60,806 L1020,806 L1020,1120 L60,1120 Z", PAL.desk) + part("M40,790 L1040,790 L1040,812 L40,812 Z", "#D6CFEA");
      const laptop =
        part("M436,790 L644,790 L630,642 L450,642 Z", PAL.laptop) +
        part("M416,790 L664,790 L658,800 L422,800 Z", "#B4B8D2") +
        `<circle class="ln" cx="540" cy="716" r="11" pathLength="1"/>`;
      const wifi =
        `<g transform="translate(540,604)">` +
        doodle("wifi-0", [[[-4, 0], [0, 4], [4, 0], [0, -4], [-4, 0]]], 11, 1.5) +
        doodle("wifi-1", [arcPts(0, 8, 26, 220, 320, 5)], 13) +
        doodle("wifi-2", [arcPts(0, 8, 46, 222, 318, 6)], 17) +
        doodle("wifi-3", [arcPts(0, 8, 66, 224, 316, 7)], 19) +
        `</g>`;
      return `<g transform="${CARO_AT}">${c}</g><g transform="${NICO_AT}">${n}</g>${desk}${laptop}${wifi}`;
    },
  },
  llamada: {
    title: "Llamada",
    desc: "Suena el celular de Caro: tiembla, ella se inclina y salen ondas.",
    build() {
      const waves =
        `<g transform="translate(-72,-118)">` +
        [0, 1, 2]
          .map((i) => pivot(`caro-wave${i}`, 0, 0, doodle(`caro-wave${i}-d`, [arcPts(0, 0, 44 + i * 4, 150, 250, 6)], 23 + i)))
          .join("") +
        `</g>`;
      const c = caro({
        back: {
          pts: [[-100, 46], [-146, 96], [-150, 64], [-94, -54]],
          hand: "grip",
          beforeHand: phoneAt("caro-phone", -70, -118, -18, 42, 82, ""),
          extra: waves,
          layer: "top",
          w: [44, 40, 38, 32],
        },
        front: { pts: [[102, 40], [120, 160], [112, 272]], hand: "relaxed" },
        mouth: "o",
      });
      const n = nico({
        back: {
          pts: [[-104, 46], [-150, 98], [-154, 66], [-98, -52]],
          hand: "grip",
          beforeHand: phoneAt("nico-phone", -74, -116, -18, 44, 84, ""),
          layer: "top",
          w: [46, 42, 40, 34],
        },
        front: { pts: [[106, 44], [122, 166], [114, 276]], hand: "relaxed" },
        mouth: "talk",
      });
      return `<g transform="${CARO_AT}">${c}</g><g transform="${NICO_AT}">${n}</g>`;
    },
  },
};

const SCENE_NAMES = Object.keys(SCENES);
const sceneInfo = (name) => ({ title: SCENES[name].title, desc: SCENES[name].desc });

const sceneSVG = (name, sid) => {
  const body = SCENES[name].build().replace(/id="/g, `id="${sid}-`);
  return `<svg class="scene" viewBox="0 0 1080 1080" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
};

// ───────── animaciones ─────────

const kf = (pairs, prop, fmt) => pairs.map(([o, v]) => ({ offset: o, [prop]: fmt(v), easing: EASE }));

const registerScene = (root, name, sid, { intro = false } = {}) => {
  const q = (id) => root.querySelector(`[id="${sid}-${id}"]`);
  const base = intro ? INTRO : 0;
  const anims = [];
  const loop = (el, frames, opts = {}) => {
    if (!el) return;
    anims.push(el.animate(frames, { duration: LOOP, iterations: Infinity, delay: base, fill: "backwards", ...opts }));
  };
  const rot = (pairs) => kf(pairs, "transform", (v) => `rotate(${v}deg)`);
  const ty = (pairs) => kf(pairs, "transform", (v) => `translateY(${v}px)`);
  const blinkAt = (b) => [
    { offset: 0, transform: "scaleY(1)" },
    { offset: b, transform: "scaleY(1)" },
    { offset: b + 0.015, transform: "scaleY(0.1)" },
    { offset: b + 0.03, transform: "scaleY(1)" },
    { offset: 1, transform: "scaleY(1)" },
  ];

  // Comunes: respiración, parpadeo, pelo.
  for (const [c, b, ph] of [
    ["caro", 0.3, 0],
    ["nico", 0.72, 0.5],
  ]) {
    loop(q(`${c}-char`), ty([[0, 0], [0.25, -1.4], [0.5, 0], [0.75, -1.4], [1, 0]]), { delay: base - ph * 1000 });
    loop(q(`${c}-eyes`), blinkAt(b));
    const sway = rot([[0, 0], [0.25, 1.5], [0.5, 0], [0.75, -1.5], [1, 0]]);
    loop(q(`${c}-hair`), sway, { delay: base - ph * 1000 });
    loop(q(`${c}-hairB`), sway, { delay: base - ph * 1000 - 120 });
  }

  // Boiling: 3 variantes alternadas cada 1/24 del loop (~167 ms), en escalones.
  root.querySelectorAll(".doodle").forEach((d) => {
    d.querySelectorAll(".boil").forEach((v, i) => {
      const frames = [];
      for (let k = 0; k <= 24; k++) frames.push({ offset: k / 24, opacity: k % 3 === i ? 1 : 0, easing: "step-end" });
      anims.push(v.animate(frames, { duration: LOOP, iterations: Infinity, delay: base, fill: "backwards" }));
    });
  });

  if (name === "celular") {
    // Ráfagas de vibración de 400 ms cada ~1,33 s (3 por loop, cierre exacto).
    const burst = [];
    const vis = [];
    for (const s of [0.05, 0.383, 0.717]) {
      const steps = [0, 3, -3, 3, -3, 3, -2, 0];
      steps.forEach((v, i) => burst.push([s + (i * 0.1) / (steps.length - 1), v]));
      vis.push({ offset: s - 0.01, opacity: 0, transform: "scale(0.8)" }, { offset: s + 0.015, opacity: 1, transform: "scale(1)" }, { offset: s + 0.1, opacity: 1, transform: "scale(1.05)" }, { offset: s + 0.13, opacity: 0, transform: "scale(1.1)" });
    }
    const shake = [{ offset: 0, transform: "rotate(0deg)" }, ...burst.map(([o, v]) => ({ offset: o, transform: `rotate(${v}deg)`, easing: "linear" })), { offset: 1, transform: "rotate(0deg)" }];
    loop(q("caro-phone"), shake);
    loop(q("caro-vib"), [{ offset: 0, opacity: 0, transform: "scale(0.8)" }, ...vis, { offset: 1, opacity: 0, transform: "scale(0.8)" }]);
    q("caro-vib")?.classList.add("fillbox");
    loop(q("caro-head"), rot([[0, 0], [0.3, 3], [0.6, 2], [1, 0]]));
    loop(q("nico-head"), rot([[0, 0], [0.4, -3], [0.7, -2], [1, 0]]));
    loop(q("nico-phone"), rot([[0, 0], [0.5, 2], [1, 0]]));
  }

  if (name === "laptop") {
    // Fist pump: dos golpes rápidos y pausa, dos veces por loop.
    const pump = [[0, 0]];
    const bounce = [[0, 0]];
    for (const s of [0.04, 0.54]) {
      pump.push([s, 0], [s + 0.05, 16], [s + 0.1, -2], [s + 0.15, 16], [s + 0.22, 0]);
      bounce.push([s, 0], [s + 0.05, 5], [s + 0.1, -3], [s + 0.15, 5], [s + 0.22, 0]);
    }
    pump.push([1, 0]);
    bounce.push([1, 0]);
    loop(q("nico-armB"), rot(pump));
    loop(q("nico-head"), ty(bounce));
    loop(q("caro-head"), ty(bounce.map(([o, v]) => [o, v * 0.6])), { delay: base - 60 });
    // Wifi: punto y arcos se encienden en secuencia (2 ciclos por loop).
    ["wifi-0", "wifi-1", "wifi-2", "wifi-3"].forEach((id, i) => {
      const frames = [];
      for (const c of [0, 0.5]) {
        const on = c + 0.05 + i * 0.07;
        frames.push({ offset: on - 0.03, opacity: 0.15, transform: "scale(0.94)" }, { offset: on, opacity: 1, transform: "scale(1.04)" }, { offset: on + 0.12, opacity: 1, transform: "scale(1)" }, { offset: c + 0.45, opacity: 0.15, transform: "scale(0.94)" });
      }
      loop(q(id), [{ offset: 0, opacity: 0.15, transform: "scale(0.94)" }, ...frames.filter((f) => f.offset > 0 && f.offset < 1), { offset: 1, opacity: 0.15, transform: "scale(0.94)" }]);
    });
  }

  if (name === "llamada") {
    // Ringtone: temblor rápido en dos tandas por loop.
    const ring = [{ offset: 0, transform: "rotate(0deg)" }];
    for (const [s, e] of [
      [0.02, 0.32],
      [0.52, 0.82],
    ]) {
      const n = 18;
      for (let i = 0; i <= n; i++) ring.push({ offset: s + ((e - s) * i) / n, transform: `rotate(${i === 0 || i === n ? 0 : i % 2 ? 4 : -4}deg)`, easing: "linear" });
    }
    ring.push({ offset: 1, transform: "rotate(0deg)" });
    loop(q("caro-phone"), ring);
    loop(q("caro-head"), rot([[0, 0], [0.2, -4], [0.5, -3], [0.7, -4.5], [1, 0]]));
    loop(q("nico-head"), rot([[0, 0], [0.25, 2], [0.5, 0], [0.75, 2], [1, 0]]));
    // Ondas que salen del celular: 1 s por onda, 3 ondas desfasadas (4 ciclos por loop).
    [0, 1, 2].forEach((i) => {
      const el = q(`caro-wave${i}`);
      if (!el) return;
      anims.push(
        el.animate(
          [
            { offset: 0, opacity: 0, transform: "scale(0.6)" },
            { offset: 0.25, opacity: 1, transform: "scale(0.9)", easing: EASE },
            { offset: 1, opacity: 0, transform: "scale(1.6)" },
          ],
          { duration: 1000, iterations: Infinity, delay: base - i * 333, fill: "backwards" },
        ),
      );
    });
  }

  // Intro (solo primer ciclo): draw-on de líneas y fade-in de rellenos y máscaras al final.
  if (intro) {
    const lines = [...root.querySelectorAll(".ln")];
    lines.forEach((el, i) => {
      anims.push(
        el.animate(
          [
            { strokeDasharray: "1 1", strokeDashoffset: 1 },
            { strokeDasharray: "1 1", strokeDashoffset: 0 },
          ],
          { duration: 900, delay: Math.min(500, i * 2.5), easing: EASE, fill: "both" },
        ),
      );
    });
    root.querySelectorAll(".mk, .fl, .dot").forEach((el) => {
      anims.push(el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450, delay: 1000, easing: EASE, fill: "backwards" }));
    });
  }
  return anims;
};

// Control determinista por tiempo: pausa todo y fija currentTime.
const installSeek = () => {
  window.seek = (ms) => {
    document.getAnimations().forEach((a) => {
      a.pause();
      a.currentTime = ms;
    });
  };
};

Object.assign(LA, { LOOP, INTRO, SCENE_NAMES, sceneInfo, sceneSVG, registerScene, installSeek });
})();
