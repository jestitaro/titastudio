// Elementos compartidos entre pasos: "Volver" (permanece fijo) y el título de sección,
// que cambia por crossfade vertical en el mismo lugar.
import React from "react";
import { FORM } from "../animation/layout";
import { SceneState } from "../animation/scene-state";
import { c, font } from "../design/tokens";
import { Abs, Button, Icon } from "./ui";

export const SectionHeader: React.FC<{ s: SceneState }> = ({ s }) => {
  const H = s.shared;
  if (!H.visible) return null;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: font, opacity: H.backOut }}>
      <Abs x={FORM.back.x} y={FORM.back.y} style={{ opacity: H.back.o, transform: `translateY(${H.back.y}px)` }}>
        <Button label="Volver" variant="secondary" height={FORM.back.h} fontSize={12.5} style={{ width: FORM.back.w, gap: 6 }}>
          <Icon name="arrow-left" size={11} />
        </Button>
      </Abs>
      {H.titles.map((t) =>
        t.o > 0.001 ? (
          <Abs key={t.text} x={FORM.innerX} y={FORM.titleY - 12} style={{ opacity: t.o, transform: `translateY(${t.y}px)`, fontSize: 16.5, fontWeight: 600, color: c.textStrong }}>
            {t.text}
          </Abs>
        ) : null,
      )}
    </div>
  );
};
