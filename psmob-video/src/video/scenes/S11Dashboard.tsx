import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, easeOut, pop, range } from "../../lib/motion";
import { camPath, Char, Layer, LightStudio, POSE, throughBlur } from "../lib/stage";
import type { Cam } from "../lib/stage";
import { C as color, FONT } from "../ds/tokens";
import { ar } from "../screens/data";
import { Icon, IconName } from "../ui/icons";

// Escena 11 — el dashboard es protagonista; Caro y Nico acompañan en los laterales, fuera de los gráficos.
const PANEL = { x: 395, y: 70, w: 1110, h: 830 };
const EXHIB = [
  { name: "Aderezos", pct: 50.74 },
  { name: "Deos", pct: 73.55 },
  { name: "Jabón", pct: 53.03 },
  { name: "Ropa", pct: 67.82 },
  { name: "Suavizantes", pct: 70.92 },
  { name: "Lavavajillas", pct: 58.24 },
];
const IN = -10; // el contenido ya está entrando cuando llega la cámara

// Push-in a los KPI (llegando desde la pantalla de la escena 10) → abre al panel completo con Caro y Nico
// → cierra empujando hacia el ranking de PDV (zoom-through a la góndola de la escena 12).
const cam = (f: number): Cam =>
  camPath(f, [
    { f: 0, x: 740, y: 230, zoom: 2.3 },
    { f: 16, x: 760, y: 235, zoom: 1.95 },
    { f: 40, x: 800, y: 250, zoom: 1.85 },
    { f: 72, x: 960, y: 520, zoom: 1.0 },
    { f: 104, x: 960, y: 520, zoom: 1.04 },
    { f: 120, x: 1200, y: 640, zoom: 2.2 },
  ]);

const Kpi: React.FC<{ f: number; at: number; icon: IconName; label: string; value: number; dec: number; suffix: string; delta: string; good: boolean }> = ({
  f,
  at,
  icon,
  label,
  value,
  dec,
  suffix,
  delta,
  good,
}) => {
  const p = pop(f, at, { damping: 14, stiffness: 140 });
  const v = interpolate(f, [at, at + 26], [0, value], { easing: easeOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ flex: 1, background: "#fff", borderRadius: 18, border: "1px solid #E8EAF3", padding: "16px 18px", transform: `translateY(${(1 - p) * 20}px)`, opacity: Math.min(1, p * 2) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: color.violetSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={22} color={color.violet} />
        </div>
        <div style={{ fontSize: 15, color: "#64748b", fontWeight: 500 }}>{label}</div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 10 }}>
        <div style={{ fontFamily: FONT, fontSize: 38, fontWeight: 900, color: color.dark }}>
          {ar(v, dec)}
          {suffix}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: good ? color.success : color.error }}>{delta}</div>
      </div>
    </div>
  );
};

// Barras: una serie, un tono, extremos redondeados apoyados en la base, etiqueta directa selectiva.
const BarChart: React.FC<{ f: number; at: number; w: number; h: number }> = ({ f, at, w, h }) => {
  const n = EXHIB.length;
  const gap = 22;
  const bw = (w - 40 - gap * (n - 1)) / n;
  const base = h - 40;
  const max = 100;
  return (
    <svg width={w} height={h}>
      {[0, 25, 50, 75, 100].map((t) => (
        <g key={t}>
          <line x1={34} x2={w} y1={base - (t / max) * (base - 20)} y2={base - (t / max) * (base - 20)} stroke="#EEF0F6" strokeWidth={1} />
          <text x={0} y={base - (t / max) * (base - 20) + 4} fontSize={12} fill="#94a3b8" fontFamily={FONT}>
            {t}
          </text>
        </g>
      ))}
      {EXHIB.map((e, i) => {
        const k = range(f, [at + i * 3, at + i * 3 + 24], [0, 1], easeOut);
        const bh = (e.pct / max) * (base - 20) * k;
        const x = 40 + i * (bw + gap);
        const top = base - bh;
        const best = i === 1;
        return (
          <g key={e.name}>
            <path d={`M${x} ${base} V${top + 6} Q${x} ${top} ${x + 6} ${top} H${x + bw - 6} Q${x + bw} ${top} ${x + bw} ${top + 6} V${base} Z`} fill={best ? color.violet : "#B9A6F5"} />
            {best && k > 0.9 && (
              <text x={x + bw / 2} y={top - 10} textAnchor="middle" fontSize={16} fontWeight={700} fill={color.dark} fontFamily={FONT}>
                {ar(e.pct)}%
              </text>
            )}
            <text x={x + bw / 2} y={base + 22} textAnchor="middle" fontSize={12.5} fill="#64748b" fontFamily={FONT}>
              {e.name}
            </text>
          </g>
        );
      })}
      <line x1={34} x2={w} y1={base} y2={base} stroke="#CBD5E1" strokeWidth={1.5} />
    </svg>
  );
};

