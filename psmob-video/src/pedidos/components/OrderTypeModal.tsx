// Contenido del modal "tipo de pedido". La superficie blanca es la card principal
// (ver Cards en PedidosFlow): así el modal se transforma en el formulario sin corte.
import React from "react";
import { CARD, MODAL } from "../animation/layout";
import { SceneState } from "../animation/scene-state";
import { c, font } from "../design/tokens";
import { Abs, Button, Icon } from "./ui";

export const OrderTypeModal: React.FC<{ s: SceneState }> = ({ s }) => {
  const M = s.modal;
  const main = s.cards.main;
  if (!M.visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: M.contentOpacity,
        fontFamily: font,
        transform: `translateY(${main.lift}px) scale(${main.scale})`,
        transformOrigin: `${CARD.modal.x + CARD.modal.w / 2}px ${CARD.modal.y + CARD.modal.h / 2}px`,
      }}
    >
      <Abs x={CARD.modal.x + 22} y={CARD.modal.y + 20} w={CARD.modal.w - 80} style={{ fontSize: 15, fontWeight: 600, color: c.textStrong, lineHeight: 1.3 }}>
        Selecciona tipo de pedido que querés crear
      </Abs>
      <Abs x={CARD.modal.x + CARD.modal.w - 40} y={CARD.modal.y + 24}>
        <Icon name="times" size={12} color={c.muted} />
      </Abs>
      <Abs x={MODAL.trad.x} y={MODAL.trad.y}>
        <Button label="Tradicional" hover={M.trad.hover} scale={M.trad.scale} height={MODAL.trad.h} style={{ width: MODAL.trad.w }} />
      </Abs>
      <Abs x={MODAL.esp.x} y={MODAL.esp.y}>
        <Button label="Especial" height={MODAL.esp.h} style={{ width: MODAL.esp.w }} />
      </Abs>
    </div>
  );
};
