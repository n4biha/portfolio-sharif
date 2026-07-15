"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/*
  Mobile About/Home — the scrapbook intro, now with the same reveal as the
  desktop Hero: the torn paper glides in (stop-motion), the tapes press on one
  by one, the photo pops, the cut-out name scatters in staggered, and the
  stickers spring on last. Honors prefers-reduced-motion (everything shown
  instantly). Reuses the desktop's CSS classes (.stop-motion-in/.photo-pop) and
  framer spring parameters so the two screens feel identical.
*/

const LETTERS = [
  { src: "/images/letter-1-n.png", alt: "N", rot: -6, from: { x: -120, y: -25, r: -65 } },
  { src: "/images/letter-2-a.png", alt: "a", rot: 4, from: { x: 0, y: -110, r: 45 } },
  { src: "/images/letter-3-b.png", alt: "b", rot: -3, from: { x: 115, y: -20, r: 75 } },
  { src: "/images/letter-4-i.png", alt: "i", rot: 5, from: { x: -95, y: 95, r: -55 } },
  { src: "/images/letter-5-h.png", alt: "h", rot: -4, from: { x: 35, y: 120, r: 65 } },
  { src: "/images/letter-6-a.png", alt: "a", rot: 3, from: { x: 125, y: 65, r: -45 } },
];

// same stagger + scatter-in springs as the desktop CutoutLetter
const nameContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.085, delayChildren: 0.04 } },
};
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

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/nabihasharif/",
    path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.64h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.78c0-1.38-.03-3.15-1.97-3.15-1.97 0-2.27 1.5-2.27 3.05V21H9V9Z",
  },
  {
    label: "GitHub",
    href: "https://github.com/n4biha",
    path: "M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z",
  },
  {
    label: "Email",
    href: "mailto:nabihasharif@berkeley.edu",
    path: "M3 5.5h18c.55 0 1 .45 1 1V17.5c0 .55-.45 1-1 1H3c-.55 0-1-.45-1-1V6.5c0-.55.45-1 1-1Zm.9 2L12 12.7 20.1 7.5H3.9ZM20 9.55l-7.46 4.79a1 1 0 0 1-1.08 0L4 9.55V16.5h16V9.55Z",
  },
];

export default function AboutMobile() {
  // reveal beats, mirroring the desktop Hero sequence
  const [paperIn, setPaperIn] = useState(false);
  const [photoIn, setPhotoIn] = useState(false);
  const [lettersIn, setLettersIn] = useState(false);
  const [decorIn, setDecorIn] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPaperIn(true);
      setPhotoIn(true);
      setLettersIn(true);
      setDecorIn(true);
      return undefined;
    }

    setPaperIn(true); // paper starts gliding immediately

    const timers = [];
    const PAPER_SETTLE = 1300; // matches .stop-motion-in's duration
    const PHOTO_AT = 700; // beat after the paper settles → photo pop

    timers.push(
      window.setTimeout(() => {
        timers.push(window.setTimeout(() => setPhotoIn(true), PHOTO_AT));
        timers.push(window.setTimeout(() => setLettersIn(true), PHOTO_AT + 220));
        timers.push(window.setTimeout(() => setDecorIn(true), PHOTO_AT + 1050));
      }, PAPER_SETTLE)
    );

    return () => timers.forEach(window.clearTimeout);
  }, []);

  return (
    <section id="home" className="m-screen m-about">
      <motion.h1
        className="m-about-name"
        aria-label="Nabiha"
        variants={nameContainer}
        initial="hidden"
        animate={lettersIn ? "show" : "hidden"}
      >
        {LETTERS.map((l, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <motion.img
            key={i}
            src={l.src}
            alt={l.alt}
            aria-hidden="true"
            className="m-about-letter"
            custom={l}
            variants={letterVariants}
          />
        ))}
      </motion.h1>

      {/* the torn paper glides in like the desktop hero; the bob rides inside
          the glide so the two transforms compose (same pattern as Hero) */}
      <div className={paperIn ? "stop-motion-in" : "opacity-0"}>
        <div className={paperIn ? "stop-motion-bob" : undefined}>
          <article className="m-about-card">
            <div className="m-about-photo-wrap">
              {/* pop wrapper is separate from the polaroid so the pop's
                  transform doesn't fight the polaroid's resting tilt */}
              <div className={photoIn ? "photo-pop" : "opacity-0"}>
                <div className="m-about-polaroid">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/photo-portrait.jpg" alt="Nabiha" />
                </div>
              </div>
              {/* stickers spring onto the photo corners, desktop-style */}
              <motion.img
                src="/images/hearts.png"
                alt=""
                aria-hidden="true"
                className="m-about-hearts"
                initial={{ opacity: 0, scale: 0.45, rotate: 8 }}
                animate={decorIn ? { opacity: 1, scale: 1, rotate: 8 } : { opacity: 0, scale: 0.45, rotate: 8 }}
                transition={{ type: "spring", stiffness: 300, damping: 14, mass: 0.8 }}
              />
              <motion.img
                src="/images/flower.png"
                alt=""
                aria-hidden="true"
                className="m-about-flower"
                initial={{ opacity: 0, scale: 0.45, rotate: -6 }}
                animate={decorIn ? { opacity: 1, scale: 1, rotate: -6 } : { opacity: 0, scale: 0.45, rotate: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 14, mass: 0.8 }}
              />
            </div>

            <div className="m-about-text">
              <p className="m-about-hi">Hi, I&rsquo;m Nabiha.</p>
              <p>
                I&rsquo;m a Data Science student at UC Berkeley.
                <br />
                I build AI-powered products that create real impact.
              </p>
            </div>

            <ul className="m-about-socials">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="m-social"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>

            {/* star sticker springs on with the rest of the decor */}
            <motion.img
              src="/images/stars-sticker.png"
              alt=""
              aria-hidden="true"
              className="m-about-star"
              initial={{ opacity: 0, scale: 0, rotate: -16 }}
              animate={decorIn ? { opacity: 1, scale: 1, rotate: 8 } : { opacity: 0, scale: 0, rotate: -16 }}
              transition={{ type: "spring", stiffness: 650, damping: 13, mass: 0.55 }}
            />
          </article>
        </div>
      </div>
    </section>
  );
}
