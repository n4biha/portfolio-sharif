"use client";

import { useEffect, useState } from "react";
import ClimbingWall from "./ClimbingWall";
import RouteBetaBoard from "./RouteBetaBoard";
import ChalkMark, { ChalkDefs } from "./ChalkMark";
import { EXPERIENCES } from "@/lib/experiences";

/*
  Holds the selection state. Clicking a hold pans the wall slightly left (it stays
  visible) and chalks in the Route Beta Board on the right — drawn onto the same
  wall, not a floating panel. Esc / "back to the wall" / clicking the hold again
  closes it.
*/
export default function ExperienceScene({ active = true }) {
  const [selectedId, setSelectedId] = useState(null);
  const open = selectedId != null;
  const experience = open ? EXPERIENCES[selectedId] : null;

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

  const select = (id) => setSelectedId((cur) => (cur === id ? null : id));

  return (
    <div className={`climb-scene${open ? " is-open" : ""}`}>
      <ChalkDefs />

      <div className="climb-scene-wall">
        <ClimbingWall selectedId={selectedId} onSelect={select} />

        {/* handwritten messages + chalk doodles drawn on the wall */}
        <div className="wall-deco" aria-hidden="true">
          <p className="wall-title hand">Climb the wall.</p>
          <p className="wall-sub hand">Every hold unlocks a chapter of my journey.</p>

          <span className="chalk-note note-a hand">Find your next move →</span>
          <span className="chalk-note note-b hand">Route in progress.</span>
          <span className="chalk-note note-c hand">Keep climbing.</span>
          <span className="chalk-note note-d hand">On belay.</span>

          <span className="chalk-grade grade-a hand">V1</span>
          <span className="chalk-grade grade-b hand">V3</span>
          <span className="chalk-grade grade-c hand">V5</span>

          <ChalkMark type="arrowUp" size={52} className="deco deco-arrow1" strokeWidth={3.2} />
          <ChalkMark type="star" size={32} className="deco deco-star1" strokeWidth={3.2} />
          <ChalkMark type="check" size={38} className="deco deco-check1" strokeWidth={3.4} />
          <ChalkMark type="x" size={26} className="deco deco-x1" strokeWidth={3.2} />
          <ChalkMark type="squiggle" size={58} className="deco deco-squig1" strokeWidth={2.6} />
          <ChalkMark type="circle" size={30} className="deco deco-circ1" strokeWidth={2.8} />
        </div>
      </div>

      <RouteBetaBoard experience={experience} onClose={() => setSelectedId(null)} />
    </div>
  );
}
