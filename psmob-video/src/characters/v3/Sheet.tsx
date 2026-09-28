import React from "react";
import { AbsoluteFill } from "remotion";
import { roboto } from "../../design/fonts";
import { caro, exprs, nico, posesFor } from "./cast";
import { Figure } from "./Figure";

const INK = "#1E2257";
const MUTED = "#5B5F86";

const Card: React.FC<{ w: number; h: number; label?: string; children: React.ReactNode }> = ({ w, h, label, children }) => (
  <div>
    <div style={{ width: w, height: h, background: "#FFFFFF", borderRadius: 18, overflow: "hidden" }}>{children}</div>
    {label && <div style={{ fontFamily: roboto, fontSize: 18, color: MUTED, textAlign: "center", marginTop: 8 }}>{label}</div>}
  </div>
);

export const SheetV3: React.FC<{ who: "caro" | "nico" }> = ({ who }) => {
  const c = who === "caro" ? caro : nico;
  const poses = posesFor(who);
  const poseExpr = { neutral: exprs.neutral, phone: exprs.phone, stress: exprs.stress };
  const heads: { k: keyof typeof exprs; t: string }[] = [
    { k: "neutral", t: "Neutral" },
    { k: "smile", t: "Sonrisa" },
    { k: "laugh", t: "Entusiasmo" },
    { k: "concern", t: "Preocupación leve" },
    { k: "stress", t: "Estrés" },
  ];
  return (
    <AbsoluteFill style={{ background: "#F1F0FA", padding: "40px 48px", fontFamily: roboto, flexDirection: "row", gap: 36 }}>
      <div style={{ width: 250, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 56, fontWeight: 700, color: INK }}>{c.name}</div>
        <div style={{ fontSize: 24, color: INK, marginTop: 4 }}>{c.role}</div>
        <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 6 }}>
          {c.traits.map((t) => (
            <div key={t} style={{ fontSize: 20, color: MUTED }}>
              {t}
            </div>
          ))}
        </div>
        <div style={{ marginTop: "auto", fontSize: 18, fontWeight: 600, color: INK }}>Paleta</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
          {c.palette.map((p) => (
            <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 15, background: p.color, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)" }} />
              <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.2 }}>
                {p.label}
                <br />
                <span style={{ fontFamily: "'Roboto Mono', monospace" }}>{p.color}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", gap: 22 }}>
          {(["neutral", "phone", "stress"] as const).map((k) => (
            <Card key={k} w={420} h={600} label={poses[k].name}>
              <Figure c={c} pose={poses[k]} e={poseExpr[k]} uid={`${who}-${k}`} viewBox="40 20 540 772" />
            </Card>
          ))}
        </div>
        <div style={{ display: "flex", gap: 18 }}>
          {heads.map(({ k, t }) => (
            <Card key={k} w={240} h={210} label={t}>
              <Figure c={c} pose={poses.neutral} e={exprs[k]} uid={`${who}-h-${k}`} viewBox="130 50 340 298" />
            </Card>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
