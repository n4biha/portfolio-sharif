"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import RecordShelf from "./RecordShelf";
import RecordPlayer from "./RecordPlayer";
import LinerNotes from "./LinerNotes";
import LivePreview from "./LivePreview";
import ProjectsMobile from "./ProjectsMobile";
import SiteFooter from "./SiteFooter";
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
  "Projects on Repeat" — a cozy vintage listening room. Browse project albums on
  the shelf; click one to "play" it (Now Playing turntable + liner-notes sheet +
  laptop live preview). `active` is false when this isn't the on-screen section of
  the home flow, which rests the spinning vinyl.
*/
function ProjectsScene({ active = true }) {
  const [category, setCategory] = useState("All");
  // default to the first project so the player/sheet/laptop are populated on load
  const [selectedId, setSelectedId] = useState(PROJECTS[0]?.id ?? null);
  const shelf = useMemo(
    () => (category === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === category)),
    [category]
  );

  const selected =
    PROJECTS.find((p) => p.id === selectedId) ?? PROJECTS[0] ?? null;

  // when switching crates, keep the current pick if it's still on the shelf;
  // otherwise drop the needle on the first record of the new crate.
  useEffect(() => {
    if (shelf.length && !shelf.some((p) => p.id === selectedId)) {
      setSelectedId(shelf[0].id);
    }
  }, [shelf, selectedId]);

  const roomRef = useRef(null);
  useParallaxLayers(roomRef, {
    layers: PARALLAX_LAYERS,
    mode: "enter",
    start: "top bottom",
    end: "top top",
  });

  // Warm every album's laptop screenshot into the browser cache on mount, so
  // switching records swaps the preview instantly instead of fetching on demand.
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
        <p className="record-room-sub">
          Favorite builds, experiments, and ideas I keep coming back to.
        </p>
      </header>

      <RecordShelf
        projects={shelf}
        selectedId={selectedId}
        onSelect={setSelectedId}
        category={category}
        onCategory={setCategory}
      />

      <div data-parallax-layer="projstage" className="record-stage">
        <RecordPlayer project={selected} spinning={active} />
        <LinerNotes project={selected} />
        <LivePreview project={selected} />
      </div>

      {/* quiet sign-off at the bottom of the room */}
      <SiteFooter />
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
