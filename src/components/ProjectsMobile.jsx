"use client";

import { useMemo, useState } from "react";
import { PROJECTS, CATEGORIES } from "@/lib/projects";
import FieldIcon from "./FieldIcon";
import { Motif } from "./AlbumCover";

/*
  Mobile Projects — the same clean beige accordion as Experience: filter chips,
  then stacked cards (motif tile + title + subtitle + field tags collapsed;
  liner notes, tools, technical highlights, and links expanded). Single-open;
  switching category closes any open card.
*/

const CHIPS = CATEGORIES;

export default function ProjectsMobile() {
  const [category, setCategory] = useState("All");
  const [openId, setOpenId] = useState(null);
  const list = useMemo(
    () => (category === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === category)),
    [category]
  );

  const pickCategory = (c) => {
    setCategory(c);
    setOpenId(null);
  };

  return (
    <section id="projects" className="m-screen m-proj">
      <header className="m-section-head m-reveal">
        <p className="m-kicker">What I&rsquo;ve built</p>
        <h1 className="m-heading">Projects on Repeat</h1>
      </header>

      <nav className="m-chips m-proj-chips" aria-label="Filter projects">
        {CHIPS.map((c) => (
          <button
            key={c}
            type="button"
            className={`m-chip m-chip-btn${category === c ? " is-active" : ""}`}
            aria-pressed={category === c}
            onClick={() => pickCategory(c)}
          >
            {c}
          </button>
        ))}
      </nav>

      <ul className="m-cards" style={{ marginTop: 4 }}>
        {list.map((p) => {
          const open = openId === p.id;
          const fields = p.fields ?? (p.category ? [p.category] : []);
          return (
            <li key={p.id}>
              <article className={`m-card m-acc m-reveal${open ? " is-open" : ""}`}>
                <button
                  type="button"
                  className="m-acc-btn"
                  aria-expanded={open}
                  aria-controls={`proj-${p.id}`}
                  onClick={() => setOpenId(open ? null : p.id)}
                >
                  <span className="m-motif-tile" aria-hidden="true">
                    <Motif motif={p.coverStyle?.motif} ink="#2b2620" accent="#b04a30" />
                  </span>
                  <span className="m-acc-main">
                    <span className="m-acc-title">{p.title}</span>
                    {p.subtitle && <span className="m-meta">{p.subtitle}</span>}
                    {fields.length > 0 && (
                      <span className="m-proj-fields">
                        {fields.map((f) => (
                          <span key={f} className="m-proj-field-tag">
                            <FieldIcon label={f} />
                            {f}
                          </span>
                        ))}
                      </span>
                    )}
                  </span>
                </button>

                <div id={`proj-${p.id}`} className="m-acc-body">
                  <div className="m-acc-body-inner">
                    <p className="m-label">Liner Notes</p>
                    <p className="m-body-text">{p.linerNotes}</p>

                    {p.tools?.length > 0 && (
                      <>
                        <p className="m-label">Tools Used</p>
                        <ul className="m-chips">
                          {p.tools.map((t, i) => (
                            <li key={i} className="m-chip">{t}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {p.technicalHighlights && (
                      <>
                        <p className="m-label">Technical Highlights</p>
                        <p className="m-body-text">{p.technicalHighlights}</p>
                      </>
                    )}

                    {(p.liveDemoUrl || (p.caseStudyUrl && p.caseStudyUrl !== "#")) && (
                      <div className="m-proj-btns">
                        {p.liveDemoUrl && (
                          <a
                            className="m-btn m-btn--primary"
                            href={p.liveDemoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {p.liveDemoLabel === "GitHub"
                              ? "↗ GitHub"
                              : `▶ ${p.liveDemoLabel || "Demo"}`}
                          </a>
                        )}
                        {/* only render with a real URL — "#" placeholders stay hidden */}
                        {p.caseStudyUrl && p.caseStudyUrl !== "#" && (
                          <a
                            className="m-btn m-btn--ghost"
                            href={p.caseStudyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Case Study
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
