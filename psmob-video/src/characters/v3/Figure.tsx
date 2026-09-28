import React from "react";
import { armOutline, norm, perp, Pt, sleeveOutline, sub } from "../v2/geometry";
import { Hand, HeldPhone } from "./Hands";
import { Head } from "./Head";
import { Arm, Expr, Look, Pose, Skin } from "./types";

// Figura de medio cuerpo, 3/4 hacia la derecha. viewBox base 600×920.
// Regla de continuidad: nada lleva contorno; las piezas del rig se solapan con el
// mismo color (cuello bajo la cara y el escote, brazo bajo la manga, torso bajo el
// pantalón), así las divisiones internas no se ven.

export type Outfit = {
  sleeve: { reach: number; ease: number; color: string; shade: string; cuff?: string };
  Body: React.FC<{ uid: string }>;
};

export type Layer = "hairBack" | "armFar" | "neck" | "body" | "head" | "hairFront" | "armNear";

export type HairSet = { Back: React.FC<{ sway: number }>; Front: React.FC<{ sway: number }> };

export type Character = {
  id: string;
  name: string;
  role: string;
  traits: string[];
  look: Look;
  jaw: "soft" | "square";
  neck: { w: number };
  browW: number;
  hair: HairSet;
  outfit: Outfit;
  palette: { label: string; color: string }[];
};

const Limb: React.FC<{ a: Arm; skin: Skin; uid: string; scale: number }> = ({ a, skin, uid, scale }) => {
  const d = armOutline(a.S, a.E, a.W, scale);
  const n = perp(norm(sub(a.E, a.S)));
  const off = (p: Pt, k: number): Pt => ({ x: p.x + n.x * k, y: p.y + n.y * k });
  const shade = armOutline(off(a.S, 16), off(a.E, 14), off(a.W, 12), scale * 0.8);
  return (
    <g>
      <clipPath id={uid}>
        <path d={d} />
      </clipPath>
      <path d={d} fill={skin.base} />
      <path d={shade} fill={skin.shade} opacity={0.75} clipPath={`url(#${uid})`} />
      <path d={`M${a.E.x - 7},${a.E.y - 3} Q${a.E.x},${a.E.y + 3} ${a.E.x + 7},${a.E.y - 2}`} stroke={skin.deep} strokeWidth={2.4} strokeLinecap="round" fill="none" opacity={0.7} />
    </g>
  );
};

const Sleeve: React.FC<{ a: Arm; o: Outfit["sleeve"]; uid: string }> = ({ a, o, uid }) => {
  const sl = sleeveOutline(a.S, a.E, o.reach, o.ease);
  const n = perp(sl.axis);
  return (
    <g>
      <clipPath id={uid}>
        <path d={sl.shape} />
      </clipPath>
      <path d={sl.shape} fill={o.color} />
      <path
        d={`M${sl.hem.from.x + n.x * 4},${sl.hem.from.y + n.y * 4} L${a.S.x + n.x * 30},${a.S.y + n.y * 30} L${a.S.x + n.x * 60},${a.S.y + n.y * 60} L${sl.hem.from.x + n.x * 30},${sl.hem.from.y + n.y * 30} Z`}
        fill={o.shade}
        clipPath={`url(#${uid})`}
      />
      <path
        d={`M${sl.hem.from.x},${sl.hem.from.y} Q${sl.hem.mid.x},${sl.hem.mid.y} ${sl.hem.to.x},${sl.hem.to.y}`}
        stroke={o.cuff ?? o.shade}
        strokeWidth={o.cuff ? 16 : 6}
        strokeLinecap="round"
        fill="none"
        clipPath={o.cuff ? undefined : `url(#${uid})`}
      />
    </g>
  );
};

export const Figure: React.FC<{
  c: Character;
  pose: Pose;
  e: Expr;
  uid: string;
  sway?: number;
  breath?: number;
  viewBox?: string;
  only?: Layer;
}> = ({ c, pose, e, uid, sway = 0, breath = 0, viewBox = "0 0 600 920", only }) => {
  const show = (l: Layer) => !only || only === l;
  const { look } = c;
  const skin = look.skin;
  const headT = `translate(${pose.headShift?.x ?? 0},${(pose.headShift?.y ?? 0) + 16 - breath * 3}) rotate(${pose.headTilt},304,360)`;
  const nw = c.neck.w;

  const arm = (a: Arm, key: string) => (
    <g key={key} display={show(key === "far" ? "armFar" : "armNear") ? undefined : "none"}>
      <Limb a={a} skin={skin} uid={`${uid}-${key}-l`} scale={0.95} />
      <Sleeve a={a} o={c.outfit.sleeve} uid={`${uid}-${key}-s`} />
      {a.hand === "relaxed" && <Hand kind="relaxed" at={a.W} from={a.E} s={skin} flip={key === "far"} />}
      {a.hand === "point" && <Hand kind="point" at={a.W} from={a.E} s={skin} flip={key === "far"} rotate={key === "far" ? 20 : -20} />}
      {a.hand === "onHead" && <Hand kind="onHead" at={a.W} from={a.E} s={skin} flip={key === "far"} />}
    </g>
  );

  const holder = pose.phone ? (pose.far.hand === "holdPhone" ? "far" : "near") : null;
  const phoneEl = pose.phone ? <HeldPhone c={pose.phone.c} rot={pose.phone.rot} s={skin} side={holder === "far" ? 1 : -1} /> : null;

  const head = (
    <g transform={headT}>
      {show("head") && <Head e={e} look={look} jaw={c.jaw} browW={c.browW} />}
      {show("hairFront") && <c.hair.Front sway={sway} />}
    </g>
  );

  return (
    <svg viewBox={viewBox} width="100%" height="100%" style={{ overflow: "visible" }}>
      <g transform={headT} display={show("hairBack") ? undefined : "none"}>
        <c.hair.Back sway={sway} />
      </g>

      {!pose.phone && !pose.farArmFront && arm(pose.far, "far")}

      <g transform={`translate(0,${-breath * 2})`} display={show("neck") ? undefined : "none"}>
        <path d={`M${304 - nw / 2},320 L${304 - nw / 2 - 4},424 L${304 + nw / 2 + 4},424 L${304 + nw / 2},330 Z`} fill={skin.base} />
        <path d={`M${304 - nw / 2 - 2},334 C292,376 322,378 ${304 + nw / 2},352 L${304 + nw / 2 + 2},394 C322,408 290,406 ${304 - nw / 2 - 3},394 Z`} fill={skin.shade} />
      </g>

      <g transform={`translate(300,920) scale(${1 + breath * 0.008}) translate(-300,-920)`} display={show("body") ? undefined : "none"}>
        <c.outfit.Body uid={uid} />
      </g>

      {head}

      {holder === "far" && (
        <>
          {arm(pose.far, "far")}
          {!only && phoneEl}
          {arm(pose.near, "near")}
        </>
      )}
      {holder === "near" && (
        <>
          {arm(pose.near, "near")}
          {!only && phoneEl}
          {arm(pose.far, "far")}
        </>
      )}
      {!pose.phone && pose.farArmFront && arm(pose.far, "far")}
      {!pose.phone && arm(pose.near, "near")}

      {!only && pose.stressMarks && (
        <g stroke={look.eye} strokeWidth={4} strokeLinecap="round" opacity={0.8}>
          <path d="M462,120 L480,104" />
          <path d="M470,146 L494,142" />
          <path d="M448,98 L452,76" />
        </g>
      )}
    </svg>
  );
};
