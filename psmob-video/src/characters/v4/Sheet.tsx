import React from "react";
import { AbsoluteFill } from "remotion";
import { roboto } from "../../design/fonts";
import { Caro } from "./Caro";
import { Nico } from "./Nico";

const INK = "#1E2257";
const MUTED = "#5B5F86";

const Card: React.FC<{ w: number; h: number; label: string; children: React.ReactNode }> = ({ w, h, label, children }) => (
  <div>
    <div style={{ width: w, height: h, background: "#FFFFFF", borderRadius: 22, overflow: "hidden" }}>{children}</div>
    <div style={{ fontFamily: roboto, fontSize: 19, color: MUTED, textAlign: "center", marginTop: 10 }}>{label}</div>
  </div>
);

export const SheetV4: React.FC<{ who: "caro" | "nico" }> = ({ who }) => {
  const C = who === "caro" ? Caro : Nico;
  const name = who === "caro" ? "Caro" : "Nico";
  const role = who === "caro" ? "Líder de equipo comercial" : "Compañero de equipo";
  return (
    <AbsoluteFill style={{ background: "#F1F0FA", padding: "44px 56px", fontFamily: roboto }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
        <div style={{ fontSize: 52, fontWeight: 700, color: INK }}>{name}</div>
        <div style={{ fontSize: 24, color: MUTED }}>{role}</div>
      </div>
      <div style={{ display: "flex", gap: 26, marginTop: 28 }}>
        {(
          [
            ["neutral", "Neutral"],
            ["phone", "Usando el celular"],
            ["stress", "Estrés / problema"],
          ] as const
        ).map(([p, t]) => (
          <Card key={p} w={410} h={760} label={t}>
            <C pose={p} uid={`${who}-${p}`} viewBox="40 10 560 1040" />
          </Card>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <Card w={300} h={320} label="Sonrisa">
            <C pose="neutral" uid={`${who}-smile`} face={{ mouth: "open", blush: 0.6, browLift: 3 }} headTilt={-4} viewBox="150 40 340 364" />
          </Card>
          <Card w={300} h={320} label="Preocupación leve">
            <C pose="neutral" uid={`${who}-concern`} face={{ mouth: "worried", brow: -5, lookX: -0.4, lookY: 0.3 }} headTilt={2} viewBox="150 40 340 364" />
          </Card>
        </div>
      </div>
    </AbsoluteFill>
  );
};
