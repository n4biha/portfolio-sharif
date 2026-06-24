"use client";

import { memo, useId } from "react";

/*
  One realistic climbing hold (a moulded resin/rock hold), drawn as inline SVG.
  Realism layers: a deep top-lit body gradient, a turbulence height-map lit by a
  distant light (diffuse + glossy specular) blended over it for a bumpy granite
  surface, white chalk smudges (climbers chalk their holds), a recessed bolt —
  and the whole thing is pushed through a displacement filter so the silhouette
  is irregular/rough rock, not a smooth shape. A tight CSS contact shadow
  (globals.css `.climb-hold`) grounds it.
*/

// deep, saturated light -> base -> dark for real resin/rock colour.
const PALETTE = {
  blue: { light: "#7ec1ff", base: "#3a93ef", dark: "#1c548d" }, // route accent
  tomato: { light: "#c06b5a", base: "#8d3c32", dark: "#4c201b" },
  mustard: { light: "#c79a4d", base: "#8c6c2b", dark: "#523c15" },
  pine: { light: "#5c8f86", base: "#345f58", dark: "#1b342e" },
  denim: { light: "#5b7188", base: "#3a4d61", dark: "#202b37" },
  kraft: { light: "#8b755b", base: "#5b4835", dark: "#31261a" },
  charcoal: { light: "#56555c", base: "#343339", dark: "#1c1b1f" },
};

// Irregular base silhouettes (further roughened by the displacement filter).
const SHAPES = [
  "M50 12 C60 12 64 19 69 32 C75 47 81 60 83 71 C85 82 71 86 58 85 C44 84 33 86 24 84 C14 82 15 73 19 64 C26 49 33 30 41 20 C45 14 44 12 50 12 Z",
  "M64 13 C73 17 80 33 81 50 C82 67 75 84 57 85 C39 86 22 79 17 64 C13 52 21 35 34 26 C47 17 56 10 64 13 Z",
  "M32 28 C44 18 62 18 74 27 C86 36 88 52 82 65 C75 81 58 85 43 83 C26 81 13 68 18 50 C21 39 26 32 32 28 Z",
  "M48 14 C61 11 70 20 73 32 C77 47 86 55 84 67 C82 80 66 84 52 83 C40 82 29 87 21 79 C12 70 18 60 19 49 C20 36 31 17 48 14 Z",
];

function ClimbingHold({
  color = "blue",
  size = 64,
  variant = 0,
  route = false,
  className = "",
}) {
  const raw = useId();
  const uid = raw.replace(/:/g, ""); // colons break url(#…) refs
  const s = PALETTE[color] ?? PALETTE.blue;
  const shape = SHAPES[variant % SHAPES.length];
  const gId = `body-${uid}`;
  const clip = `clip-${uid}`;

  return (
    <span
      className={`climb-hold${route ? " climb-hold--route" : ""} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
          <linearGradient id={gId} x1="0" y1="0" x2="0.18" y2="1">
            <stop offset="0%" stopColor={s.light} />
            <stop offset="42%" stopColor={s.base} />
            <stop offset="100%" stopColor={s.dark} />
          </linearGradient>
          <clipPath id={clip}>
            <path d={shape} />
          </clipPath>
        </defs>

        {/* whole hold pushed through the displacement filter -> rough rock edges */}
        <g filter="url(#rockEdge)">
          <path d={shape} fill={`url(#${gId})`} />

          <g clipPath={`url(#${clip})`}>
            {/* bumpy lit granite, blended so it textures without washing colour.
                (A second, coarser "grit" filter pass used to sit here but was
                dropped — running a second turbulence+lighting chain per hold made
                the wall expensive to rasterize as it scrolled into view. The
                single bump pass below carries the texture.) */}
            <rect x="0" y="0" width="100" height="100" filter="url(#rockBump)" opacity="0.68" style={{ mixBlendMode: "soft-light" }} />
            {/* deeper core shadow toward the bottom-right */}
            <rect x="0" y="0" width="100" height="100" fill="url(#holdAO)" />
            {/* top rim light */}
            <rect x="0" y="0" width="100" height="100" fill="url(#holdRim)" />
            {/* glossy resin sheen */}
            <ellipse cx="40" cy="28" rx="19" ry="11" fill="url(#holdSheen)" />
            {/* white chalk smudges */}
            <ellipse cx="36" cy="62" rx="15" ry="9" fill="url(#holdChalk)" opacity="0.5" transform="rotate(-18 36 62)" />
            <ellipse cx="64" cy="48" rx="10" ry="7" fill="url(#holdChalk)" opacity="0.38" transform="rotate(12 64 48)" />
          </g>

          {/* recessed bolt, slightly off-centre */}
          <circle cx="54" cy="50" r="6.4" fill="url(#holdBolt)" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
          <circle cx="54" cy="50" r="2.3" fill="#0b0b0d" />
        </g>
      </svg>
    </span>
  );
}

export default memo(ClimbingHold);

/*
  Shared SVG <defs> rendered ONCE on the wall: colour-independent gradients + the
  bump-lighting and edge-displacement filters every hold references by id.
*/
export function ClimbingWallDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <defs>
        <radialGradient id="holdAO" cx="46%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="66%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
        </radialGradient>
        <linearGradient id="holdRim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="8%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <radialGradient id="holdSheen" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.42)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id="holdChalk" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(245,245,242,0.9)" />
          <stop offset="100%" stopColor="rgba(245,245,242,0)" />
        </radialGradient>
        <radialGradient id="holdBolt" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#3d3d41" />
          <stop offset="100%" stopColor="#0f0f11" />
        </radialGradient>

        {/* bumpy granite as a grey lit texture (height-map -> diffuse light).
            Kept to a single diffuse-lighting pass (no extra specular pass) and
            fewer octaves so 25 holds rasterize cheaply when scrolled into view;
            the glossy highlight is supplied separately by the holdSheen ellipse. */}
        <filter id="rockBump" x="-6%" y="-6%" width="112%" height="112%">
          <feTurbulence type="fractalNoise" baseFrequency="0.13" numOctaves="2" seed="6" result="noise" />
          <feDiffuseLighting in="noise" surfaceScale="4" diffuseConstant="0.66" lightingColor="#ffffff" result="diffuse">
            <feDistantLight azimuth="235" elevation="55" />
          </feDiffuseLighting>
        </filter>

        {/* roughen the whole hold's silhouette into irregular rock */}
        <filter id="rockEdge" x="-14%" y="-14%" width="128%" height="128%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="8" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}
