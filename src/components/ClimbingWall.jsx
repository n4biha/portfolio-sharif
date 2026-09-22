"use client";

import ClimbingHold, { ClimbingWallDefs } from "./ClimbingHold";
import { ChalkDust } from "./ChalkMark";
import { EXPERIENCES } from "@/lib/experiences";

/*
  The climbing wall content: one bright-blue route weaving up the centre (each
  hold = one of the main experiences, its name chalked beside it), a dotted blue
  trail joining the holds, and a few muted holds scattered around so the wall
  feels like a real bouldering gym. Positions are in % so it scales with the
  viewport; sizes use clamp() via inline calc.
*/

// The route — bottom "start" upward: the four MAIN experiences (the other three
// live in the logbook, see WallLogbook.jsx). `label` says which side of the hold
// its chalk name sits on — always the OUTER side of the zigzag, so a name never
// crosses the trail. The bottom hold is on the right so its name can't run into
// the EXPERIENCE title (bottom-left). Keep x within ~38–62 so every hold stays
// on-screen, and clear of the card, once the wall pans left on open.
const ROUTE = [
  { id: "pm-intern", x: 53, y: 81, size: 54, rot: -8, label: "right" },
  { id: "frontier-pm", x: 41, y: 62, size: 56, rot: 7, label: "left" },
  { id: "eko-health", x: 53, y: 43, size: 53, rot: -5, label: "right" },
  { id: "ibm", x: 42, y: 22, size: 54, rot: 6, label: "left" },
];

// Muted scattered holds for ambiance — kept few, and clear of the route's chalk
// names, the title (bottom-left) and the logbook (right, x ≳ 70, y ~20–80).
// `hideSm` holds are dropped on phones (see .climb-amb-extra in globals.css) so
// the narrow portrait wall isn't crowded; the larger corner holds stay.
const SCATTER = [
  { x: 12, y: 17, size: 36, c: "kraft", v: 0, rot: 12 },
  { x: 24, y: 38, size: 30, c: "pine", v: 1, rot: -18, hideSm: true },
  { x: 13, y: 55, size: 42, c: "denim", v: 2, rot: 8 },
  { x: 66, y: 11, size: 34, c: "pine", v: 0, rot: -12 },
  { x: 64, y: 93, size: 30, c: "charcoal", v: 1, rot: -16 },
  { x: 85, y: 91, size: 32, c: "tomato", v: 2, rot: 8, hideSm: true },
];

// A point on the Catmull-Rom spline between p1 and p2 (p0/p3 = the neighbouring
// holds), t in 0..1. The spline passes through every hold, so the dotted trail
// flows through the route's curves as one line instead of arcing hold-to-hold.
function splinePoint(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  const f = (a, b, c, d) =>
    0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (3 * b - a - 3 * c + d) * t3);
  return {
    x: +f(p0.x, p1.x, p2.x, p3.x).toFixed(2),
    y: +f(p0.y, p1.y, p2.y, p3.y).toFixed(2),
  };
}

// Dots for one leg of the route. Lengths are in rough screen terms (x is weighted
// 1.6× — the wall is roughly that much wider than tall, so 1% of x covers more
// ground than 1% of y). Each leg's dots are sampled only from its middle stretch,
// leaving DOT_CLEAR at both ends, so a dot never sits half-tucked under a hold;
// the count then scales with what's left so spacing stays even on any reach.
const DOT_CLEAR = 4.2;
const DOT_SPACING = 4.2;

function dotsForLeg(a, i) {
  const b = ROUTE[i + 1];
  const prev = ROUTE[i - 1] ?? a;
  const next = ROUTE[i + 2] ?? b;
  const len = Math.hypot((b.x - a.x) * 1.6, b.y - a.y);
  const t0 = DOT_CLEAR / len;
  const n = Math.max(3, Math.round((len - 2 * DOT_CLEAR) / DOT_SPACING));
  return Array.from({ length: n }, (_, j) =>
    splinePoint(prev, a, b, next, t0 + ((1 - 2 * t0) * (j + 0.5)) / n)
  );
}

