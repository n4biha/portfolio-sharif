"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import AboutMobile from "./AboutMobile";
import ExperienceMobile from "./ExperienceMobile";
import ProjectsMobile from "./ProjectsMobile";
import MobileFooter from "./MobileFooter";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/*
  Mobile home flow — one calm beige scrollable page: About, Experience,
  Projects, and a simple sign-off footer, all on a continuous paper surface
  (no per-section theme worlds; the desktop keeps its scenes). The nav menu
  jumps between sections; an IntersectionObserver keeps the active link in
  sync. The navbar stays light — every section is beige now.
*/

// nav link id -> section element id
const SECTION_FOR = { home: "home", about: "home", fun: "home", experience: "experience", projects: "projects" };

export default function HomeMobile() {
  const [section, setSection] = useState("home");
  const containerRef = useRef(null);
  useScrollReveal(containerRef);

  const goTo = (id) => {
    const el = document.getElementById(SECTION_FOR[id] ?? "home");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const ids = ["home", "experience", "projects", "footer"];
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

  const active = section === "experience" ? "experience" : section === "projects" ? "projects" : null;

  return (
    <div className="m-flow" ref={containerRef}>
      <Navbar fixed theme="light" active={active} arrived onNav={goTo} />
      <main>
        <AboutMobile />
        <ExperienceMobile />
        <ProjectsMobile />
      </main>
      <MobileFooter />
    </div>
  );
}
