"use client";

import { motion } from "framer-motion";

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

        <p className="liner-label">Liner Notes</p>
        <p className="liner-text">{project.linerNotes}</p>

        <p className="liner-label">Tools Used</p>
        <ul className="liner-tools">
          {project.tools.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <div className="liner-cols">
          <div>
            <p className="liner-label">Role</p>
            <p className="liner-text liner-text--tight">{project.role}</p>
          </div>
          <div>
            <p className="liner-label">Favorite Feature</p>
            <p className="liner-text liner-text--tight">{project.favoriteFeature}</p>
          </div>
        </div>

        <div className="liner-buttons">
          <a className="liner-btn liner-btn--primary" href={project.liveDemoUrl} target="_blank" rel="noreferrer">
            ▶ Live Demo
          </a>
          <a className="liner-btn" href={project.caseStudyUrl} target="_blank" rel="noreferrer">
            Case Study
          </a>
        </div>
      </motion.div>

      <span className="liner-footnote hand" aria-hidden="true">
        more projects coming soon… stay tuned!
      </span>
    </div>
  );
}
