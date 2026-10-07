// Composición principal: "Crear pedido" en QuartzSales.
//
// renderFrame(frame) === <PedidosFrame frame={frame} />: todo el estado visual se deriva de
// getSceneState(frame), sin timers ni estado incremental. Renderizar el frame 1200 directo
// da siempre la misma imagen.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { cameraTransform } from "./animation/camera";
import { VIEW } from "./animation/layout";
import { getSceneState, SceneState } from "./animation/scene-state";
import { Sidebar, Topbar } from "../qs-kit/ui/AppShell";
import { CartSummary } from "./components/CartSummary";
import { Cursor } from "../qs-kit/ui/Cursor";
import { GeneralInfo } from "./components/GeneralInfo";
import { OrderList } from "./components/OrderList";
import { OrderSummary } from "./components/OrderSummary";
import { OrderTypeModal } from "./components/OrderTypeModal";
import { ProductTable } from "./components/ProductTable";
import { SectionHeader } from "./components/SectionHeader";
import { Stepper } from "./components/Stepper";
import { Toast } from "./components/Toast";
import { c, shadow } from "../qs-kit/design/tokens";
import { orderTotal } from "./data/mock-data";
import { LogoOutro, outroUiOpacity } from "../qs-kit/ui/LogoOutro";
import { T } from "./animation/timeline";

const Surface: React.FC<{ rect: { x: number; y: number; w: number; h: number }; opacity: number; style?: React.CSSProperties }> = ({ rect, opacity, style }) =>
  opacity > 0 ? (
    <div
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        background: c.card,
        borderRadius: 12,
        boxShadow: shadow.card,
        opacity,
        ...style,
      }}
    />
  ) : null;

// Escena completa en el viewport lógico (1600×900).
export const Screen: React.FC<{ s: SceneState }> = ({ s }) => {
  const main = s.cards.main;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: VIEW.w, height: VIEW.h, background: c.ground, overflow: "hidden" }}>
      <Sidebar active="Pedidos" />
      <Topbar crumbs={["Pedidos", "Pedidos"]} />

      {/* Listado */}
      <Surface rect={s.cards.list.rect} opacity={s.cards.list.opacity} />
      {s.list.phaseB ? null : <OrderList s={s} total={orderTotal()} />}

      {/* Backdrop del modal */}
      {s.backdrop > 0 ? <div style={{ position: "absolute", inset: 0, background: `rgba(30, 41, 59, ${s.backdrop})` }} /> : null}

      {/* Card principal: modal → formulario → productos → resumen → listado */}
      <Surface
        rect={main.rect}
        opacity={main.opacity}
        style={{
          transform: `translateY(${main.lift}px) scale(${main.scale})`,
          // Sombra de overlay mientras es modal; de card cuando se asienta como formulario.
          boxShadow: s.backdrop > 0.01 ? shadow.overlay : shadow.card,
        }}
      />
      <OrderTypeModal s={s} />
      <Stepper s={s} />
      <CartSummary s={s} />

      <SectionHeader s={s} />
      <GeneralInfo s={s} />
      <ProductTable s={s} />
      <OrderSummary s={s} />
      {/* En el regreso, el listado vive sobre la card principal (que se expande hasta ser su card). */}
      {s.list.phaseB ? <OrderList s={s} total={orderTotal()} /> : null}

      <Toast s={s} />
      <Cursor cursor={s.cursor} />
    </div>
  );
};

export const PedidosFrame: React.FC<{ frame: number }> = ({ frame }) => {
  const s = getSceneState(frame);
  return (
    <AbsoluteFill style={{ background: c.ground, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: VIEW.w, height: VIEW.h, transform: `scale(${VIEW.scale})`, transformOrigin: "0 0" }}>
        <div style={{ position: "absolute", inset: 0, transform: cameraTransform(s.camera), transformOrigin: "0 0", opacity: outroUiOpacity(frame, T.outro) }}>
          <Screen s={s} />
        </div>
      </div>
      <LogoOutro frame={frame} timing={T.outro} />
    </AbsoluteFill>
  );
};

export const PedidosFlow: React.FC = () => {
  const frame = useCurrentFrame();
  return <PedidosFrame frame={frame} />;
};