const DOTS = ROUTE.slice(0, -1).flatMap(dotsForLeg);

// Per-dot stagger, derived from the dot count so the whole trail always traces in
// over the same ~1.4s however many holds the route has.
const DOT_STEP = 1.44 / DOTS.length;

// The chalk label shows only when a role started ("May 2026"), not the whole
// range — that stays on the card and in the logbook. Derived from the entry's
// `date` ("May 2026 – August 2026") so there's one source of truth.
const startOf = (date) => (date ?? "").split(/\s[–-]\s/)[0].trim();

// Modest, viewport-responsive sizing: base is the px from the data, gently scaled.
const px = (base) => `clamp(${base * 0.62}px, ${base * 0.13}vw + ${base * 0.5}px, ${base * 1.15}px)`;

export default function ClimbingWall({ selectedId = null, onSelect, hint = false }) {
  const sel = ROUTE.find((h) => h.id === selectedId);
  return (
    <div className="climb-stage">
      <ClimbingWallDefs />

      {/* scattered ambiance holds (back) */}
      {SCATTER.map((h, i) => (
        <div
          key={`s${i}`}
          className={`climb-hold-pos${h.hideSm ? " climb-amb-extra" : ""}`}
          style={{ left: `${h.x}%`, top: `${h.y}%`, transform: `translate(-50%, -50%) rotate(${h.rot}deg)` }}
        >
          <ClimbingHold color={h.c} variant={h.v} size={px(h.size)} />
        </div>
      ))}

      {/* dotted route trail — drawn in sequentially (bottom hold -> top) via a
          per-dot animation delay, so it's absent on entry then draws itself. */}
      {DOTS.map((d, i) => (
        <span
          key={`d${i}`}
          className="climb-dot"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            animationDelay: `${(0.35 + i * DOT_STEP).toFixed(2)}s`,
          }}
        />
      ))}

      {/* the blue route holds (front) — clickable; each opens its chapter. The
          chalk name sits INSIDE the button (absolutely placed, so the button's box
          is still just the rock): hovering or clicking the name acts on the rock,
          with no second tab stop. `--rot` lets the name counter-rotate so it reads
          level while the rock stays tilted. */}
      {ROUTE.map((h, i) => {
        const exp = EXPERIENCES[h.id];
        return (
          <button
            type="button"
            key={h.id}
            className={`climb-hold-pos climb-hold-btn${selectedId === h.id ? " is-selected" : ""}`}
            style={{
              left: `${h.x}%`,
              top: `${h.y}%`,
              transform: `translate(-50%, -50%) rotate(${h.rot}deg)`,
              "--rot": `${h.rot}deg`,
            }}
            onClick={(e) => onSelect?.(h.id, e.currentTarget)}
            aria-label={`Open ${exp.company}, ${exp.roleName}`}
          >
            <ClimbingHold color="blue" variant={i % 3} size={px(h.size)} route />
            <span className={`hold-label hold-label--${h.label}`} aria-hidden="true">
              {exp.label ?? exp.company}
              {exp.date && <span className="hold-label-date">{startOf(exp.date)}</span>}
            </span>
            {/* one-time sparkle hint on the bottom (first) hold — "start here" */}
            {i === 0 && hint && (
              <span className="climb-hint" aria-hidden="true">
                <span className="hint-ring" />
                <span className="hint-ring r2" />
                <span className="spark s1" />
                <span className="spark s2" />
                <span className="spark s3" />
                <span className="spark s4" />
                <span className="spark s5" />
              </span>
            )}
          </button>
        );
      })}

      {/* selected hold gets a puff of chalk dust on click */}
      {sel && (
        <ChalkDust key={selectedId} style={{ left: `${sel.x}%`, top: `${sel.y}%` }} />
      )}
    </div>
  );
}
