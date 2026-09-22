"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ClimbingWall from "./ClimbingWall";
import RouteBetaBoard from "./RouteBetaBoard";
import WallLogbook from "./WallLogbook";
import ChalkMark, { ChalkDefs } from "./ChalkMark";
import ExperienceMobile from "./ExperienceMobile";
import { EXPERIENCES, SIDE_EXPERIENCES } from "@/lib/experiences";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useParallaxLayers } from "./ui/parallax-scrolling";

// Same layered-drift as the Hero, tuned for the climbing wall. The interactive
// holds stay put (they carry the zoom-pan on open); only the chalk title, the
// doodles and the logbook ride separate planes, so they drift as this screen
// scrolls up toward Projects. Exit mode → identity at rest, drift on the way out.
// yPercent is a % of each layer's OWN height (the logbook's wrapper is full
// height, so its small number is still a real drift). Tunable.
const PARALLAX_LAYERS = [
  { layer: "exptitle", yPercent: -16 }, // chalk EXPERIENCE title — drifts up
  { layer: "expdeco", yPercent: 22 },   // chalk doodles — lag down, a far plane
  { layer: "explog", yPercent: -7 },    // hanging logbook — a near plane, up
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
  // The logbook swings in with that first trace, then STAYS: `tracing` drops the
  // instant a glide away begins (arrived → false), which is invisible for the 6px
  // dots but would blink the whole sheet out mid-scroll. So this only latches on.
  const [logbookIn, setLogbookIn] = useState(false);
  useEffect(() => {
    if (!arrived) {
      setTracing(false);
      return;
    }
    const t = setTimeout(() => {
      setTracing(true);
      setLogbookIn(true);
    }, 650);
    return () => clearTimeout(t);
  }, [arrived]);

  // Closing via Esc or the card's ✕ hands focus back to whatever opened the card
  // (a rock, or a logbook row). The logbook is inert while a card is open, so
  // without this a keyboard user's focus falls to <body>. It's restored in an
  // effect — i.e. after the commit that lifts `inert` — and with preventScroll,
  // since a focus-scroll would desync the locked page glide.
  const openerRef = useRef(null);
  const restoreFocus = useRef(false);
  const close = useCallback(() => {
    restoreFocus.current = true;
    setSelectedId(null);
  }, []);
  useEffect(() => {
    if (open || !restoreFocus.current) return;
    restoreFocus.current = false;
    openerRef.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // When we scroll away from the wall (no longer "on the page"), close any open
  // Route Beta Board so the info sidebar isn't left lingering.
  useEffect(() => {
    if (!active) setSelectedId(null);
  }, [active]);

  // One-time "click here first" sparkle on the bottom hold: shows once the route
  // has traced in, then disappears for good the moment any hold is clicked.
  const [hintDone, setHintDone] = useState(false);
  const hint = active && arrived && tracing && !open && !hintDone;

  // `el` = the rock / logbook row that was activated (see `close` above)
  const select = useCallback((id, el) => {
    setHintDone(true);
    openerRef.current = el ?? null;
    setSelectedId((cur) => (cur === id ? null : id));
  }, []);

  const wall = useMemo(
    () => <ClimbingWall selectedId={selectedId} onSelect={select} hint={hint} />,
    [selectedId, select, hint]
  );

  return (
    <div
      ref={sceneRef}
      className={`climb-scene${open ? " is-open" : ""}${experience?.compact ? " is-compact" : ""}${tracing ? " is-tracing" : ""}`}
    >
      <ChalkDefs />

      <div className="climb-scene-wall">
        {wall}

        {/* chalk doodles drawn on the wall — left + centre only; the right side
            belongs to the logbook */}
        <div data-parallax-layer="expdeco" className="wall-deco" aria-hidden="true">
          <ChalkMark type="arrowUp" size={52} className="deco deco-arrow1" strokeWidth={3.2} />
          <ChalkMark type="star" size={32} className="deco deco-star1" strokeWidth={3.2} />
          <ChalkMark type="x" size={26} className="deco deco-x1" strokeWidth={3.2} />
          <ChalkMark type="squiggle" size={58} className="deco deco-squig1" strokeWidth={2.6} />
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

      {/* the "where it started" logbook, hanging on the right — a sibling of the
          wall layer (not inside it) so it neither pans nor dirties the wall's
          cached texture. The card opens over this spot, so it fades while open. */}
      <WallLogbook entries={SIDE_EXPERIENCES} onSelect={select} shown={logbookIn} covered={open} />

      <RouteBetaBoard experience={experience} onClose={close} />
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
