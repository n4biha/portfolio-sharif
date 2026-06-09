"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import CutoutLetter from "./CutoutLetter";
import IntroText from "./IntroText";
import { unlockAudio, playPop } from "@/lib/sfx";
// Static import lets next/image auto-detect the size and serve a
// correctly-scaled version for each device (phone, tablet, desktop).
import pageRipOut from "../../public/images/page-rip-out.png";
import photoPortrait from "../../public/images/photo-portrait.jpg";

/*
  The "Nabiha" cut-out name.
  Upload one PNG per letter into /public/images using these exact filenames.
  Until a file exists, a styled fallback letter shows in its place.
*/
// width/height are the PNGs' intrinsic pixel sizes — passed to each <img> so the
// browser reserves the right aspect-ratio box and the name doesn't collapse /
// reflow while the images are still loading on first paint.
const letters = [
  { char: "N", src: "/images/letter-1-n.png", width: 356, height: 342, rotation: -6, enterFrom: { x: -240, y: -50, r: -65 }, fallbackBg: "var(--tomato)", fallbackFg: "#f3f0e7" },
  { char: "a", src: "/images/letter-2-a.png", width: 284, height: 324, rotation: 4, enterFrom: { x: 0, y: -220, r: 45 }, fallbackBg: "var(--mustard)", fallbackFg: "#2b2620" },
  { char: "b", src: "/images/letter-3-b.png", width: 298, height: 326, rotation: -3, enterFrom: { x: 230, y: -40, r: 75 }, fallbackBg: "var(--pine)", fallbackFg: "#f3f0e7" },
  { char: "i", src: "/images/letter-4-i.png", width: 196, height: 370, rotation: 5, enterFrom: { x: -190, y: 190, r: -55 }, fallbackBg: "var(--denim)", fallbackFg: "#f3f0e7" },
  { char: "h", src: "/images/letter-5-h.png", width: 292, height: 334, rotation: -4, enterFrom: { x: 70, y: 240, r: 65 }, fallbackBg: "var(--burnt)", fallbackFg: "#f3f0e7" },
  { char: "a", src: "/images/letter-6-a.png", width: 326, height: 298, rotation: 3, enterFrom: { x: 250, y: 130, r: -45 }, fallbackBg: "var(--pine)", fallbackFg: "#f3f0e7" },
];

// Staggered container for the cut-out name's "scatter in" — letters fly in one
// after another (left-to-right) once the group animates to "show".
const nameContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.085, delayChildren: 0.04 } },
};

// Intro paragraph typed out next to the name once the photo is on.
const INTRO_TEXT = `Hi, I'm Nabiha!

I am a student studying Data Science and Cognitive Science at UC Berkeley. I am interested in Data Science + Engineering, Product Management, and AI/ML roles. I am currently a Product Management intern at Dabble Health.

Explore this website to learn more about me!`;

