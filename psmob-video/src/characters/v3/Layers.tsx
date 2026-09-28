import React from "react";
import { AbsoluteFill } from "remotion";
import { roboto } from "../../design/fonts";
import { caro, exprs, nico, posesFor } from "./cast";
import { Figure, Layer } from "./Figure";

// Lámina de rig: cada capa aislada + el compuesto. Muestra que las divisiones
// internas (cuello, hombros, mangas, cintura) quedan tapadas por solapamiento.

const LAYERS: { l: Layer; t: string; pivot: string }[] = [
  { l: "hairBack", t: "Pelo trasero", pivot: "coronilla" },
  { l: "armFar", t: "Brazo lejano", pivot: "hombro → codo → muñeca" },
  { l: "neck", t: "Cuello", pivot: "base del cuello" },
  { l: "body", t: "Torso + ropa", pivot: "cadera (respiración)" },
  { l: "head", t: "Cabeza + rasgos", pivot: "base del cuello" },
  { l: "hairFront", t: "Pelo delantero", pivot: "raya del pelo" },
  { l: "armNear", t: "Brazo cercano + mano", pivot: "hombro → codo → muñeca" },
];

export const LayersV3: React.FC<{ who: "caro" | "nico" }> = ({ who }) => {
  const c = who === "caro" ? caro : nico;
  const pose = posesFor(who).neutral;
  return (
    <AbsoluteFill style={{ background: "#F1F0FA", padding: "40px 48px", fontFamily: roboto }}>
      <div style={{ fontSize: 40, fontWeight: 700, color: "#1E2257" }}>{c.name} · capas para animación</div>
      <div style={{ display: "flex", gap: 14, marginTop: 30, alignItems: "flex-end" }}>
        {LAYERS.map(({ l, t, pivot }) => (
          <div key={l} style={{ width: 196 }}>
            <div style={{ height: 300, background: "#FFFFFF", borderRadius: 14, overflow: "hidden" }}>
              <Figure c={c} pose={pose} e={exprs.neutral} uid={`${who}-layer-${l}`} viewBox="60 40 480 780" only={l} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, color: "#1E2257", marginTop: 8 }}>{t}</div>
            <div style={{ fontSize: 14, color: "#5B5F86" }}>Pivote: {pivot}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 40, marginTop: 30, alignItems: "flex-start" }}>
        <div style={{ width: 300, height: 480, background: "#FFFFFF", borderRadius: 14, overflow: "hidden" }}>
          <Figure c={c} pose={pose} e={exprs.neutral} uid={`${who}-layer-all`} viewBox="60 40 480 780" />
        </div>
        <div style={{ fontSize: 20, color: "#1E2257", lineHeight: 1.6, maxWidth: 1100 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Compuesto (orden de dibujo de izquierda a derecha)</div>
          <div>• El cuello nace debajo de la cara y termina debajo del escote: no hay corte en mentón ni clavícula.</div>
          <div>• Cada brazo es una sola silueta hombro-muñeca; la manga lo cubre desde arriba, sin costura visible.</div>
          <div>• El torso baja por detrás del cinturón y el pantalón; la cintura no se abre al respirar.</div>
          <div>• Pelo en dos capas: la masa trasera va detrás del cuerpo y la delantera sobre la cara, cada una con su balanceo.</div>
          <div>• Manos diseñadas por gesto (relajada, señalar, sostener celular, sobre la cabeza), intercambiables en la muñeca.</div>
          <div>• Expresión por parámetros: ojos (abiertos, felices, cerrados, parpadeo), mirada, cejas, boca y rubor.</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
