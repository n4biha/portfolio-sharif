"use client";

import { motion } from "framer-motion";

import FieldIcon from "./FieldIcon";

/*
  Lower-middle cream paper sheet: the readable details for the selected project,
  styled like an album's liner notes. Crossfades when the selection changes.
*/
export default function LinerNotes({ project }) {
  if (!project) return null;
  return (
    <div className="liner-sheet">
      <span className="liner-tape" aria-hidden="true" />
      <motion.div
        key={project.id}
        className="liner-inner"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <h2 className="liner-title">{project.title}</h2>
        <p className="liner-subtitle">{project.subtitle}</p>
        <div className="liner-fields">
          {(project.fields ?? [project.category]).map((f) => (
            <span key={f} className="liner-field-tag">
              <FieldIcon label={f} />
              {f}
            </span>
          ))}
        </div>

        <p className="liner-label">Liner Notes</p>
        <p className="liner-text">{project.linerNotes}</p>

        <p className="liner-label">Tools Used</p>
        <ul className="liner-tools">
          {project.tools.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <p className="liner-label">Technical Highlights</p>
        <p className="liner-text">{project.technicalHighlights}</p>

        {project.liveDemoUrl && (
          <div className="liner-buttons">
            <a className="liner-btn liner-btn--primary" href={project.liveDemoUrl} target="_blank" rel="noreferrer">
              {project.liveDemoLabel === "GitHub" ? "↗ GitHub" : "▶ Live Demo"}
            </a>
          </div>
        )}
      </motion.div>
    </div>
  );
}
