"use client";

import { motion } from "framer-motion";

/*
  A heading rendered in the same cut-out ransom-note style as the "Nabiha" hero
  name — each letter is a torn-paper chip in a palette colour at a jaunty angle,
  with the hard offset shadow. Letters straighten + pop on hover, matching the
  hero letters, so titles feel like part of the same scrapbook.
*/
const palette = [
  { bg: "var(--tomato)", fg: "#f3f0e7" },
  { bg: "var(--mustard)", fg: "#2b2620" },
  { bg: "var(--pine)", fg: "#f3f0e7" },
  { bg: "var(--denim)", fg: "#f3f0e7" },
  { bg: "var(--burnt)", fg: "#f3f0e7" },
];
const rotations = [-6, 4, -3, 5, -4, 3, -5, 6, -2, 2];

export default function RansomTitle({ text, className = "" }) {
  const chars = [...text];

  return (
    <h2
      aria-label={text}
      className={`flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 ${className}`}
    >
      {chars.map((ch, i) => {
        if (ch === " ") return <span key={i} className="w-2 sm:w-4" aria-hidden="true" />;
        const c = palette[i % palette.length];
        return (
          <motion.span
            key={i}
            aria-hidden="true"
            whileHover={{ rotate: 0, scale: 1.12, y: -4 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 240, damping: 12 }}
            className="torn shadow-hard inline-block cursor-default px-2.5 py-1 font-anton text-2xl uppercase leading-none sm:px-3.5 sm:py-1.5 sm:text-4xl md:text-5xl"
            style={{
              rotate: `${rotations[i % rotations.length]}deg`,
              backgroundColor: c.bg,
              color: c.fg,
            }}
          >
            {ch}
          </motion.span>
        );
      })}
    </h2>
  );
}
