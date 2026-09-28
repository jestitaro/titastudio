import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { color, radius, shadow } from "../../../design/psmob-tokens";
import { easeInOut, easeOut, pop, range } from "../../../lib/motion";
import { catSrc, FORMS, PDV, PRODUCTS } from "../../data";
import { robotoMono } from "../../lib/fonts";
import { Icon } from "../icons";
import { AppHeader, BottomNav, Chip, NAV_MAIN, SCREEN_W, Tap } from "../Phone";

// Flujo de captura (escena 9): Formularios → tap → Carga de formularios → marcar stock/quiebre
// → Enviar → check de éxito → pantalla de Quiebres detectados.
export const FORM_T = {
  navTap: 10,
  list: [14, 26] as [number, number],
  cardTap: 32,
  toForm: [36, 46] as [number, number],
  marks: [52, 62, 72],
  sendTap: 84,
  success: [88, 102] as [number, number],
  toBreaks: [102, 114] as [number, number],
};
// Estado por producto: 0 = con stock, 1 = quiebre.
export const MARKS: (0 | 1)[] = [0, 1, 0];
const FORM_PRODUCTS = [PRODUCTS[0], PRODUCTS[1], PRODUCTS[2]];

const Thumb: React.FC<{ cat: (typeof PRODUCTS)[number]["cat"]; size?: number }> = ({ cat, size = 44 }) => (
  <div style={{ width: size, height: size, borderRadius: 10, background: "#F5F7FB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <Img src={staticFile(catSrc(cat))} style={{ width: size * 0.9, height: size * 0.9 }} />
  </div>
);

const FormsList: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", inset: 0, background: color.background }}>
    <AppHeader title="Formularios" back right={["filter"]} />
    <div style={{ background: color.primaryDark, padding: "0 16px 14px" }}>
      <div style={{ background: "rgba(255,255,255,0.18)", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, fontWeight: 500 }}>Mayorista Central</div>
    </div>
    <div style={{ padding: "14px 16px" }}>
      <div style={{ fontSize: 17, fontWeight: 600, color: color.textPrimary, marginBottom: 10 }}>Planificados</div>
      {FORMS.map((fm, i) => {
        const sel = i === 1 && f >= FORM_T.cardTap;
        return (
          <div key={fm.title} style={{ background: sel ? color.primaryLight : color.surface, borderRadius: radius.lg, boxShadow: shadow.card, padding: "12px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 10, outline: sel ? `2px solid ${color.primary}` : undefined }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Chip tone="grey" size={11}>
                  {fm.freq}
                </Chip>
                <span style={{ fontSize: 14.5, fontWeight: 600, color: color.textPrimary }}>{fm.title}</span>
              </div>
              <div style={{ fontSize: 12, color: color.textSecondary, marginTop: 6 }}>Última captura: {fm.last}</div>
              <div style={{ fontSize: 12, color: color.textSecondary, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="calendar" size={14} color={color.textSecondary} fill={false} /> F. Límite · {fm.limit}
              </div>
            </div>
            <Icon name="chevron" size={20} color={color.textDisabled} fill={false} />
          </div>
        );
      })}
    </div>
    <Tap f={f} at={FORM_T.cardTap} x={250} y={330} />
  </div>
);

const Segmented: React.FC<{ f: number; at: number; value: 0 | 1 }> = ({ f, at, value }) => {
  const on = f >= at;
  const p = pop(f, at, { damping: 10, stiffness: 200, mass: 0.5 });
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {["Con stock", "Quiebre"].map((l, i) => {
        const active = on && value === i;
        const bg = active ? (i === 0 ? color.success : color.danger) : "#ECEFF1";
        return (
          <div key={l} style={{ padding: "6px 10px", borderRadius: radius.pill, background: bg, color: active ? "#fff" : color.textSecondary, fontSize: 12, fontWeight: 600, transform: active ? `scale(${0.9 + 0.1 * p})` : undefined, display: "flex", alignItems: "center", gap: 4 }}>
            {active && <Icon name={i === 0 ? "check" : "x"} size={13} color="#fff" fill={false} sw={2.6} />}
            {l}
          </div>
        );
      })}
    </div>
  );
};

const FormLoad: React.FC<{ f: number }> = ({ f }) => {
  const done = FORM_T.marks.filter((m) => f >= m).length;
  const ready = done === 3;
  const rowY = [262, 338, 470];
  return (
    <div style={{ position: "absolute", inset: 0, background: color.background }}>
      <AppHeader title="Carga de formularios" back right={["camera"]} />
      <div style={{ background: color.primaryDark, padding: "0 16px 14px" }}>
        <div style={{ background: "rgba(255,255,255,0.18)", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
          <Chip tone="active" dot size={11}>
            Visita activa
          </Chip>
          <span style={{ color: "#fff", fontSize: 13.5, fontWeight: 500 }}>
            {PDV.active.code} - {PDV.active.name}
          </span>
        </div>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: color.textPrimary }}>Quiebres Limpieza Hogar</div>
          <Chip tone={ready ? "done" : "info"}>{done}/3</Chip>
        </div>
        {[
          { title: "Jabón para la ropa", items: [0, 1] },
          { title: "Lavandinas", items: [2] },
        ].map((sec) => (
          <div key={sec.title} style={{ background: color.surface, border: `1px solid ${color.border}`, borderRadius: radius.md, marginBottom: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "12px 14px", gap: 10, borderBottom: `1px solid ${color.border}` }}>
              <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: color.textPrimary }}>{sec.title}</div>
              <Icon name="camera" size={20} color={color.textSecondary} fill={false} />
            </div>
            {sec.items.map((idx) => {
              const pr = FORM_PRODUCTS[idx];
              return (
                <div key={pr.ean} style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid #F0F0F0` }}>
                  <Thumb cat={pr.cat} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11.5, color: color.textSecondary, fontFamily: robotoMono }}>{pr.ean}</div>
                    <div style={{ fontSize: 13.5, color: color.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pr.name}</div>
                    <div style={{ marginTop: 6 }}>
                      <Segmented f={f} at={FORM_T.marks[idx]} value={MARKS[idx]} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 16, right: 16, bottom: 30, display: "flex", gap: 10 }}>
        <div style={{ flex: 1, border: `1.5px solid ${color.textDisabled}`, borderRadius: 8, padding: "13px 0", textAlign: "center", color: "#424242", fontWeight: 600, fontSize: 14 }}>Guardar borrador</div>
        <div style={{ flex: 1, background: ready ? color.accent : "#C9BDFD", borderRadius: 8, padding: "13px 0", textAlign: "center", color: "#fff", fontWeight: 600, fontSize: 14 }}>Enviar formulario</div>
      </div>
      {FORM_T.marks.map((m, i) => (
        <Tap key={m} f={f} at={m} x={MARKS[i] === 0 ? 118 : 205} y={rowY[i]} enter={6} hold={4} />
      ))}
      <Tap f={f} at={FORM_T.sendTap} x={290} y={790} />
    </div>
  );
};

const Success: React.FC<{ f: number }> = ({ f }) => {
  const k = range(f, FORM_T.success, [0, 1], easeOut);
  const draw = range(f, [FORM_T.success[0] + 4, FORM_T.success[0] + 14], [0, 1], easeOut);
  const o = 1 - range(f, [FORM_T.toBreaks[0], FORM_T.toBreaks[0] + 6], [0, 1]);
  return (
    <div style={{ position: "absolute", inset: 0, background: `rgba(255,255,255,${0.92 * k})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, opacity: o }}>
      <svg width={140} height={140} viewBox="0 0 100 100" style={{ transform: `scale(${pop(f, FORM_T.success[0], { damping: 9, stiffness: 180 })})` }}>
        <circle cx="50" cy="50" r="44" fill={color.success} />
        <path d="M30 51 44 65 71 37" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
      </svg>
      <div style={{ fontSize: 20, fontWeight: 600, color: color.textPrimary, opacity: k }}>Formulario enviado</div>
    </div>
  );
};

const Breaks: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", inset: 0, background: color.background }}>
    <AppHeader title="Quiebres detectados" back right={["filter"]} />
    <div style={{ display: "flex", background: color.surface, borderBottom: `1px solid ${color.border}` }}>
      {["Faltantes", "A confirmar"].map((t, i) => (
        <div key={t} style={{ flex: 1, textAlign: "center", padding: "14px 0", fontSize: 14.5, fontWeight: 600, color: i === 0 ? color.primaryDark : color.textSecondary, borderBottom: i === 0 ? `3px solid ${color.primary}` : "3px solid transparent" }}>
          {t}
        </div>
      ))}
    </div>
    <div style={{ padding: 16 }}>
      <div style={{ background: color.dangerLight, borderRadius: radius.md, padding: "10px 12px", fontSize: 13, color: color.dangerDark, marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <Icon name="alert" size={18} color={color.danger} /> 3 productos sin stock en góndola
      </div>
      {[PRODUCTS[1], PRODUCTS[3], PRODUCTS[0]].map((p, i) => {
        const pp = pop(f, FORM_T.toBreaks[1] + i * 3, { damping: 11, stiffness: 170, mass: 0.6 });
        return (
          <div key={p.ean + i} style={{ background: color.surface, borderRadius: radius.lg, boxShadow: shadow.card, padding: "10px 12px", marginBottom: 10, display: "flex", alignItems: "center", gap: 10, transform: `translateX(${(1 - pp) * 40}px)`, opacity: Math.min(1, pp * 2) }}>
            <Thumb cat={p.cat} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11.5, color: color.textSecondary, fontFamily: robotoMono }}>{p.ean}</div>
              <div style={{ fontSize: 13.5, color: color.textPrimary }}>{p.name}</div>
              <div style={{ fontSize: 12, color: color.textSecondary }}>{[PDV.active.name, PDV.list[0].name, PDV.list[1].name][i]}</div>
            </div>
            <div style={{ width: 30, height: 30, borderRadius: 15, background: color.dangerLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="x" size={16} color={color.danger} fill={false} sw={2.6} />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// Transición interna tipo "push" de navegación.
const push = (f: number, r: [number, number]) => range(f, r, [0, 1], easeInOut);

export const FormsFlow: React.FC<{ f: number; under: React.ReactNode }> = ({ f, under }) => {
  const a = push(f, FORM_T.list);
  const b = push(f, FORM_T.toForm);
  const c = push(f, FORM_T.toBreaks);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-a * 30}%)` }}>{under}</div>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${interpolate(a, [0, 1], [SCREEN_W, 0]) - b * SCREEN_W * 0.3}px)`, boxShadow: shadow.modal }}>
        <FormsList f={f} />
      </div>
      {b > 0 && (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${interpolate(b, [0, 1], [SCREEN_W, 0]) - c * SCREEN_W * 0.3}px)`, boxShadow: shadow.modal }}>
          <FormLoad f={f} />
          {f >= FORM_T.success[0] && <Success f={f} />}
        </div>
      )}
      {c > 0 && (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${interpolate(c, [0, 1], [SCREEN_W, 0])}px)`, boxShadow: shadow.modal }}>
          <Breaks f={f} />
        </div>
      )}
      {a < 1 && (
        <>
          <BottomNav items={NAV_MAIN} active={f >= FORM_T.navTap ? 3 : 1} />
          <Tap f={f} at={FORM_T.navTap} x={273} y={800} enter={8} hold={4} />
        </>
      )}
    </div>
  );
};
