import { interpolate } from "remotion";
import { TriState } from "./QSLogo";

// Loading de marca: los 20 triángulos del isotipo giran en un anillo alrededor del centro del símbolo
// y luego se ensamblan en su lugar. `assemble` 0 = anillo, 1 = isotipo en reposo.
const CX = 124;
const CY = 124;
const R = 165;
const N = 20;

const smooth = (t: number) => t * t * (3 - 2 * t);

export const loaderTri =
  (spin: number, assemble: number, appear = 1) =>
  (i: number, c: [number, number]): TriState => {
    const a = (i / N) * Math.PI * 2 + spin;
    const rx = CX + Math.cos(a) * R;
    const ry = CY + Math.sin(a) * R;
    // Ensamblado escalonado: cada triángulo llega con un pequeño retardo.
    const k = smooth(Math.min(1, Math.max(0, assemble * 1.6 - (i / N) * 0.6)));
    const ap = smooth(Math.min(1, Math.max(0, appear * 1.5 - (i / N) * 0.5)));
    return {
      tx: interpolate(k, [0, 1], [rx - c[0], 0]),
      ty: interpolate(k, [0, 1], [ry - c[1], 0]),
      s: interpolate(k, [0, 1], [0.7, 1]) * ap,
      rot: interpolate(k, [0, 1], [(a * 180) / Math.PI + 90, 0]),
      o: ap,
    };
  };
