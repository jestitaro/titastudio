import { es } from "../i18n/es";

// Timeline del video completo @30fps. Cada escena es un bloque independiente:
// para retimear con la locución final alcanza con cambiar `dur` (y los beats internos, que son relativos).
export const FPS = 30;

export const SCENES = [
  { id: "s01", dur: 300 }, // Escenas 1–4: sobrecarga + órbita (beats internos en BEATS_S01)
  { id: "s05", dur: 150 }, // Escritorio, paso del tiempo
  { id: "s06", dur: 120 }, // Caro muestra el celular → UI
  { id: "s07", dur: 165 }, // Organización: visita → equipo → ruteo
  { id: "s08", dur: 120 }, // Optimiza la comunicación
  { id: "s09", dur: 120 }, // Agiliza la captura de datos
  { id: "s10", dur: 150 }, // Información en tiempo real
  { id: "s11", dur: 120 }, // Dashboard
  { id: "s12", dur: 240 }, // AiFred en góndola
  { id: "s13", dur: 120 }, // Sin conexión → enviando → loading de marca
  { id: "s14", dur: 165 }, // Cierre QuartzSales
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
export const BEATS_S01 = { team: 120, pdv: 175, process: 225, drop: 282 };

// Locución de referencia por escena (solo para el draft; frames relativos al bloque).
export const VO: Record<SceneId, { text: string; from: number; to: number }[]> = {
  s01: [
    { text: es.video.vo.s01a, from: 8, to: 112 },
    { text: es.video.vo.s01b, from: 118, to: 170 },
    { text: es.video.vo.s01c, from: 172, to: 222 },
    { text: es.video.vo.s01d, from: 224, to: 298 },
  ],
  s05: [{ text: es.video.vo.s05, from: 4, to: 146 }],
  s06: [{ text: es.video.vo.s06, from: 6, to: 118 }],
  s07: [{ text: es.video.vo.s07, from: 4, to: 160 }],
  s08: [{ text: es.video.vo.s08, from: 10, to: 110 }],
  s09: [{ text: es.video.vo.s09, from: 8, to: 110 }],
  s10: [{ text: es.video.vo.s10, from: 8, to: 146 }],
  s11: [{ text: es.video.vo.s11, from: 4, to: 116 }],
  s12: [
    {
      text: es.video.vo.s12a,
      from: 4,
      to: 130,
    },
    { text: es.video.vo.s12b, from: 134, to: 236 },
  ],
  s13: [{ text: es.video.vo.s13, from: 6, to: 90 }],
  s14: [{ text: es.video.vo.s14, from: 10, to: 150 }],
};
