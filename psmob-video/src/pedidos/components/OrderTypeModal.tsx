// Contenido del modal "tipo de pedido": opciones como tarjetas con ícono, título y descripción,
// borde violeta en hover. La superficie blanca es la card principal (ver PedidosFlow):
// así el modal se transforma en el formulario sin corte.
import React from "react";
import { CARD, MODAL, Rect } from "../animation/layout";
import { SceneState } from "../animation/scene-state";
import { c, font } from "../../qs-kit/design/tokens";
import { Abs, Icon, mix } from "../../qs-kit/ui/primitives";

const Option: React.FC<{ r: Rect; icon: string; title: string; desc: string; hover: number; scale: number }> = ({ r, icon, title, desc, hover, scale }) => (
  <Abs
    x={r.x}
    y={r.y}
    w={r.w}
    h={r.h}
    style={{
      boxSizing: "border-box",
      borderRadius: 10,
      border: `1px solid ${mix(c.border, c.primary, hover)}`,
      background: mix("#ffffff", c.primary50, hover),
      boxShadow: hover > 0 ? `0 0 0 ${3 * hover}px ${c.primaryRing}` : "none",
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "0 16px",
      transform: `scale(${scale})`,
    }}
  >
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 19,
        flexShrink: 0,
        background: mix(c.primary50, c.primary100, hover),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon name={icon} size={15} color={c.primary} />
    </div>
    <div style={{ lineHeight: 1.35 }}>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: c.textStrong }}>{title}</div>
      <div style={{ fontSize: 11.5, color: c.muted }}>{desc}</div>
    </div>
  </Abs>
);

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
      <Abs x={CARD.modal.x + 24} y={CARD.modal.y + 24} w={CARD.modal.w - 90} style={{ fontSize: 15, fontWeight: 600, color: c.textStrong, lineHeight: 1.35 }}>
        Seleccioná el tipo de pedido que querés crear
      </Abs>
      <Abs x={CARD.modal.x + CARD.modal.w - 40} y={CARD.modal.y + 28}>
        <Icon name="times" size={12} color={c.muted} />
      </Abs>
      <Option r={MODAL.trad} icon="shopping-cart" title="Pedido tradicional" desc="Creá un pedido con el flujo habitual" hover={M.trad.hover} scale={M.trad.scale} />
      <Option r={MODAL.esp} icon="star" title="Pedido especial" desc="Creá un pedido con condiciones especiales" hover={0} scale={1} />
    </div>
  );
};
