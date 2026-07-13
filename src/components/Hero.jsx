"use client";

import { memo, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import CutoutLetter from "./CutoutLetter";
import IntroText from "./IntroText";
import { useParallaxLayers } from "./ui/parallax-scrolling";
import { armAudioUnlock, playPop } from "@/lib/sfx";
// Static import lets next/image auto-detect the size and serve a
// correctly-scaled version for each device (phone, tablet, desktop).
import pageRipOut from "../../public/images/page-rip-out.png";
import photoPortrait from "../../public/images/photo-portrait.jpg";
import starsSticker from "../../public/images/stars-sticker.png";
import flowerSticker from "../../public/images/flower.png";
import heartsSticker from "../../public/images/hearts.png";

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

// Contact sticker-icons under the paper: pop in left-to-right with a springy
// overshoot (like the other scrapbook stickers). Each badge keeps a resting tilt.
const contactContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const contactItem = {
  hidden: { scale: 0, opacity: 0 },
  // `custom` carries each badge's resting tilt so rotate is handled by framer-motion
  // (keeping it off Tailwind's transform, which would otherwise clash with hover).
  show: (tilt) => ({
    scale: 1,
    opacity: 1,
    rotate: tilt,
    transition: { type: "spring", stiffness: 600, damping: 13, mass: 0.55 },
  }),
};

// LinkedIn / GitHub / Email — cream "sticker" links, ink glyphs, slight scrapbook
// tilt + a hover pop. Inline SVGs so there are no extra assets/deps.
const CONTACTS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/nabihasharif/",
    external: true,
    tilt: -6,
    icon: (
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.64h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.78c0-1.38-.03-3.15-1.97-3.15-1.97 0-2.27 1.5-2.27 3.05V21H9V9Z" />
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/n4biha",
    external: true,
    tilt: 4,
    icon: (
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    ),
  },
  {
    label: "Email",
    href: "mailto:nabihasharif@berkeley.edu",
    external: false,
    tilt: -3,
    icon: (
      <path d="M3 5.5h18c.55 0 1 .45 1 1V17.5c0 .55-.45 1-1 1H3c-.55 0-1-.45-1-1V6.5c0-.55.45-1 1-1Zm.9 2L12 12.7 20.1 7.5H3.9ZM20 9.55l-7.46 4.79a1 1 0 0 1-1.08 0L4 9.55V16.5h16V9.55Z" />
    ),
  },
];

// Intro paragraph typed out next to the name once the photo is on.
const INTRO_TEXT = `Hey, I'm Nabiha!

I’m studying Data Science and Cognitive Science at UC Berkeley. I’m always learning something new, and I care a lot about turning what I learn into something I can teach others. 

Interested in Product Management, Data Science, and AI/ML roles. 

Explore this website to learn more about me!`;

// Scroll-parallax depth for the scrapbook. As the Hero screen glides up toward
// Experience, the layers drift by different amounts — and in opposite directions —
// so the composition visibly pulls apart into planes. Values are % of each layer's
// own height (negative = up). name/paper are the two main planes; stars + contacts
// nest inside the paper for extra depth. Tune these four numbers to taste.
// (Driven by useParallaxLayers over the existing Lenis engine.)
const PARALLAX_LAYERS = [
  { layer: "name", yPercent: -18 },   // floats closest — drifts up, exits fast
  { layer: "paper", yPercent: 22 },   // backdrop sheet — lags down like a far plane
  { layer: "stars", yPercent: 16 },   // bottom-right accent — extra drift on the paper
  { layer: "contacts", yPercent: -12 }, // left-edge badges — pull the opposite way
];

