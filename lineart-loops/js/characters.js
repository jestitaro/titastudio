(() => {
const LA = (window.LA = window.LA || {});
const { angle, blob, dot, hand, line, part, PAL, pivot, sleeve, tube } = LA;

// Personajes line-art de medio cuerpo, mirando a +x. Origen = base del cuello.
// Cabeza con pivote en la nuca (0,-50); pelo con pivote en la coronilla (0,-200).

const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

const arm = (a, skin, top, sleeveW = [62, 56]) => {
  const tipA = lerp(a.pts[0], a.pts[1], 0.18);
  const body = part(tube([tipA, ...a.pts.slice(1)], a.w ?? [44, 38, 34, 30]), skin);
  const n = a.pts.length;
  const h = a.hand ? hand(a.hand, a.pts[n - 1], angle(a.pts[n - 2], a.pts[n - 1]), skin, a.flipHand, a.handScale ?? 1.1) : "";
  const sv = sleeve(a.pts[0], lerp(a.pts[0], a.pts[1], a.reach ?? 0.5), sleeveW[0], sleeveW[1]);
  const sl = part(sv.fill, top, { line: false, mask: false, off: [3, 3] }) + part(sv.fill, top, { line: false, mask: false, off: [0, 0] }) + line(sv.outline);
  return body + (a.beforeHand ?? "") + h + (a.extra ?? "") + sl;
};

const armGroup = (id, a, skin, top, sleeveW) =>
  a.pivot ? pivot(id, a.pts[0][0], a.pts[0][1], arm(a, skin, top, sleeveW)) : `<g id="${id}">${arm(a, skin, top, sleeveW)}</g>`;

const mouthD = {
  smile: "M22,-80 Q34,-69 46,-82",
  grin: "M20,-84 Q34,-64 50,-86 Z",
  talk: "M26,-80 Q36,-72 44,-80 Q36,-86 26,-80 Z",
  o: "M30,-82 Q36,-72 42,-82 Q36,-90 30,-82 Z",
};

const face = (p, { faceD, eyesY = -124, mouth = "smile", happy = false, browW = 4, brows }) => {
  const m = mouthD[mouth];
  const closed = m.endsWith("Z");
  const eyes = happy
    ? line("M6,-122 Q14,-132 22,-122", 4) + line("M40,-124 Q47,-133 54,-124", 4)
    : dot(14, eyesY, 5.5) + dot(47, eyesY - 2, 5);
  return (
    part(faceD, p.skin) +
    blob(6, -98, 11, PAL.blush) +
    blob(60, -100, 7, PAL.blush) +
    `<g id="${p.id}-eyes" class="fillbox">${eyes}</g>` +
    line(brows[0], browW) +
    line(brows[1], browW) +
    line("M60,-118 Q70,-102 56,-97", 3.5) +
    (closed ? part(m, "#C2505E", { off: [0, 0] }) : line(m, 4))
  );
};

// ───────────────────────── CARO ─────────────────────────

const caro = ({ back, front, mouth = "smile", happy = false, props = "", frontOverHead = false }) => {
  const p = { id: "caro", skin: PAL.skin };
  const top = PAL.caroTop;
  const hairBack =
    "M-36,-204 C-102,-200 -126,-152 -116,-110 C-134,-90 -124,-64 -134,-42 C-144,-14 -124,10 -132,36 C-114,56 -86,50 -78,32 L62,30 C72,48 100,52 114,34 C104,12 118,-12 106,-34 C116,-58 100,-80 104,-104 C108,-160 72,-206 -36,-204 Z";
  const hairFront =
    "M-62,-110 C-72,-178 -22,-216 22,-210 C64,-204 84,-168 72,-124 C66,-146 50,-160 32,-164 C22,-148 4,-136 -18,-132 C-34,-128 -48,-120 -62,-110 Z";
  const faceD =
    "M-56,-138 C-56,-182 -24,-200 8,-200 C46,-200 66,-170 66,-132 C66,-104 60,-82 48,-66 C36,-52 20,-46 4,-46 C-22,-48 -44,-62 -52,-86 C-56,-100 -56,-120 -56,-138 Z";
  const torso = "M-118,40 C-110,8 -70,-2 -22,-6 L2,46 L26,-8 C70,-4 108,6 118,40 C124,120 128,300 130,640 L-124,640 C-122,300 -122,120 -118,40 Z";

  const head =
    part("M-62,-112 A13,13 0 1 0 -38,-112 A13,13 0 1 0 -62,-112 Z", p.skin) +
    `<circle class="fl" cx="-50" cy="-92" r="4.5" fill="${PAL.gold}"/>` +
    face(p, {
      faceD,
      mouth,
      happy,
      brows: ["M4,-146 Q14,-153 25,-148", "M38,-151 Q46,-155 55,-150"],
    }) +
    pivot("caro-hair", 0, -200, part(hairFront, PAL.caroHair) + line("M-18,-192 C2,-200 28,-200 46,-190", 3.5) + line("M-40,-160 C-26,-172 -6,-178 14,-178", 3));

  return (
    `<g id="caro-char">` +
    pivot("caro-hairB", 0, -200, part(hairBack, PAL.caroHair) + line("M-120,-40 C-110,-20 -126,0 -116,22", 3) + line("M100,-60 C110,-40 96,-20 106,4", 3)) +
    (back.layer === "under" ? armGroup("caro-armB", back, p.skin, top) : "") +
    part("M-17,-62 L-19,6 L21,6 L19,-62 Z", p.skin) +
    part("M-22,-6 L2,46 L26,-8 Z", p.skin, { line: false }) +
    part(torso, top) +
    line("M-60,160 C-40,150 -20,150 0,158", 3) +
    (back.layer !== "under" && back.layer !== "top" ? armGroup("caro-armB", back, p.skin, top) : "") +
    (!frontOverHead ? armGroup("caro-armF", front, p.skin, top) : "") +
    props +
    pivot("caro-head", 0, -50, head) +
    (back.layer === "top" ? armGroup("caro-armB", back, p.skin, top) : "") +
    (frontOverHead ? armGroup("caro-armF", front, p.skin, top) : "") +
    `</g>`
  );
};

// ───────────────────────── NICO ─────────────────────────

const nico = ({ back, front, mouth = "smile", happy = false, props = "", frontOverHead = false }) => {
  const p = { id: "nico", skin: PAL.skinN };
  const shirt = PAL.nicoShirt;
  const faceD =
    "M-58,-140 C-58,-186 -24,-204 10,-204 C50,-204 70,-172 70,-134 C70,-100 64,-78 50,-62 C38,-50 20,-44 2,-44 C-24,-46 -46,-60 -54,-86 C-58,-102 -58,-122 -58,-140 Z";
  const hair =
    "M-62,-118 C-72,-168 -44,-204 -4,-208 C6,-222 30,-228 46,-216 C66,-214 84,-194 80,-166 C88,-152 84,-134 74,-124 C70,-138 62,-146 52,-150 C44,-140 30,-138 20,-146 C8,-136 -8,-136 -18,-146 C-30,-136 -44,-128 -50,-112 Z";
  const tee = "M-128,40 C-118,6 -72,-2 -26,-4 C-10,16 16,16 32,-6 C76,-2 118,6 128,40 C134,120 136,300 138,640 L-132,640 C-130,300 -130,120 -128,40 Z";
  const left = "M-128,40 C-118,6 -72,-2 -30,-6 L-22,24 L-10,96 L-14,640 L-132,640 C-130,300 -130,120 -128,40 Z";
  const right = "M36,-8 C78,-2 118,6 128,40 C134,120 136,300 138,640 L20,640 L22,96 L32,26 Z";

  const head =
    part("M-66,-110 A14,14 0 1 0 -38,-110 A14,14 0 1 0 -66,-110 Z", p.skin) +
    face(p, {
      faceD,
      mouth,
      happy,
      browW: 6,
      brows: ["M0,-146 L26,-149", "M38,-151 L58,-148"],
    }) +
    pivot(
      "nico-hair",
      0,
      -200,
      part(hair, PAL.nicoHair) +
        line("M-10,-192 C4,-202 22,-204 36,-198", 3.5) +
        line("M28,-170 C40,-178 52,-180 64,-174", 3),
    );

  return (
    `<g id="nico-char">` +
    pivot("nico-hairB", 0, -200, part("M-56,-116 C-64,-92 -60,-72 -48,-62 L-36,-80 Z", PAL.nicoHair)) +
    (back.layer === "under" ? armGroup("nico-armB", back, p.skin, shirt, [70, 62]) : "") +
    part("M-21,-60 L-23,8 L25,8 L23,-60 Z", p.skin) +
    part(tee, PAL.tee) +
    part(left, shirt) +
    part(right, shirt) +
    line("M-30,-6 L-44,30 L-22,40", 3.5) +
    line("M36,-8 L50,28 L30,40", 3.5) +
    (back.layer !== "under" && back.layer !== "top" ? armGroup("nico-armB", back, p.skin, shirt, [70, 62]) : "") +
    (!frontOverHead ? armGroup("nico-armF", front, p.skin, shirt, [70, 62]) : "") +
    props +
    pivot("nico-head", 0, -50, head) +
    (back.layer === "top" ? armGroup("nico-armB", back, p.skin, shirt, [70, 62]) : "") +
    (frontOverHead ? armGroup("nico-armF", front, p.skin, shirt, [70, 62]) : "") +
    `</g>`
  );
};

Object.assign(LA, { caro, nico });
})();
