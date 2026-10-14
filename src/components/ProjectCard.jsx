"use client";

import { motion, useReducedMotion } from "framer-motion";
import ProjectIcon from "./ProjectIcon";

/*
  One card in the carousel: a dark tile tinted from the project's cover colours,
  its monoline icon centred and the serif title underneath. The playing card
  carries a cream ring + glow (CSS). Hover lifts it a touch. When a filter adds
  or removes cards, each one fades/scales in or out and the rest slide into
  place (`layout`, driven by the AnimatePresence in ProjectCarousel). All of it
  is skipped under reduced motion.
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
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.85 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
      whileHover={reduce ? undefined : { y: -6 }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
    >
      <span className="proj-card-icon" aria-hidden="true">
        <ProjectIcon motif={motif} />
      </span>
      <span className="proj-card-title">{project.title}</span>
    </motion.button>
  );
}
