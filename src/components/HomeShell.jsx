"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./Navbar";
import Hero from "./Hero";
// NOTE: ExperienceVinyl + RansomTitle (and the .vinyl-* CSS) are kept on purpose
// — the record/vinyl concept is reserved for the future Projects section.

// Coordinates the one-time intro: the navbar (and everything else) stays
// hidden until the Hero's zoom-out has finished, then fades in.
export default function HomeShell() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      <AnimatePresence>
        {introDone && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Navbar />
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <Hero introDone={introDone} onIntroDone={() => setIntroDone(true)} />
      </main>
    </>
  );
}
