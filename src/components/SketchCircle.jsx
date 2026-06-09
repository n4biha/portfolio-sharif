"use client";

/*
  A hand-drawn, imperfect blue "pencil" circle that rings whatever it's placed
  over (the active nav item). Absolutely positioned to overlay its relative
  parent. The loop is deliberately wonky and overshoots past where it started so
  it reads as drawn by hand; a turbulence filter roughens the stroke, and it
  draws itself in on mount (see `.sketch-circle` in globals.css).
*/
export default function SketchCircle() {
  return (
    <svg
      className="sketch-circle"
      viewBox="0 0 200 80"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="sketch-rough">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.022"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.4" />
        </filter>
      </defs>
      {/* one wonky loop that overshoots past its start = hand-drawn feel */}
      <path
        pathLength="100"
        filter="url(#sketch-rough)"
        d="M40 17 C82 4 150 5 178 23 C197 35 190 59 150 68 C99 80 36 77 15 57 C4 45 11 22 49 12 C72 6 122 8 143 17"
      />
    </svg>
  );
}
