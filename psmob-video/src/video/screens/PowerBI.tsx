import React from "react";
import { interpolate } from "remotion";
import { easeInOut, easeOut, range } from "../../lib/motion";
import { FONT } from "../ds/tokens";
import { Icon } from "../ui/icons";
import { ar } from "./data";

// Reporte con lenguaje de Power BI (sin marcas de terceros): lienzo gris claro, visuales blancos con título
// chico, segmentadores arriba, tarjetas de KPI, columnas agrupadas con leyenda, línea con marcadores,
// anillo, matriz con barras de datos e íconos, pestañas de página abajo y panel de filtros colapsado.
const PBI = {
  canvas: "#F3F2F1",
  tile: "#FFFFFF",
  border: "#E1DFDD",
  title: "#252423",
  text: "#605E5C",
  s1: "#118DFF",
  s2: "#12239E",
  s3: "#E66C37",
  s4: "#6B007B",
  good: "#1AAB40",
  bad: "#D64554",
};

const cnt = (f: number, at: number, to: number, dur = 30) => interpolate(f, [at, at + dur], [0, to], { easing: easeOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const Visual: React.FC<{ title: string; children: React.ReactNode; style?: React.CSSProperties; f: number; at: number }> = ({ title, children, style, f, at }) => {
  const p = range(f, [at, at + 14], [0, 1], easeOut);
  return (
    <div style={{ background: PBI.tile, border: `1px solid ${PBI.border}`, padding: "10px 12px", display: "flex", flexDirection: "column", opacity: p, transform: `translateY(${(1 - p) * 10}px)`, ...style }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: PBI.title, marginBottom: 6 }}>{title}</div>
      <div style={{ flex: 1, position: "relative" }}>{children}</div>
    </div>
  );
};

const Card: React.FC<{ f: number; at: number; value: string; label: string; delta: string; good: boolean }> = ({ f, at, value, label, delta, good }) => {
  const p = range(f, [at, at + 14], [0, 1], easeOut);
  return (
    <div style={{ flex: 1, background: PBI.tile, border: `1px solid ${PBI.border}`, padding: "10px 14px", opacity: p, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ fontSize: 34, fontWeight: 600, color: PBI.title, lineHeight: 1.05 }}>{value}</div>
      <div style={{ fontSize: 13, color: PBI.text, marginTop: 2 }}>{label}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: good ? PBI.good : PBI.bad, marginTop: 4 }}>{delta}</div>
    </div>
  );
};

