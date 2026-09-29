import { ISO_CENTERS } from "./logoData";
import { TriState } from "./QSLogo";

// Loading de marca: el isotipo aparece "en fantasma" y sus 20 triángulos se encienden en secuencia
// recorriendo la forma (sentido horario desde arriba), como una barra de progreso con la geometría de la Q.
const CX = 124;
const CY = 118;
const ORDER: number[] = ISO_CENTERS.map((c, i) => ({ i, a: (Math.atan2(c[1] - CY, c[0] - CX) + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2) }))
  .sort((a, b) => a.a - b.a)
  .map((x) => x.i);
const RANK: number[] = ORDER.reduce((acc, idx, r) => {
  acc[idx] = r;
  return acc;
}, [] as number[]);

const smooth = (t: number) => t * t * (3 - 2 * t);

// `progress` 0..1 (triángulos encendidos); `ghost` opacidad de los apagados; `appear` 0..1 entrada del fantasma.
export const fillTri =
  (progress: number, ghost = 0.16, appear = 1) =>
  (i: number): TriState => {
    const lit = smooth(Math.min(1, Math.max(0, progress * 20 - RANK[i])));
    const pulse = lit > 0 && lit < 1 ? 1 + 0.18 * Math.sin(lit * Math.PI) : 1;
    return { tx: 0, ty: 0, s: pulse * (0.85 + 0.15 * appear), rot: 0, o: (ghost + (1 - ghost) * lit) * appear };
  };
