"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CATEGORIES } from "@/lib/projects";

/*
  The filter pills above the carousel: "All" plus each project category. One
  cream highlight slides between pills (a shared framer `layoutId`) rather than
  each pill flipping its own fill. Narrows the carousel (ProjectsScene owns the
  state).
*/
export default function ProjectFilters({ value, onChange }) {
  const reduce = useReducedMotion();
  return (
    <div className="proj-filters" role="group" aria-label="Filter projects">
      {CATEGORIES.map((c) => {
        const active = c === value;
        return (
          <button
            key={c}
            type="button"
            className={`proj-pill${active ? " is-active" : ""}`}
            aria-pressed={active}
            onClick={() => onChange(c)}
          >
            {active && (
              <motion.span
                layoutId="proj-pill-active"
                className="proj-pill-bg"
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <span className="proj-pill-label">{c}</span>
          </button>
        );
      })}
    </div>
  );
}
