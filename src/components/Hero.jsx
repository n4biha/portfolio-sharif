"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform } from "framer-motion";
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
const letters = [
  { char: "N", src: "/images/letter-1-n.png", rotation: -6, fallbackBg: "var(--tomato)", fallbackFg: "#f3f0e7" },
  { char: "a", src: "/images/letter-2-a.png", rotation: 4, fallbackBg: "var(--mustard)", fallbackFg: "#2b2620" },
  { char: "b", src: "/images/letter-3-b.png", rotation: -3, fallbackBg: "var(--pine)", fallbackFg: "#f3f0e7" },
  { char: "i", src: "/images/letter-4-i.png", rotation: 5, fallbackBg: "var(--denim)", fallbackFg: "#f3f0e7" },
  { char: "h", src: "/images/letter-5-h.png", rotation: -4, fallbackBg: "var(--burnt)", fallbackFg: "#f3f0e7" },
  { char: "a", src: "/images/letter-6-a.png", rotation: 3, fallbackBg: "var(--pine)", fallbackFg: "#f3f0e7" },
];

// Intro paragraph typed out next to the name once the photo is on.
const INTRO_TEXT = `Hi, I'm Nabiha!

I am a student studying Data Science and Cognitive Science at UC Berkeley. I am interested in Data Science + Engineering, Product Management, and AI/ML roles. I am currently a Product Management intern at Dabble Health.

Explore this website to learn more about me!`;

// Which letter we start "inside" of (index into `letters`). The b is central.
const FOCAL_LETTER = 2;
// Where inside that letter to anchor the zoom, as a fraction of its box.
// Aim for a solid-color area (not a glyph/outline edge) so only ONE color shows.
const FOCAL_X = 0.2; // 0 = left edge, 1 = right edge
const FOCAL_Y = 0.45; // 0 = top edge, 1 = bottom11 edge
// Backdrop color while zoomed in. Match it to the focal letter's color so any
// transparent edges of the patch read as the SAME color = one solid field.
const FOCAL_COLOR = "var(--mustard)"; // the "b" patch color
// Master switch for the click-driven zoom intro. When true, the page opens
// zoomed inside a letter and the whole reveal plays on the first click/tap/key.
// When false, it skips straight to the settled state (the rip-page entrance
// still plays).
const ENABLE_INTRO = false;
// Easing of the displayed zoom toward its target each frame (lower = slower).
const EASE = 0.062;

