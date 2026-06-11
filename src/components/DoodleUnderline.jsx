"use client";

/*
  A wobbly, hand-drawn blue underline that draws itself in beneath the active nav
  item (everything except Experience, which keeps the SketchCircle). Absolutely
  positioned under its relative parent; the path carries pathLength="100" so the
  stroke animates on a 0–100 scale (see `.doodle-underline` in globals.css).

  NB: no SVG roughen filter (same reasoning as SketchCircle) — this mounts when a
  tab becomes active (mid-scroll on the home flow) and animates its stroke in; a
  per-frame turbulence filter would be re-rasterised every frame of that draw. The
  wonky path already reads as hand-drawn, so the stroke stays GPU-cheap.
*/
export default function DoodleUnderline() {
  return (
    <svg
      className="doodle-underline"
      viewBox="0 0 200 24"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {/* one slightly wavy stroke that dips + overshoots its ends = hand-drawn */}
      <path
        pathLength="100"
        d="M6 14 C40 6 70 19 104 11 C134 4 162 17 194 9"
      />
    </svg>
  );
}
