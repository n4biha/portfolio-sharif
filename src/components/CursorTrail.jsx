"use client";

import { useEffect, useRef } from "react";

/*
  Cursor trail — a fixed, pointer-events-none canvas that sprinkles scene-themed
  particles behind the pointer. One component, three variants, one per scene:

    "confetti" — About: small paper confetti bits in muted, dusty versions of
                 the scrapbook accent palette, fluttering down with a sway.
    "chalk"  — Experience: soft white chalk puffs that drift and dissipate
               (same language as the holds' click chalk-dust).
    "motes"  — Projects: warm golden dust motes, like specks caught in the
               record-room lamplight, drifting up with a twinkle.

  Skipped entirely on touch/coarse pointers and for prefers-reduced-motion.
  The rAF loop only runs while particles are alive, so it costs nothing idle.
  Swapping `variant` retunes the spawner in place — in-flight particles finish
  out naturally across a scene change.
*/

// confetti palette — the scrapbook's accent colors (tomato / mustard / pine /
// denim + rose), all dusted down a few notches so the trail reads soft-craft,
// not kids'-party.
const CONFETTI_COLORS = [
  "#c98273", // dusty terracotta (muted tomato)
  "#d9b36a", // soft mustard
  "#6f9a8f", // sea-glass pine
  "#7d94a8", // faded denim
  "#d8a3ad", // dusty rose
  "#e8d9c4", // cream
];

const rand = (a, b) => a + Math.random() * (b - a);

function spawnParticle(variant, x, y) {
  if (variant === "chalk") {
    return {
      kind: "chalk",
      x: x + rand(-3, 3),
      y: y + rand(-3, 3),
      vx: rand(-0.35, 0.35),
      vy: rand(-0.5, 0.1),
      r: rand(2.5, 5.5),
      growth: rand(0.06, 0.14),
      life: 1,
      decay: rand(0.02, 0.035),
    };
  }
  if (variant === "motes") {
    return {
      kind: "mote",
      x: x + rand(-6, 6),
      y: y + rand(-4, 4),
      vx: rand(-0.15, 0.15),
      vy: rand(-0.45, -0.15),
      r: rand(1.2, 2.6),
      phase: rand(0, Math.PI * 2), // twinkle offset
      life: 1,
      decay: rand(0.008, 0.016),
    };
  }
  // confetti
  return {
    kind: "confetti",
    color: CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0],
    // mostly little paper rectangles, some round dots for variety
    round: Math.random() < 0.25,
    x,
    y,
    vx: rand(-0.25, 0.25),
    vy: rand(0.35, 0.8), // gentle fall
    w: rand(4, 7),
    h: rand(2.5, 4),
    rot: rand(0, Math.PI * 2),
    vr: rand(-0.08, 0.08), // slow tumble
    phase: rand(0, Math.PI * 2),
    sway: rand(0.3, 0.8), // horizontal flutter amplitude
    life: 1,
    decay: rand(0.01, 0.018),
  };
}

// one confetti bit: a small tumbling paper rectangle (or dot)
function drawConfetti(ctx, p, alpha) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = p.color;
  if (p.round) {
    ctx.beginPath();
    ctx.arc(0, 0, p.h, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
  }
  ctx.restore();
}

export default function CursorTrail({ variant = "confetti" }) {
  const canvasRef = useRef(null);
  const variantRef = useRef(variant);
  variantRef.current = variant;

  useEffect(() => {
    // desktop-only garnish: skip touch/coarse pointers and reduced motion
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = [];
    let raf = 0;
    let running = false;

    const tick = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= p.decay;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;

        if (p.kind === "chalk") {
          p.r += p.growth;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          g.addColorStop(0, `rgba(233, 227, 216, ${0.4 * p.life})`);
          g.addColorStop(1, "rgba(233, 227, 216, 0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.kind === "mote") {
          p.phase += 0.15;
          const twinkle = 0.55 + 0.45 * Math.sin(p.phase);
          const a = p.life * twinkle;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
          g.addColorStop(0, `rgba(255, 214, 140, ${0.85 * a})`);
          g.addColorStop(0.4, `rgba(255, 214, 140, ${0.25 * a})`);
          g.addColorStop(1, "rgba(255, 214, 140, 0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // confetti flutter: sine sway carries the drift, plus a slow tumble
          p.phase += 0.05;
          p.x += Math.sin(p.phase) * p.sway;
          p.rot += p.vr;
          drawConfetti(ctx, p, Math.min(1, p.life * 1.4));
        }
      }

      if (particles.length) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false; // sleep until the pointer moves again
      }
    };

    // spawn along the pointer's path, metered by distance travelled so fast
    // flicks and slow drags feel equally dense
    let lastX = null;
    let lastY = null;
    let travelled = 0;
    const SPACING = 26; // px of movement per spawn

    const onMove = (e) => {
      if (lastX == null) {
        lastX = e.clientX;
        lastY = e.clientY;
        return;
      }
      travelled += Math.hypot(e.clientX - lastX, e.clientY - lastY);
      lastX = e.clientX;
      lastY = e.clientY;
      if (travelled < SPACING) return;
      travelled = 0;

      const v = variantRef.current;
      const n = v === "chalk" ? 2 : 1; // chalk reads better as a small puff
      for (let i = 0; i < n && particles.length < 90; i++) {
        particles.push(spawnParticle(v, e.clientX, e.clientY));
      }
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 80,
      }}
    />
  );
}
