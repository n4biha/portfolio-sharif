"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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

// how a stage cell (the featured card, the screen frame) comes and goes when
// the record changes: the old one fades up and out while the new one rises in
const CELL_IN = { opacity: 1, y: 0 };

/*
  "Projects on Repeat" — a dark listening room, modern cut: title, filter
  pills, a carousel of project cards, and the stage below — the Now Playing disc,
  the featured-project card, and the screenshot on its device. Pick a card (or
  step with the chevrons / ← → / the transport under the disc) to "play" it.
  `active` is false when this isn't the on-screen section of the home flow,
  which rests the disc.
*/
function ProjectsScene({ active = true }) {
  const [category, setCategory] = useState("All");
  // default to the first record so the stage is populated on load
  const [selectedId, setSelectedId] = useState(PROJECTS[0]?.id ?? null);
  // the play/pause under the disc
  const [playing, setPlaying] = useState(true);
  const reduce = useReducedMotion();

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

  const togglePlay = useCallback(() => setPlaying((v) => !v), []);

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

  const cell = {
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: CELL_IN,
    exit: reduce ? undefined : { opacity: 0, y: -8, transition: { duration: 0.18, ease: "easeIn" } },
    transition: reduce ? { duration: 0 } : { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <div ref={roomRef} className="record-room">
      <header data-parallax-layer="projhead" className="proj-head">
        <h1 className="proj-head-title">Projects on Repeat</h1>
      </header>

      <ProjectFilters value={category} onChange={pickCategory} />

      <ProjectCarousel projects={visible} selectedId={selected?.id} onSelect={setSelectedId} onStep={step} />

      {/* the stage is always rendered: the parallax hook queries its layer once on mount */}
      <div data-parallax-layer="projstage" className="record-stage">
        <RecordPlayer
          project={selected}
          index={index}
          total={visible.length}
          spinning={active && playing}
          playing={playing}
          onTogglePlay={togglePlay}
          onStep={step}
        />
        {/* popLayout lifts the leaving cells out of the grid so the new ones
            take their slots at once and the two simply crossfade */}
        <AnimatePresence initial={false} mode="popLayout">
          {selected && (
            <motion.div key={`panel-${selected.id}`} className="stage-cell" {...cell}>
              <RecordPanel project={selected} />
            </motion.div>
          )}
          {selected && (
            <motion.div key={`frame-${selected.id}`} className="stage-cell stage-cell-frame" {...cell}>
              <ScreenFrame project={selected} />
            </motion.div>
          )}
        </AnimatePresence>
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
