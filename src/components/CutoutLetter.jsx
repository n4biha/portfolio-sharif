"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/*
  Renders one cut-out letter as your uploaded PNG (from /public/images).
  Until the image exists (or if it fails to load) it shows a styled
  ransom-note fallback so the layout always looks right.

  Entrance is a "scatter in": the letter flies in from its own off-screen-ish
  offset/angle (`enterFrom`) and springs into place, settling at its resting
  tilt (`rotation`). The parent group drives the staggered timing via variants,
  so these stay hidden until the group animates to "show".
*/
const letterVariants = {
  hidden: (c) => ({ opacity: 0, x: c.from.x, y: c.from.y, rotate: c.from.r, scale: 0.7 }),
  show: (c) => ({
    opacity: 1,
    x: 0,
    y: 0,
    rotate: c.rot,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 18, mass: 0.9 },
  }),
};

export default function CutoutLetter({
  src,
  char,
  width,
  height,
  rotation = 0,
  enterFrom = { x: 0, y: -120, r: 0 },
  fallbackBg = "var(--mustard)",
  fallbackFg = "#2b2620",
}) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <motion.span
      custom={{ rot: rotation, from: enterFrom }}
      variants={letterVariants}
      whileHover={{ rotate: 0, scale: 1.08 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="inline-block"
    >
      {showImage ? (
        /* fluid height (not stepped breakpoints) so six letters + gaps always
           fit one line — fixed 144px letters wrapped to two lines on iPads */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={char}
          width={width}
          height={height}
          onError={() => setFailed(true)}
          className="block w-auto select-none h-[clamp(48px,11vw,144px)]"
        />
      ) : (
        <span
          className="torn shadow-hard inline-block px-3 py-1 font-anton text-5xl uppercase leading-none sm:px-5 sm:py-2 sm:text-7xl"
          style={{ backgroundColor: fallbackBg, color: fallbackFg }}
        >
          {char}
        </span>
      )}
    </motion.span>
  );
}