// Línea: OSA de las últimas 8 semanas, 2px, con meta punteada y etiqueta del último punto.
const LineChart: React.FC<{ f: number; at: number; w: number; h: number }> = ({ f, at, w, h }) => {
  const data = [71, 74, 72, 78, 81, 80, 85, 89.2];
  const x0 = 34;
  const base = h - 30;
  const y = (v: number) => base - ((v - 60) / 40) * (base - 16);
  const x = (i: number) => x0 + (i / (data.length - 1)) * (w - x0 - 50);
  const d = data.map((v, i) => `${i ? "L" : "M"}${x(i)} ${y(v)}`).join(" ");
  const k = range(f, [at, at + 34], [0, 1], easeInOut);
  const endP = pop(f, at + 32, { damping: 10, stiffness: 180 });
  return (
    <svg width={w} height={h}>
      {[60, 70, 80, 90, 100].map((t) => (
        <g key={t}>
          <line x1={x0} x2={w} y1={y(t)} y2={y(t)} stroke="#EEF0F6" />
          <text x={0} y={y(t) + 4} fontSize={12} fill="#94a3b8" fontFamily={FONT}>
            {t}
          </text>
        </g>
      ))}
      <line x1={x0} x2={w - 50} y1={y(85)} y2={y(85)} stroke={color.success} strokeWidth={1.5} strokeDasharray="6 6" opacity={0.7} />
      <text x={w - 46} y={y(85) + 4} fontSize={12} fill={color.success} fontFamily={FONT}>
        Meta
      </text>
      <path d={`${d} L${x(data.length - 1)} ${base} L${x0} ${base} Z`} fill="rgba(112,37,224,0.08)" opacity={k} />
      <path d={d} fill="none" stroke={color.violet} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - k} />
      <g transform={`translate(${x(data.length - 1)} ${y(data[data.length - 1])}) scale(${endP})`}>
        <circle r={8} fill={color.violet} stroke="#fff" strokeWidth={3} />
      </g>
      {endP > 0.5 && (
        <text x={x(data.length - 1) - 8} y={y(data[data.length - 1]) - 16} textAnchor="end" fontSize={16} fontWeight={700} fill={color.dark} fontFamily={FONT}>
          89,2%
        </text>
      )}
      {["S32", "S33", "S34", "S35", "S36", "S37", "S38", "S39"].map((s, i) => (
        <text key={s} x={x(i)} y={base + 22} textAnchor="middle" fontSize={12} fill="#94a3b8" fontFamily={FONT}>
          {s}
        </text>
      ))}
    </svg>
  );
};

