"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ProjectIcon from "./ProjectIcon";

/*
  The "Now Playing" column on the left of the stage: the record counter, the
  playing project's title, then a dark card holding a flat vinyl disc — fine
  concentric grooves that turn, the project's accent label (static) in the
  middle with its icon, and a thin accent progress arc + dot that slowly sweep
  round while it plays — with a small transport row underneath: previous,
  play/pause, next.

  `spinning` is false when the projects screen isn't on screen (home flow) or
  the listener pressed pause, so the disc and the arc rest. The text block
  crossfades between records; the disc card itself never re-mounts (its spin
  keeps going), only the label pops and its colours ease to the new accent.
*/

const R = 46; // arc radius in the 100×100 disc viewBox (just outside the vinyl)
const CIRC = Math.round(2 * Math.PI * R * 100) / 100;

const TEXT_IN = { opacity: 1, y: 0 };

export default function RecordPlayer({
  project,
  index = 0,
  total = 1,
  spinning = true,
  playing = true,
  onTogglePlay,
  onStep,
}) {
  const reduce = useReducedMotion();
  if (!project) return null;
  const { accent, motif } = project.coverStyle;
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="now-playing" style={{ "--accent": accent }}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={project.id}
          className="now-playing-text"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={TEXT_IN}
          exit={reduce ? undefined : { opacity: 0, y: -6, transition: { duration: 0.16, ease: "easeIn" } }}
          transition={reduce ? { duration: 0 } : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="now-playing-count">
            {pad(index + 1)} <span aria-hidden="true">/</span> {pad(total)}
          </p>
          <p className="now-playing-eyebrow">Now Playing</p>
          <h2 className="now-playing-title">{project.title}</h2>
          <span className="now-playing-rule" aria-hidden="true" />
        </motion.div>
      </AnimatePresence>

      <div className={`disc-card${spinning ? "" : " is-paused"}`}>
        <div className="disc" aria-hidden="true">
          {/* the pressed vinyl: grooves are CSS; only this layer rotates */}
          <span className="disc-vinyl" />
          {/* the label sits on top and stays put, so the icon never turns;
              keyed so a new pick re-mounts it → scale-pop */}
          <span key={project.id} className="disc-label">
            <ProjectIcon motif={motif} />
          </span>

          {/* progress arc (rotated -90° in CSS so it starts at 12 o'clock): a
              faint full ring, then the accent sweep + the dot riding its tip.
              Not keyed: it keeps sweeping, its colour eases to the new accent. */}
          <svg className="disc-arc" viewBox="0 0 100 100" style={{ "--circ": CIRC }}>
            <circle className="disc-arc-track" cx="50" cy="50" r={R} />
            <circle className="disc-arc-fill" cx="50" cy="50" r={R} strokeDasharray={CIRC} strokeDashoffset={CIRC} />
            <g className="disc-arc-dot">
              <circle cx={50 + R} cy="50" r="3" />
            </g>
          </svg>
        </div>

        <div className="disc-transport" role="group" aria-label="Playback">
          <button type="button" className="disc-btn" onClick={() => onStep?.(-1)} aria-label="Previous project">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 5.5h2.2v13H6z" />
              <path d="M18.5 5.8v12.4L9.4 12l9.1-6.2Z" />
            </svg>
          </button>
          <button
            type="button"
            className="disc-btn is-play"
            onClick={onTogglePlay}
            aria-label={playing ? "Pause" : "Play"}
            aria-pressed={playing}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6.5" y="5" width="4" height="14" rx="1" />
                <rect x="13.5" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.2v13.6a.8.8 0 0 0 1.2.7l10.4-6.8a.8.8 0 0 0 0-1.4L9.2 4.5A.8.8 0 0 0 8 5.2Z" />
              </svg>
            )}
          </button>
          <button type="button" className="disc-btn" onClick={() => onStep?.(1)} aria-label="Next project">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M15.8 5.5H18v13h-2.2z" />
              <path d="M5.5 5.8v12.4l9.1-6.2-9.1-6.2Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
