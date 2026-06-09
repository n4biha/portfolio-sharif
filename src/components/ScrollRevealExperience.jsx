"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Navbar from "./Navbar";
import Hero from "./Hero";
import ExperienceScene from "./ExperienceScene";

/*
  One continuous scroll story. The cream scrapbook (Hero) sits on top; the dark
  climbing wall (ExperienceScene) is already rendered underneath. Lenis smooth-scroll
  interpolates the raw wheel input, and a GSAP ScrollTrigger timeline (scrubbed off
  that smooth scroll) eases the scrapbook up + dissolves it while the wall settles in,
  the stage darkens cream → charcoal, and the nav ink → white. No route change — it's
  all one page. Outer 220vh wrapper gives scroll distance; inner sticky stage is the
  pinned full screen.
*/
export default function ScrollRevealExperience() {
  const wrap = useRef(null);
  const wall = useRef(null);
  const book = useRef(null);
  const lenisRef = useRef(null);
  // ring "Experience" in the nav + keep the wall interactive once we're on it
  const [revealed, setRevealed] = useState(false);
  const revealedRef = useRef(false);
  // once the visitor starts scrolling off the intro, pause the hero's typewriter
  const [leftIntro, setLeftIntro] = useState(false);
  const leftIntroRef = useRef(false);

  // In-page nav: "Experience" scrolls down to the revealed wall; everything else
  // (About / Projects / Skills / Fun / the wordmark) scrolls back up to the top.
  const handleNav = (id) => {
    const el = wrap.current;
    const lenis = lenisRef.current;
    const target =
      id === "experience" && el
        ? el.offsetTop + el.offsetHeight - window.innerHeight
        : 0;
    const duration = id === "experience" ? 1.4 : 1.2;
    if (lenis) lenis.scrollTo(target, { duration });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Lenis smooth scroll → buttery, frame-synced scroll position. Driven from
    // GSAP's ticker and kept in lockstep with ScrollTrigger so the scrub never steps.
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      gsap.set(wall.current, { opacity: 0 });

      gsap.timeline({
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // the reveal completes ~78% in; treat >0.7 as "arrived on the wall":
            // ring the nav item, allow hold clicks, and keep the board open
            const onWall = self.progress > 0.7;
            wall.current.style.pointerEvents = onWall ? "auto" : "none";
            book.current.style.pointerEvents = self.progress > 0.5 ? "none" : "auto";
            if (onWall !== revealedRef.current) {
              revealedRef.current = onWall;
              setRevealed(onWall);
            }
            // any meaningful scroll away from the intro silences the typewriter
            const left = self.progress > 0.12;
            if (left !== leftIntroRef.current) {
              leftIntroRef.current = left;
              setLeftIntro(left);
            }
          },
        },
      })
        // the scrapbook slides STRAIGHT up at full size (no scale — scaling made the
        // whole page appear to shrink/drift sideways) and fades; the wall fades in
        // behind it. Linear (scrubbed) for a smooth, even feel.
        .to(book.current, { yPercent: -100, opacity: 0, ease: "none", force3D: true, duration: 0.78 }, 0)
        .to(wall.current, { opacity: 1, ease: "none", duration: 0.78 }, 0)
        .to(".scroll-reveal-stage", { backgroundColor: "#2c2b2d", ease: "none", duration: 0.78 }, 0)
        .to("header a", { color: "#e9e3d8", ease: "none", duration: 0.78 }, 0)
        // small settle buffer so the wall is fully revealed before the scroll ends
        .to({}, { duration: 0.22 });

      ScrollTrigger.refresh();
    }, wrap);

    return () => {
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <div ref={wrap} className="scroll-reveal-experience">
      <div className="scroll-reveal-stage">
        <Navbar onNav={handleNav} active={revealed ? "experience" : null} />

        <div ref={wall} className="climbing-wall-layer climb-wall">
          <ExperienceScene active={revealed} />
        </div>

        <div ref={book} className="scrapbook-layer">
          <Hero introDone onIntroDone={() => {}} paused={leftIntro} />
        </div>
      </div>
    </div>
  );
}