const Ranking: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const rows = [
    ["SUPERMERCADO NORTE", 96],
    ["MAYORISTA CENTRAL", 91],
    ["AUTOSERVICIO LUNA", 84],
    ["DISTRIBUIDORA SUR", 77],
  ] as const;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
      {rows.map(([n, v], i) => {
        const k = range(f, [at + i * 4, at + i * 4 + 22], [0, 1], easeOut);
        return (
          <div key={n}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, color: "#334155", marginBottom: 5 }}>
              <span>{n}</span>
              <b>{Math.round(v * k)}%</b>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "#EEF0F6" }}>
              <div style={{ width: `${v * k}%`, height: "100%", borderRadius: 4, background: i === 0 ? color.violet : "#B9A6F5" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Card: React.FC<{ title: string; sub?: string; children: React.ReactNode; style?: React.CSSProperties; f: number; at: number }> = ({ title, sub, children, style, f, at }) => {
  const p = pop(f, at, { damping: 16, stiffness: 120 });
  return (
    <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E8EAF3", padding: "18px 20px", transform: `translateY(${(1 - p) * 24}px)`, opacity: Math.min(1, p * 2), ...style }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontFamily: FONT, fontSize: 19, fontWeight: 800, color: color.dark }}>{title}</div>
        {sub && <div style={{ fontSize: 13, color: "#94a3b8" }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
};

const Dashboard: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", fontFamily: FONT, background: "#F6F7FC" }}>
    <div style={{ width: 70, background: color.dark, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 26, gap: 26 }}>
      {(["dashboard", "users", "pin", "form", "chart", "camera"] as IconName[]).map((ic, i) => (
        <div key={ic} style={{ width: 42, height: 42, borderRadius: 12, background: i === 0 ? "rgba(255,255,255,0.16)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={ic} size={24} color={i === 0 ? "#fff" : "rgba(255,255,255,0.55)"} fill={false} />
        </div>
      ))}
    </div>
    <div style={{ flex: 1, padding: "22px 26px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", opacity: range(f, [IN, IN + 8], [0, 1]) }}>
        <div>
          <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 900, color: color.dark }}>Tablero de Trade Marketing</div>
          <div style={{ fontSize: 14, color: "#64748b" }}>Semana 39 · 22/09/2026 – 28/09/2026</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Todas las regiones", "Todos los canales"].map((t) => (
            <div key={t} style={{ fontSize: 13.5, color: "#334155", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "8px 12px" }}>
              {t}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        <Kpi f={f} at={IN + 2} icon="grid" label="OSA" value={89.2} dec={1} suffix="%" delta="▲ 4,1 pts" good />
        <Kpi f={f} at={IN + 5} icon="store" label="Exhibición" value={73.5} dec={1} suffix="%" delta="▲ 2,3 pts" good />
        <Kpi f={f} at={IN + 8} icon="pin" label="Visitas realizadas" value={1248} dec={0} suffix="" delta="▲ 12%" good />
        <Kpi f={f} at={IN + 11} icon="alert" label="Quiebres" value={-32} dec={0} suffix="%" delta="vs. semana ant." good />
      </div>
      <div style={{ display: "flex", gap: 14, flex: 1 }}>
        <Card f={f} at={IN + 12} title="Exhibición por categoría" sub="% de cumplimiento" style={{ flex: 1.15 }}>
          <BarChart f={f} at={IN + 20} w={500} h={300} />
        </Card>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
          <Card f={f} at={IN + 16} title="OSA · últimas 8 semanas" sub="%">
            <LineChart f={f} at={IN + 24} w={420} h={150} />
          </Card>
          <Card f={f} at={IN + 20} title="Top PDV" sub="cumplimiento" style={{ flex: 1 }}>
            <Ranking f={f} at={IN + 28} />
          </Card>
        </div>
      </div>
    </div>
  </div>
);

export const S11Dashboard: React.FC = () => {
  const f = useCurrentFrame();
  const c = cam(f);
  const blur = throughBlur(f, 120, 12, 10, 12);
  return (
    <AbsoluteFill style={{ overflow: "hidden", filter: blur > 0 ? `blur(${blur}px)` : undefined }}>
      <LightStudio f={f + 675} />
      <Layer cam={c} depth={1}>
        <div style={{ position: "absolute", left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, borderRadius: 28, background: "#F6F7FC", overflow: "hidden", boxShadow: "0 40px 90px rgba(19,13,93,0.22)" }}>
          <Dashboard f={f} />
        </div>
      </Layer>
      {/* Caro y Nico acompañan: aparecen cuando la cámara abre, fuera de las áreas de gráficos */}
      <Layer cam={c} depth={1.08}>
        <Char pose={POSE.caroExplicando} x={180} feetY={1190} scale={0.62} />
        <Char pose={POSE.nicoExplicando} x={1765} feetY={1190} scale={0.57} />
      </Layer>
    </AbsoluteFill>
  );
};
