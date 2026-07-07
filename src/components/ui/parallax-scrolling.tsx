"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
  Layered scroll-parallax — adapted from the Osmo parallax component to fit this
  site's scroll engine.

  What stayed: the technique. A single scrubbed GSAP timeline over a container
  moves its `[data-parallax-layer="…"]` children by different amounts, so nearer
  layers drift faster than farther ones as the container scrolls past.

  What changed (and why):
    • No `new Lenis()` in here. The page already runs ONE Lenis instance in
      ScrollRevealExperience, which drives `gsap.ticker` and calls
      `ScrollTrigger.update` on every scroll. A second Lenis would double-drive
      the wheel and fight the locked section paging. This hook only adds the
      scrubbed timeline and lets that existing engine feed it.
    • Container + layers are passed in by the caller (via refs + data-attrs) so
      it wraps the real Hero scrapbook instead of Osmo's demo images.
    • TypeScript, reduced-motion guard, and gsap.context cleanup so it tears
      down cleanly with the component.
*/

export type ParallaxLayer = {
  /** matches a child's [data-parallax-layer="…"] value */
  layer: string;
  /** how far the layer drifts across the scroll, in % of its own height */
  yPercent: number;
};

export type UseParallaxLayersOptions = {
  layers: ParallaxLayer[];
  /** ScrollTrigger start/end over the container. Defaults span one screen:
      progress 0 when the container is at rest at the top, 1 once it has fully
      scrolled up and out of view (i.e. during the page-glide to the next screen). */
  start?: string;
  end?: string;
  /** "exit" (default): layers sit at rest (identity) and drift AWAY to `yPercent`
      as the screen scrolls up and out — use for a screen you leave upward (Hero,
      Experience). "enter": layers start offset at `yPercent` and settle to
      identity as the screen glides up INTO view — use for the last screen, which
      only ever scrolls in (Projects). Pair "enter" with start:"top bottom",
      end:"top top" so rest lands at identity. */
  mode?: "exit" | "enter";
  /** set false to skip setup entirely (e.g. on mobile / when not mounted) */
  enabled?: boolean;
};

export function useParallaxLayers(
  containerRef: RefObject<HTMLElement | null>,
  {
    layers,
    start = "top top",
    end = "bottom top",
    mode = "exit",
    enabled = true,
  }: UseParallaxLayersOptions
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;
    // Respect users who asked for less motion — leave the layers static.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: container, start, end, scrub: 0 },
      });

      layers.forEach((l, i) => {
        const els = container.querySelectorAll(`[data-parallax-layer="${l.layer}"]`);
        if (!els.length) return;
        // stack every layer's tween at time 0 ("<") so they scrub in parallel
        const at = i === 0 ? undefined : "<";
        if (mode === "enter") {
          // start offset, settle to identity as the screen glides into view
          tl.fromTo(els, { yPercent: l.yPercent }, { yPercent: 0, ease: "none" }, at);
        } else {
          // rest at identity, drift away as the screen scrolls out
          tl.to(els, { yPercent: l.yPercent, ease: "none" }, at);
        }
      });
    }, container);

    return () => ctx.revert();
  }, [containerRef, enabled, start, end, mode, layers]);
}
