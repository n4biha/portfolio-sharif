"use client";

/*
  White, hand-drawn climbing-chalk graphics — arrows, circles, stars, X's,
  checks, squiggles — as roughened SVG strokes (the turbulence/displacement
  trick from SketchCircle). Plus a chalk-dust burst for clicks. Render <ChalkDefs/>
  once on the page so every mark can reference the shared #chalkRough filter.
*/

const PATHS = {
  arrowUp: ["M50 88 L50 18", "M50 18 L34 36", "M50 18 L66 36"],
  arrowUpRight: ["M18 84 C42 64 58 46 80 24", "M80 24 L58 28", "M80 24 L75 47"],
  circle: [
    "M50 14 C71 12 87 31 85 52 C83 73 63 89 45 86 C27 83 13 64 18 45 C22 28 37 11 52 14 C61 15 67 18 71 23",
  ],
  star: ["M50 10 L60 38 L90 38 L66 56 L75 88 L50 69 L25 88 L34 56 L10 38 L40 38 Z"],
  x: ["M24 24 L76 76", "M76 24 L24 76"],
  check: ["M18 54 L42 80 L84 18"],
  squiggle: ["M8 52 C20 30 32 72 46 50 C60 28 72 72 92 48"],
};

export default function ChalkMark({
  type = "circle",
  size = 60,
  strokeWidth = 3.4,
  stroke = "#f1ede4",
  className = "",
  style,
}) {
  const paths = PATHS[type] ?? PATHS.circle;
  return (
    <svg
      className={`chalk-mark ${className}`}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      style={style}
    >
      <g
        filter="url(#chalkRough)"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}

// Render once; holds the shared chalk roughening filter.
export function ChalkDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <defs>
        <filter id="chalkRough">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" result="disp" />
          <feTurbulence type="fractalNoise" baseFrequency="0.32" numOctaves="3" seed="5" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.7 -0.5" result="mask" />
          <feComposite in="disp" in2="mask" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

// A short puff of chalk dust — deterministic (index-based) directions so it's
// SSR-safe. Mount it (keyed) to replay; it auto-fades via CSS.
const DUST = Array.from({ length: 14 }, (_, i) => {
  const ang = (i / 14) * Math.PI * 2 + (i % 3) * 0.5;
  const dist = 16 + (i % 5) * 9;
  return {
    dx: Math.round(Math.cos(ang) * dist),
    dy: Math.round(Math.sin(ang) * dist - 18), // bias upward
    sz: 4 + (i % 4) * 2,
    delay: (i % 4) * 35,
  };
});

export function ChalkDust({ className = "", style }) {
  return (
    <span className={`chalk-dust ${className}`} aria-hidden="true" style={style}>
      {DUST.map((p, i) => (
        <span
          key={i}
          className="chalk-particle"
          style={{
            "--dx": `${p.dx}px`,
            "--dy": `${p.dy}px`,
            width: p.sz,
            height: p.sz,
            animationDelay: `${p.delay}ms`,
          }}
        />
      ))}
    </span>
  );
}