function Hero({ onIntroDone, introDone = false, paused = false, play = true }) {
  // Tape sequence stage: 0 = none placed, 1 = first (top-right) placed,
  // 2 = both placed.
  const [tapeStage, setTapeStage] = useState(0);
  // Photo pops on last, once the paper + both tapes are placed.
  const [photoIn, setPhotoIn] = useState(false);
  // Cut-out name scatters in AFTER the photo pops (hidden until then).
  const [lettersIn, setLettersIn] = useState(false);
  // Star stickers pop on (bottom-right of the paper) just after the name lands.
  const [starsIn, setStarsIn] = useState(false);
  // "!!" sticker pops on (top-left of the screen) with a fun bounce, alongside stars.
  // Flower + hearts fade/drift onto the photo corners shortly after it lands.
  const [decorIn, setDecorIn] = useState(false);
  // Intro paragraph starts typing just after the stars pop.
  const [introTextIn, setIntroTextIn] = useState(false);
  // Contact sticker-icons pop on last, under the torn paper.
  const [contactIn, setContactIn] = useState(false);

  // Layered scroll-parallax on the scrapbook (see PARALLAX_LAYERS). Scrubs off
  // the existing Lenis/ScrollTrigger engine as this screen scrolls out — no new
  // Lenis instance, no interference with the locked section paging.
  const heroRef = useRef(null);
  useParallaxLayers(heroRef, { layers: PARALLAX_LAYERS });

  // No click-to-enter zoom anymore — the scrapbook reveal just plays on mount.
  // Signal "done" right away (shows the navbar + kicks off the reveal sequence
  // below), and unlock audio on the visitor's first interaction so the intro
  // sounds can play once the browser allows it.
  useEffect(() => {
    onIntroDone?.();
    // Unlock audio on the visitor's first interaction of ANY kind (move, scroll,
    // key, touch — not just a click) so the intro sounds can play without them
    // having to click anything.
    return armAudioUnlock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sound + reveal sequence, kicked off when the intro finishes. The paper is
  // gliding in right now, so play its rustle immediately; then, once the paper
  // has fully settled, the tapes go on one-by-one (each with a "shh") and the
  // photo pops on (with a "pop"). Audio was unlocked by the intro click.
  useEffect(() => {
    if (!introDone || typeof window === "undefined") return;

    // Reloaded straight onto another section (experience/projects): show the whole
    // scrapbook in its final state with NO timed reveal and NO audio, so About
    // doesn't animate/play offscreen.
    if (!play) {
      setTapeStage(2);
      setPhotoIn(true);
      setDecorIn(true);
      setLettersIn(true);
      setStarsIn(true);
      setIntroTextIn(true);
      setContactIn(true);
      return;
    }

    // Reduced motion: show both tapes + photo + text immediately, no sound.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTapeStage(2);
      setPhotoIn(true);
      setDecorIn(true);
      setLettersIn(true);
      setStarsIn(true);
      setIntroTextIn(true);
      setContactIn(true);
      return;
    }

    const timers = [];

    // ms for the paper's glide-to-center (`stop-motion-in`) to finish — the
    // tape/photo reveal waits for this so nothing lands on empty space.
    // (Matches the .stop-motion-in CSS duration.)
    const PAPER_SETTLE = 1300;
    // ms between the first tape starting and the second tape starting.
    const SECOND_AT = 950;
    // ms after the second tape starts to when the photo pops on (after it sets).
    const PHOTO_AT = SECOND_AT + 900;

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

      // The cut-out name scatters in (it was hidden until now).
      timers.push(window.setTimeout(() => setLettersIn(true), PHOTO_AT + 220));

      // Then ALL the stickers (stars, "!!", flower, hearts) appear together once
      // the name has landed, and finally the intro starts typing.
      timers.push(
        window.setTimeout(() => {
          setStarsIn(true);
          setDecorIn(true);
        }, PHOTO_AT + 1050)
      );
      timers.push(window.setTimeout(() => setIntroTextIn(true), PHOTO_AT + 1350));

      // Contact sticker-icons pop on under the paper, rounding out the reveal.
      timers.push(window.setTimeout(() => setContactIn(true), PHOTO_AT + 1500));
    };

    timers.push(window.setTimeout(startSequence, PAPER_SETTLE));

    return () => timers.forEach(window.clearTimeout);
  }, [introDone, play]);

  return (
    <section
      ref={heroRef}
      id="home"
      // transform-gpu: own compositor layer so the page-glide moves a cached texture
      className="relative flex h-screen flex-col items-center justify-center overflow-hidden px-6 transform-gpu"
    >
      {/* Cut-out name — hidden until the photo pops, then the letters scatter in
          one-by-one (staggered) and spring into their resting tilts.
          Wrapped in a plain parallax-layer div so GSAP can drift the whole name
          on scroll without touching Framer Motion's transforms on the letters. */}
      <div data-parallax-layer="name" className="relative z-10">
        <motion.div
          variants={nameContainer}
          initial="hidden"
          animate={lettersIn ? "show" : "hidden"}
          className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-6"
        >
          {letters.map((l, i) => (
            <CutoutLetter key={i} {...l} />
          ))}
        </motion.div>
      </div>


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
        data-parallax-layer="paper"
        className="relative z-10 mx-auto mt-4 w-full max-w-5xl"
        style={{
          width: "min(64rem, 92vw, calc((100svh - 210px) * 1.69))",
          // query container so the on-paper text scales with the paper, not the viewport
          containerType: "inline-size",
        }}
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
          className={`absolute left-[15%] top-[18%] z-20 w-[26%] ${photoIn ? "photo-pop" : "opacity-0"
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

        {/* Hearts — bounce onto the photo's TOP-RIGHT corner (spring, like the name). */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-[34%] top-[10%] z-30 w-[12%]"
          initial={{ opacity: 0, scale: 0.45, rotate: 8 }}
          animate={
            decorIn
              ? { opacity: 1, scale: 1, rotate: 8 }
              : { opacity: 0, scale: 0.45, rotate: 8 }
          }
          transition={{ type: "spring", stiffness: 300, damping: 14, mass: 0.8 }}
        >
          <Image
            src={heartsSticker}
            alt=""
            sizes="(max-width: 1024px) 14vw, 170px"
            className="block h-auto w-full select-none"
          />
        </motion.div>

        {/* Flower — bounce onto the photo's BOTTOM-LEFT corner (spring, like the name). */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-[10%] top-[62%] z-30 w-[16%]"
          initial={{ opacity: 0, scale: 0.45, rotate: -6 }}
          animate={
            decorIn
              ? { opacity: 1, scale: 1, rotate: -6 }
              : { opacity: 0, scale: 0.45, rotate: -6 }
          }
          transition={{ type: "spring", stiffness: 300, damping: 14, mass: 0.8 }}
        >
          <Image
            src={flowerSticker}
            alt=""
            sizes="(max-width: 1024px) 16vw, 170px"
            className="block h-auto w-full select-none"
          />
        </motion.div>

        {/* Intro paragraph — typed out next to the photo on the paper's right
            half once the photo has landed. Sits in the right-hand area of the
            paper, clear of the photo. Plain responsive px sizing (no container
            queries — those broke positioning in some browsers); the paper's
            height cap above keeps the whole block on-screen so the typed text
            stays inside the paper and never spills into a torn corner. */}
        <div className="absolute left-[46%] top-[29%] z-20 w-[48%] leading-[1.45] text-[clamp(7.5px,1.37cqw,14px)] sm:leading-[1.6]">
          <IntroText text={INTRO_TEXT} start={introTextIn} stop={paused} instant={!play} />
        </div>

        {/* Tape, top-right corner — flies in from the right edge of the screen. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-[92.5%] top-[10.5%] z-30 ${tapeStage >= 1 ? "tape-in-right" : "opacity-0"
            }`}
        >
          <div className={tapeStage >= 1 ? "tape-bob" : undefined}>
            <div className="tape tape--tr" />
          </div>
        </div>

        {/* Tape, bottom-left corner — flies in from the bottom-left of the screen. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-[13.5%] top-[88%] z-30 ${tapeStage >= 2 ? "tape-in-bl" : "opacity-0"
            }`}
        >
          <div className={tapeStage >= 2 ? "tape-bob" : undefined}>
            <div className="tape tape--bl" />
          </div>
        </div>

        {/* Star stickers — pop on in the bottom-right corner of the paper (after
            the name lands, before the typing) with a quick spring + a stuck tilt.
            Plain parallax-layer wrapper carries the positioning so GSAP can drift
            it independently without touching Framer's spring transform. */}
        <div
          data-parallax-layer="stars"
          className="pointer-events-none absolute left-[78%] top-[68%] z-30 w-[25%]"
        >
          <motion.div
            aria-hidden="true"
            initial={{ scale: 0, opacity: 0, rotate: -16 }}
            animate={
              starsIn
                ? { scale: 1, opacity: 1, rotate: 7 }
                : { scale: 0, opacity: 0, rotate: -16 }
            }
            transition={{ type: "spring", stiffness: 650, damping: 13, mass: 0.55 }}
          >
            <Image
              src={starsSticker}
              alt=""
              sizes="(max-width: 1024px) 20vw, 210px"
              className="block h-auto w-full select-none"
            />
          </motion.div>
        </div>

        {/* Contact sticker-icons — anchored to the torn paper (its wrapper is the
            centering reference), hanging just below it. Absolute so it doesn't
            change the paper's height / disturb its % layout. Bigger cream badges
            with a slight scrapbook tilt, spaced out, that pop in + lift on hover. */}
        {/* Parallax wrapper owns GSAP's transform; the -50% vertical centering
            lives on the inner div so the two transforms don't fight. */}
        <div
          data-parallax-layer="contacts"
          className="absolute left-[2%] top-1/2 z-20"
        >
        <motion.div
          variants={contactContainer}
          initial="hidden"
          animate={contactIn ? "show" : "hidden"}
          className="flex -translate-y-1/2 flex-col items-center justify-center gap-[clamp(13px,4.5cqw,44px)]"
        >
          {CONTACTS.map((c) => (
            <motion.a
              key={c.label}
              variants={contactItem}
              custom={c.tilt}
              href={c.href}
              aria-label={c.label}
              {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              whileHover={{ y: -5, scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-[clamp(30px,5cqw,52px)] w-[clamp(30px,5cqw,52px)] items-center justify-center rounded-full bg-[#B76E52] text-[#F4E7D6] shadow-[2px_4px_13px_rgba(43,38,32,0.30)] ring-1 ring-[#3B3127]/15 transition-colors duration-200 hover:bg-[#A05B41]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-[clamp(15px,2.6cqw,24px)] w-[clamp(15px,2.6cqw,24px)]">
                {c.icon}
              </svg>
            </motion.a>
          ))}
        </motion.div>
        </div>
      </div>
    </section>
  );
}

// Memoised so the home flow's mid-scroll re-renders (section index, nav theme)
// don't reconcile the whole scrapbook + its framer-motion tree during the page
// glide. Re-renders only when paused/play/introDone change (stable props).
export default memo(Hero);
