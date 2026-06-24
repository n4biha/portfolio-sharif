"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import AboutMobile from "./AboutMobile";
import ExperienceMobile from "./ExperienceMobile";
import ProjectsMobile from "./ProjectsMobile";

/*
  Mobile home flow — a simple, normal-scroll stack (no Lenis page-lock): the
  scrapbook About, then the dark Experience list, then the green Projects list.
  The nav menu jumps between sections; an IntersectionObserver keeps the navbar
  theme (light on About, dark on the wall/green screens) and active link in sync.
*/

// nav link id -> section element id
const SECTION_FOR = { home: "home", about: "home", fun: "home", experience: "experience", projects: "projects" };

export default function HomeMobile() {
  const [section, setSection] = useState("home");
  const containerRef = useRef(null);

  const goTo = (id) => {
    const el = document.getElementById(SECTION_FOR[id] ?? "home");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const ids = ["home", "experience", "projects"];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setSection(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const theme = section === "home" ? "light" : "dark";
  const active = section === "experience" ? "experience" : section === "projects" ? "projects" : null;

  return (
    <div className="m-flow" ref={containerRef}>
      <Navbar fixed theme={theme} active={active} arrived onNav={goTo} />
      <main>
        <AboutMobile />
        <ExperienceMobile />
        <ProjectsMobile />
      </main>
    </div>
  );
}