export default function Hero({ onIntroDone, introDone = false, paused = false }) {
  // Tape sequence stage: 0 = none placed, 1 = first (top-right) placed,
  // 2 = both placed.
  const [tapeStage, setTapeStage] = useState(0);
  // Photo pops on last, once the paper + both tapes are placed.
  const [photoIn, setPhotoIn] = useState(false);
  // Cut-out name scatters in AFTER the photo pops (hidden until then).
  const [lettersIn, setLettersIn] = useState(false);
  // Intro paragraph starts typing just after the name has landed.
  const [introTextIn, setIntroTextIn] = useState(false);

  // No click-to-enter zoom anymore — the scrapbook reveal just plays on mount.
  // Signal "done" right away (shows the navbar + kicks off the reveal sequence
  // below), and unlock audio on the visitor's first interaction so the intro
  // sounds can play once the browser allows it.
  useEffect(() => {
    onIntroDone?.();
    const unlock = () => {
      unlockAudio();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sound + reveal sequence, kicked off when the intro finishes. The paper is
  // gliding in right now, so play its rustle immediately; then, once the paper
  // has fully settled, the tapes go on one-by-one (each with a "shh") and the
  // photo pops on (with a "pop"). Audio was unlocked by the intro click.
  useEffect(() => {
    if (!introDone || typeof window === "undefined") return;

    // Reduced motion: show both tapes + photo + text immediately, no sound.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTapeStage(2);
      setPhotoIn(true);
      setLettersIn(true);
      setIntroTextIn(true);
      return;
    }

    const timers = [];

    // ms for the paper's glide-to-center (`stop-motion-in`) to finish — the
    // tape/photo reveal waits for this so nothing lands on empty space.
    // (Matches the .stop-motion-in CSS duration.)
    const PAPER_SETTLE = 1950;
    // ms between the first tape starting and the second tape starting.
    const SECOND_AT = 1200;
    // ms after the second tape starts to when the photo pops on (after it sets).
    const PHOTO_AT = SECOND_AT + 1150;

    // The torn paper glides in silently now (no paper sound) — the tapes and
    // the typing tick handle the audio from here.

    const startSequence = () => {
      // Tape 1 (top-right) goes on — silently now (no tape sound).
      setTapeStage(1);

      // Tape 2 (bottom-left) goes on after the first has settled.
      timers.push(window.setTimeout(() => setTapeStage(2), SECOND_AT));

      // The photo pops onto the paper, with a quick pop.
      timers.push(
        window.setTimeout(() => {
          setPhotoIn(true);
          playPop();
        }, PHOTO_AT)
      );

      // Then the cut-out name scatters in (it was hidden until now), and only
      // once it has landed does the intro paragraph start typing.
      timers.push(window.setTimeout(() => setLettersIn(true), PHOTO_AT + 250));
      timers.push(window.setTimeout(() => setIntroTextIn(true), PHOTO_AT + 1350));
    };

    timers.push(window.setTimeout(startSequence, PAPER_SETTLE));

    return () => timers.forEach(window.clearTimeout);
  }, [introDone]);

  return (
    <section
      id="home"
      className="relative flex h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* Cut-out name — hidden until the photo pops, then the letters scatter in
          one-by-one (staggered) and spring into their resting tilts. */}
      <motion.div
        variants={nameContainer}
        initial="hidden"
        animate={lettersIn ? "show" : "hidden"}
        className="relative z-10 mt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
      >
        {letters.map((l, i) => (
          <CutoutLetter key={i} {...l} />
        ))}
      </motion.div>

      {/* Torn-paper panel — once the zoom finishes it gets "placed" onto the
          page like a scrapbook piece via the pure-CSS `.stop-motion-in` class:
          it marches in from off-screen right in chunky stop-motion hops, pops
          forward, overshoots a touch, then settles. The class is only added once
          `introDone` is true (after the zoom); until then it's held hidden with
          `opacity-0`. Space is reserved from the start so nothing else reflows. */}
      {/* Static positioning wrapper: holds the paper (in flow, so it defines
          the box) plus the two tape strips (absolute, layered on the corners).
          Each piece runs its own entrance independently. */}
      {/* Width is capped by BOTH the viewport width and height so the whole
          torn-paper composition (name + paper) always fits on one screen and
          never gets clipped by the section's overflow-hidden. The paper image
          is ~1.69:1, so width = height × 1.69; we reserve ~210px for the name
          above it. Everything inside is positioned as a % of this box, so the
          photo / text / tapes scale together with the paper. */}
      <div
        className="relative z-10 mx-auto mt-4 w-full max-w-5xl"
        style={{ width: "min(64rem, 92vw, calc((100svh - 210px) * 1.69))" }}
      >
        {/* The torn-paper panel — glides in from the left. Its inner element
            carries the bob (Y + rotate + scale) so it composes with — instead
            of fighting — the horizontal glide. Both classes flip on together
            with `introDone`, so they start in sync. */}
        <div className={introDone ? "stop-motion-in" : "opacity-0"}>
          <div className={introDone ? "stop-motion-bob" : undefined}>
            <Image
              src={pageRipOut}
              alt=""
              aria-hidden="true"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="h-auto w-full select-none"
            />
          </div>
        </div>

        {/* Scrapbook photo on the left of the paper — pops on once the paper
            settles. Framed like a print (cream border + soft lifted shadow)
            and resting at a slight tilt, matching the pasted-on cut-out feel. */}
        <div
          className={`absolute left-[15%] top-[18%] z-20 w-[26%] ${
            photoIn ? "photo-pop" : "opacity-0"
          }`}
        >
          <div className="bg-[#f8f4ea] p-[4%] shadow-[3px_5px_15px_rgba(43,38,32,0.33)]">
            <Image
              src={photoPortrait}
              alt="Nabiha"
              sizes="(max-width: 1024px) 27vw, 280px"
              className="block h-auto w-full select-none"
            />
          </div>
        </div>

        {/* Intro paragraph — typed out next to the photo on the paper's right
            half once the photo has landed. Sits in the right-hand area of the
            paper, clear of the photo. Plain responsive px sizing (no container
            queries — those broke positioning in some browsers); the paper's
            height cap above keeps the whole block on-screen so the typed text
            stays inside the paper and never spills into a torn corner. */}
        <div className="absolute left-[46%] top-[30%] z-20 w-[46%] leading-[1.6] text-[12px] sm:text-[13px] md:text-[14px]">
          <IntroText text={INTRO_TEXT} start={introTextIn} stop={paused} />
        </div>

        {/* Tape, top-right corner — flies in from the right edge of the screen. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-[92.5%] top-[10.5%] z-30 ${
            tapeStage >= 1 ? "tape-in-right" : "opacity-0"
          }`}
        >
          <div className={tapeStage >= 1 ? "tape-bob" : undefined}>
            <div className="tape tape--tr" />
          </div>
        </div>

        {/* Tape, bottom-left corner — flies in from the bottom-left of the screen. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-[13.5%] top-[88%] z-30 ${
            tapeStage >= 2 ? "tape-in-bl" : "opacity-0"
          }`}
        >
          <div className={tapeStage >= 2 ? "tape-bob" : undefined}>
            <div className="tape tape--bl" />
          </div>
        </div>
      </div>
    </section>
  );
}
