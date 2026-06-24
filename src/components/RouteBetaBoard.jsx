"use client";

import { useEffect, useState } from "react";
import ExpandableText from "./ExpandableText";


// tiny line icons for the metadata row (date / location / employment type)
function MetaIcon({ type }) {
  const common = {
    width: 13,
    height: 13,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    className: "beta-meta-ico",
  };
  if (type === "date")
    return <svg {...common}><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M3 9h18M8 2.5v4M16 2.5v4" /></svg>;
  if (type === "loc")
    return <svg {...common}><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z" /><circle cx="12" cy="9" r="2.4" /></svg>;
  return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3 2" /></svg>;
}

// HIGHLIGHTS snapshot — a rounded photo integrated into the card, with a caption.
// Falls back to a clean placeholder until a real photo path is supplied.
function Highlight({ photo, photos, caption }) {
  // accept a single `photo` or a `photos` array (rendered side-by-side)
  const list = photos?.length ? photos : photo ? [photo] : [];
  const multi = list.length > 1;
  return (
    <figure className="beta-highlight">
      {list.length ? (
        <div className={`beta-highlight-photos${multi ? " is-multi" : ""}`}>
          {list.map((src, i) => (
            <div className="beta-highlight-frame" key={i}>
              <img src={src} alt={caption || ""} className="beta-highlight-img" />
            </div>
          ))}
        </div>
      ) : (
        <div className="beta-highlight-frame">
          <div className="beta-highlight-ph" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
              <circle cx="8.5" cy="9.5" r="1.6" />
              <path d="M21 16.5l-5-5-8 8" />
            </svg>
          </div>
        </div>
      )}
      {caption && <figcaption className="beta-highlight-cap">{caption}</figcaption>}
    </figure>
  );
}

export default function RouteBetaBoard({ experience, onClose }) {
  const open = !!experience;
  const [shown, setShown] = useState(experience ?? null);
  // bumps on every open/switch so the ExpandableText below remounts fresh
  // (collapsed, no leftover inline styles) each time a card opens
  const [openSeq, setOpenSeq] = useState(0);
  useEffect(() => {
    if (experience) {
      setShown(experience);
      setOpenSeq((s) => s + 1);
    }
  }, [experience]);
  const exp = shown;

  return (
    <div className={`beta-board${open ? " is-open" : ""}`} aria-hidden={!open}>
      {exp && (
        <div className="beta-inner">
          <button className="beta-close" type="button" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6 L18 18 M18 6 L6 18" />
            </svg>
          </button>

          {/* header */}
          <p className="beta-eyebrow">Experience {exp.index}</p>
          <h2 className="beta-title">{exp.company}</h2>

          {/* role lockup */}
          <div className="beta-role">
            <span className="beta-role-bar" aria-hidden="true" />
            <div className="beta-role-text">
              <p className="beta-role-label">Role</p>
              <div className="beta-role-name-row">
                <h3 className="beta-role-name">{exp.roleName}</h3>
                {exp.roleTag && <span className="beta-role-pill">{exp.roleTag}</span>}
              </div>
            </div>
          </div>

          {/* metadata */}
          <div className="beta-meta">
            <span className="beta-meta-item"><MetaIcon type="date" />{exp.date}</span>
            {exp.location && (
              <span className="beta-meta-item"><MetaIcon type="loc" />{exp.location}</span>
            )}
            {exp.employmentType && (
              <span className="beta-meta-item"><MetaIcon type="clock" />{exp.employmentType}</span>
            )}
          </div>

          <div className="beta-divider" aria-hidden="true" />

          {/* about — clamped to 3 lines with an inline show-more */}
          <section className="beta-section">
            <p className="beta-section-label">About</p>
            <ExpandableText key={openSeq} text={exp.about} lines={3} className="beta-about-body" />
          </section>

          <div className="beta-divider" aria-hidden="true" />

          {/* two columns — key contributions / highlights */}
          <div className="beta-columns">
            <section className="beta-section">
              <p className="beta-section-label">Key Contributions</p>
              <ul className="beta-contrib">
                {exp.contributions.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </section>

            <section className="beta-section">
              <p className="beta-section-label">Highlights</p>
              <Highlight photo={exp.highlight?.photo} photos={exp.highlight?.photos} caption={exp.highlight?.caption} />
            </section>
          </div>

          <div className="beta-divider" aria-hidden="true" />

          {/* skills */}
          <section className="beta-section">
            <p className="beta-section-label">Skills</p>
            <ul className="beta-skill-list">
              {exp.skills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
