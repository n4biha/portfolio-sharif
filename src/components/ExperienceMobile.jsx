"use client";

import { useState } from "react";
import { MAIN_EXPERIENCES, SIDE_EXPERIENCES, SIDE_HEADING } from "@/lib/experiences";

/*
  Mobile Experience — a clean beige accordion list. Each card leads with the
  company, role · date, and the top skills (skills visible without tapping);
  expanding reveals the full write-up: meta, about, contributions, all skills,
  and the highlight photo(s). Single-open accordion (one `openId` across both
  groups); the body stays mounted so collapse animates (CSS grid-template-rows).
  `compact` entries skip the accordion entirely — a small static card with the
  role, timeline, and brief.

  Two groups, mirroring the desktop wall: the main roles (its rocks), then the
  "where it started" tier (its logbook).
*/

// main roles newest-first; the "where it started" group reads oldest-first, the
// same order as the desktop logbook
const MAIN = [...MAIN_EXPERIENCES].reverse();
const SIDE = SIDE_EXPERIENCES;

function ExperienceCard({ exp, open, onToggle }) {
  const { id } = exp;
  const meta = [exp.date, exp.location, exp.employmentType].filter(Boolean).join(" · ");
  const photos = exp.highlight?.photos ?? (exp.highlight?.photo ? [exp.highlight.photo] : []);

  // compact entries: a small static card (nothing to expand) — company, role,
  // timeline, and the one-line brief
  if (exp.compact) {
    return (
      <article className="m-card m-compact m-reveal">
        <span className="m-acc-title">{exp.company}</span>
        <span className="m-meta">
          {[exp.roleName, exp.roleTag].filter(Boolean).join(" · ")}
        </span>
        {meta && <span className="m-meta">{meta}</span>}
        <p className="m-body-text">{exp.brief}</p>
      </article>
    );
  }

  return (
    <article className={`m-card m-acc m-reveal${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="m-acc-btn"
        aria-expanded={open}
        aria-controls={`exp-${id}`}
        onClick={onToggle}
      >
        <span className="m-acc-main">
          <span className="m-acc-title">{exp.company}</span>
          <span className="m-meta">
            {exp.roleName}
            {exp.date ? ` · ${exp.date}` : ""}
          </span>
          {exp.skills?.length > 0 && (
            <span className="m-chips m-skills" aria-label="Top skills">
              {exp.skills.filter(Boolean).slice(0, 3).map((s, i) => (
                <span key={i} className="m-chip">{s}</span>
              ))}
            </span>
          )}
        </span>
      </button>

      <div id={`exp-${id}`} className="m-acc-body">
        <div className="m-acc-body-inner">
          {meta && <p className="m-meta" style={{ marginBottom: 8 }}>{meta}</p>}
          <p className="m-body-text">{exp.about}</p>

          {exp.contributions?.length > 0 && (
            <>
              <p className="m-label">Key Contributions</p>
              <ul className="m-list">
                {exp.contributions.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </>
          )}

          {exp.skills?.length > 0 && (
            <>
              <p className="m-label">Skills</p>
              <ul className="m-chips">
                {exp.skills.filter(Boolean).map((s, i) => (
                  <li key={i} className="m-chip">{s}</li>
                ))}
              </ul>
            </>
          )}

          {photos.map((src, i) => (
            <figure key={i} className="m-photo-fig">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={exp.highlight?.caption || `${exp.company} highlight`}
                className="m-photo"
                style={{
                  objectFit: exp.highlight?.fit ?? "cover",
                  objectPosition: exp.highlight?.focus ?? "center",
                  background: exp.highlight?.bg ?? undefined,
                }}
              />
              {exp.highlight?.caption && (
                <figcaption className="m-meta">{exp.highlight.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function ExperienceMobile() {
  const [openId, setOpenId] = useState(null);

  const list = (entries) => (
    <ol className="m-cards">
      {entries.map((exp) => (
        <li key={exp.id}>
          <ExperienceCard
            exp={exp}
            open={openId === exp.id}
            onToggle={() => setOpenId((cur) => (cur === exp.id ? null : exp.id))}
          />
        </li>
      ))}
    </ol>
  );

  return (
    <section id="experience" className="m-screen m-exp">
      <header className="m-section-head m-reveal">
        <p className="m-kicker">Where I&rsquo;ve worked</p>
        <h1 className="m-heading">Experience</h1>
      </header>

      {list(MAIN)}

      <h2 className="m-kicker m-group-label m-reveal">{SIDE_HEADING}</h2>
      {list(SIDE)}
    </section>
  );
}
