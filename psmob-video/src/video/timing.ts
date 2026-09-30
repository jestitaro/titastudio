import { es } from "../i18n/es";

// Timeline del video completo @30fps. Cada escena es un bloque independiente:
// para retimear con la locución final alcanza con cambiar `dur` (y los beats internos, que son relativos).
export const FPS = 30;

// Duraciones ajustadas a la locución (58 s). `orig` = duración con la que se animó la escena; `trim` =
// frames iniciales que se saltean. La escena se reproduce comprimida: velocidad = (orig - trim) / dur.
export const SCENES = [
  { id: "s01", dur: 270, orig: 360, trim: 0 }, // "Gestionar a tu equipo…" + sobrecarga + caída
  { id: "s05", dur: 200, orig: 255, trim: 0 }, // "Coordinar tareas… tiempo y dinero"
  { id: "s06", dur: 132, orig: 165, trim: 0 }, // "Ahora, con la nueva versión…"
  { id: "s07", dur: 138, orig: 195, trim: 0 }, // "Tu equipo puede encargarse…"
  { id: "s08", dur: 168, orig: 255, trim: 0 }, // pausa musical (charla) → "Optimiza la comunicación"
  { id: "s09", dur: 114, orig: 210, trim: 0 }, // "Agiliza la captura de datos"
  { id: "s10", dur: 120, orig: 180, trim: 0 }, // "Y ofrece información en tiempo real…"
  { id: "s11", dur: 138, orig: 195, trim: 0 }, // "…para una mejor toma de decisiones" + "Además, con AiFred…"
  { id: "s12", dur: 200, orig: 300, trim: 60 }, // "…al siguiente nivel: escanea estantes, reconoce precios…"
  { id: "s13", dur: 80, orig: 165, trim: 0 }, // "e incluso funciona sin conexión"
  { id: "s14", dur: 171, orig: 225, trim: 0 }, // "Implementá QuartzSales Trade Marketing…"
] as const;

export type SceneId = (typeof SCENES)[number]["id"];

export const sceneStart = (id: SceneId) => {
  let t = 0;
  for (const s of SCENES) {
    if (s.id === id) return t;
    t += s.dur;
  }
  throw new Error(id);
};

export const sceneDur = (id: SceneId) => SCENES.find((s) => s.id === id)!.dur;

export const TOTAL = SCENES.reduce((a, s) => a + s.dur, 0);

// Beats internos de la escena 1–4 (relativos al inicio del bloque).
// Las tareas llegan de a una (cada ~14 frames) y se acumulan; Caro se estresa recién con 9 en pantalla.
export const BEATS_S01 = { first: 20, every: 14, open: [60, 150] as [number, number], stress: 142, alert: 196, drop: 290 };

// Locución de referencia por escena (frames relativos al bloque). No se muestra en el video: sirve para
// retimear cuando llegue el audio final.
export const VO: Record<SceneId, { text: string; from: number; to: number }[]> = {
  s01: [
    { text: es.video.vo.s01a, from: 9, to: 123 },
    { text: es.video.vo.s01b, from: 130, to: 187 },
    { text: es.video.vo.s01c, from: 189, to: 244 },
    { text: es.video.vo.s01d, from: 246, to: 328 },
  ],
  s05: [{ text: es.video.vo.s05, from: 4, to: 161 }],
  s06: [{ text: es.video.vo.s06, from: 8, to: 148 }],
  s07: [{ text: es.video.vo.s07, from: 5, to: 189 }],
  s08: [{ text: es.video.vo.s08, from: 14, to: 151 }],
  s09: [{ text: es.video.vo.s09, from: 12, to: 165 }],
  s10: [{ text: es.video.vo.s10, from: 9, to: 161 }],
  s11: [{ text: es.video.vo.s11, from: 6, to: 160 }],
  s12: [
    {
      text: es.video.vo.s12a,
      from: 4,
      to: 146,
    },
    { text: es.video.vo.s12b, from: 151, to: 266 },
  ],
  s13: [{ text: es.video.vo.s13, from: 8, to: 112 }],
  s14: [{ text: es.video.vo.s14, from: 11, to: 164 }],
};
