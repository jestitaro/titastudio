import React from "react";
import { AbsoluteFill } from "remotion";
import { roboto } from "../../design/fonts";
import { ink } from "../../design/illustration";
import { caro, Design, nico } from "./designs";
import { Figure } from "./Figure";
import { caroPoses, expressions, nicoPoses } from "./poses";
import { Expression, Pose, Variant } from "./types";

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: roboto, fontSize: 20, fontWeight: 500, color: ink.slate, marginTop: 10, textAlign: "center" }}>{children}</div>
);

const Frame: React.FC<{ w: number; h: number; children: React.ReactNode }> = ({ w, h, children }) => (
  <div style={{ width: w, height: h, background: "#FFFFFF", borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
    {children}
  </div>
);

export const CharacterSheetV2: React.FC<{ who: "caro" | "nico"; variant: Variant }> = ({ who, variant }) => {
  const d: Design = who === "caro" ? caro : nico;
  const poses = who === "caro" ? caroPoses : nicoPoses;
  const poseExpr: Record<string, Expression> =
    who === "caro"
      ? { neutral: expressions.neutral, phone: expressions.phone, stress: expressions.stress }
      : { neutral: expressions.neutral, phone: expressions.phoneGrin, stress: expressions.awkward };
  const smile = who === "caro" ? expressions.smile : expressions.grin;
  const swatches = [d.pal.skin, d.pal.skinShade, d.pal.hair, d.pal.hairShade, d.pal.top, d.pal.topShade, d.pal.bottom, ink.line];
  const order: (keyof typeof poses)[] = ["neutral", "phone", "stress"];

  return (
    <AbsoluteFill style={{ background: "#F3F1F8", padding: "44px 56px", fontFamily: roboto }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
        <div style={{ fontSize: 44, fontWeight: 700, color: ink.line }}>{d.name}</div>
        <div style={{ fontSize: 24, color: ink.slate }}>{d.role}</div>
        <div
          style={{
            marginLeft: "auto",
            fontSize: 20,
            fontWeight: 600,
            color: "#FFFFFF",
            background: variant === "A" ? ink.slate : ink.purple,
            padding: "6px 16px",
            borderRadius: 20,
          }}
        >
          {variant === "A" ? "Variante A · cercana al estilo actual" : "Variante B · refinada / premium"}
        </div>
      </div>

      <div style={{ display: "flex", gap: 28, marginTop: 28 }}>
        {order.map((k) => {
          const pose: Pose = poses[k];
          return (
            <div key={k}>
              <Frame w={380} h={780}>
                <Figure d={d} variant={variant} pose={pose} e={poseExpr[k]} viewBox="40 16 520 1068" />
              </Frame>
              <Label>{pose.name}</Label>
            </div>
          );
        })}

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginLeft: 8 }}>
          {[
            { e: smile, t: "Sonrisa" },
            { e: expressions.concern, t: "Preocupación leve" },
          ].map(({ e, t }) => (
            <div key={t}>
              <Frame w={300} h={318}>
                <Figure d={d} variant={variant} pose={poses.neutral} e={e} viewBox="150 30 300 318" />
              </Frame>
              <Label>{t}</Label>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginLeft: 8, width: 150 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: ink.slate, marginBottom: 4 }}>Paleta</div>
          {swatches.map((c) => (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: c, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)" }} />
              <div style={{ fontSize: 15, color: ink.slate, fontFamily: "'Roboto Mono', monospace" }}>{c}</div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
