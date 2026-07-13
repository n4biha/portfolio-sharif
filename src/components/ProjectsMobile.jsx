"use client";

import { useMemo, useState } from "react";
import { PROJECTS, CATEGORIES } from "@/lib/projects";
import FieldIcon from "./FieldIcon";

/*
  Mobile Projects screen — keeps the "Projects on Repeat" vinyl vibe (deep green
  wall, a small record accent) but simplifies the record room into a clean list:
  filter chips → tappable project rows → one cream detail card for the selected
  project. Data comes from the shared PROJECTS list.
*/

// keep the mobile chip row short + tidy (per design): All + first two categories
const CHIPS = CATEGORIES.slice(0, 3);

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
          <h1 className="m-proj-title">Projects</h1>
          <Vinyl className="m-proj-vinyl" />
        </div>
        <p className="m-proj-sub">On repeat</p>
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

      <ul className="m-proj-list">
        {list.map((p) => {
          const active = selected?.id === p.id;
          return (
            <li key={p.id}>
              <button
                type="button"
                className={`m-proj-row${active ? " is-active" : ""}`}
                aria-pressed={active}
                onClick={() => setSelectedId(p.id)}
              >
                <span className="m-proj-icon" style={{ background: p.coverStyle?.bg }}>
                  <Vinyl className="m-proj-icon-vinyl" accent={p.coverStyle?.accent} />
                </span>
                <span className="m-proj-row-text">
                  <span className="m-proj-row-title">{p.title}</span>
                  <span className="m-proj-row-meta">{p.category} · {p.year}</span>
                </span>
                <span className="m-proj-chev" aria-hidden="true">›</span>
              </button>
            </li>
          );
        })}
      </ul>

      {selected && (
        <article className="m-proj-detail">
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
          <p className="m-proj-detail-text">{selected.linerNotes}</p>

          {selected.tools?.length > 0 && (
            <ul className="m-chips m-proj-tools">
              {selected.tools.map((t, i) => (
                <li key={i} className="m-chip m-chip-tool">{t}</li>
              ))}
            </ul>
          )}

          <div className="m-proj-btns">
            {selected.liveDemoUrl && (
              <a className="m-btn m-btn--primary" href={selected.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                {selected.liveDemoLabel === "GitHub"
                  ? "↗ GitHub"
                  : `▶ ${selected.liveDemoLabel || "Demo"}`}
              </a>
            )}
            <a className="m-btn m-btn--ghost" href={selected.caseStudyUrl || "#"} target="_blank" rel="noopener noreferrer">
              Case Study
            </a>
          </div>
        </article>
      )}
    </section>
  );
}
