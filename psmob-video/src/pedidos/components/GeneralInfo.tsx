// Paso 1 · Información general: Orden de compra, Cliente, Sucursal.
import React from "react";
import { FORM, panelRect } from "../animation/layout";
import { SceneState } from "../animation/scene-state";
import { c, font, shadow } from "../design/tokens";
import { BRANCH_INDEX, BRANCH_OPTIONS, CLIENT_INDEX, CLIENT_OPTIONS, ORDER } from "../data/mock-data";
import { Abs, Button, Caret, Field, Icon, Label, mix, Sk } from "./ui";

type Rect = { x: number; y: number; w: number; h: number };

const Dropdown: React.FC<{
  field: Rect;
  options: string[];
  panel: number;
  hover: number;
  selected: number;
  skeleton?: number;
  optionAt: (i: number) => number;
}> = ({ field, options, panel, hover, selected, skeleton = 0, optionAt }) => {
  const r = panelRect(field, options.length);
  return (
    <div
      style={{
        position: "absolute",
        left: r.x,
        top: r.y,
        width: r.w,
        height: r.h,
        background: "#fff",
        borderRadius: 6,
        boxShadow: shadow.overlay,
        border: `1px solid ${c.border}`,
        boxSizing: "border-box",
        opacity: panel,
        transform: `translateY(${(1 - panel) * -6}px) scaleY(${0.96 + 0.04 * panel})`,
        transformOrigin: "top",
        // Máscara: el panel se despliega hacia abajo.
        clipPath: `inset(0 0 ${(1 - panel) * 100}% 0 round 6px)`,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: 10, top: 8, right: 10 }}>
        <Field width="100%" height={30} focus={1} style={{ boxShadow: "none", color: c.muted }}>
          Buscar
          <Icon name="search" size={11} color={c.muted} style={{ position: "absolute", right: 10 }} />
        </Field>
      </div>
      {options.map((o, i) => {
        const p = optionAt(i);
        const isHover = hover === i;
        const isSel = selected === i;
        return (
          <div key={o} style={{ position: "absolute", left: 4, right: 4, top: FORM.panelSearchH + i * FORM.optionH, height: FORM.optionH }}>
            {skeleton > 0.01 ? (
              <div style={{ position: "absolute", left: 8, top: 11, opacity: skeleton }}>
                <Sk w={[190, 150, 170, 210, 140, 180][i % 6]} h={11} />
              </div>
            ) : null}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 4,
                background: isSel ? c.primary100 : isHover ? c.hover : "transparent",
                color: isSel ? c.primaryHover : c.textStrong,
                display: "flex",
                alignItems: "center",
                padding: "0 8px",
                fontSize: 12.5,
                opacity: p,
                transform: `translateY(${(1 - p) * 4}px)`,
              }}
            >
              {o}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const GeneralInfo: React.FC<{ s: SceneState }> = ({ s }) => {
  const F = s.form;
  if (!F.visible) return null;
  const blk = (i: number): React.CSSProperties => ({ opacity: F.field(i).o, transform: `translateY(${F.field(i).y}px)` });
  const chevron = <Icon name="chevron-down" size={11} color={c.muted} style={{ position: "absolute", right: 12 }} />;
  const clientSelected = F.client.value ? CLIENT_INDEX : -1;
  const branchSelected = F.branch.value ? BRANCH_INDEX : -1;

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: font, opacity: F.opacity, transform: `translateY(${F.exitY}px)` }}>
      {/* Orden de compra */}
      <Abs x={FORM.oc.x} y={FORM.oc.y - 20} style={blk(1)}>
        <Label>Número de Orden de Compra</Label>
      </Abs>
      <Abs x={FORM.oc.x} y={FORM.oc.y} style={blk(1)}>
        <Field width={FORM.oc.w} focus={F.oc.focus}>
          <span style={{ color: c.textStrong }}>{F.oc.text}</span>
          {F.oc.caret ? <Caret on /> : null}
        </Field>
      </Abs>

      {/* Sucursal (debajo del panel de Cliente) */}
      <Abs x={FORM.branch.x} y={FORM.branch.y - 20} style={blk(3)}>
        <Label>Sucursal *</Label>
      </Abs>
      <Abs x={FORM.branch.x} y={FORM.branch.y} style={blk(3)}>
        <Field width={FORM.branch.w} focus={F.branch.focus} disabled={1 - F.branch.enabled}>
          {F.branch.value ? (
            <span style={{ color: c.textStrong, opacity: F.branch.valueIn, transform: `translateX(${(1 - F.branch.valueIn) * -4}px)` }}>{F.branch.value}</span>
          ) : (
            <span style={{ color: mix("#7c8696", c.muted, F.branch.enabled) }}>Buscar</span>
          )}
          {F.branch.value ? <Icon name="times" size={10} color={c.muted} style={{ position: "absolute", right: 34, opacity: F.branch.valueIn }} /> : null}
          {chevron}
        </Field>
      </Abs>

      {/* Fecha + Observaciones */}
      <Abs x={FORM.date.x} y={FORM.date.y - 20} style={blk(4)}>
        <Label>Fecha de Creación de Pedido *</Label>
      </Abs>
      <Abs x={FORM.date.x} y={FORM.date.y} style={blk(4)}>
        <Field width={FORM.date.w} disabled={1}>
          <span style={{ color: "#6b7585" }}>{ORDER.date}</span>
          <Icon name="calendar" size={11} color="#8a94a3" style={{ position: "absolute", right: 12 }} />
        </Field>
      </Abs>
      <Abs x={FORM.obs.x} y={FORM.obs.y - 20} style={blk(5)}>
        <Label>Observaciones</Label>
      </Abs>
      <Abs x={FORM.obs.x} y={FORM.obs.y} style={blk(5)}>
        <Field width={FORM.obs.w} height={FORM.obs.h} />
      </Abs>

      {/* Guardar y Continuar */}
      <Abs x={FORM.save.x} y={FORM.save.y} style={blk(6)}>
        <Button
          label="Guardar y Continuar"
          icon="save"
          enabled={F.save.enabled}
          hover={F.save.hover}
          scale={F.save.scale}
          height={FORM.save.h}
          style={{ width: FORM.save.w }}
        />
      </Abs>

      {/* Cliente (va último: su panel se superpone a Sucursal) */}
      <Abs x={FORM.client.x} y={FORM.client.y - 20} style={blk(2)}>
        <Label>Cliente *</Label>
      </Abs>
      <Abs x={FORM.client.x} y={FORM.client.y} style={blk(2)}>
        <Field width={FORM.client.w} focus={F.client.focus}>
          {F.client.value ? (
            <span style={{ color: c.textStrong, opacity: F.client.valueIn, transform: `translateX(${(1 - F.client.valueIn) * -4}px)` }}>{F.client.value}</span>
          ) : (
            <span style={{ color: c.muted }}>Buscar</span>
          )}
          {F.client.value ? <Icon name="times" size={10} color={c.muted} style={{ position: "absolute", right: 34, opacity: F.client.valueIn }} /> : null}
          {chevron}
        </Field>
      </Abs>
      {F.client.panelVisible ? (
        <Dropdown
          field={FORM.client}
          options={CLIENT_OPTIONS}
          panel={F.client.panel}
          hover={F.client.hover}
          selected={clientSelected}
          skeleton={F.client.skeleton}
          optionAt={(i) => Math.min(F.client.optionAt(i), 1 - F.client.skeleton + 0.001)}
        />
      ) : null}
      {F.branch.panelVisible ? (
        <Dropdown
          field={FORM.branch}
          options={BRANCH_OPTIONS}
          panel={F.branch.panel}
          hover={F.branch.hover}
          selected={branchSelected}
          optionAt={F.branch.optionAt}
        />
      ) : null}
    </div>
  );
};
