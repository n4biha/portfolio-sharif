"use client";

import Polaroid from "./Polaroid";
import { PROJECTS } from "@/lib/projects";

/*
  The gallery-wall content: project polaroids taped up on a cream wall, each a
  clickable snapshot that opens its ProjectCard. Laid out as a centered, responsive
  2-column grid (so the polaroids never overlap at any viewport) with a per-item
  resting tilt for the scrapbook feel. A couple of handwritten notes + washi scraps
  sit in the margins on wider screens.
*/

// order + resting tilt for each polaroid. `id` matches a key in PROJECTS.
const GALLERY = [
  { id: "scrapbook-portfolio", rot: -4 },
  { id: "data-dashboard", rot: 3 },
  { id: "study-buddy", rot: -3 },
  { id: "next-thing", rot: 4 },
];

export default function GalleryWall({ selectedId = null, onSelect }) {
  return (
    <div className="gallery-stage">
      {/* handwritten wall notes + washi scraps (hidden on narrow screens) */}
      <div className="gallery-deco" aria-hidden="true">
        <span className="gallery-washi washi-a" />
        <span className="gallery-washi washi-b" />
        <span className="gallery-note note-1 hand">stuff I&apos;ve made →</span>
        <span className="gallery-note note-2 hand">pick a snapshot ✦</span>
        <span className="gallery-note note-3 hand">more soon!</span>
      </div>

      {/* the clickable polaroids */}
      <div className="gallery-grid">
        {GALLERY.map((p, i) => {
          const project = PROJECTS[p.id];
          if (!project) return null;
          return (
            <button
              type="button"
              key={p.id}
              className={`polaroid-cell polaroid-btn${selectedId === p.id ? " is-selected" : ""}`}
              style={{ "--rot": `${p.rot}deg` }}
              onClick={() => onSelect?.(p.id)}
              aria-label={`Open the ${project.title} project`}
            >
              <Polaroid project={project} tint={i} selected={selectedId === p.id} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
