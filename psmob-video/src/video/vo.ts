import { SceneId, sceneStart } from "./timing";
import manifest from "./vo-manifest.json";

// Locución: guion final dividido en frases, cada una anclada a su escena (frame relativo al inicio).
// Los archivos se generan con scripts/vo.py en public/audio/vo/<id>.mp3; el manifest guarda la
// duración de cada uno. Si una frase no tiene audio todavía, simplemente no suena.
export const VO_LINES: { id: string; scene: SceneId; at: number; text: string }[] = [
  { id: "01", scene: "s01", at: 30, text: "Gestionar a tu equipo comercial no tiene por qué ser un dolor de cabeza." },
  { id: "02", scene: "s01", at: 200, text: "Coordinar tareas, recopilar datos en múltiples puntos de venta y procesar toda esa información puede ser muy tedioso y consumir demasiado tiempo y dinero." },
  { id: "03", scene: "s06", at: 16, text: "Ahora, con la nueva versión de QuartzSales Trade Marketing, todo puede cambiar." },
  { id: "04", scene: "s07", at: 20, text: "Tu equipo puede encargarse de todas estas tareas de una manera más eficiente y organizada." },
  { id: "05", scene: "s08", at: 200, text: "Optimiza la comunicación." },
  { id: "06", scene: "s09", at: 60, text: "Agiliza la captura de datos." },
  { id: "07", scene: "s10", at: 90, text: "Y ofrece información en tiempo real para una mejor toma de decisiones." },
  { id: "08", scene: "s11", at: 170, text: "Además, con AiFred, nuestro asistente con Inteligencia Artificial, llevamos la automatización al siguiente nivel:" },
  { id: "09", scene: "s12", at: 172, text: "escanea estantes, reconoce precios, valida planogramas" },
  { id: "10", scene: "s13", at: 16, text: "e incluso funciona sin conexión." },
  { id: "11", scene: "s14", at: 60, text: "Implementá QuartzSales Trade Marketing y llevá tu negocio al futuro." },
];

const DUR = manifest as Record<string, number>;
export const VO = VO_LINES.filter((l) => DUR[l.id] !== undefined).map((l) => ({
  ...l,
  from: sceneStart(l.scene) + l.at,
  frames: Math.ceil(DUR[l.id] * 30) + 2,
}));
