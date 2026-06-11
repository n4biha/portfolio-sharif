"use client";

import { useEffect, useState } from "react";

/*
  The Project Card — the full story behind a polaroid, drawn on a torn-paper card
  that slides/fades in from the right when a polaroid is clicked; the gallery wall
  pans slightly left and stays visible. Keeps showing the last project while
  closing so nothing flickers out. Styling lives in globals.css (.project-card*).
*/

// tiny outline icons for the meta grid
function Icon({ type }) {
  const common = {
    width: 15,
    height: 15,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    className: "pc-ico",
  };
  if (type === "year")
    return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M3 9h18M8 2v4M16 2v4" />
      </svg>
    );
  if (type === "type")
    return (
      <svg {...common}>
        <path d="M3 7l9-4 9 4-9 4-9-4Z" />
        <path d="M3 7v6l9 4 9-4V7" />
      </svg>
    );
  if (type === "link")
    return (
      <svg {...common}>
        <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
        <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.5a3 3 0 0 0-.9-2.6c3-.3 6-1.5 6-6.6a5 5 0 0 0-1.4-3.5 4.6 4.6 0 0 0-.1-3.5s-1.1-.3-3.6 1.4a12.3 12.3 0 0 0-6.4 0C6.6 1.9 5.5 2.2 5.5 2.2a4.6 4.6 0 0 0-.1 3.5A5 5 0 0 0 4 9.2c0 5.1 3 6.3 6 6.6a3 3 0 0 0-.9 2.6V22" />
    </svg>
  );
}

export default function ProjectCard({ project, onClose }) {
  const open = !!project;
  const [shown, setShown] = useState(project ?? null);
  useEffect(() => {
    if (project) setShown(project);
  }, [project]);
  const p = shown;

  return (
    <div className={`project-card${open ? " is-open" : ""}`} aria-hidden={!open}>
      {p && (
        <div className="pc-inner">
          <button className="pc-back" type="button" onClick={onClose}>
            ← back to the wall
          </button>

          {/* header */}
          <span className="pc-eyebrow hand">project</span>
          <h2 className="pc-title">{p.title}</h2>
          <p className="pc-subtitle hand">{p.caption}</p>

          {/* meta grid */}
          <dl className="pc-grid">
            <div className="pc-cell">
              <Icon type="year" />
              <dt>Year</dt>
              <dd>{p.year}</dd>
            </div>
            <div className="pc-cell">
              <Icon type="type" />
              <dt>Type</dt>
              <dd>{p.type}</dd>
            </div>
          </dl>

          {/* description */}
          <p className="pc-label">ABOUT</p>
          <p className="pc-desc">{p.description}</p>

          {/* tech */}
          <p className="pc-label">BUILT WITH</p>
          <ul className="pc-tags">
            {p.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>

          {/* links */}
          {(p.links?.live || p.links?.repo) && (
            <div className="pc-links">
              {p.links?.live && (
                <a className="pc-link" href={p.links.live} target="_blank" rel="noreferrer">
                  <Icon type="link" /> Live
                </a>
              )}
              {p.links?.repo && (
                <a className="pc-link" href={p.links.repo} target="_blank" rel="noreferrer">
                  <Icon type="repo" /> Code
                </a>
              )}
            </div>
          )}

          {/* notes — taped scrap */}
          {p.notes?.length > 0 && (
            <>
              <p className="pc-label">NOTES</p>
              <div className="pc-notes">
                <span className="pc-notes-tape" />
                <ul>
                  {p.notes.map((n, i) => (
                    <li key={i} className="hand">
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
