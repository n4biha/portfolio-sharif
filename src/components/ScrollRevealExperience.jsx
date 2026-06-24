"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Navbar from "./Navbar";
import Hero from "./Hero";
import ExperienceScene from "./ExperienceScene";
import ProjectsScene from "./ProjectsScene";
import HomeMobile from "./HomeMobile";
import { useIsMobile } from "@/hooks/useIsMobile";

/*
  Three full screens, navigated like pages: the cream scrapbook (Hero / "about")
  is screen 0, the dark climbing wall (ExperienceScene) is screen 1, and the
  polaroid gallery (ProjectsScene) is screen 2. Scrolling is locked to whole
  screens — any wheel / swipe / arrow commits to a full-screen glide (eased via
  Lenis.scrollTo with lock) and further input is ignored until it lands, so you
  can never rest in the gap between screens. A ScrollTrigger over the wall flips
  the fixed navbar to cream ink while you're on the (dark) experience; the nav
  ring follows whichever screen you're heading to.
*/
const PAGE_DURATION = 1.4;
// easeInOutCubic — eases gently in AND out (vs. the old ease-out that started
// abruptly fast), so each page glide feels smooth from rest to rest.
const PAGE_EASE = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const LAST = 2;
// stable no-op so Hero's memo isn't broken by a fresh inline fn each render
const NOOP = () => {};
// section index → URL hash (0 = About = no hash). Lets a reload stay on the same
// screen with the correct nav instead of snapping back to About.
const SECTION_HASH = ["", "experience", "projects"];

// On phones, swap the whole locked-paging desktop flow for the simple mobile
// stack. HomeDesktop only mounts on desktop, so Lenis/ScrollTrigger never run on
// mobile. Desktop renders on SSR/first paint (no hydration mismatch).
export default function ScrollRevealExperience() {
  const { isMobile, mounted } = useIsMobile();
  if (mounted && isMobile) return <HomeMobile />;
  return <HomeDesktop />;
}

