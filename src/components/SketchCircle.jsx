"use client";

/*
  A hand-drawn, imperfect blue "pencil" circle that rings whatever it's placed
  over (the active nav item). Absolutely positioned to overlay its relative
  parent. The loop is deliberately wonky and overshoots past where it started so
  it reads as drawn by hand, and it draws itself in on mount (see `.sketch-circle`
  in globals.css).

  NB: no SVG roughen filter here on purpose. This circle mounts once the glide to
  the wall has landed (Navbar only renders it when `arrived`), then draws itself in
  over 0.7s after a short delay. A feTurbulence/feDisplacementMap filter on the path
  would be re-rasterised every frame of that stroke animation — a per-frame cost
  that showed up as a hitch. The wonky path + tilt already read as hand-drawn
  without it, so the stroke animates GPU-cheap instead.
*/
export default function SketchCircle() {
  return (
    <svg
      className="sketch-circle"
      viewBox="0 0 200 80"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {/* one wonky loop that overshoots past its start = hand-drawn feel */}
      <path
        pathLength="100"
        d="M40 17 C82 4 150 5 178 23 C197 35 190 59 150 68 C99 80 36 77 15 57 C4 45 11 22 49 12 C72 6 122 8 143 17"
      />
    </svg>
  );
}
