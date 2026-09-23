"use client";

import { useState } from "react";
import ExpandableText from "./ExpandableText";
import FieldIcon from "./FieldIcon";

/*
  The one detail panel beside the turntable — the record that's "playing". Built
  from the same panel material and section recipes as the Experience pop-up card
  (--climb-card-* / --climb-text-* tokens, the .beta-* styling), so the two
  sections read as one system: eyebrow (record number · category · year), title,
  subtitle, iconed field tags, Liner Notes and Technical Highlights (each clamped
  with an inline "Show more"), Tools, one link — and the project's screenshot set
  into a frame on the right with its note as the caption. It replaces the taped
  liner sheet + the laptop/tablet/phone mockups.

  The inner wrapper is keyed on the project, so switching records re-mounts it
  and replays a short CSS fade/rise (see .record-panel-inner in globals.css).
*/

// The screenshot, held invisible until it has loaded + decoded, then faded in —
// so a cold first visit never shows it painting in half-drawn.
function Shot({ src, alt, contain }) {
  const [loaded, setLoaded] = useState(false);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`record-shot-img${loaded ? " is-loaded" : ""}${contain ? " is-contain" : ""}`}
      decoding="async"
      onLoad={() => setLoaded(true)}
      // cached images can be complete before onLoad wires up — catch those too
      ref={(el) => {
        if (el?.complete && el.naturalWidth > 0) setLoaded(true);
      }}
    />
  );
}

export default function RecordPanel({ project, index = 0 }) {
  if (!project) return null;
  const preview = project.demoPreview ?? {};
  // phone / tablet shots are portrait — show them whole instead of cropping
  const contain = preview.device === "phone" || preview.device === "tablet";
  const eyebrow = [`Record ${String(index + 1).padStart(2, "0")}`, project.category, project.year]
    .filter(Boolean)
    .join(" · ");
  const linkLabel =
    project.liveDemoLabel === "GitHub" ? "↗ GitHub" : `▶ ${project.liveDemoLabel || "Live Demo"}`;
  const fields = project.fields ?? [project.category];

  return (
    <section className="record-panel" aria-label={`${project.title} details`}>
      <div key={project.id} className="record-panel-inner">
        <div className="record-panel-text">
          <p className="record-panel-eyebrow">{eyebrow}</p>
          <h2 className="record-panel-title">{project.title}</h2>
          {project.subtitle && <p className="record-panel-subtitle">{project.subtitle}</p>}

          {fields.length > 0 && (
            <ul className="record-panel-tags" aria-label="Fields">
              {fields.map((f) => (
                <li key={f} className="record-panel-tag">
                  <FieldIcon label={f} />
                  {f}
                </li>
              ))}
            </ul>
          )}

          {project.linerNotes && (
            <section className="record-panel-section">
              <p className="record-panel-label">Liner Notes</p>
              <ExpandableText text={project.linerNotes} lines={4} className="record-panel-desc" />
            </section>
          )}

          {project.technicalHighlights && (
            <section className="record-panel-section">
              <p className="record-panel-label">Technical Highlights</p>
              <ExpandableText text={project.technicalHighlights} lines={3} className="record-panel-desc" />
            </section>
          )}

          {project.tools?.length > 0 && (
            <section className="record-panel-section">
              <p className="record-panel-label">Tools</p>
              <ul className="record-panel-tools">
                {project.tools.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </section>
          )}

          {project.liveDemoUrl && (
            <a className="record-panel-link" href={project.liveDemoUrl} target="_blank" rel="noreferrer">
              {linkLabel}
            </a>
          )}
        </div>

        {preview.screenshot && (
          <figure className="record-shot">
            <div className={`record-shot-frame${contain ? " is-contain" : ""}`}>
              <Shot src={preview.screenshot} alt={`${project.title} preview`} contain={contain} />
            </div>
            {preview.note && <figcaption className="record-shot-cap">{preview.note}</figcaption>}
          </figure>
        )}
      </div>
    </section>
  );
}