export default function Hero({ onIntroDone, introDone = false }) {
  const groupRef = useRef(null);

  // Tape sequence stage: 0 = none placed, 1 = first (top-right) placed,
  // 2 = both placed. Advances on the first user interaction after the intro.
  const [tapeStage, setTapeStage] = useState(0);
  // Photo pops on last, once the paper + both tapes are placed.
  const [photoIn, setPhotoIn] = useState(false);
  // Intro paragraph starts typing just after the photo lands.
  const [introTextIn, setIntroTextIn] = useState(false);

  // 0 = fully zoomed in (inside one letter), 1 = settled into place.
  const progress = useMotionValue(0);
  // Starting scale — set from the viewport before first paint (see below).
  const bigScale = useMotionValue(36);

  // Letters scale from huge -> 1 as progress goes 0 -> 1. We interpolate the
  // scale EXPONENTIALLY (b^(1-p)) instead of linearly: that keeps the *perceived*
  // zoom rate constant, which reads far smoother and more cinematic than a linear
  // ramp (which rushes at the start and crawls at the end).
  const scale = useTransform([progress, bigScale], ([p, b]) => Math.pow(b, 1 - p));
  // Scroll hint fades out almost immediately once you start scrolling.
  const hintOpacity = useTransform(progress, [0, 0.18], [1, 0]);
  // Full-bleed backdrop covers the page while zoomed in (so the gaps between
  // the transparent letter patches never reveal the screen), then fades out.
  const backdropOpacity = useTransform(progress, [0.65, 1], [1, 0]);

  // Zoom origin — placed over the center of the focal letter so the very first
  // frame is a solid field of that letter's color (no gaps, no backdrop).
  const [origin, setOrigin] = useState("50% 50%");

  // Measure the focal letter and size the zoom BEFORE the browser paints, so
  // there's no visible pop on load. offsetLeft/Width are layout values, so the
  // transform already applied doesn't affect the measurement.
  useLayoutEffect(() => {
    const recalc = () => {
      const group = groupRef.current;
      const el = group?.children?.[FOCAL_LETTER];
      if (!el) return;

      // Tiny visible window = single, uniform color fills the screen.
      const vmax = Math.max(window.innerWidth, window.innerHeight);
      bigScale.set(Math.max(45, Math.ceil(vmax / 28)));

      const ox = ((el.offsetLeft + el.offsetWidth * FOCAL_X) / group.offsetWidth) * 100;
      const oy = ((el.offsetTop + el.offsetHeight * FOCAL_Y) / group.offsetHeight) * 100;
      setOrigin(`${ox}% ${oy}%`);
    };
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const doc = document.documentElement;
    const target = { current: 0 };
    const state = { done: false, raf: 0 };

    const finish = () => {
      if (state.done) return;
      state.done = true;
      progress.set(1);
      doc.style.overflow = "";
      document.body.style.overflow = "";
      window.removeEventListener("pointerdown", onStart);
      window.removeEventListener("keydown", onStart);
      window.removeEventListener("touchstart", onStart);
      cancelAnimationFrame(state.raf);
      onIntroDone?.();
    };

    // Intro disabled, or reduced-motion requested: skip straight to settled.
    if (
      !ENABLE_INTRO ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      state.done = true;
      progress.set(1);
      onIntroDone?.();
      return;
    }

    // Lock the page while the intro plays.
    doc.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // A single click / tap / key plays the whole zoom-out. It's a real
    // activation gesture, so it also unlocks audio for the tape "shh" later.
    let armed = true;
    const onStart = (e) => {
      if (!armed) return;
      if (
        e.type === "keydown" &&
        !["Enter", " ", "Spacebar", "ArrowDown"].includes(e.key)
      ) {
        return;
      }
      armed = false;
      unlockAudio();
      target.current = 1; // the tick eases progress 0 -> 1 (smooth zoom-out)
    };

    window.addEventListener("pointerdown", onStart);
    window.addEventListener("keydown", onStart);
    window.addEventListener("touchstart", onStart, { passive: true });

    // Ease the displayed progress toward the target every frame. When there's
    // nothing meaningful to move, we DON'T write the value — that stops the
    // huge upscaled image from being re-rasterized every idle frame (the
    // "tacky refresh" flicker), keeping the motion clean and coherent.
    const tick = () => {
      const cur = progress.get();
      if (target.current >= 1 && cur > 0.999) {
        finish();
        return;
      }
      const delta = target.current - cur;
      if (Math.abs(delta) > 0.0003) {
        progress.set(cur + delta * EASE);
      }
      state.raf = requestAnimationFrame(tick);
    };
    state.raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(state.raf);
      window.removeEventListener("pointerdown", onStart);
      window.removeEventListener("keydown", onStart);
      window.removeEventListener("touchstart", onStart);
      doc.style.overflow = "";
      document.body.style.overflow = "";
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

      // Then the intro paragraph starts typing next to it.
      timers.push(window.setTimeout(() => setIntroTextIn(true), PHOTO_AT + 350));
    };

    timers.push(window.setTimeout(startSequence, PAPER_SETTLE));

    return () => timers.forEach(window.clearTimeout);
  }, [introDone]);

  return (
    // One full screen. Letters keep their final layout box the whole time
    // (transform scale doesn't reflow), so the zoom is perfectly seamless.
    <section
      id="home"
      className="relative flex h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* Full-bleed backdrop — guarantees the screen is fully covered while the
          letters are zoomed in, then fades to reveal the normal page. */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: backdropOpacity, backgroundColor: FOCAL_COLOR }}
        className="pointer-events-none absolute inset-0"
      />

      {/* Cut-out name — the zoom subject. will-change/backface promote it to its
          own GPU layer so scaling stays smooth (no per-frame repaint). */}
      <motion.div
        ref={groupRef}
        style={{
          scale,
          transformOrigin: origin,
          willChange: "transform",
          backfaceVisibility: "hidden",
          // No hover/interaction until the scroll intro has finished.
          pointerEvents: introDone ? "auto" : "none",
        }}
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
          <IntroText text={INTRO_TEXT} start={introTextIn} />
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

      {/* Click prompt — centered. Fades out the moment you click and the zoom
          begins. The dark chip stays readable over any letter color behind it,
          and the gentle pulse invites the click. */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          style={{ opacity: hintOpacity }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1.5 rounded-full bg-black/45 px-7 py-3.5 text-[#f3f0e7] backdrop-blur-sm"
        >
          <span aria-hidden="true" className="text-xl leading-none">
            ☞
          </span>
          <span
            className="text-xs uppercase tracking-[0.3em]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Click to enter
          </span>
        </motion.div>
      </div>
    </section>
  );
}
