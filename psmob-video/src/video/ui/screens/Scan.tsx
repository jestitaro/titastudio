import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { color, radius } from "../../../design/psmob-tokens";
import { easeOut, pop, range } from "../../../lib/motion";
import { catSrc, PRODUCTS } from "../../data";
import { robotoMono } from "../../lib/fonts";
import { Icon } from "../icons";
import { SCREEN_W } from "../Phone";
import { FACINGS, Shelf, SHELF } from "../Shelf";

// Cámara de AiFred (referencias 06_ai_scan_generic): feed de la góndola, barrido de escaneo,
// bounding boxes, precios reconocidos, planograma y progreso. `offline` agrega el modo sin conexión.
export const SCAN = { boxes: 20, prices: 44, plano: 58, p50: 40, p100: 100 };

// Recorte de la góndola que se ve en el feed (coords de la góndola).
const VIEW = { x: 1340, y: 250, s: 0.62 };
const inView = FACINGS.filter((p) => p.level < 2 && p.x > VIEW.x + 20 && p.x < VIEW.x + SCREEN_W / VIEW.s - 20);

export const ScanScreen: React.FC<{ f: number; offline?: number; progressOverride?: number }> = ({ f, offline = 0, progressOverride }) => {
  const scanY = ((f * 9) % 560) + 70;
  const progress = progressOverride ?? Math.round(interpolate(f, [4, SCAN.p50, SCAN.p50 + 20, SCAN.p100], [0, 50, 50, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const sheet = range(f, [SCAN.prices - 6, SCAN.prices + 6], [0, 1], easeOut);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#0B0F2E", overflow: "hidden" }}>
      {/* Feed de cámara */}
      <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN_W, height: 600, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -VIEW.x * VIEW.s, top: -VIEW.y * VIEW.s, transform: `scale(${VIEW.s})`, transformOrigin: "0 0" }}>
          <Shelf dim={0.25} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(11,15,46,0.35), rgba(11,15,46,0) 30%, rgba(11,15,46,0) 70%, rgba(11,15,46,0.6))" }} />
        {/* Barrido */}
        {progress < 100 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: scanY, height: 70, background: "linear-gradient(180deg, rgba(124,92,252,0), rgba(124,92,252,0.35))", borderBottom: "2px solid #B79CFF" }} />
        )}
        {/* Bounding boxes + estado de planograma */}
        {inView.map((p, i) => {
          const at = SCAN.boxes + i * 1.6;
          const k = pop(f, at, { damping: 13, stiffness: 180, mass: 0.6 });
          if (k <= 0.01) return null;
          const bx = (p.x - VIEW.x) * VIEW.s;
          const by = (p.y - VIEW.y) * VIEW.s;
          const w = SHELF.slot * VIEW.s - 8;
          const h = SHELF.productH * VIEW.s - 4;
          const bad = p.kind !== "ok";
          const planoOn = f >= SCAN.plano + i * 0.8;
          const c = !planoOn ? "#B79CFF" : bad ? color.danger : "#69F0AE";
          return (
            <div key={`${p.level}-${p.group}-${p.i}`} style={{ position: "absolute", left: bx - w / 2, top: by - h, width: w, height: h, border: `2px solid ${c}`, borderRadius: 6, transform: `scale(${0.8 + 0.2 * k})`, opacity: k, background: bad && planoOn ? "rgba(244,67,54,0.15)" : undefined }}>
              {planoOn && (
                <div style={{ position: "absolute", right: -8, top: -8, width: 20, height: 20, borderRadius: 10, background: c, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={bad ? "x" : "check"} size={12} color={bad ? "#fff" : "#0B3D1E"} fill={false} sw={3} />
                </div>
              )}
            </div>
          );
        })}
        {/* Precios reconocidos sobre los flejes */}
        {[0, 1].map((level) => {
          const y = (SHELF.levels[level] + 27 - VIEW.y) * VIEW.s;
          return [3, 4].map((g) => {
            const x = ((60 + g * (3 * SHELF.slot + 24) + 1.5 * SHELF.slot) - VIEW.x) * VIEW.s;
            const p = pop(f, SCAN.prices + level * 4 + (g - 3) * 3, { damping: 11, stiffness: 180, mass: 0.6 });
            if (p <= 0.01 || x < 0 || x > SCREEN_W) return null;
            return (
              <div key={`${level}-${g}`} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${p})`, background: color.successDark, color: "#fff", borderRadius: 6, padding: "3px 7px", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4, boxShadow: "0 4px 10px rgba(0,0,0,0.35)" }}>
                <Icon name="check" size={11} color="#fff" fill={false} sw={3} /> Precio OK
              </div>
            );
          });
        })}
      </div>

      {/* Header de la cámara */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 48, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(124,92,252,0.9)", color: "#fff", borderRadius: radius.pill, padding: "6px 12px", fontSize: 13, fontWeight: 600 }}>
          <Icon name="sparkle" size={16} color="#fff" />
          AiFred · {progress < 100 ? "reconociendo" : "listo"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {offline > 0 && (
            <div style={{ opacity: offline, display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.14)", borderRadius: radius.pill, padding: "5px 10px", color: "#fff", fontSize: 12 }}>
              <Icon name="offline" size={15} color="#fff" fill={false} /> Offline
            </div>
          )}
          <Icon name="x" size={22} color="#fff" fill={false} />
        </div>
      </div>

      {/* Progreso */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 590, textAlign: "center", color: "#fff", fontSize: 17, fontWeight: 700 }}>{progress}%</div>
      <div style={{ position: "absolute", left: 0, top: 616, height: 4, width: `${progress}%`, background: "#FFD54F" }} />

      {/* Lista de reconocidos (sheet inferior) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 622, bottom: 0, background: "#131845", padding: "12px 14px", transform: `translateY(${(1 - sheet) * 60}px)`, opacity: sheet }}>
        {[PRODUCTS[2], PRODUCTS[0]].map((p, i) => (
          <div key={p.ean} style={{ marginBottom: 10 }}>
            <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{i === 0 ? "Lavandinas" : "Jabón para la ropa"}</div>
            <div style={{ background: "#fff", borderRadius: 10, padding: "8px 10px", display: "flex", alignItems: "center", gap: 10 }}>
              <Img src={staticFile(catSrc(p.cat))} style={{ width: 34, height: 34 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: color.textSecondary, fontFamily: robotoMono }}>{p.ean}</div>
                <div style={{ fontSize: 13, color: color.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: color.primaryDark, border: `1.5px solid ${color.primary}`, borderRadius: 8, padding: "4px 8px", fontFamily: robotoMono }}>{p.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
