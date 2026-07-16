"use client";

import { useMemo, useState } from "react";
import { PROJECTS, CATEGORIES } from "@/lib/projects";
import FieldIcon from "./FieldIcon";
import { Motif } from "./AlbumCover";

/*
  Mobile Projects screen — keeps the "Projects on Repeat" vinyl vibe (deep green
  wall, a small record accent) but simplifies the record room into a clean list:
  filter chips → tappable project rows → one cream detail card for the selected
  project. Data comes from the shared PROJECTS list.
*/

const CHIPS = CATEGORIES;

// small spinning-free vinyl mark for the header + row icons
function Vinyl({ className, accent = "#e9c46a" }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="#15110f" />
      <circle cx="20" cy="20" r="14" fill="none" stroke="rgba(255,255,255,0.12)" />
      <circle cx="20" cy="20" r="10" fill="none" stroke="rgba(255,255,255,0.12)" />
      <circle cx="20" cy="20" r="6.5" fill={accent} />
      <circle cx="20" cy="20" r="1.6" fill="#15110f" />
    </svg>
  );
}

export default function ProjectsMobile() {
  const [category, setCategory] = useState("All");
  const list = useMemo(
    () => (category === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === category)),
    [category]
  );
  const [selectedId, setSelectedId] = useState(PROJECTS[0]?.id ?? null);
  const selected = useMemo(
    () => list.find((p) => p.id === selectedId) ?? list[0] ?? null,
    [list, selectedId]
  );

  return (
    <section id="projects" className="m-screen m-proj">
      <header className="m-proj-head">
        <div className="m-proj-titlewrap">
          <h1 className="m-proj-title">Projects on Repeat</h1>
          <Vinyl className="m-proj-vinyl" />
        </div>
      </header>

      <nav className="m-chips m-proj-chips" aria-label="Filter projects">
        {CHIPS.map((c) => (
          <button
            key={c}
            type="button"
            className={`m-chip m-chip-btn${category === c ? " is-active" : ""}`}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </nav>

      {/* the record shelf: mini album covers standing on a walnut plank, like
          the desktop record room — tap a cover to drop the needle on it */}
      <div className="m-shelf">
        <ul className="m-shelf-row">
          {list.map((p) => {
            const active = selected?.id === p.id;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  className={`m-shelf-cover${active ? " is-active" : ""}`}
                  aria-pressed={active}
                  onClick={() => setSelectedId(p.id)}
                  style={{ background: p.coverStyle?.bg, color: p.coverStyle?.ink }}
                >
                  <span className="m-shelf-art" aria-hidden="true">
                    <span className="m-shelf-band" style={{ background: p.coverStyle?.accent }} />
                    <Motif motif={p.coverStyle?.motif} ink={p.coverStyle?.ink} accent={p.coverStyle?.accent} />
                  </span>
                  <span className="m-shelf-title">{p.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="m-shelf-lip" aria-hidden="true" />
      </div>

      {selected && (
        <article className="m-proj-detail">
          {/* liner-notes sheet dressing: tape at the top, now-playing vinyl */}
          <span className="m-liner-tape" aria-hidden="true" />
          <div className="m-proj-nowplaying" aria-hidden="true">
            <Vinyl className="m-proj-nowplaying-vinyl" accent={selected.coverStyle?.accent} />
            <span>Now Playing</span>
          </div>
          <h2 className="m-proj-detail-title">{selected.title}</h2>
          {selected.subtitle && <p className="m-proj-detail-sub">{selected.subtitle}</p>}
          <div className="m-proj-fields">
            {(selected.fields ?? (selected.category ? [selected.category] : [])).map((f) => (
              <span key={f} className="m-proj-field-tag">
                <FieldIcon label={f} />
                {f}
              </span>
            ))}
          </div>

          <p className="m-liner-label">Liner Notes</p>
          <p className="m-proj-detail-text">{selected.linerNotes}</p>

          {selected.tools?.length > 0 && (
            <>
              <p className="m-liner-label">Tools Used</p>
              <ul className="m-chips m-proj-tools">
                {selected.tools.map((t, i) => (
                  <li key={i} className="m-chip m-chip-tool">{t}</li>
                ))}
              </ul>
            </>
          )}

          {selected.technicalHighlights && (
            <>
              <p className="m-liner-label">Technical Highlights</p>
              <p className="m-proj-detail-text">{selected.technicalHighlights}</p>
            </>
          )}

          <div className="m-proj-btns">
            {selected.liveDemoUrl && (
              <a className="m-btn m-btn--primary" href={selected.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                {selected.liveDemoLabel === "GitHub"
                  ? "↗ GitHub"
                  : `▶ ${selected.liveDemoLabel || "Demo"}`}
              </a>
            )}
            {/* only render with a real URL — every project's caseStudyUrl is
                still the "#" placeholder, which made this a dead link */}
            {selected.caseStudyUrl && selected.caseStudyUrl !== "#" && (
              <a className="m-btn m-btn--ghost" href={selected.caseStudyUrl} target="_blank" rel="noopener noreferrer">
                Case Study
              </a>
            )}
          </div>
        </article>
      )}
    </section>
  );
}
