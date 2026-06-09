"use client";

import ClimbingHold, { ClimbingWallDefs } from "./ClimbingHold";
import { ChalkDust } from "./ChalkMark";

/*
  The climbing wall content: one bright-blue route weaving up the centre (each
  hold = a future experience), a dotted blue trail joining the holds, and muted
  holds scattered around so the wall feels like a real bouldering gym. Positions
  are in % so it scales with the viewport; sizes use clamp() via inline calc.
*/

// The route — bottom "start" to top "future". x weaves around centre (50%).
const ROUTE = [
  { id: "code-ninjas", x: 46, y: 85, size: 64, rot: -8 },
  { id: "datastory", x: 58, y: 69, size: 60, rot: 7 },
  { id: "behavioral", x: 44, y: 53, size: 66, rot: -5 },
  { id: "pm-intern", x: 58, y: 37, size: 62, rot: 9 },
  { id: "future", x: 49, y: 21, size: 56, rot: -6 },
];

// Muted scattered holds — mostly off to the sides of the route for ambiance.
const SCATTER = [
  { x: 12, y: 17, size: 36, c: "kraft", v: 0, rot: 12 },
  { x: 25, y: 31, size: 30, c: "pine", v: 1, rot: -18 },
  { x: 14, y: 53, size: 42, c: "denim", v: 2, rot: 8 },
  { x: 9, y: 75, size: 30, c: "mustard", v: 0, rot: -10 },
  { x: 27, y: 89, size: 34, c: "charcoal", v: 1, rot: 20 },
  { x: 33, y: 13, size: 28, c: "tomato", v: 2, rot: 6 },
  { x: 70, y: 13, size: 38, c: "pine", v: 0, rot: -12 },
  { x: 83, y: 25, size: 30, c: "mustard", v: 1, rot: 14 },
  { x: 72, y: 43, size: 44, c: "kraft", v: 2, rot: -8 },
  { x: 87, y: 55, size: 30, c: "denim", v: 0, rot: 10 },
  { x: 74, y: 69, size: 36, c: "charcoal", v: 1, rot: -16 },
  { x: 88, y: 81, size: 32, c: "tomato", v: 2, rot: 8 },
  { x: 66, y: 87, size: 30, c: "pine", v: 0, rot: -6 },
  { x: 37, y: 75, size: 26, c: "mustard", v: 1, rot: 18 },
  { x: 63, y: 55, size: 26, c: "kraft", v: 2, rot: -14 },
  { x: 39, y: 40, size: 24, c: "denim", v: 0, rot: 10 },
  { x: 20, y: 43, size: 26, c: "tomato", v: 1, rot: -8 },
  { x: 81, y: 37, size: 24, c: "charcoal", v: 2, rot: 12 },
  { x: 30, y: 63, size: 28, c: "pine", v: 0, rot: -20 },
  { x: 85, y: 14, size: 24, c: "kraft", v: 1, rot: 6 },
];

// Sample dots along a gentle curve between two route holds (quadratic bezier with
// a perpendicular control-point offset so the trail weaves rather than runs straight).
function dotsBetween(a, b, idx) {
  const N = 6;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const off = (idx % 2 === 0 ? 1 : -1) * 5; // perpendicular weave, %
  const cx = mx + (-dy / len) * off;
  const cy = my + (dx / len) * off;
  const out = [];
  for (let i = 1; i <= N; i++) {
    const t = i / (N + 1);
    const u = 1 - t;
    out.push({
      x: u * u * a.x + 2 * u * t * cx + t * t * b.x,
      y: u * u * a.y + 2 * u * t * cy + t * t * b.y,
    });
  }
  return out;
}

const DOTS = ROUTE.slice(0, -1).flatMap((a, i) => dotsBetween(a, ROUTE[i + 1], i));

// Modest, viewport-responsive sizing: base is the px from the data, gently scaled.
const px = (base) => `clamp(${base * 0.62}px, ${base * 0.13}vw + ${base * 0.5}px, ${base * 1.15}px)`;

export default function ClimbingWall({ selectedId = null, onSelect }) {
  const sel = ROUTE.find((h) => h.id === selectedId);
  return (
    <div className="climb-stage">
      <ClimbingWallDefs />

      {/* scattered ambiance holds (back) */}
      {SCATTER.map((h, i) => (
        <div
          key={`s${i}`}
          className="climb-hold-pos"
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
            animationDelay: `${0.35 + i * 0.06}s`,
          }}
        />
      ))}

      {/* the blue route holds (front) — clickable; each opens its chapter */}
      {ROUTE.map((h, i) => (
        <button
          type="button"
          key={h.id}
          className={`climb-hold-pos climb-hold-btn${selectedId === h.id ? " is-selected" : ""}`}
          style={{ left: `${h.x}%`, top: `${h.y}%`, transform: `translate(-50%, -50%) rotate(${h.rot}deg)` }}
          onClick={() => onSelect?.(h.id)}
          aria-label={`Open the ${h.id.replace(/-/g, " ")} chapter`}
        >
          <ClimbingHold color="blue" variant={i % 3} size={px(h.size)} route />
        </button>
      ))}

      {/* selected hold gets a puff of chalk dust on click */}
      {sel && (
        <ChalkDust key={selectedId} style={{ left: `${sel.x}%`, top: `${sel.y}%` }} />
      )}
    </div>
  );
}
