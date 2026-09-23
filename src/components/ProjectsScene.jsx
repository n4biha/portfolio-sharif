"use client";

import { memo, useEffect, useRef, useState } from "react";
import RecordShelf from "./RecordShelf";
import RecordPlayer from "./RecordPlayer";
import RecordPanel from "./RecordPanel";
import ProjectsMobile from "./ProjectsMobile";
import { PROJECTS } from "@/lib/projects";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useParallaxLayers } from "./ui/parallax-scrolling";

// Projects is the last screen — it only ever glides UP into view, never out the
// top — so this uses "enter" mode: the title and turntable stage start slightly
// offset and settle into place (identity at rest) as the screen rises in. Paired
// with the start/end below so rest lands exactly at identity. Tunable.
const PARALLAX_LAYERS = [
  { layer: "projhead", yPercent: -20 },  // title drops into place from above
  { layer: "projstage", yPercent: 16 },  // turntable stage rises up into place
];

/*
  "Projects on Repeat" — a vintage listening room, kept simple: every album on one
  shelf; click one to "play" it — the turntable spins it and the one panel beside
  it carries the record's details and screenshot (RecordPanel). `active` is false
  when this isn't the on-screen section of the home flow, which rests the vinyl.
*/
function ProjectsScene({ active = true }) {
  // default to the first record so the player + panel are populated on load
  const [selectedId, setSelectedId] = useState(PROJECTS[0]?.id ?? null);
  const index = Math.max(0, PROJECTS.findIndex((p) => p.id === selectedId));
  const selected = PROJECTS[index] ?? null;

  const roomRef = useRef(null);
  useParallaxLayers(roomRef, {
    layers: PARALLAX_LAYERS,
    mode: "enter",
    start: "top bottom",
    end: "top top",
  });

  // Warm every record's screenshot into the browser cache on mount, so switching
  // records swaps the preview instantly instead of fetching on demand.
  useEffect(() => {
    PROJECTS.forEach((p) => {
      if (p.demoPreview?.screenshot) {
        const img = new Image();
        img.src = p.demoPreview.screenshot;
      }
    });
  }, []);

  return (
    <div ref={roomRef} className="record-room">
      <header data-parallax-layer="projhead" className="record-room-head">
        <h1 className="record-room-title hand">Projects on Repeat</h1>
      </header>

      <RecordShelf projects={PROJECTS} selectedId={selectedId} onSelect={setSelectedId} />

      {/* the stage is always rendered: the parallax hook queries its layer once on mount */}
      <div data-parallax-layer="projstage" className="record-stage">
        <RecordPlayer project={selected} spinning={active} />
        <RecordPanel project={selected} index={index} />
      </div>
    </div>
  );
}

// Memoised: the home flow re-renders on every section / nav-theme change (some of
// them mid-scroll). Without this, those updates re-reconcile this whole scene
// during the page glide — a per-frame hitch. It only needs to re-render when its
// `active` prop actually changes.
const ProjectsSceneDesktop = memo(ProjectsScene);

// On phones (incl. the standalone /projects route) render the simple mobile list
// instead of the record-room scene.
export default function ProjectsSceneSwitch(props) {
  const { isMobile, mounted } = useIsMobile();
  if (mounted && isMobile) return <ProjectsMobile />;
  return <ProjectsSceneDesktop {...props} />;
}
