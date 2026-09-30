import React, { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";

// Reloj de escena: cada escena se animó con su duración original; para encajar con la locución se
// reproduce el tramo [trim, orig] comprimido en la duración nueva. Como la escena sigue terminando en su
// frame original, la continuidad de cámara con la escena siguiente no cambia.
const Ctx = createContext({ speed: 1, trim: 0 });

export const SceneClock: React.FC<{ speed: number; trim: number; children: React.ReactNode }> = ({ speed, trim, children }) => (
  <Ctx.Provider value={{ speed, trim }}>{children}</Ctx.Provider>
);

export const useSceneFrame = () => {
  const f = useCurrentFrame();
  const { speed, trim } = useContext(Ctx);
  return trim + f * speed;
};
