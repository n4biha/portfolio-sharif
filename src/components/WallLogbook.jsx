"use client";

import { SIDE_HEADING } from "@/lib/experiences";

/*
  The "where it started" logbook — a quiet dark panel on the right of the climbing
  wall listing the SIDE experiences (the ones that aren't rocks on the route).
  Each row opens that experience's normal full card, exactly like clicking a rock.

  Deliberately plain: the same panel material and type tokens as the Route Beta
  Board it opens (--climb-card-* / --climb-text-* in globals.css), a heading and
  names in the rock labels' chalk handwriting, one muted "role · dates" line per
  row, and nothing else — no clip, tilt, ticks or arrows.

  Two elements on purpose:
   • `.wall-logbook` — the positioned wrapper and the parallax target. GSAP writes
     inline `transform`s onto [data-parallax-layer] elements, so this one must
     never carry a CSS transform (or a transition on transform) of its own.
   • `.logbook-sheet` — the panel itself; owns the fade-in entrance.

  It lives OUTSIDE the panning wall layer (see ExperienceScene), so its hover and
  entrance never touch the wall's cached, SVG-filtered texture.

  `shown` latches true once the route has traced (the panel then fades in).
  `covered` is true while a pop-up card is open: it slides in over this spot, so
  the logbook fades out and goes `inert` — otherwise its invisible rows would
  still be tabbable / clickable underneath.
*/
export default function WallLogbook({ entries, onSelect, shown = false, covered = false }) {
  return (
    <aside
      data-parallax-layer="explog"
      className={`wall-logbook${shown ? " is-in" : ""}`}
      aria-label={SIDE_HEADING}
      inert={covered ? true : undefined}
    >
      <div className="logbook-sheet">
        <h2 className="logbook-title">{SIDE_HEADING}</h2>

        <ul className="logbook-list">
          {entries.map((exp) => (
            <li key={exp.id}>
              <button
                type="button"
                className="logbook-row"
                onClick={(e) => onSelect?.(exp.id, e.currentTarget)}
                aria-label={`Open ${exp.company}, ${exp.roleName}`}
              >
                <span className="logbook-name">{exp.label ?? exp.company}</span>
                <span className="logbook-meta">
                  {[exp.logRole ?? exp.roleName, exp.date].filter(Boolean).join(" · ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
