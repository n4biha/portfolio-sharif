"use client";

import { useState } from "react";
import ClimbingHold, { ClimbingWallDefs } from "./ClimbingHold";
import { EXPERIENCES } from "@/lib/experiences";

/*
  Mobile Experience screen — keeps the climbing-wall theme (dark wall, faint
  holds, a route line with hold-dots) but turns the experiences into a clean
  vertical list of tappable cards instead of a scattered rock map. Tapping a card
  expands it to the full write-up. Data comes from the shared EXPERIENCES map.
*/

// newest-first
const ORDER = Object.keys(EXPERIENCES).reverse();

export default function ExperienceMobile() {
  const [openId, setOpenId] = useState(null);

  return (
    <section id="experience" className="m-screen m-exp">
      <ClimbingWallDefs />

      {/* a few faint decorative holds — purely thematic, not interactive */}
      <div className="m-exp-holds" aria-hidden="true">
        <ClimbingHold color="pine" variant={1} size="46px" />
        <ClimbingHold color="kraft" variant={2} size="60px" />
        <ClimbingHold color="denim" variant={0} size="38px" />
      </div>

      <header className="m-exp-head">
        <h1 className="m-exp-title">Experience</h1>
        <p className="m-exp-sub">Climb through my work.</p>
      </header>

      <ol className="m-route">
        {ORDER.map((id) => {
          const exp = EXPERIENCES[id];
          if (!exp) return null;
          const open = openId === id;
          return (
            <li key={id} className="m-route-item">
              <span className="m-route-dot" aria-hidden="true" />
              <article className={`m-exp-card${open ? " is-open" : ""}`}>
                <button
                  type="button"
                  className="m-exp-card-btn"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : id)}
                >
                  <span className="m-exp-card-main">
                    <span className="m-exp-role">{exp.roleName}</span>
                    <span className="m-exp-org">
                      {exp.company}
                      {exp.date ? ` · ${exp.date}` : ""}
                    </span>
                    {!open && exp.contributions?.[0] && (
                      <span className="m-exp-blurb">{exp.contributions[0]}</span>
                    )}
                  </span>
                  {exp.grade && <span className="m-grade">{exp.grade}</span>}
                </button>

                {open && (
                  <div className="m-exp-detail">
                    <p className="m-exp-about">{exp.about}</p>

                    {exp.contributions?.length > 0 && (
                      <ul className="m-exp-list">
                        {exp.contributions.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    )}

                    {exp.skills?.length > 0 && (
                      <ul className="m-chips">
                        {exp.skills.filter(Boolean).map((s, i) => (
                          <li key={i} className="m-chip">{s}</li>
                        ))}
                      </ul>
                    )}

                    {(exp.highlight?.photos?.length || exp.highlight?.photo) && (
                      <div className="m-exp-photos">
                        {(exp.highlight.photos ?? [exp.highlight.photo]).map((src, i) => (
                          <img key={i} src={src} alt={exp.highlight.caption || ""} className="m-exp-photo" />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