function HomeDesktop() {
  const router = useRouter();
  const exp = useRef(null);
  const proj = useRef(null);
  // imperative page-changer, wired up in the effect; used by the navbar too
  const goToRef = useRef(null);
  // which screen we're on/heading to (rings the matching nav item)
  const [section, setSection] = useState(0);
  // true once a glide to the experience screen has fully settled (drives the
  // delayed dot-trail trace, so it only starts after you've actually landed)
  const [arrivedExp, setArrivedExp] = useState(false);
  // dark nav theme only while the dark wall sits behind the navbar
  const [onWall, setOnWall] = useState(false);
  const onWallRef = useRef(false);
  // when a reload lands us on a non-About screen, keep Hero's intro silent + static
  const [silentIntro, setSilentIntro] = useState(false);

  // "Experience" → screen 1, "Projects" → screen 2, "About"/"Fun"/wordmark →
  // screen 0. (Projects lives on this page now, so no route change.)
  const handleNav = (id) => {
    const target = id === "experience" ? 1 : id === "projects" ? 2 : 0;
    goToRef.current?.(target);
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // start at the top every load — paging owns the scroll position
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Lenis drives the eased page-to-page glide via scrollTo. Its free
    // wheel/touch scrolling is OFF so the only way to move is our locked paging.
    const lenis = new Lenis({
      duration: PAGE_DURATION,
      easing: PAGE_EASE,
      smoothWheel: false,
      smoothTouch: false,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // --- locked section paging ---------------------------------------------
    const indexRef = { current: 0 };
    const animatingRef = { current: false };
    const targetFor = (i) => (i === 0 ? 0 : i === 1 ? exp.current : proj.current);

    const goTo = (i) => {
      const next = i < 0 ? 0 : i > LAST ? LAST : i;
      if (next === indexRef.current || animatingRef.current) return;
      indexRef.current = next;
      // reflect the screen in the URL so a reload restores it (no new history entry)
      const hash = SECTION_HASH[next];
      window.history.replaceState(
        null,
        "",
        hash ? `#${hash}` : window.location.pathname + window.location.search
      );
      startTransition(() => {
        setSection(next);
        // leaving the wall (or never on it) → reset so the trace re-arms
        if (next !== 1) setArrivedExp(false);
      });
      animatingRef.current = true;
      lenis.scrollTo(targetFor(next), {
        duration: PAGE_DURATION,
        easing: PAGE_EASE,
        lock: true, // ignore user scroll input during the glide
        force: true,
        onComplete: () => {
          animatingRef.current = false;
          // we've settled on the wall — arm the delayed dot-trail trace
          if (next === 1) startTransition(() => setArrivedExp(true));
        },
      });
    };
    goToRef.current = goTo;

    // Restore the screen from the URL hash on (re)load: if we reloaded onto
    // experience/projects, set the nav state + keep About silent, then jump the
    // scroll there (done after ScrollTrigger.refresh below).
    const startIndex = SECTION_HASH.indexOf(window.location.hash.replace("#", ""));
    const start = startIndex > 0 ? startIndex : 0;
    if (start > 0) {
      indexRef.current = start;
      onWallRef.current = start === 1;
      setSection(start);
      setSilentIntro(true);
      if (start === 1) {
        setOnWall(true);
        setArrivedExp(true);
      }
    }

    // let an open detail panel scroll natively; only page when it's at its edge
    const scrollablePanel = (target, dir) => {
      const panel = target?.closest?.(".pc-inner, .beta-inner, .liner-sheet, .record-room");
      if (!panel) return false;
      // The experience card captures wheel whenever it's scrollable, so hitting
      // its top/bottom edge never pages to the next screen (matches touch).
      if (panel.classList.contains("beta-inner")) return panel.scrollHeight > panel.clientHeight + 1;
      if (dir > 0) return panel.scrollTop + panel.clientHeight < panel.scrollHeight - 1;
      if (dir < 0) return panel.scrollTop > 0;
      return panel.scrollHeight > panel.clientHeight + 1;
    };

    const onWheel = (e) => {
      if (scrollablePanel(e.target, e.deltaY)) return; // let the panel scroll
      e.preventDefault(); // block all native/free page scrolling
      if (animatingRef.current) return;
      if (e.deltaY > 6) goTo(indexRef.current + 1);
      else if (e.deltaY < -6) goTo(indexRef.current - 1);
    };

    let touchStartY = null;
    let touchPanel = null;
    const onTouchStart = (e) => {
      touchStartY = e.touches[0]?.clientY ?? null;
      touchPanel = e.target?.closest?.(".pc-inner, .beta-inner") ?? null;
    };
    const onTouchMove = (e) => {
      if (touchPanel && touchPanel.scrollHeight > touchPanel.clientHeight + 1) return;
      e.preventDefault(); // block native touch scroll
    };
    const onTouchEnd = (e) => {
      const startedInPanel = touchPanel;
      touchPanel = null;
      if (startedInPanel || touchStartY == null || animatingRef.current) return;
      const dy = touchStartY - (e.changedTouches[0]?.clientY ?? touchStartY);
      if (dy > 40) goTo(indexRef.current + 1);
      else if (dy < -40) goTo(indexRef.current - 1);
      touchStartY = null;
    };

    const onKey = (e) => {
      if (animatingRef.current) return;
      if (["ArrowDown", "PageDown"].includes(e.key) || e.key === " ") {
        e.preventDefault();
        goTo(indexRef.current + 1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        goTo(indexRef.current - 1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);

    const ctx = gsap.context(() => {
      // Cream nav ink while the dark wall is the screen behind the navbar (from
      // when its top passes the upper 15% until its bottom does). setState runs
      // as a non-urgent transition so React reconciles it off the scroll frame.
      ScrollTrigger.create({
        trigger: exp.current,
        start: "top 15%",
        end: "bottom 15%",
        onToggle: (self) => {
          if (self.isActive !== onWallRef.current) {
            onWallRef.current = self.isActive;
            startTransition(() => setOnWall(self.isActive));
          }
        },
      });

      ScrollTrigger.refresh();

      // jump to the restored screen instantly (no glide) once positions are known
      if (start > 0) {
        lenis.scrollTo(targetFor(start), { immediate: true, force: true });
      }
    });

    return () => {
      ctx.revert();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      goToRef.current = null;
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="home-flow">
      <Navbar
        fixed
        theme={onWall || section === 2 ? "dark" : "light"}
        active={section === 1 ? "experience" : section === 2 ? "projects" : null}
        arrived={arrivedExp}
        onNav={handleNav}
      />

      {/* screen 0 — the scrapbook "about" (Hero is its own h-screen section) */}
      <Hero introDone onIntroDone={NOOP} paused={section !== 0} play={!silentIntro} />

      {/* screen 1 — the climbing wall */}
      <section ref={exp} className="experience-section climb-wall">
        <ExperienceScene active={section === 1} arrived={arrivedExp} />
      </section>

      {/* screen 2 — the polaroid gallery (just the wall, no cover) */}
      <section ref={proj} className="projects-section">
        <ProjectsScene active={section === 2} />
      </section>
    </div>
  );
}
