"use client";

import Image from "next/image";

/*
  One polaroid pinned to the gallery wall: a white frame with a photo box up top
  and a handwritten caption below. Until a real `photo` path is dropped in, the
  photo box shows a soft tinted placeholder with the project's initials. A strip
  of washi tape holds it to the wall. Sizing/placement live on .polaroid-pos
  (set in GalleryWall); hover lift + the selected glow live in globals.css.
*/

// a stable tint per polaroid so the placeholders aren't all the same colour
const TINTS = [
  ["#e7d9c4", "#c9b48f"],
  ["#cfdbcd", "#9fb89a"],
  ["#d9cee0", "#b39fc4"],
  ["#e0d2c6", "#c1a48c"],
];

const initials = (title) =>
  title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export default function Polaroid({ project, tint = 0, selected = false }) {
  const [a, b] = TINTS[tint % TINTS.length];
  return (
    <span className={`polaroid${selected ? " is-selected" : ""}`}>
      <span className="polaroid-tape" aria-hidden="true" />
      <span className="polaroid-photo">
        {project.photo ? (
          <Image
            src={project.photo}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 40vw, 220px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span
            className="polaroid-placeholder"
            style={{ background: `linear-gradient(150deg, ${a}, ${b})` }}
          >
            {initials(project.title)}
          </span>
        )}
      </span>
      <span className="polaroid-caption hand">{project.caption}</span>
    </span>
  );
}
