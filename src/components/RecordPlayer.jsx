"use client";

import ProjectIcon from "./ProjectIcon";

/*
  The "Now Playing" column on the left of the stage: the record counter, the
  playing project's title, then a dark card holding a flat vinyl disc — fine
  concentric grooves that turn, the project's accent label (static) in the
  middle with its icon, and a thin accent progress arc + dot that slowly sweep
  round while it plays — with the project's one-line tagline as the caption.

  `spinning` is false when the projects screen isn't on screen (home flow), so
  the disc and the arc rest. The label + arc are keyed on the project so a new
  pick re-mounts them: the label scale-pops and the arc starts over.
*/

const R = 46; // arc radius in the 100×100 disc viewBox (just outside the vinyl)
const CIRC = Math.round(2 * Math.PI * R * 100) / 100;

export default function RecordPlayer({ project, index = 0, total = 1, spinning = true }) {
  if (!project) return null;
  const { accent, motif } = project.coverStyle;
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="now-playing" style={{ "--accent": accent }}>
      <p className="now-playing-count">
        {pad(index + 1)} <span aria-hidden="true">/</span> {pad(total)}
      </p>
      <p className="now-playing-eyebrow">Now Playing</p>
      <h2 className="now-playing-title">{project.title}</h2>
      <span className="now-playing-rule" aria-hidden="true" />

      <div className={`disc-card${spinning ? "" : " is-paused"}`}>
        <div className="disc" aria-hidden="true">
          {/* the pressed vinyl: grooves are CSS; only this layer rotates */}
          <span className="disc-vinyl" />
          {/* the label sits on top and stays put, so the icon never turns */}
          <span key={project.id} className="disc-label">
            <ProjectIcon motif={motif} />
          </span>

          {/* progress arc (rotated -90° in CSS so it starts at 12 o'clock): a
              faint full ring, then the accent sweep + the dot riding its tip */}
          <svg key={`arc-${project.id}`} className="disc-arc" viewBox="0 0 100 100" style={{ "--circ": CIRC }}>
            <circle className="disc-arc-track" cx="50" cy="50" r={R} />
            <circle className="disc-arc-fill" cx="50" cy="50" r={R} strokeDasharray={CIRC} strokeDashoffset={CIRC} />
            <g className="disc-arc-dot">
              <circle cx={50 + R} cy="50" r="3" />
            </g>
          </svg>
        </div>

        {project.tagline && <p className="disc-caption">{project.tagline}</p>}
      </div>
    </div>
  );
}
