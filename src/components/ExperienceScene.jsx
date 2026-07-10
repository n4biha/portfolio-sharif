"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ClimbingWall from "./ClimbingWall";
import RouteBetaBoard from "./RouteBetaBoard";
import ChalkMark, { ChalkDefs } from "./ChalkMark";
import ExperienceMobile from "./ExperienceMobile";
import { EXPERIENCES } from "@/lib/experiences";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useParallaxLayers } from "./ui/parallax-scrolling";

// Same layered-drift as the Hero, tuned for the climbing wall. The interactive
// holds stay put (they carry the zoom-pan on open); only the chalk title and
// doodles ride separate planes, so they drift as this screen scrolls up toward
// Projects. Exit mode → identity at rest, drift on the way out. Tunable.
const PARALLAX_LAYERS = [
  { layer: "exptitle", yPercent: -16 }, // chalk EXPERIENCE title — drifts up
  { layer: "expdeco", yPercent: 22 },   // chalk doodles — lag down, a far plane
];

function ExperienceScene({ active = true, arrived = true }) {
  const sceneRef = useRef(null);
  useParallaxLayers(sceneRef, { layers: PARALLAX_LAYERS });

  // Warm every route's highlight photo into the browser cache on mount, so
  // opening a rock (or hopping between rocks) never fetches + decodes a photo
  // mid-animation — that on-demand load was visible jank on the deployed site.
  useEffect(() => {
    Object.values(EXPERIENCES).forEach((exp) => {
      const list = exp.highlight?.photos ?? (exp.highlight?.photo ? [exp.highlight.photo] : []);
      list.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    });
  }, []);
  const [selectedId, setSelectedId] = useState(null);
  const open = selectedId != null;
  const experience = open ? EXPERIENCES[selectedId] : null;

  // Trace the dotted route in ~1s AFTER landing on the wall (a beat to settle in
  // first), then let the per-dot stagger draw it bottom → top. `arrived` flips
  // true once the page glide finishes (or immediately on the standalone route).
  const [tracing, setTracing] = useState(false);
  useEffect(() => {
    if (!arrived) {
      setTracing(false);
      return;
    }
    const t = setTimeout(() => setTracing(true), 650);
    return () => clearTimeout(t);
  }, [arrived]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setSelectedId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // When we scroll away from the wall (no longer "on the page"), close any open
  // Route Beta Board so the info sidebar isn't left lingering.
  useEffect(() => {
    if (!active) setSelectedId(null);
  }, [active]);

  // One-time "click here first" sparkle on the bottom hold: shows once the route
  // has traced in, then disappears for good the moment any hold is clicked.
  const [hintDone, setHintDone] = useState(false);
  const hint = active && arrived && tracing && !open && !hintDone;

  const select = useCallback((id) => {
    setHintDone(true);
    setSelectedId((cur) => (cur === id ? null : id));
  }, []);

  const wall = useMemo(
    () => <ClimbingWall selectedId={selectedId} onSelect={select} hint={hint} />,
    [selectedId, select, hint]
  );

  return (
    <div ref={sceneRef} className={`climb-scene${open ? " is-open" : ""}${tracing ? " is-tracing" : ""}`}>
      <ChalkDefs />

      <div className="climb-scene-wall">
        {wall}

        {/* chalk doodles drawn on the wall (text removed — drawings only) */}
        <div data-parallax-layer="expdeco" className="wall-deco" aria-hidden="true">
          <ChalkMark type="arrowUp" size={52} className="deco deco-arrow1" strokeWidth={3.2} />
          <ChalkMark type="star" size={32} className="deco deco-star1" strokeWidth={3.2} />
          <ChalkMark type="check" size={38} className="deco deco-check1" strokeWidth={3.4} />
          <ChalkMark type="x" size={26} className="deco deco-x1" strokeWidth={3.2} />
          <ChalkMark type="squiggle" size={58} className="deco deco-squig1" strokeWidth={2.6} />
          <ChalkMark type="circle" size={30} className="deco deco-circ1" strokeWidth={2.8} />
        </div>
      </div>

      {/* page title, chalked bottom-left of the wall; fades out while a route is
          open so it doesn't clash with the Route Beta Board */}
      <div data-parallax-layer="exptitle" className="wall-title-block">
        <svg
          className="wall-title-marker"
          viewBox="0 0 26 240"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <circle cx="13" cy="14" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="13" y1="20" x2="13" y2="218" stroke="currentColor" strokeWidth="2" />
          <line x1="7" y1="222" x2="19" y2="234" stroke="currentColor" strokeWidth="2" />
          <line x1="19" y1="222" x2="7" y2="234" stroke="currentColor" strokeWidth="2" />
        </svg>
        <div>
          <h1 className="wall-title">EXPERIENCE</h1>
          <p className="wall-sub">Climb the rocks to learn about my experience.</p>
        </div>
      </div>

      <RouteBetaBoard experience={experience} onClose={() => setSelectedId(null)} />
    </div>
  );
}

// Memoised so the home flow's mid-scroll state updates (section / nav theme)
// don't re-reconcile the climbing wall during the page glide. Re-renders only
// when `active` or `arrived` change.
const ExperienceSceneDesktop = memo(ExperienceScene);

// On phones (incl. the standalone /experience route) render the simple mobile
// list instead of the interactive climbing wall.
export default function ExperienceSceneSwitch(props) {
  const { isMobile, mounted } = useIsMobile();
  if (mounted && isMobile) return <ExperienceMobile />;
  return <ExperienceSceneDesktop {...props} />;
}