const Slicer: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ width: 180 }}>
    <div style={{ fontSize: 11, color: PBI.text, marginBottom: 3 }}>{label}</div>
    <div style={{ height: 26, border: `1px solid ${PBI.border}`, background: PBI.tile, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", fontSize: 12, color: PBI.title }}>
      {value}
      <div style={{ transform: "rotate(90deg)" }}>
        <Icon name="chevron" size={12} color={PBI.text} fill={false} />
      </div>
    </div>
  </div>
);

const CATS = [
  ["Aderezos", 50.7, 60],
  ["Deos", 73.6, 70],
  ["Jabón", 53.0, 65],
  ["Ropa", 67.8, 70],
  ["Suaviz.", 70.9, 65],
  ["Lavav.", 58.2, 60],
] as const;

const Columns: React.FC<{ f: number; at: number; w: number; h: number }> = ({ f, at, w, h }) => {
  const base = h - 22;
  const gw = (w - 40) / CATS.length;
  const bw = gw * 0.32;
  const y = (v: number) => base - (v / 100) * (base - 26);
  return (
    <svg width={w} height={h}>
      <g fontFamily={FONT} fontSize={10} fill={PBI.text}>
        <rect x={34} y={2} width={9} height={9} fill={PBI.s1} />
        <text x={47} y={10}>Actual</text>
        <rect x={94} y={2} width={9} height={9} fill={PBI.s2} />
        <text x={107} y={10}>Objetivo</text>
      </g>
      {[0, 25, 50, 75, 100].map((t) => (
        <g key={t}>
          <line x1={30} x2={w} y1={y(t)} y2={y(t)} stroke="#EDEBE9" />
          <text x={0} y={y(t) + 3} fontSize={10} fill={PBI.text} fontFamily={FONT}>
            {t}
          </text>
        </g>
      ))}
      {CATS.map(([n, a, o], i) => {
        const k = range(f, [at + i * 3, at + i * 3 + 26], [0, 1], easeInOut);
        const x = 36 + i * gw;
        return (
          <g key={n}>
            <rect x={x} y={y(a * k)} width={bw} height={base - y(a * k)} fill={PBI.s1} />
            <rect x={x + bw + 2} y={y(o * k)} width={bw} height={base - y(o * k)} fill={PBI.s2} />
            <text x={x + bw} y={base + 14} textAnchor="middle" fontSize={10} fill={PBI.text} fontFamily={FONT}>
              {n}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const Line: React.FC<{ f: number; at: number; w: number; h: number }> = ({ f, at, w, h }) => {
  const data = [71, 74, 72, 78, 81, 80, 85, 89.2];
  const base = h - 18;
  const x = (i: number) => 30 + (i / (data.length - 1)) * (w - 44);
  const y = (v: number) => base - ((v - 60) / 40) * (base - 8);
  const k = range(f, [at, at + 40], [0, 1], easeInOut);
  const d = data.map((v, i) => `${i ? "L" : "M"}${x(i)} ${y(v)}`).join(" ");
  return (
    <svg width={w} height={h}>
      {[60, 80, 100].map((t) => (
        <g key={t}>
          <line x1={26} x2={w} y1={y(t)} y2={y(t)} stroke="#EDEBE9" />
          <text x={0} y={y(t) + 3} fontSize={10} fill={PBI.text} fontFamily={FONT}>
            {t}
          </text>
        </g>
      ))}
      <path d={d} fill="none" stroke={PBI.s1} strokeWidth={2.5} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - k} />
      {data.map((v, i) => (i / (data.length - 1) <= k ? <circle key={i} cx={x(i)} cy={y(v)} r={3.5} fill={PBI.s1} stroke="#fff" strokeWidth={1.5} /> : null))}
      {k > 0.98 && (
        <text x={x(data.length - 1) - 4} y={y(89.2) - 8} textAnchor="end" fontSize={11} fontWeight={600} fill={PBI.title} fontFamily={FONT}>
          89,2%
        </text>
      )}
    </svg>
  );
};

const Donut: React.FC<{ f: number; at: number; size: number }> = ({ f, at, size }) => {
  const parts = [
    ["Completadas", 62, PBI.s1],
    ["En curso", 23, PBI.s2],
    ["Pendientes", 15, PBI.s3],
  ] as const;
  const k = range(f, [at, at + 36], [0, 1], easeInOut);
  const r = size / 2 - 12;
  const C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {parts.map(([n, v, c]) => {
            const len = (v / 100) * C * k;
            const el = <circle key={n} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={c} strokeWidth={22} strokeDasharray={`${Math.max(0, len - 2)} ${C}`} strokeDashoffset={-acc * k} />;
            acc += (v / 100) * C;
            return el;
          })}
        </g>
        <text x={size / 2} y={size / 2 + 6} textAnchor="middle" fontSize={18} fontWeight={600} fill={PBI.title} fontFamily={FONT}>
          {Math.round(cnt(f, at, 1248, 36))}
        </text>
      </svg>
      <div style={{ fontSize: 12, color: PBI.text, lineHeight: 1.9 }}>
        {parts.map(([n, v, c]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 9, height: 9, background: c, display: "inline-block" }} />
            {n} <b style={{ color: PBI.title }}>{v}%</b>
          </div>
        ))}
      </div>
    </div>
  );
};

const Matrix: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const rows = [
    ["SUPERMERCADO NORTE", 96.1, 1.2],
    ["MAYORISTA CENTRAL", 91.4, 0.8],
    ["AUTOSERVICIO LUNA", 84.0, -0.6],
    ["DISTRIBUIDORA SUR", 77.3, -1.4],
  ] as const;
  return (
    <div style={{ fontSize: 12, color: PBI.title }}>
      <div style={{ display: "flex", fontWeight: 600, borderBottom: `1px solid ${PBI.border}`, paddingBottom: 4 }}>
        <div style={{ flex: 1.6 }}>PDV</div>
        <div style={{ flex: 1.2 }}>OSA %</div>
        <div style={{ width: 54, textAlign: "right" }}>Var.</div>
      </div>
      {rows.map(([n, v, d], i) => {
        const k = range(f, [at + i * 4, at + i * 4 + 22], [0, 1], easeOut);
        return (
          <div key={n} style={{ display: "flex", alignItems: "center", padding: "6px 0", borderBottom: `1px solid #F3F2F1` }}>
            <div style={{ flex: 1.6 }}>{n}</div>
            <div style={{ flex: 1.2, position: "relative", height: 16 }}>
              <div style={{ position: "absolute", left: 0, top: 1, height: 14, width: `${v * k * 0.9}%`, background: "#9ACDFF" }} />
              <span style={{ position: "relative", paddingLeft: 4 }}>{ar(v * k, 1)}</span>
            </div>
            <div style={{ width: 54, textAlign: "right", color: d > 0 ? PBI.good : PBI.bad, fontWeight: 600 }}>
              {d > 0 ? "▲" : "▼"} {ar(Math.abs(d), 1)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const PowerBIReport: React.FC<{ f: number; w: number; h: number }> = ({ f, w, h }) => (
  <div style={{ width: w, height: h, background: PBI.canvas, fontFamily: FONT, display: "flex", flexDirection: "column" }}>
    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
      <div style={{ flex: 1, padding: 14, display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: PBI.title }}>Trade Marketing · Resumen</div>
            <div style={{ fontSize: 12, color: PBI.text }}>Semana 39 · actualizado hace 1 min</div>
          </div>
          <Slicer label="Región" value="Todas" />
          <Slicer label="Canal" value="Todos" />
          <Slicer label="Semana" value="22/09 – 28/09/2026" />
        </div>
        <div style={{ display: "flex", gap: 10, height: 104 }}>
          <Card f={f} at={2} value={`${ar(cnt(f, 2, 89.2), 1)}%`} label="OSA" delta="▲ 4,1 pts vs. sem. ant." good />
          <Card f={f} at={6} value={`${ar(cnt(f, 6, 73.5), 1)}%`} label="Exhibición" delta="▲ 2,3 pts vs. sem. ant." good />
          <Card f={f} at={10} value={ar(cnt(f, 10, 1248), 0)} label="Visitas realizadas" delta="▲ 12% vs. sem. ant." good />
          <Card f={f} at={14} value={ar(cnt(f, 14, 312), 0)} label="Quiebres" delta="▼ 32% vs. sem. ant." good />
        </div>
        <div style={{ display: "flex", gap: 10, flex: 1, minHeight: 0 }}>
          <Visual f={f} at={18} title="Cumplimiento de exhibición por categoría" style={{ flex: 1.25 }}>
            <Columns f={f} at={24} w={520} h={250} />
          </Visual>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            <Visual f={f} at={22} title="OSA % por semana" style={{ flex: 1 }}>
              <Line f={f} at={28} w={400} h={110} />
            </Visual>
            <Visual f={f} at={26} title="Visitas por estado" style={{ flex: 1 }}>
              <Donut f={f} at={32} size={110} />
            </Visual>
          </div>
        </div>
        <Visual f={f} at={30} title="OSA por punto de venta" style={{ height: 176 }}>
          <Matrix f={f} at={36} />
        </Visual>
      </div>
      {/* Panel de filtros colapsado */}
      <div style={{ width: 28, background: PBI.tile, borderLeft: `1px solid ${PBI.border}`, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 16 }}>
        <div style={{ writingMode: "vertical-rl", fontSize: 12, color: PBI.text }}>Filtros</div>
      </div>
    </div>
    {/* Pestañas de página */}
    <div style={{ height: 32, background: PBI.tile, borderTop: `1px solid ${PBI.border}`, display: "flex", alignItems: "stretch", paddingLeft: 12, fontSize: 12 }}>
      {["Resumen", "Quiebres", "Exhibición", "Equipo"].map((t, i) => (
        <div key={t} style={{ padding: "0 16px", display: "flex", alignItems: "center", color: i === 0 ? PBI.title : PBI.text, fontWeight: i === 0 ? 600 : 400, borderTop: i === 0 ? `3px solid ${PBI.s1}` : "3px solid transparent", background: i === 0 ? "#FAF9F8" : undefined }}>
          {t}
        </div>
      ))}
    </div>
  </div>
);
