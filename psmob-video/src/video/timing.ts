import { es } from "../i18n/es";

// Timeline del video completo @30fps. Cada escena es un bloque independiente:
// para retimear con la locución final alcanza con cambiar `dur` (y los beats internos, que son relativos).
export const FPS = 30;

export const SCENES = [
  { id: "s01", dur: 360 }, // Escenas 1–4: caminata, tareas en el celular, sobrecarga + órbita
  { id: "s05", dur: 255 }, // Escritorio, paso del tiempo
  { id: "s06", dur: 165 }, // Caro muestra el celular → UI
  { id: "s07", dur: 195 }, // Organización: equipo → ruteo
  { id: "s08", dur: 195 }, // Optimiza la comunicación
  { id: "s09", dur: 210 }, // Agiliza la captura de datos
  { id: "s10", dur: 180 }, // Información en tiempo real
  { id: "s11", dur: 195 }, // Dashboard
  { id: "s12", dur: 300 }, // AiFred en góndola
  { id: "s13", dur: 165 }, // Sin conexión → enviando → loading de marca
  { id: "s14", dur: 195 }, // Cierre QuartzSales
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
export const BEATS_S01 = { stop: 80, team: 110, stress: 140, pdv: 142, check: 174, data: 206, alert: 236, drop: 290 };

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
