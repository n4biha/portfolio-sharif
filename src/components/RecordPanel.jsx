"use client";

import ExpandableText from "./ExpandableText";
import FieldIcon from "./FieldIcon";

/*
  The featured-project card in the middle of the stage — the cream sheet beside
  the disc. Eyebrow, serif title + subtitle, outlined field pills, the liner
  notes (clamped with an inline "Show more"), then two labelled sections —
  Tools Used (every chip) and Technical Highlights (clamped) — and one dark
  pill button for the project's link (none when the project has no public
  link). The screenshot lives in the ScreenFrame to the right.

  Switching records crossfades the whole card (ProjectsScene wraps it in a
  keyed motion cell), so nothing in here needs its own entrance.
*/
export default function RecordPanel({ project }) {
  if (!project) return null;
  const fields = project.fields ?? [project.category];
  const isGitHub = project.liveDemoLabel === "GitHub";
  const linkLabel = isGitHub ? "View on GitHub" : "Watch the demo";

  return (
    <section className="record-panel" aria-label={`${project.title} details`}>
      <div className="record-panel-inner">
        <p className="record-panel-eyebrow">Featured Project</p>
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
          <ExpandableText text={project.linerNotes} lines={4} className="record-panel-desc" />
        )}

        {project.tools?.length > 0 && (
          <section className="record-panel-section">
            <p className="record-panel-label">Tools Used</p>
            <ul className="record-panel-tools" aria-label="Tools">
              {project.tools.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>
        )}

        {project.technicalHighlights && (
          <section className="record-panel-section">
            <p className="record-panel-label">Technical Highlights</p>
            <ExpandableText text={project.technicalHighlights} lines={3} className="record-panel-desc is-tight" />
          </section>
        )}

        {project.liveDemoUrl && (
          <a className="record-panel-link" href={project.liveDemoUrl} target="_blank" rel="noreferrer">
            {isGitHub ? <GitHubGlyph /> : <PlayGlyph />}
            {linkLabel}
            <svg className="record-panel-link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9.5 6 6 6-6 6" />
            </svg>
          </a>
        )}
      </div>
    </section>
  );
}

function GitHubGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.46-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.85.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.72 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.95c.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}
