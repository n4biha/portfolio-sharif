"use client";

/*
  Lower-left "Now Playing" turntable: just the record on the player, spinning
  slowly (CSS) while a project is playing. `spinning` is false when the projects
  screen isn't active, so the record rests. The current pick's identity lives in
  the liner-notes sheet + the shelf's "now playing" sticker.
*/
export default function RecordPlayer({ project, spinning = true }) {
  if (!project) return null;
  const { accent } = project.coverStyle;
  return (
    <div className="record-player">
      <span className="now-playing-label hand">Now Playing</span>

      <div className="turntable">
        <span className="rec-vinyl" aria-hidden="true">
          {/* only the disc spins; grooves are CSS */}
          <span className={`rec-vinyl-disc${spinning ? "" : " is-paused"}`}>
            {/* key on the project so the label re-mounts + scale-pops on each change */}
            <span key={project.id} className="rec-vinyl-label" style={{ background: accent }}>
              <span className="rec-vinyl-hole" />
            </span>
          </span>
          {/* the light reflection stays fixed (doesn't rotate with the disc) */}
          <span className="rec-vinyl-gloss" />
          {/* accent glow pulse — re-mounts on each selection to replay */}
          <span
            key={project.id}
            className="rec-vinyl-pulse"
            style={{ "--accent": accent }}
          />
        </span>

        <span className="tonearm" aria-hidden="true">
          <span className="tonearm-pivot" />
          <span className="tonearm-arm" />
          <span className="tonearm-head" />
        </span>
      </div>
    </div>
  );
}
