"use client";

import { useEffect, useState } from "react";

/*
  The journal page that opens from the right when a hold is clicked. Design is
  intentionally minimal for now — a clean page with the role header + a way back —
  to be rebuilt from an uploaded reference. Keeps showing the last experience
  while folding closed so content doesn't vanish mid-animation. Styling lives in
  globals.css (`.notebook*`).
*/
export default function Notebook({ experience, onClose }) {
  const open = !!experience;
  const [shown, setShown] = useState(experience ?? null);
  useEffect(() => {
    if (experience) setShown(experience);
  }, [experience]);
  const exp = shown;

  return (
    <div className={`notebook${open ? " is-open" : ""}`} aria-hidden={!open}>
      <div className="notebook-page">
        <button className="notebook-back" type="button" onClick={onClose}>
          <span aria-hidden="true">←</span> back to the wall
        </button>

        {exp && (
          <div className="notebook-body">
            <p className="nb-grade">ROUTE {exp.grade}</p>
            <h2 className="nb-role">{exp.role}</h2>
            <p className="nb-company">{exp.company}</p>
            <p className="nb-date">{exp.dates}</p>
          </div>
        )}
      </div>
    </div>
  );
}
