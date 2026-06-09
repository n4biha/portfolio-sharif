"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/*
  Renders one cut-out letter as your uploaded PNG (from /public/images).
  Until the image exists (or if it fails to load) it shows a styled
  ransom-note fallback so the layout always looks right.
*/
export default function CutoutLetter({
  src,
  char,
  rotation = 0,
  fallbackBg = "var(--mustard)",
  fallbackFg = "#2b2620",
}) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    // No entrance animation here — the parent group does the zoom-out intro,
    // so each letter just rests at its rotation and reacts to hover. This keeps
    // the zoom perfectly smooth (one transform instead of competing ones).
    <motion.span
      whileHover={{ rotate: 0, scale: 1.08 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="inline-block"
      style={{ rotate: `${rotation}deg` }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={char}
          onError={() => setFailed(true)}
          className="block h-20 w-auto select-none sm:h-28 md:h-36"
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
