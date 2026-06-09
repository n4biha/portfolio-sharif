"use client";

import { useEffect, useRef, useState } from "react";
import RansomTitle from "./RansomTitle";

/*
  Experience, as a vinyl record half-pulled from its sleeve (pure-CSS art in
  globals.css). Resting state recreates the reference mock-up. "Playing" it — a
  click / Enter / Space — slides the record out of the sleeve, sets it spinning,
  and reveals the liner notes (the role write-up) printed on the sleeve. Clicking
  anywhere off the record stops the spin and slides it back into the sleeve.
*/
export default function ExperienceVinyl() {
  const [out, setOut] = useState(false);
  const vinylRef = useRef(null);

  // While it's playing, a click anywhere outside the record closes it again.
  useEffect(() => {
    if (!out) return;
    const onDocPointerDown = (e) => {
      if (vinylRef.current && !vinylRef.current.contains(e.target)) {
        setOut(false);
      }
    };
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, [out]);

  return (
    <section
      id="experience"
      className="vinyl-scene flex min-h-screen flex-col items-center justify-center gap-12 overflow-hidden px-6 py-20"
    >
      <RansomTitle text="Experience" />

      <div
        ref={vinylRef}
        className={`vinyl ${out ? "is-out" : ""}`}
        role="button"
        tabIndex={0}
        aria-pressed={out}
        aria-label={
          out ? "Stop and slide the record back in" : "Play the record to read the role"
        }
        onClick={() => setOut((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOut((v) => !v);
          }
        }}
      >
        {/* the record (behind the sleeve). The face spins; the gloss stays put. */}
        <div className="vinyl-disc">
          <div className="vinyl-disc-face">
            <div className="vinyl-label" />
          </div>
          <div className="vinyl-gloss" aria-hidden="true" />
        </div>

        {/* the sleeve, covering the record's left half; carries the liner notes */}
        <div className="vinyl-sleeve">
          <div className="vinyl-notes">
            <p className="vn-eyebrow">Now Playing · Experience</p>
            <h3 className="vn-title">Product Management Intern</h3>
            <p className="vn-sub">Dabble Health · 2025</p>
            <ul className="vn-list">
              <li>
                Shipping features that help patients track and act on their own
                health data.
              </li>
              <li>
                Run user discovery, scope the roadmap, and spec features with
                engineering &amp; design.
              </li>
              <li>
                Turn messy feedback into prioritized, measurable product bets.
              </li>
            </ul>
          </div>
        </div>

        <span className="vinyl-hint">▶ play the record</span>
      </div>
    </section>
  );
}
