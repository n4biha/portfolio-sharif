"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import GalleryWall from "./GalleryWall";
import ProjectCard from "./ProjectCard";
import { PROJECTS } from "@/lib/projects";

/*
  Holds the selection state for the gallery. Clicking a polaroid pans the wall
  slightly left (it stays visible) and slides the Project Card in on the right.
  Esc / "back to the wall" / clicking the polaroid again closes it. Mirrors
  ExperienceScene so the two pages behave identically.
*/
export default function ProjectsScene({ active = true }) {
  const [selectedId, setSelectedId] = useState(null);
  const open = selectedId != null;
  const project = open ? PROJECTS[selectedId] : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setSelectedId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // When we scroll away from the wall (no longer "on the page"), close any open
  // card so it isn't left lingering.
  useEffect(() => {
    if (!active) setSelectedId(null);
  }, [active]);

  const select = useCallback(
    (id) => setSelectedId((cur) => (cur === id ? null : id)),
    []
  );

  // Memoise the wall on its only real input (selectedId, with a stable onSelect)
  // so the scroll reveal flipping `active` mid-transition re-renders only the
  // cheap deco, never the polaroids — same trick ExperienceScene uses.
  const wall = useMemo(
    () => <GalleryWall selectedId={selectedId} onSelect={select} />,
    [selectedId, select]
  );

  return (
    <div className={`gallery-scene${open ? " is-open" : ""}`}>
      <div className="gallery-scene-wall">{wall}</div>
      <ProjectCard project={project} onClose={() => setSelectedId(null)} />
    </div>
  );
}
