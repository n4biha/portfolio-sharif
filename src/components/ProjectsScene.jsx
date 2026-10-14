"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import ProjectFilters from "./ProjectFilters";
import ProjectCarousel from "./ProjectCarousel";
import RecordPlayer from "./RecordPlayer";
import RecordPanel from "./RecordPanel";
import ScreenFrame from "./ScreenFrame";
import ProjectsMobile from "./ProjectsMobile";
import { PROJECTS } from "@/lib/projects";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useParallaxLayers } from "./ui/parallax-scrolling";

// Projects is the last screen — it only ever glides UP into view, never out the
// top — so this uses "enter" mode: the title and stage start slightly offset and
// settle into place (identity at rest) as the screen rises in. Paired with the
// start/end below so rest lands exactly at identity. Tunable.
const PARALLAX_LAYERS = [
  { layer: "projhead", yPercent: -20 },  // title drops into place from above
  { layer: "projstage", yPercent: 16 },  // stage rises up into place
];

/*
  "Projects on Repeat" — a dark listening room, modern cut: title block, filter
  pills, a carousel of project cards, and the stage below — the Now Playing disc,
  the featured-project card, and the screenshot in a browser frame. Pick a card
  (or step with the chevrons / ← →) to "play" it. `active` is false when this
  isn't the on-screen section of the home flow, which rests the disc.
*/
function ProjectsScene({ active = true }) {
  const [category, setCategory] = useState("All");
  // default to the first record so the stage is populated on load
  const [selectedId, setSelectedId] = useState(PROJECTS[0]?.id ?? null);

  const visible = category === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === category);
  const index = Math.max(0, visible.findIndex((p) => p.id === selectedId));
  const selected = visible[index] ?? null;

  // a filter that hides the playing record hands play to the first one showing
  const pickCategory = useCallback((c) => {
    setCategory(c);
    const next = c === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === c);
    setSelectedId((id) => (next.some((p) => p.id === id) ? id : next[0]?.id ?? null));
  }, []);

  // prev / next, wrapping round the visible row
  const step = useCallback(
    (dir) => {
      if (!visible.length) return;
      const next = (index + dir + visible.length) % visible.length;
      setSelectedId(visible[next].id);
    },
    [visible, index],
  );

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
      <header data-parallax-layer="projhead" className="proj-head">
        <p className="proj-head-eyebrow">Ideas. Tools. Impact.</p>
        <h1 className="proj-head-title">Projects on Repeat</h1>
        <p className="proj-head-sub">Exploring ideas, building solutions, and turning curiosity into real-world impact.</p>
      </header>

      <ProjectFilters value={category} onChange={pickCategory} />

      <ProjectCarousel projects={visible} selectedId={selected?.id} onSelect={setSelectedId} onStep={step} />

      {/* the stage is always rendered: the parallax hook queries its layer once on mount */}
      <div data-parallax-layer="projstage" className="record-stage">
        <RecordPlayer project={selected} index={index} total={visible.length} spinning={active} />
        <RecordPanel project={selected} />
        {selected && <ScreenFrame key={selected.id} project={selected} />}
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
