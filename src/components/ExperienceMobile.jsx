"use client";

import { useState } from "react";
import { EXPERIENCES } from "@/lib/experiences";

/*
  Mobile Experience — a clean beige accordion list. Each card leads with the
  company, role · date, and the top skills (skills visible without tapping);
  expanding reveals the full write-up: meta, about, contributions, all skills,
  and the highlight photo(s). Single-open accordion; the body stays mounted so
  collapse animates (CSS grid-template-rows).
*/

// newest-first
const ORDER = Object.keys(EXPERIENCES).reverse();

export default function ExperienceMobile() {
  const [openId, setOpenId] = useState(null);

  return (
    <section id="experience" className="m-screen m-exp">
      <header className="m-section-head m-reveal">
        <p className="m-kicker">Where I&rsquo;ve worked</p>
        <h1 className="m-heading">Experience</h1>
      </header>

      <ol className="m-cards">
        {ORDER.map((id) => {
          const exp = EXPERIENCES[id];
          if (!exp) return null;
          const open = openId === id;
          const meta = [exp.date, exp.location, exp.employmentType]
            .filter(Boolean)
            .join(" · ");
          const photos = exp.highlight?.photos ?? (exp.highlight?.photo ? [exp.highlight.photo] : []);
          return (
            <li key={id}>
              <article className={`m-card m-acc m-reveal${open ? " is-open" : ""}`}>
                <button
                  type="button"
                  className="m-acc-btn"
                  aria-expanded={open}
                  aria-controls={`exp-${id}`}
                  onClick={() => setOpenId(open ? null : id)}
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
            </li>
          );
        })}
      </ol>
    </section>
  );
}
