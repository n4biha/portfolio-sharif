"use client";

import { motion, useReducedMotion } from "framer-motion";
import ProjectIcon from "./ProjectIcon";

/*
  One card in the carousel: a dark tile tinted from the project's cover colours,
  its monoline icon centred and the serif title underneath. The playing card
  carries a cream ring + glow (CSS). Hover lifts it a touch (skipped under
  reduced motion).
*/
export default function ProjectCard({ project, selected = false, onSelect }) {
  const { bg, accent, motif } = project.coverStyle;
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      className={`proj-card${selected ? " is-playing" : ""}`}
      style={{ "--card-bg": bg, "--card-accent": accent }}
      onClick={() => onSelect?.(project.id)}
      aria-label={`Play ${project.title}`}
      aria-pressed={selected}
      initial={false}
      whileHover={reduce ? undefined : { y: -6, transition: { type: "spring", stiffness: 320, damping: 20 } }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
    >
      <span className="proj-card-icon" aria-hidden="true">
        <ProjectIcon motif={motif} />
      </span>
      <span className="proj-card-title">{project.title}</span>
    </motion.button>
  );
}
