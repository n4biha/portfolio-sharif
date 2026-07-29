"use client";

import { useEffect } from "react";

/*
  The mobile page's single motion system: a gentle fade-up as content scrolls
  into view. Built default-visible so it can never strand content invisible:

  - Elements tagged `.m-reveal` ship fully visible (the CSS hidden state only
    applies once JS adds `.reveal-armed`). No JS, reduced-motion, or an old
    browser → everything simply shows.
  - On mount we arm ONLY elements below the initial viewport, so nothing that's
    already on screen flashes, then an IntersectionObserver reveals each element
    once as it enters view.
  - A failsafe reveals everything a few seconds in, in case the observer never
    fires (e.g. a background tab that throttles callbacks).
*/
export function useScrollReveal(containerRef) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    if (typeof IntersectionObserver === "undefined") return undefined;

    const els = Array.from(root.querySelectorAll(".m-reveal"));
    if (!els.length) return undefined;

    // Only arm what's comfortably below the fold — on-screen content stays put.
    const armed = els.filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight * 0.9
    );
    armed.forEach((el) => el.classList.add("reveal-armed"));
    if (!armed.length) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-revealed");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    armed.forEach((el) => io.observe(el));

    // never leave content hidden if the observer goes quiet
    const failsafe = window.setTimeout(() => {
      armed.forEach((el) => el.classList.add("is-revealed"));
    }, 3000);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
      armed.forEach((el) => el.classList.remove("reveal-armed", "is-revealed"));
    };
  }, [containerRef]);
}
