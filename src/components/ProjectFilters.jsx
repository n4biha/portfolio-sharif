"use client";

import { CATEGORIES } from "@/lib/projects";

/*
  The filter pills above the carousel: "All" plus each project category. The
  active pill fills cream; the rest are glass outlines. Narrows the carousel
  (ProjectsScene owns the state).
*/
export default function ProjectFilters({ value, onChange }) {
  return (
    <div className="proj-filters" role="group" aria-label="Filter projects">
      {CATEGORIES.map((c) => (
        <button
          key={c}
          type="button"
          className={`proj-pill${c === value ? " is-active" : ""}`}
          aria-pressed={c === value}
          onClick={() => onChange(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
